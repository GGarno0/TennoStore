const gamesService = require('../services/games.service');

// Obtener todos los juegos
const getGames = async (req, res) => {
  try {
    const games = await gamesService.getGames();
    res.json(games || []);
  } catch (err) {
    console.error('Error al consultar la BD:', err);
    res.status(500).json({ error: 'Error al obtener los juegos' });
  }
};

// Obtener historial de precio
const getHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const history = await gamesService.getPriceHistory(id);
    res.json(history);
  } catch (err) {
    console.error('Error al consultar historial:', err);
    res.status(500).json({ error: 'Error al obtener el historial de precios' });
  }
};

const reserveStock = async (req, res) => {
  const { gameId, sessionId } = req.body;
  const userId = req.user?.id; // Miramos si esta logueado
  
  if (!gameId) {
    return res.status(400).json({ error: 'Falta el gameId en el cuerpo de la petición' });
  }

  try {
    const result = await gamesService.reserveStock(gameId, userId, sessionId);
    res.json(result);
  } catch (err) {
    console.error('Error al reservar stock:', err.message);
    res.status(400).json({ error: err.message });
  }
};

const cancelReservation = async (req, res) => {
  const { gameId, quantity, sessionId } = req.body;
  const userId = req.user?.id;
  
  if (!gameId) {
    return res.status(400).json({ error: 'Falta el gameId en el cuerpo de la petición' });
  }

  try {
    const result = await gamesService.cancelReservation(gameId, userId, sessionId, quantity || 1);
    res.json(result);
  } catch (err) {
    console.error('Error al cancelar reserva:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// Añadir juego nuevo
const createGame = async (req, res) => {
  const { titulo, precio, stock, categoria, plataforma, imagen_url } = req.body;
  
  if (!titulo || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  // No permitimos valores negativos
  if (parseFloat(precio) < 0 || parseInt(stock) < 0) {
    return res.status(400).json({ error: 'El precio y el stock no pueden ser negativos' });
  }
  try {
    const game = await gamesService.createGame(titulo, precio, stock, categoria, plataforma, imagen_url);
    res.status(201).json(game);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Ya existe un videojuego con ese título exactamente' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al crear juego' });
  }
};

const updateGame = async (req, res) => {
  const { id } = req.params;
  const { titulo, precio, stock, categoria, plataforma, imagen_url } = req.body;
  if (precio !== undefined && parseFloat(precio) < 0) {
    return res.status(400).json({ error: 'El precio no puede ser negativo' });
  }
  if (stock !== undefined && parseInt(stock) < 0) {
    return res.status(400).json({ error: 'El stock no puede ser negativo' });
  }
  
  // Guardamos los cambios
  try {
    const game = await gamesService.updateGame(id, titulo, precio, stock, categoria, plataforma, imagen_url);
    res.json(game);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Ya existe otro videojuego con ese título' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar juego' });
  }
};

const deleteGame = async (req, res) => {
  const { id } = req.params;
  try {
    await gamesService.deleteGame(id);
    res.json({ success: true, message: 'Juego eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar juego' });
  }
};

const getRecommendations = async (req, res) => {
  const { id } = req.params;
  try {
    const recommendations = await gamesService.getRecommendations(id);
    res.json(recommendations);
  } catch (err) {
    console.error('Error al obtener recomendaciones:', err);
    res.status(500).json({ error: 'Error al obtener recomendaciones' });
  }
};

module.exports = {
  getGames,
  getHistory,
  reserveStock,
  cancelReservation,
  createGame,
  updateGame,
  deleteGame,
  getRecommendations
};
