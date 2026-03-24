const pool = require("../../config/db");
const logger = require("../utils/logger");

/**
 * Create a new institution
 */
const createInstitution = async (name, walletAddress) => {
  logger.info("DB INSERT started", { table: "institutions", name });

  const result = await pool.query(
    `INSERT INTO institutions (name, wallet_address)
     VALUES ($1, $2)
     RETURNING *`,
    [name, walletAddress]
  );

  logger.info("DB INSERT success", { table: "institutions", name });

  return result.rows[0];
};

/**
 * Get institution by wallet address
 */
const getInstitutionByWallet = async (walletAddress) => {
  logger.info("DB SELECT started", { walletAddress });

  const result = await pool.query(
    `SELECT * FROM institutions
     WHERE wallet_address = $1`,
    [walletAddress]
  );

  logger.info("DB SELECT success", {
    walletAddress,
    found: !!result.rows[0],
  });

  return result.rows[0];
};

/**
 * Verify / Approve institution
 */
const verifyInstitution = async (institutionId) => {
  logger.info("DB UPDATE started", { institutionId });

  const result = await pool.query(
    `UPDATE institutions
     SET verified = TRUE
     WHERE id = $1
     RETURNING *`,
    [institutionId]
  );

  logger.info("DB UPDATE success", { institutionId });

  return result.rows[0];
};

/**
 * Get all institutions
 */
const getAllInstitutions = async () => {
  logger.info("DB SELECT ALL institutions");

  const result = await pool.query(`SELECT * FROM institutions`);

  return result.rows;
};

module.exports = {
  createInstitution,
  getInstitutionByWallet,
  verifyInstitution,
  getAllInstitutions,
};