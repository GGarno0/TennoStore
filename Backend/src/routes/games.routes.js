const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/games.controller');

router.get('/', gamesController.getGames);

module.exports = router;
