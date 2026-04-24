const { Pool } = require("pg");
require("dotenv").config();
const logger = require("../src/utils/logger");

// Determine if we are in production (using a connection string)
const isProduction = !!process.env.DATABASE_URL;

const poolConfig = isProduction 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

// Create pool
const pool = new Pool(poolConfig);

//  Better connection test
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected Successfully");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL Connection Error:", err.message);
    logger.error("Database connection error", { error: err.message });
  }
})();

// Handle unexpected errors
pool.on("error", (err) => {
  console.error("❌ Unexpected DB Error:", err.message);
});

module.exports = pool;