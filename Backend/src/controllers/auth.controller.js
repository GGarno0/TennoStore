const authService = require('../services/auth.service');
const Joi = require('joi');

const authSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required()
});

const register = async (req, res) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await authService.registerUser(req.body.username, req.body.password);
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (err) {
    if (err.code === '23505') { // Código de error único en PostgreSQL
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { token, user } = await authService.loginUser(req.body.username, req.body.password);
    // Sanitizamos el objeto user antes de enviarlo
    const sanitizedUser = { id: user.id, username: user.username, is_admin: user.is_admin };
    res.json({ message: 'Login exitoso', token, user: sanitizedUser });
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
    console.error(err);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
