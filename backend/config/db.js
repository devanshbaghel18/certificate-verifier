const { Pool } = require("pg");
require("dotenv").config();
const logger = require("../src/utils/logger");

// Build config: prefer DATABASE_URL if available, otherwise use individual params
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "certichain",
      ssl: false,
    };

poolConfig.max = 10;
poolConfig.idleTimeoutMillis = 30000;
poolConfig.connectionTimeoutMillis = 2000;

const pool = new Pool(poolConfig);

// Connection test
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