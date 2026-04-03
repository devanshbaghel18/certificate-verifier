const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}

router.post("/login", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: "No credential provided" });
    const payload = await verifyGoogleToken(credential);
    const { sub: googleId, email, name, picture } = payload;
    const result = await pool.query(
      `INSERT INTO users (google_id, email, name, picture)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (google_id) DO UPDATE
       SET email = EXCLUDED.email, name = EXCLUDED.name, picture = EXCLUDED.picture
       RETURNING *`,
      [googleId, email, name, picture]
    );
    res.json({ user: result.rows[0], token: credential });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/history", async (req, res) => {
  try {
    const { token, certificateHash, fileName, isValid, issuerName, issuedAt } = req.body;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = await verifyGoogleToken(token);
    const googleId = payload.sub;
    const userResult = await pool.query("SELECT id FROM users WHERE google_id = $1", [googleId]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: "User not found" });
    const userId = userResult.rows[0].id;
    const result = await pool.query(
      `INSERT INTO verification_history (user_id, certificate_hash, file_name, is_valid, issuer_name, issued_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, certificateHash, fileName, isValid, issuerName || null, issuedAt || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save history" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = await verifyGoogleToken(token);
    const googleId = payload.sub;
    const userResult = await pool.query("SELECT id FROM users WHERE google_id = $1", [googleId]);
    if (userResult.rows.length === 0) return res.json([]);
    const userId = userResult.rows[0].id;
    const result = await pool.query(
      `SELECT * FROM verification_history WHERE user_id = $1 ORDER BY verified_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
