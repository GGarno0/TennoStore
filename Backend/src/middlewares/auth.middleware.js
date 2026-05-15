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

const optionalToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return next();

  try {
    const tokenClean = token.replace('Bearer ', '');
    const verified = jwt.verify(tokenClean, process.env.JWT_SECRET);
    req.user = verified;
  } catch (err) {
    // Si el token está mal formado lo ignoramos, pero no bloqueamos (opcional)
    console.error('Optional token invalid');
  }
  next();
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
  optionalToken,
  verifyAdmin
};
