const pool = require('../config/db');

const getGames = async () => {
  const query = `
    SELECT v.*, 
    (
      SELECT ph.precio 
      FROM price_history ph 
      WHERE ph.game_id = v.id 
      AND ph.precio > v.precio
      ORDER BY ph.fecha DESC 
      LIMIT 1
    ) as precio_anterior
    FROM videojuegos v 
    ORDER BY v.id ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Obtener historial de precios (RF04)
const getPriceHistory = async (gameId) => {
  const result = await pool.query(
    'SELECT precio, fecha FROM price_history WHERE game_id = $1 ORDER BY fecha ASC', 
    [gameId]
  );
  return result.rows;
};

const reserveStock = async (gameId) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN'); // Transacción ACID para asegurar consistencia de stock
    
    // Bloqueo de fila para evitar condiciones de carrera (Race Conditions)
    const result = await client.query('SELECT stock FROM videojuegos WHERE id = $1 FOR UPDATE', [gameId]);
    
    if (result.rows.length === 0) {
      throw new Error('Juego no encontrado');
    }
    
    const stock = result.rows[0].stock;
    
    if (stock <= 0) {
      throw new Error('Sin stock disponible');
    }
    
    // Restar 1 unidad
    await client.query('UPDATE videojuegos SET stock = stock - 1 WHERE id = $1', [gameId]);
    
    await client.query('COMMIT');
    
    return { success: true, message: 'Stock reservado correctamente. Tienes 10 minutos para confirmar.' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const cancelReservation = async (gameId) => {
  // Sumar 1 al stock porque el usuario lo sacó del carrito
  await pool.query('UPDATE videojuegos SET stock = stock + 1 WHERE id = $1', [gameId]);
  return { success: true, message: 'Reserva cancelada y stock devuelto.' };
};

// Admin CRUD
const createGame = async (titulo, precio, stock, categoria, plataforma, imagen_url) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'INSERT INTO videojuegos (titulo, precio, stock, categoria, plataforma, imagen_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titulo, precio, stock, categoria, plataforma, imagen_url]
    );
    const newGame = result.rows[0];
    
    // Crear entrada inicial en historial de precios
    await client.query(
      'INSERT INTO price_history (game_id, precio, fecha) VALUES ($1, $2, CURRENT_DATE)',
      [newGame.id, precio]
    );
    
    await client.query('COMMIT');
    return newGame;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const updateGame = async (id, titulo, precio, stock, categoria, plataforma, imagen_url) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Obtener precio actual antes de actualizar
    const currentRes = await client.query('SELECT precio FROM videojuegos WHERE id = $1', [id]);
    const oldPrice = currentRes.rows[0]?.precio;

    const result = await client.query(
      'UPDATE videojuegos SET titulo = $1, precio = $2, stock = $3, categoria = $4, plataforma = $5, imagen_url = $6 WHERE id = $7 RETURNING *',
      [titulo, precio, stock, categoria, plataforma, imagen_url, id]
    );
    const updatedGame = result.rows[0];

    // Registro histórico si detectamos cambio de precio (C10)
    if (parseFloat(oldPrice) !== parseFloat(precio)) {
      const historyCheck = await client.query('SELECT 1 FROM price_history WHERE game_id = $1 LIMIT 1', [id]);
      if (historyCheck.rows.length === 0) {
        await client.query(
          'INSERT INTO price_history (game_id, precio, fecha) VALUES ($1, $2, CURRENT_DATE - INTERVAL \'1 day\')',
          [id, oldPrice]
        );
      }
      await client.query(
        'INSERT INTO price_history (game_id, precio, fecha) VALUES ($1, $2, CURRENT_DATE)',
        [id, precio]
      );
    }
    
    await client.query('COMMIT');
    return updatedGame;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const deleteGame = async (id) => {
  await pool.query('DELETE FROM videojuegos WHERE id = $1', [id]);
  return { success: true };
};

const getRecommendations = async (id) => {
  // Buscamos juegos de la misma categoría, excluyendo el juego actual
  const query = `
    SELECT * FROM videojuegos 
    WHERE categoria = (SELECT categoria FROM videojuegos WHERE id = $1)
    AND id != $1
    LIMIT 3
  `;
  const result = await pool.query(query, [id]);
  return result.rows;
};

module.exports = {
  getGames,
  getPriceHistory,
  reserveStock,
  cancelReservation,
  createGame,
  updateGame,
  deleteGame,
  getRecommendations
};
