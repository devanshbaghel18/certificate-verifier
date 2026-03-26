const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
require("dotenv").config();

const logger = require("./src/utils/logger");
const requestLogger = require("./src/middlewares/requestLogger");
const securityLogger = require("./src/middlewares/securityLogger");
const pool = require("./config/db");

const { googleLogin } = require("./src/auth/googleAuth");
const {
  issueCertificate,
  verifyCertificate,
} = require("./src/services/blockchainService");

const certificateRoutes = require("./src/routes/certificate.routes");

const app = express();
const upload = multer({ dest: "uploads/" });

// ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(securityLogger);

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()), // Save logs via Winston
    },
  })
);

// ✅ ROUTES (IMPORTANT - after app defined)
app.use("/api/certificates", certificateRoutes);

// Google Auth
app.post("/auth/google", googleLogin);

// Health
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend server is running successfully",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Certificate Verifier Backend Running"); // Basic check endpoint
});

// Get all certificates
app.get("/certificates", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM certificates"); // Fetch all rows
    res.json(result.rows); // Send data
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Insert certificate (manual)
app.post("/certificates", async (req, res) => {
  const { certificate_hash, issuer_name } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO certificates (certificate_hash, issuer_name)
       VALUES ($1, $2)
       RETURNING *`,
      [certificate_hash, issuer_name]
    );

    res.status(201).json(result.rows[0]); // Return inserted record
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// Issue Certificate on Blockchain (old)
app.post("/issue-blockchain", async (req, res) => {
  try {
    const { id, student, course, institution } = req.body;

    const result = await issueCertificate(
      id,
      student,
      course,
      institution
    );

    res.json({ success: true, message: result });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify Certificate from Blockchain
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



// Verify via file
app.post("/verify-file", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ valid: false });

    const fileBuffer = fs.readFileSync(file.path);

    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

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

// Issue via file
app.post("/issue-certificate", upload.single("file"), async (req, res) => {
  try {
    const { student, course, institution } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = fs.readFileSync(file.path);

    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    await pool.query(
      "INSERT INTO certificates (certificate_hash, issuer_name) VALUES ($1, $2)",
      [hash, institution]
    );

    const blockchainResult = await issueCertificate(
      hash,
      student,
      course,
      institution
    );

    fs.unlinkSync(file.path);

    res.json({
      success: true,
      hash,
      blockchain: blockchainResult,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// DB init
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

    console.log("Database connected & table ready");
  } catch (err) {
    logger.error(err.message);
  }
}

initializeDatabase();

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  logger.info(`Server running on http://localhost:${PORT}`);
});