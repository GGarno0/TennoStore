const express = require('express');
const cors = require('cors');

const statusRoutes = require('./routes/status.routes');
const gamesRoutes = require('./routes/games.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/status', statusRoutes);
app.use('/api/games', gamesRoutes);

module.exports = app;
