import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PriceHistoryChart from './PriceHistoryChart';

const GameDetailModal = ({ game, isOpen, onClose, onAddToCart, onSelectGame, onShowAuth, API_URL, token }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && game) {
      setLoadingRecs(true);
      fetch(`${API_URL}/api/games/${game.id}/recommendations`)
        .then(res => res.json())
        .then(data => {
          setRecommendations(data);
          setLoadingRecs(false);
        })
        .catch(err => {
          console.error('Error fetching recommendations:', err);
          setLoadingRecs(false);
        });
    }
  }, [isOpen, game, API_URL]);

  const handleReserve = async () => {
    if (!token) {
      onClose(); // Cerrar el modal para que se vea el modal de auth
      onShowAuth();
      return;
    }

    setReserving(true);
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
      onAddToCart(game);
      
      // Esperamos un momento para que lea el mensaje
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 800);
      
    } catch (err) {
      setMessage(err.message);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setReserving(false);
    }
  };

  if (!isOpen || !game) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/90 flex items-start md:items-center justify-center z-[70] backdrop-blur-xl p-0 md:p-4 overflow-y-auto">
      <div className="bg-gray-900 w-full max-w-4xl rounded-none md:rounded-3xl border-x md:border border-gray-700 shadow-2xl animate-scale-up md:my-8 relative">
        
        {/* Cabecera de la ficha */}
        <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden rounded-t-none md:rounded-t-3xl bg-gradient-to-br from-purple-800 via-gray-900 to-cyan-900 flex items-center justify-center">
          
          {/* Letras gigantes de fondo */}
          <span className="absolute text-[12rem] font-black text-white/5 select-none tracking-tighter">
            TENNO
          </span>

          <img 
            src={game.imagen_url || `https://picsum.photos/seed/${game.id}/800/600`} 
            alt={game.titulo}
            className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-1000"
            onLoad={(e) => e.target.style.opacity = '0.4'}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://picsum.photos/seed/${game.id}/800/600`;
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-all z-50 border border-white/20 shadow-lg backdrop-blur-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <div className="absolute top-4 -left-1.5 z-50 flex flex-col gap-1 items-start">
             {/* Cartelito de descuento */}
             {game.precio_anterior && (
               <>
                 <div className="bg-red-600 text-white text-[11px] md:text-xs font-black px-4 py-2 rounded-r-xl shadow-[5px_5px_20px_rgba(220,38,38,0.5)] border-l-4 border-red-800 uppercase tracking-widest animate-pulse">
                   OFERTA ESPECIAL
                 </div>
                 <div className="ml-2 bg-white text-gray-900 text-[14px] md:text-16px font-black px-3 py-1 rounded-lg shadow-2xl border border-white/20">
                   AHORRAS {Math.round(((game.precio_anterior - game.precio) / game.precio_anterior) * 100)}%
                 </div>
               </>
             )}
          </div>
          
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-10 w-full pr-12">
            <div className="flex flex-wrap gap-2 mb-2 md:mb-3">
              <span className="bg-cyan-500/20 text-cyan-400 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full uppercase tracking-widest inline-block border border-cyan-500/30 backdrop-blur-sm">
                {game.categoria}
              </span>
              {(game.plataforma || 'MULTI').split(',').map(plat => (
                <span key={plat} className="bg-purple-500/20 text-purple-400 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full uppercase tracking-widest inline-block border border-purple-500/30 backdrop-blur-sm">
                  {plat.trim()}
                </span>
              ))}
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-white drop-shadow-2xl leading-tight line-clamp-2">{game.titulo}</h2>
          </div>
        </div>

        <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Parte izquierda: Detalles y botón */}
          <div className="lg:col-span-1 space-y-6">

            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-400 text-sm">Precio Actual</span>
                <div className="text-right">
                  {game.precio_anterior && (
                    <div className="text-sm text-gray-500 line-through mb-1">{game.precio_anterior}€</div>
                  )}
                  <span className="text-4xl font-black text-cyan-400">{game.precio}€</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm mb-6">
                <span className="text-gray-400">Estado</span>
                <span className={`font-bold ${game.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {game.stock > 0 ? `${game.stock} Unidades disponibles` : 'Agotado'}
                </span>
              </div>
              <div className="relative">
                {message && (
                  <div className="absolute -top-10 left-0 right-0 flex justify-center animate-bounce-in z-50 pointer-events-none">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-2xl border backdrop-blur-md whitespace-nowrap ${
                      message.includes('Añadido') 
                        ? 'bg-green-500/90 text-white border-green-400 shadow-green-500/40' 
                        : 'bg-red-500/90 text-white border-red-400 shadow-red-500/40'
                    }`}>
                      {message}
                    </div>
                  </div>
                )}
                <button 
                  onClick={handleReserve}
                  disabled={game.stock <= 0 || reserving}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {reserving ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      Añadir al Carrito
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-gray-400 text-sm leading-relaxed">
              <p>Explora este increíble título de {game.categoria}. TennoStore te garantiza la mejor experiencia de compra y el precio más bajo del mercado.</p>
            </div>
          </div>

          {/* Parte derecha: Gráfica y sugerencias */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gráfica de precios historicos */}
            <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                Evolución de Precio
              </h3>
              <PriceHistoryChart gameId={game.id} API_URL={API_URL} />
            </div>

            {/* Juegos similares */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                También te podría gustar
              </h3>
              
              {loadingRecs ? (
                <div className="h-24 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.length > 0 ? recommendations.map(rec => (
                    <div 
                      key={rec.id} 
                      className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer group"
                      onClick={() => onSelectGame(rec)}
                    >
                      <h4 className="text-white font-bold text-sm truncate group-hover:text-cyan-400 transition-colors">{rec.titulo}</h4>
                      <p className="text-cyan-400 font-black text-lg mt-1">{rec.precio}€</p>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-sm italic">No hay juegos similares disponibles en este momento.</p>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>,
    document.body
  );
};

export default GameDetailModal;
