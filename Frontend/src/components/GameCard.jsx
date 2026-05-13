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

      setMessage('¡Añadido al carrito!');
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
         
         {/* Badge de Oferta */}
         {game.precio_anterior && (
           <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
             <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-red-600/40 animate-pulse flex items-center gap-1.5 border border-red-400/50">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
               </span>
               OFERTA
             </div>
             <div className="bg-white/10 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full border border-white/20 text-center">
               -{Math.round((1 - (parseFloat(game.precio) / parseFloat(game.precio_anterior))) * 100)}%
             </div>
           </div>
         )}
      </div>
      
      {/* Información del juego */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="text-xl font-bold text-gray-100 leading-tight cursor-pointer hover:text-cyan-400 transition-colors line-clamp-2 h-14"
            title={game.titulo}
            onClick={() => onShowDetail(game)}
          >
            {game.titulo}
          </h3>
          <div className="flex flex-col items-end gap-1 ml-2">
            <span className="bg-cyan-900/50 text-cyan-300 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap uppercase tracking-widest border border-cyan-800/30">
              {game.categoria || 'Juego'}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {game.precio_anterior && (
              <span className="text-xs text-gray-500 line-through font-semibold mb-0.5">
                {game.precio_anterior}€
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black ${game.precio_anterior ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]' : 'text-white'}`}>
                {game.precio}€
              </span>
            </div>
          </div>
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
