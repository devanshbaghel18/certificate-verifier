import {
  createCertificate,
  getCertificateByUID,
} from "../models/certificate.model.js";

import logger from "../utils/logger.js";

import {
  issueCertificate,
  verifyCertificate,
} from "../services/blockchain.service.js";

// Issue certificate
export const issueCert = async (req, res) => {
  try {
    const { uid, student, course, institution } = req.body;

    // ✅ LOG START (ADD HERE)
    logger.info("Issue certificate request received", {
      uid,
      student,
      course,
      institution,
    });

    // Issue on blockchain
    await issueCertificate(uid, student, course, institution);

    // ✅ LOG BLOCKCHAIN SUCCESS
    logger.info("Blockchain certificate issued", { uid });

    // Store in DB
    const cert = await createCertificate(
      uid,
      null,
      null,
      "hash_here",
      "txHash_here",
      process.env.CONTRACT_ADDRESS
    );

    // ✅ LOG DB SUCCESS
    logger.info("Certificate stored in DB", {
      uid,
      contractAddress: process.env.CONTRACT_ADDRESS,
    });

    // ✅ FINAL SUCCESS LOG
    logger.info("Certificate issued successfully", { uid });

    res.json({ success: true, cert });

  } catch (err) {
    // ✅ ERROR LOG (VERY IMPORTANT)
    logger.error("Error issuing certificate", {
      error: err.message,
      body: req.body,
    });

    res.status(500).json({ error: err.message });
  }
};

// Verify certificate
export const verifyCert = async (req, res) => {
  try {
    const { uid } = req.params;

    // ✅ LOG START
    logger.info("Verification request received", { uid });

    const blockchainData = await verifyCertificate(uid);

    // ✅ LOG BLOCKCHAIN RESULT
    logger.info("Blockchain verification success", { uid });

    const dbData = await getCertificateByUID(uid);

    // ✅ LOG DB FETCH
    logger.info("Database fetch success", { uid });

    res.json({
      blockchain: blockchainData,
      database: dbData,
    });

  } catch (err) {
    // ✅ ERROR LOG
    logger.error("Verification failed", {
      uid: req.params.uid,
      error: err.message,
    });

    res.status(500).json({ error: err.message });
  }
};