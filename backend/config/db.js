const { Pool } = require("pg");
require("dotenv").config();

// Create pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // 🔥 NEW (important)
  max: 10, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 🔥 Better connection test
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected Successfully");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL Connection Error:", err.message);
  }
})();

// 🔥 Handle unexpected errors
pool.on("error", (err) => {
  console.error("❌ Unexpected DB Error:", err.message);
});

module.exports = pool;