import pool from "../config/db.js";

export const createCertificate = async (
  uid,
  studentId,
  issuerId,
  hash,
  txHash,
  contractAddress
) => {
  const result = await pool.query(
    `INSERT INTO certificates 
     (certificate_uid, student_id, issuer_id, certificate_hash, blockchain_tx_hash, contract_address)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [uid, studentId, issuerId, hash, txHash, contractAddress]
  );

  return result.rows[0];
};

export const getCertificateByUID = async (uid) => {
  const result = await pool.query(
    `SELECT * FROM certificates WHERE certificate_uid = $1`,
    [uid]
  );

  return result.rows[0];
};