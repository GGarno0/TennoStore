const { Pool } = require('pg');

// Conexión con PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== 'db' ? { rejectUnauthorized: false } : false
});

module.exports = pool;
