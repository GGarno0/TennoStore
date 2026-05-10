const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, async (req, res) => {
  const { total, items } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id',
      [userId, total]
    );
    
    // Aquí se podrían insertar los detalles del pedido si hubiera una tabla order_items
    
    res.status(201).json({ 
      success: true, 
      orderId: result.rows[0].id,
      message: 'Pago procesado y pedido creado correctamente.' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  }
});

module.exports = router;
