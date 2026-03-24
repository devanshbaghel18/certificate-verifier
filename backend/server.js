const express = require("express"); // Import Express framework
const http = require("http"); // Import HTTP module for Socket.IO
const { Server } = require("socket.io"); // Import Socket.IO
const cors = require("cors"); // Enable Cross-Origin Resource Sharing
require("dotenv").config(); // Load environment variables from .env

const logger = require("./src/utils/logger"); // Custom logger (Winston)
const requestLogger = require("./src/middlewares/requestLogger"); // Logs all incoming requests
const securityLogger = require("./src/middlewares/securityLogger"); // Logs suspicious activity
const morgan = require("morgan"); // HTTP request logger middleware

const certificateRoutes = require("./src/routes/certificate.routes"); // Import certificate routes

const { googleLogin } = require("./src/auth/googleAuth"); // Google authentication handler
const pool = require("./config/db"); // PostgreSQL database connection

const app = express(); // Create Express app
const server = http.createServer(app); // Create HTTP server for Socket.IO
const io = new Server(server, { cors: { origin: "*" } }); // Create Socket.IO server

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

app.set("io", io); // Make io accessible in routes/controllers

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

app.use(requestLogger);   // ✅ request tracking
app.use(securityLogger);  // ✅ security logs

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()), // Save logs via Winston
    },
  })
);

// Register certificate routes
app.use("/api/certificates", certificateRoutes); // All certificate APIs start with this path

logger.info("Server starting..."); // Log server startup

// Google Authentication Route
app.post("/auth/google", googleLogin); // Endpoint for Google login

const PORT = process.env.PORT || 5000; // Set port from env or default 5000

// Health Check API
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK", // Server status
    message: "Backend server is running successfully",
    timestamp: new Date(), // Current time
    uptime: process.uptime(), // Server uptime
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Certificate Verifier Backend Running"); // Basic check endpoint
});

// Get all certificates from DB
app.get("/certificates", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM certificates"); // Fetch all rows
    res.json(result.rows); // Send data
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" }); // Handle DB error
  }
});

// Insert certificate manually (basic test API)
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
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  logger.info(`Server running on http://localhost:${PORT}`);
});

// Initialize DB table (if not exists)
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
    console.error("Database error:", err);
  }
}


initializeDatabase();