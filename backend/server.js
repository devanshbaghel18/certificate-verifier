/**
 * ============================================================================
 * SERVER.JS - The Core Backend Engine
 * ============================================================================
 * This is the main entry point for the backend. It sets up the Express server,
 * connects to PostgreSQL, hooks up Socket.IO for real-time admin notifications,
 * and wires all our routing and security middlewares.
 */
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
require("dotenv").config();

// ─── Monitoring & Security Middlewares ───────────────────────────────────────
// These tools keep the server safe from spam and track how well it's performing.
const statusMonitor = require("express-status-monitor");
const logger = require("./src/utils/logger");
const requestLogger = require("./src/middlewares/requestLogger");
const securityLogger = require("./src/middlewares/securityLogger");
const errorHandler = require("./src/middlewares/errorHandler");
const { apiLimiter, authLimiter, blockchainLimiter } = require("./src/middlewares/rateLimiter");

const pool = require("./config/db");

const { googleLogin } = require("./src/auth/googleAuth");
const {
  issueCertificate,
  verifyCertificate,
} = require("./src/services/blockchainService");

const certificateRoutes = require("./src/routes/certificate.routes");
const viewerRoutes = require("./src/routes/viewer.routes");
const institutionRoutes = require("./src/routes/institution.routes");
const adminRoutes = require("./src/routes/admin.routes");
const { verifyInstitutionToken } = require("./src/middlewares/authMiddleware");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://certificate-verifier.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
});
app.set("io", io);

io.on("connection", (socket) => {
  logger.info("Admin dashboard socket connected: " + socket.id);
});

const upload = multer({ dest: "uploads/" });

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ─── 1. SYSTEM MONITORING DASHBOARD ─────────────────────────────────────────
// Visit http://localhost:5000/status to see live dashboard
app.use(statusMonitor({
  title: "Certificate Verifier — System Monitor",
  path: "/status",
  spans: [
    { interval: 1,  retention: 60  },  // 1 second intervals, keep 60 data points
    { interval: 5,  retention: 60  },  // 5 second intervals
    { interval: 15, retention: 60  },  // 15 second intervals
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    heap: true,
    responseTime: true,
    rps: true,
    statusCodes: true,
  },
}));

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["https://certificate-verifier.vercel.app", "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());

// ─── 2. REQUEST MONITORING (every request is logged) ─────────────────────────
app.use(requestLogger);

// ─── 3. SECURITY MONITORING (suspicious activity detection) ──────────────────
app.use(securityLogger);

// ─── 4. RATE LIMITING (API abuse prevention) ─────────────────────────────────
app.use(apiLimiter);

// Morgan — HTTP access logs piped into Winston
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use("/api/certificates", certificateRoutes);
app.use("/api/viewer", viewerRoutes);
app.use("/api/institution", institutionRoutes);
app.use("/api/admin", adminRoutes);

// Auth — stricter rate limit
app.post("/auth/google", authLimiter, googleLogin);

// Health check (excluded from rate limiting intentionally)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend server is running successfully",
    timestamp: new Date(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});

app.get("/", (req, res) => {
  res.send("Certificate Verifier Backend Running");
});

app.get("/certificates", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM certificates ORDER BY issued_at DESC");
    res.json(result.rows);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/certificates", async (req, res) => {
  const { certificate_hash, issuer_name } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO certificates (certificate_hash, issuer_name)
       VALUES ($1, $2) RETURNING *`,
      [certificate_hash, issuer_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// Blockchain routes — strictest rate limit
app.post("/issue-blockchain", blockchainLimiter, async (req, res) => {
  try {
    const { id, student, course, institution } = req.body;
    const result = await issueCertificate(id, student, course, institution);
    res.json({ success: true, message: result });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/verify-blockchain/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const certificate = await verifyCertificate(id);
    res.json({
      certificateId: certificate[0],
      studentName: certificate[1],
      courseName: certificate[2],
      institutionName: certificate[3],
      issueDate: Number(certificate[4]),
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/verify-file", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ valid: false });

    const fileBuffer = fs.readFileSync(file.path);
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    const result = await pool.query(
      "SELECT * FROM certificates WHERE certificate_hash = $1",
      [hash]
    );

    fs.unlinkSync(file.path);

    if (result.rows.length > 0) {
      return res.json({ valid: true, data: result.rows[0] });
    }

    res.json({ valid: false });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ valid: false });
  }
});

app.post("/issue-certificate", verifyInstitutionToken, blockchainLimiter, upload.single("file"), async (req, res) => {
  try {
    const { student, course, institution } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!student || !course || !institution) {
      if (file) fs.unlinkSync(file.path);
      return res.status(400).json({
        error: "Missing fields: student, course, and institution are required",
      });
    }

    const fileBuffer = fs.readFileSync(file.path);
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    const existing = await pool.query(
      "SELECT * FROM certificates WHERE certificate_hash = $1",
      [hash]
    );

    if (existing.rows.length > 0) {
      fs.unlinkSync(file.path);
      return res.status(409).json({
        error: "This certificate has already been issued.",
        hash,
        certificate: existing.rows[0],
      });
    }

    await pool.query(
      "INSERT INTO certificates (certificate_hash, issuer_name) VALUES ($1, $2)",
      [hash, institution]
    );

    let blockchainResult = null;
    try {
      blockchainResult = await issueCertificate(hash, student, course, institution);
    } catch (blockchainErr) {
      logger.warn("Blockchain store skipped (node offline?): " + blockchainErr.message);
    }

    fs.unlinkSync(file.path);

    res.json({ success: true, hash, blockchain: blockchainResult });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── DATABASE INIT ───────────────────────────────────────────────────────────
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        certificate_hash VARCHAR(255) UNIQUE NOT NULL,
        issuer_name VARCHAR(255) NOT NULL,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        certificate_hash VARCHAR(255),
        file_name VARCHAR(255),
        is_valid BOOLEAN,
        issuer_name VARCHAR(255),
        issued_at TIMESTAMP,
        verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS authorized_institutions (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ All tables ready");
  } catch (err) {
    logger.error("Database initialization failed", { error: err.message });
  }
}

initializeDatabase();

// ─── 5. GLOBAL ERROR HANDLER (must be LAST middleware) ───────────────────────
app.use(errorHandler);

// ─── 6. PROCESS-LEVEL MONITORING ─────────────────────────────────────────────
// Catch unhandled rejections (e.g., failed async operations)
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection", {
    reason: reason?.message || reason,
    stack: reason?.stack,
  });
});

// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception — shutting down", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

// Log graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received — graceful shutdown initiated");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received — graceful shutdown initiated");
  process.exit(0);
});

// ─── START SERVER ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📊 Monitoring dashboard at http://localhost:${PORT}/status`);
});
