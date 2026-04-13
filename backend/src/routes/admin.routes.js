const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const pool = require("../../config/db");
const { verifyAdminToken } = require("../middlewares/authMiddleware");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
const MASTER_ADMIN = process.env.ADMIN_EMAIL || "dev@certichain.com";

// Admin Authorization Initializer
router.post("/login", async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();

    if (email !== MASTER_ADMIN) {
      return res.status(403).json({ error: "Intrusion Denied: You are not the Master Admin." });
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
