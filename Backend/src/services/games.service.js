const pool = require('../config/db');

const getGames = async () => {
  const result = await pool.query('SELECT * FROM videojuegos ORDER BY id ASC');
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
    await client.query('BEGIN'); // Iniciar transacción ACID
    
    // Bloquear la fila con SELECT FOR UPDATE
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
    
    // Tarea programada (setTimeout) para devolver el stock si no se confirma en 10 mins
    setTimeout(async () => {
      console.log(`[Timer] Revertiendo reserva no confirmada para el juego ${gameId}`);
      try {
        await pool.query('UPDATE videojuegos SET stock = stock + 1 WHERE id = $1', [gameId]);
      } catch (err) {
        console.error('Error al revertir el stock:', err);
      }
    }, 10 * 60 * 1000); // 10 minutos
    
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
const createGame = async (titulo, precio, stock, categoria, imagen_url) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'INSERT INTO videojuegos (titulo, precio, stock, categoria, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titulo, precio, stock, categoria, imagen_url]
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

const updateGame = async (id, titulo, precio, stock, categoria, imagen_url) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Obtener precio actual antes de actualizar
    const currentRes = await client.query('SELECT precio FROM videojuegos WHERE id = $1', [id]);
    const oldPrice = currentRes.rows[0]?.precio;

    const result = await client.query(
      'UPDATE videojuegos SET titulo = $1, precio = $2, stock = $3, categoria = $4, imagen_url = $5 WHERE id = $6 RETURNING *',
      [titulo, precio, stock, categoria, imagen_url, id]
    );
    const updatedGame = result.rows[0];

    // Si el precio ha cambiado, registrar en el historial
    if (parseFloat(oldPrice) !== parseFloat(precio)) {
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
