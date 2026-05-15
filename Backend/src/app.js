const express = require('express');
const cors = require('cors');

const gamesRoutes = require('./routes/games.routes');
const authRoutes = require('./routes/auth.routes');
const ordersRoutes = require('./routes/orders.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware
// Configuración de CORS permisiva para despliegue
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check / root route
app.get('/', (req, res) => {
  res.json({ message: 'TennoStore API is running' });
});

// Routes
app.use('/api/games', gamesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
