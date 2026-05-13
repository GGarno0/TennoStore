const adminService = require('../services/admin.service');

const getUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, is_admin } = req.body;
  try {
    const user = await adminService.updateUserByAdmin(id, username, email, is_admin);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await adminService.deleteUserByAdmin(id);
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser
};
