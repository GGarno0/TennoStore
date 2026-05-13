const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, async (req, res) => {
  const { total, items } = req.body;
  const userId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Crear el pedido principal
    const orderRes = await client.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id',
      [userId, total]
    );
    const orderId = orderRes.rows[0].id;

    // Insertar cada producto del carrito en order_items
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, game_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.precio]
      );
    }
    
    await client.query('COMMIT');

    res.status(201).json({ 
      success: true, 
      orderId,
      message: 'Pedido y detalles guardados correctamente.' 
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  } finally {
    client.release();
  }
});

router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    // Consulta robusta: LEFT JOIN para no perder pedidos antiguos y filtrado de nulos en el agregador
    const query = `
      SELECT o.*, 
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', v.id,
                   'titulo', v.titulo,
                   'precio', oi.price_at_purchase,
                   'cantidad', oi.quantity,
                   'imagen_url', v.imagen_url
                 )
               ) FILTER (WHERE oi.id IS NOT NULL), 
               '[]'
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN videojuegos v ON oi.game_id = v.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

module.exports = router;
