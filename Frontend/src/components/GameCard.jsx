import React, { useState, useEffect } from 'react';
import PriceHistoryChart from './PriceHistoryChart';

const GameCard = ({ game, token, API_URL, onShowAuth, onAddToCart, onShowDetail }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [localStock, setLocalStock] = useState(game.stock);

  // Sincronizar stock si se actualiza desde el padre (ej. al cancelar reserva)
  useEffect(() => {
    setLocalStock(game.stock);
  }, [game.stock]);

  const handleReserve = async () => {
    if (!token) {
      onShowAuth();
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/games/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gameId: game.id })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al reservar');
      }

      setMessage('¡Añadido y Reservado!');
      setLocalStock(prev => prev - 1);
      
      // Añadir al estado del carrito en React
      onAddToCart(game);
      
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
      // Limpiar mensaje tras 3 segundos
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-cyan-500/30 transition-all duration-500 border-2 border-gray-800 hover:border-cyan-500/50 flex flex-col group relative z-0 hover:z-10">
      {/* Imagen del juego */}
      <div 
        className="h-48 bg-gray-700 flex items-center justify-center relative overflow-hidden cursor-pointer bg-gradient-to-br from-purple-900 to-gray-800"
        onClick={() => onShowDetail(game)}
      >
         <img 
            src={game.imagen_url || `https://picsum.photos/seed/${game.id}/400/300`} 
            alt={game.titulo}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:brightness-110 transition-all duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://picsum.photos/seed/${game.id}/400/300`;
            }}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
         <span className="text-white font-black text-2xl z-10 drop-shadow-lg opacity-20 group-hover:opacity-100 transition-opacity">
            {game.titulo.substring(0, 2).toUpperCase()}
         </span>
      </div>
      
      {/* Información del juego */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="text-xl font-bold text-gray-100 leading-tight cursor-pointer hover:text-cyan-400 transition-colors"
            onClick={() => onShowDetail(game)}
          >
            {game.titulo}
          </h3>
          <span className="bg-cyan-900/50 text-cyan-300 text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2">
            {game.categoria || 'Juego'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-white">{game.precio}€</span>
          <span className={`text-sm font-bold ${localStock > 10 ? 'text-green-400' : localStock > 0 ? 'text-orange-400' : 'text-red-500'}`}>
            {localStock > 0 ? `${localStock} unidades` : 'Sin Stock'}
          </span>
        </div>

        {/* Gráfica de Historial de Precios */}
        <PriceHistoryChart gameId={game.id} API_URL={API_URL} />
        
        <div className="mt-auto pt-5">
          {message && (
            <p className={`text-sm mb-2 text-center ${message.includes('Añadido') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
          <button 
            onClick={handleReserve}
            disabled={loading || localStock <= 0}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <span>Procesando...</span>
            ) : localStock > 0 ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Añadir al carrito</span>
              </>
            ) : (
              <span>Agotado</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
