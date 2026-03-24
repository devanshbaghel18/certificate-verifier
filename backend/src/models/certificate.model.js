const pool = require("../../config/db"); // DB connection
const logger = require("../utils/logger"); // Logger

const createCertificate = async (
  uid,
  studentId,
  issuerId,
  hash,
  txHash,
  contractAddress
) => {
  logger.info("DB INSERT started", { uid }); // Log before insert

  const result = await pool.query(
    `INSERT INTO certificates 
     (certificate_uid, student_id, issuer_id, certificate_hash, blockchain_tx_hash, contract_address)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [uid, studentId, issuerId, hash, txHash, contractAddress]
  );

  logger.info("DB INSERT success", { uid }); // Log after insert

  return result.rows[0]; // Return inserted row
};

const getCertificateByUID = async (uid) => {
  logger.info("DB SELECT started", { uid }); // Log query start

  const result = await pool.query(
    `SELECT * FROM certificates WHERE certificate_uid = $1`,
    [uid]
  );

  return result.rows[0]; // Return found record
};

module.exports = {
  createCertificate,
  getCertificateByUID,
};