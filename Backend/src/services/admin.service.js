const pool = require('../config/db');

const getAllUsers = async () => {
  const result = await pool.query('SELECT id, username, email, is_admin FROM users ORDER BY id ASC');
  return result.rows;
};

const updateUserByAdmin = async (id, username, email, is_admin) => {
  const result = await pool.query(
    'UPDATE users SET username = $1, email = $2, is_admin = $3 WHERE id = $4 RETURNING id, username, email, is_admin',
    [username, email, is_admin, id]
  );
  return result.rows[0];
};

const deleteUserByAdmin = async (id) => {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return { success: true };
};

module.exports = {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin
};
