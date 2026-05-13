const authService = require('../services/auth.service');
const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
    'any.required': 'El nombre de usuario es obligatorio'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'El formato del email no es válido',
    'any.required': 'El email es obligatorio'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es obligatoria'
  })
});

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'El usuario o email es obligatorio'
  }),
  password: Joi.string().required().messages({
    'any.required': 'La contraseña es obligatoria'
  })
});

const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await authService.registerUser(req.body.username, req.body.email, req.body.password);
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El usuario o email ya existe' });
    }
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { token, user } = await authService.loginUser(req.body.username, req.body.password);
    res.json({ message: 'Login exitoso', token, user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    // req.user viene del middleware verifyToken
    const user = await authService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    res.json({ user: { id: user.id, username: user.username, is_admin: user.is_admin } });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authService.updateUser(req.user.id, username, password);
    res.json({ message: 'Perfil actualizado', user });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

const deleteProfile = async (req, res) => {
  try {
    await authService.deleteUser(req.user.id);
    res.json({ message: 'Cuenta eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
};

const exportProfile = async (req, res) => {
  try {
    const data = await authService.exportUserData(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al exportar datos' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  deleteProfile,
  exportProfile
};
