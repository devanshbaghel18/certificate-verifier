import {
  createCertificate,
  getCertificateByUID,
} from "../models/certificate.model.js";

import {
  issueCertificate,
  verifyCertificate,
} from "../services/blockchain.service.js";

// Issue certificate
export const issueCert = async (req, res) => {
  try {
    const { uid, student, course, institution } = req.body;

    // 1. Issue on blockchain
    await issueCertificate(uid, student, course, institution);

    // 2. Store in DB
    const cert = await createCertificate(
      uid,
      null,
      null,
      "hash_here",
      "txHash_here",
      process.env.CONTRACT_ADDRESS
    );

    res.json({ success: true, cert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify certificate
export const verifyCert = async (req, res) => {
  try {
    const { uid } = req.params;

    const blockchainData = await verifyCertificate(uid);

    const dbData = await getCertificateByUID(uid);

    res.json({
      blockchain: blockchainData,
      database: dbData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};