const { Pool } = require('pg');

// Conexión con PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASS || 'admin',
  database: process.env.DB_NAME || 'tennostore_db',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
