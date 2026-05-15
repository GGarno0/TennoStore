require('dotenv').config();
const app = require('./app');
const gamesService = require('./services/games.service');

const port = process.env.PORT || 3000;

// Limpieza automática de carritos cada minuto
setInterval(() => {
  gamesService.cleanupExpiredReservations();
}, 60000);

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
