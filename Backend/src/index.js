require('dotenv').config();
const app = require('./app');
const gamesService = require('./services/games.service');

const port = process.env.PORT || 3000;

// Worker de limpieza de reservas expiradas
setInterval(() => {
  gamesService.cleanupExpiredReservations();
}, 60000); // Ejecutar cada minuto

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
