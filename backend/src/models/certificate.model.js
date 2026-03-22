import pool from "../config/db.js";

// 🔥 ADDED
import logger from "../utils/logger.js";

export const createCertificate = async (
  uid,
  studentId,
  issuerId,
  hash,
  txHash,
  contractAddress
) => {

  // 🔥 ADDED (before query)
  logger.info("DB INSERT started", {
    table: "certificates",
    certificate_uid: uid,
  });

  const result = await pool.query(
    `INSERT INTO certificates 
     (certificate_uid, student_id, issuer_id, certificate_hash, blockchain_tx_hash, contract_address)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [uid, studentId, issuerId, hash, txHash, contractAddress]
  );

  // 🔥 ADDED (after success)
  logger.info("DB INSERT success", {
    table: "certificates",
    certificate_uid: uid,
  });

  return result.rows[0];
};

export const getCertificateByUID = async (uid) => {

  // 🔥 ADDED (before query)
  logger.info("DB SELECT started", {
    table: "certificates",
    certificate_uid: uid,
  });

  const result = await pool.query(
    `SELECT * FROM certificates WHERE certificate_uid = $1`,
    [uid]
  );

  // 🔥 ADDED (after query)
  logger.info("DB SELECT success", {
    table: "certificates",
    certificate_uid: uid,
    found: !!result.rows[0],
  });

  return result.rows[0];
};