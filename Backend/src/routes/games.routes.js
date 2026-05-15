const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/games.controller');
const { verifyToken, optionalToken, verifyAdmin } = require('../middlewares/auth.middleware');

// Rutas de juegos
router.get('/', gamesController.getGames);
router.get('/:id/history', gamesController.getHistory);

// Rutas de stock
router.post('/reserve', optionalToken, gamesController.reserveStock);
router.post('/cancel-reservation', optionalToken, gamesController.cancelReservation);

// Rutas de administración
router.post('/', verifyAdmin, gamesController.createGame);
router.put('/:id', verifyAdmin, gamesController.updateGame);
router.delete('/:id', verifyAdmin, gamesController.deleteGame);

// Recomendaciones
router.get('/:id/recommendations', gamesController.getRecommendations);

module.exports = router;
