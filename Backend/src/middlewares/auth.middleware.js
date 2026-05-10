const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });

  try {
    const tokenClean = token.replace('Bearer ', '');
    const verified = jwt.verify(tokenClean, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token inválido o expirado.' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.is_admin) {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado. Permisos de administrador requeridos.' });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAdmin
};
