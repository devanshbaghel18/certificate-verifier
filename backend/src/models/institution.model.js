import pool from "../config/db.js";

/**
 * Create a new institution
 */
export const createInstitution = async (name, walletAddress) => {
  const result = await pool.query(
    `INSERT INTO institutions (name, wallet_address)
     VALUES ($1, $2)
     RETURNING *`,
    [name, walletAddress]
  );

  return result.rows[0];
};

/**
 * Get institution by wallet address
 */
export const getInstitutionByWallet = async (walletAddress) => {
  const result = await pool.query(
    `SELECT * FROM institutions
     WHERE wallet_address = $1`,
    [walletAddress]
  );

  return result.rows[0];
};

/**
 * Verify / Approve institution
 */
export const verifyInstitution = async (institutionId) => {
  const result = await pool.query(
    `UPDATE institutions
     SET verified = TRUE
     WHERE id = $1
     RETURNING *`,
    [institutionId]
  );

  return result.rows[0];
};

/**
 * Get all institutions
 */
export const getAllInstitutions = async () => {
  const result = await pool.query(
    `SELECT * FROM institutions`
  );

  return result.rows;
};