import { useEffect, useState } from 'react';
import StatusIndicator from './components/StatusIndicator';
import GameCard from './components/GameCard';

function App() {
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // URL de la API del backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    // Pedir estado del backend
    fetch(`${API_URL}/api/status`)
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('Error: No se pudo conectar al Backend'));

    // Pedir la lista de juegos
    fetch(`${API_URL}/api/games`)
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching games:', err);
        setLoading(false);
      });
  }, [API_URL]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            TennoStore
          </h1>
          <p className="text-gray-400 text-lg">Tu e-commerce de videojuegos</p>
        </header>

        {/* Indicador de estado */}
        <StatusIndicator status={status} />

        {/* Listado de juegos */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold mb-6 border-b border-gray-700 pb-2">Juegos Destacados</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
        
        {games.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-10">
            No se encontraron juegos en la base de datos.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
