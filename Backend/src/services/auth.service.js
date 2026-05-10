const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (username, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
    [username, hashedPassword]
  );
  
  return result.rows[0];
};

const loginUser = async (username, password) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  
  if (result.rows.length === 0) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password);
  
  if (!validPassword) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, is_admin: user.is_admin }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  return { token, user: { id: user.id, username: user.username, is_admin: user.is_admin } };
};

module.exports = {
  registerUser,
  loginUser
};
