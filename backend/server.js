require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Health API
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend server is running successfully 🚀",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Root
app.get("/", (req, res) => {
  res.send("Certificate Verifier Backend Running");
});
// Get all certificates
app.get("/certificates", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM certificates");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Insert certificate
app.post("/certificates", async (req, res) => {
  const { certificate_hash, issuer_name } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO certificates (certificate_hash, issuer_name)
       VALUES ($1, $2)
       RETURNING *`,
      [certificate_hash, issuer_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});

const pool = require("./config/db");

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

    console.log(" Database connected & table ready");
  } catch (err) {
    console.error(" Database error:", err);
  }
}


initializeDatabase();