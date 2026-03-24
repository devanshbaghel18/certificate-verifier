const {
  createCertificate,
  getCertificateByUID,
} = require("../models/certificate.model"); // DB functions

const logger = require("../utils/logger"); // Logger

const {
  issueCertificate,
  verifyCertificate,
} = require("../services/blockchainService"); // Blockchain functions

// Issue Certificate
const issueCert = async (req, res) => {
  try {
    const { uid, student, course, institution } = req.body;
    const io = req.app.get("io");

    console.log("NEW CONTROLLER HIT"); // Debug log

    logger.info("Issue certificate request received", { uid }); // Log request

    // Call blockchain
    const result = await issueCertificate(uid, student, course, institution, io);

    // Store in DB
    const cert = await createCertificate(
      uid,
      null,
      null,
      "hash_here",
      result.txHash, // Store real txHash
      process.env.CONTRACT_ADDRESS
    );

    res.json({
      success: true,
      message: result.message,
      txHash: result.txHash,
      cert,
    });

  } catch (err) {
    logger.error("Error issuing certificate", { error: err.message });

    res.status(500).json({ error: err.message });
  }
};

// Verify Certificate
const verifyCert = async (req, res) => {
  try {
    const { uid } = req.params;

    logger.info("Verification request received", { uid });

    const blockchainData = await verifyCertificate(uid); // Get blockchain data
    const dbData = await getCertificateByUID(uid); // Get DB data

    res.json({
      blockchain: blockchainData,
      database: dbData,
    });

  } catch (err) {
    logger.error("Verification failed", { error: err.message });

    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  issueCert,
  verifyCert,
};