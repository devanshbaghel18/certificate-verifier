const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const pool = require("../../config/db");
const { verifyAdminToken } = require("../middlewares/authMiddleware");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
// Support multiple admin emails (comma-separated in env)
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || "dev@certichain.com")
  .split(",")
  .map(e => e.trim().toLowerCase());

// ─── QUICK LOGIN (email + password, no Google OAuth) ─────────────────────────
// Credentials are stored in env: ADMIN_EMAIL and ADMIN_PASSWORD
router.post("/quick-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!ADMIN_EMAILS.includes(email.toLowerCase()) || password !== adminPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email, role: "admin", name: "Admin" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token, user: { email, name: "Admin", role: "admin" } });
  } catch (err) {
    res.status(500).json({ error: "Quick login failed" });
  }
});

// Admin Authorization via Google OAuth
router.post("/login", async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();

    if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({ error: "Intrusion Denied: You are not an authorized Admin." });
    }

    const token = jwt.sign({ email, role: "admin", name }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { email, name, role: "admin" } });
  } catch (err) {
    res.status(500).json({ error: "Admin login procedure failed" });
  }
});

// SECURED ROUTES BEYOND THIS POINT
router.use(verifyAdminToken);

router.get("/institutions", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM authorized_institutions ORDER BY added_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch registry" });
  }
});

router.put("/institutions/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ error: "Invalid system state assignment" });
    }

    const result = await pool.query(
      "UPDATE authorized_institutions SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update target's network status" });
  }
});

router.delete("/institutions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM authorized_institutions WHERE id = $1", [id]);
    res.json({ success: true, removedId: id });
  } catch (error) {
    res.status(500).json({ error: "Failed to obliterate record from database" });
  }
});

module.exports = router;
