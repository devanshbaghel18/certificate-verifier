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

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});