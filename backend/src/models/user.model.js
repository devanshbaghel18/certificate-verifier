import pool from "../config/db.js";

export const createUser = async (wallet, role, name, email) => {
  const result = await pool.query(
    `INSERT INTO users (wallet_address, role, name, email)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [wallet, role, name, email]
  );

  return result.rows[0];
};

export const getUserByWallet = async (wallet) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE wallet_address = $1`,
    [wallet]
  );

  return result.rows[0];
};