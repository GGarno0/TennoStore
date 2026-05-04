const pool = require('../config/db');

// Obtener todos los juegos
const getGames = async (req, res) => {
  try {
    // Intentar traer los juegos de la base de datos
    const result = await pool.query('SELECT * FROM videojuegos');
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
  } catch (err) {
    console.error('Error al consultar la BD, usando datos de prueba:', err);
  }

  // Datos de prueba por si falla la base de datos
  const testGames = [
    { id: 1, titulo: 'The Legend of Zelda', precio: 59.99, stock: 10, categoria: 'Aventura' },
    { id: 2, titulo: 'Elden Ring', precio: 49.99, stock: 5, categoria: 'RPG' },
    { id: 3, titulo: 'Cyberpunk 2077', precio: 29.99, stock: 20, categoria: 'Acción' }
  ];
  res.json(testGames);
};

module.exports = {
  getGames
};
