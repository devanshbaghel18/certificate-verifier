const pool = require("../../config/db");
const logger = require("../utils/logger");

const createUser = async (wallet, role, name, email) => {
  logger.info("DB INSERT user", { wallet, role });

  const result = await pool.query(
    `INSERT INTO users (wallet_address, role, name, email)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [wallet, role, name, email]
  );

  return result.rows[0];
};

const getUserByWallet = async (wallet) => {
  logger.info("DB SELECT user", { wallet });

  const result = await pool.query(
    `SELECT * FROM users WHERE wallet_address = $1`,
    [wallet]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByWallet,
};