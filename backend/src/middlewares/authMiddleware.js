const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || "dev@certichain.com")
  .split(",")
  .map(e => e.trim().toLowerCase());

// ─── AUTHENTICATION GUARDS ──────────────────────────────────────────────────
// These middleware functions act as security bouncers for our API routes.
// Every protected request must pass through one of these to ensure only
// authorized users (either Institutions or the Master Admin) can take action.

const verifyInstitutionToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing authorization header" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "institution") {
        return res.status(403).json({ error: "Access denied. Not an approved institution." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ─── MASTER ADMIN GUARD ─────────────────────────────────────────────────────
// Used for high-security actions like approving or rejecting institutions.
// This strictly checks that the JWT was signed for the Master Admin email.
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing authorization header" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin" && !ADMIN_EMAILS.includes(decoded.email?.toLowerCase())) {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired admin token" });
  }
};

module.exports = { verifyInstitutionToken, verifyAdminToken };
