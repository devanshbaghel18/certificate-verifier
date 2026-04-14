const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const pool = require("../../config/db");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

router.post("/login", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: "No google credential provided" });

    // Verify Google Token cryptographically
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();

    // Check Postgres
    const result = await pool.query("SELECT * FROM authorized_institutions WHERE email = $1", [email]);
    let institution = result.rows[0];

    if (!institution) {
      // First-time University Request! Insert as pending
      const insertResult = await pool.query(
        "INSERT INTO authorized_institutions (email, name, status) VALUES ($1, $2, 'pending') RETURNING *",
        [email, name || "Unknown University Entity"]
      );
      institution = insertResult.rows[0];

      // Ping the Admin Dashboard in Real Time via Socket!
      const io = req.app.get("io");
      io.emit("new_institution_request", institution);

      return res.json({ 
        status: "pending", 
        message: "Your credentials have been forwarded securely to the Master Admin for review." 
      });
    }

    if (institution.status === "pending") {
      return res.json({ status: "pending", message: "Your account is still pending administrative approval." });
    }

    if (institution.status === "rejected") {
      return res.status(403).json({ status: "rejected", message: "Institution denied network access." });
    }

    if (institution.status === "approved") {
      // SUCCESS! Upgrade local session to a trusted Backend JWT Token
      const token = jwt.sign(
        { id: institution.id, email: institution.email, role: "institution", name: institution.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({ status: "approved", token, user: institution });
    }

  } catch (error) {
    console.error("Institution Login Error:", error);
    res.status(500).json({ error: "Failed to authenticate external university." });
  }
});

module.exports = router;
