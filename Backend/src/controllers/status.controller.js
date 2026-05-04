const pool = require('../config/db');

const getStatus = async (req, res) => {
  try {
    const client = await pool.connect();
    client.release();
    res.json({ status: 'Conexión con Backend: OK', database: 'connected' });
  } catch (err) {
    console.error('Error connecting to database:', err);
    res.status(500).json({ status: 'Error', message: 'Database connection failed' });
  }
};

module.exports = {
  getStatus
};
