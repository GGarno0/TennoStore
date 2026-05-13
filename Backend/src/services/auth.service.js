const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (username, email, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
    [username, email, hashedPassword]
  );
  
  return result.rows[0];
};

const loginUser = async (identifier, password) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1 OR email = $1', 
    [identifier]
  );
  
  if (result.rows.length === 0) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password);
  
  if (!validPassword) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  return { token, user: { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin } };
};

const getUserById = async (id) => {
  const result = await pool.query('SELECT id, username, is_admin FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const updateUser = async (id, username, password) => {
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query('UPDATE users SET username = $1, password = $2 WHERE id = $3', [username, hashedPassword, id]);
  } else {
    await pool.query('UPDATE users SET username = $1 WHERE id = $2', [username, id]);
  }
  return { id, username };
};

const deleteUser = async (id) => {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
};

const exportUserData = async (id) => {
  const user = await pool.query('SELECT id, username, email, is_admin FROM users WHERE id = $1', [id]);
  const orders = await pool.query('SELECT * FROM orders WHERE user_id = $1', [id]);
  return {
    profile: user.rows[0],
    orders: orders.rows,
    exported_at: new Date()
  };
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
  exportUserData
};
