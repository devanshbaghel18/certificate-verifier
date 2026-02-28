import pool from "../config/db.js";

/**
 * Log a verification attempt
 */
export const logVerification = async (
  certificateId,
  verifierWallet,
  verificationStatus
) => {
  const result = await pool.query(
    `INSERT INTO verification_logs 
     (certificate_id, verifier_wallet, verification_status)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [certificateId, verifierWallet, verificationStatus]
  );

  return result.rows[0];
};

/**
 * Get verification logs for a certificate
 */
export const getVerificationLogs = async (certificateId) => {
  const result = await pool.query(
    `SELECT * FROM verification_logs
     WHERE certificate_id = $1
     ORDER BY verified_at DESC`,
    [certificateId]
  );

  return result.rows;
};

/**
 * Count how many times certificate was verified
 */
export const getVerificationCount = async (certificateId) => {
  const result = await pool.query(
    `SELECT COUNT(*) 
     FROM verification_logs
     WHERE certificate_id = $1`,
    [certificateId]
  );

  return result.rows[0].count;
};