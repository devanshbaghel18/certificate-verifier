const crypto = require("crypto");
const fs = require("fs");

const logger = require("../utils/logger");
const pool = require("../../config/db");

const {
  issueCertificate,
  verifyCertificate,
} = require("../services/blockchainService");

// Issue certificate
const issueCert = async (req, res) => {
  let file;

  try {
    // ✅ SAFE BODY HANDLING (FIXED)
    const student = req.body?.student || "Unknown";
    const course = req.body?.course || "Unknown";
    const institution = req.body?.institution || "Unknown";

    file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("BODY:", req.body); // debug

    const fileBuffer = fs.readFileSync(file.path);

    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    logger.info("Generated certificate hash", { hash });

    // Check duplicate
    const existing = await pool.query(
      "SELECT * FROM certificates WHERE certificate_hash = $1",
      [hash]
    );

    console.log("ISSUE HASH:", hash);

    if (existing.rows.length > 0) {
      return res.status(400).json({
        error: "Certificate already exists",
      });
    }

    // 🔥 FIRST store on blockchain
    const tx = await issueCertificate(
      hash,
      student,
      course,
      institution
    );

    // 🔥 THEN store in DB (only if blockchain succeeds)
    await pool.query(
      "INSERT INTO certificates (certificate_hash, issuer_name) VALUES ($1, $2)",
      [hash, institution]
    );

    res.json({
      success: true,
      hash,
      transaction: tx,
    });

  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });

  } finally {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};

// Verify certificate
const verifyCert = async (req, res) => {
  let file;

  try {
    file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = fs.readFileSync(file.path);

    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");



    const result = await pool.query(
      "SELECT * FROM certificates WHERE certificate_hash = $1",
      [hash]
    );

    if (result.rows.length === 0) {
      return res.json({ valid: false });
    }

    let blockchainData = null;

    try {
      blockchainData = await verifyCertificate(hash);
    } catch (err) {
      console.log("Blockchain not found for this hash");
    }
    console.log("VERIFY HASH:", hash);
    res.json({
      valid: true,
      certificate: result.rows[0],
      blockchain: blockchainData,
    });

  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });

  } finally {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};

module.exports = { issueCert, verifyCert };
