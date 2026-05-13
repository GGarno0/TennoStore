import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PriceHistoryChart from './PriceHistoryChart';

const GameDetailModal = ({ game, isOpen, onClose, onAddToCart, onSelectGame, API_URL, token }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

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

  if (!isOpen || !game) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] backdrop-blur-xl p-4 overflow-y-auto">
      <div className="bg-gray-900 w-full max-w-4xl rounded-3xl border border-gray-700 shadow-2xl animate-scale-up my-8">
        
        {/* Cabecera con Diseño de Respaldo (CSS) */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl bg-gradient-to-br from-purple-800 via-gray-900 to-cyan-900 flex items-center justify-center">
          
          {/* Tipografía de fondo (estilo moderno) */}
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
            className="absolute top-6 right-6 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all z-20 border border-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <div className="absolute bottom-8 left-8 z-10">
            <div className="flex gap-2 mb-3">
              <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block border border-cyan-500/30 backdrop-blur-sm">
                {game.categoria}
              </span>
              {(game.plataforma || 'MULTI').split(',').map(plat => (
                <span key={plat} className="bg-purple-500/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block border border-purple-500/30 backdrop-blur-sm">
                  {plat.trim()}
                </span>
              ))}
              {game.precio_anterior && (
                <span className="bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block border border-red-500/30 backdrop-blur-sm animate-pulse">
                  -{Math.round(((game.precio_anterior - game.precio) / game.precio_anterior) * 100)}% Oferta
                </span>
              )}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl">{game.titulo}</h2>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Info y Compra */}
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
              <button 
                onClick={() => onAddToCart(game)}
                disabled={game.stock <= 0}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Añadir al Carrito
              </button>
            </div>

            <div className="text-gray-400 text-sm leading-relaxed">
              <p>Explora este increíble título de {game.categoria}. TennoStore te garantiza la mejor experiencia de compra y el precio más bajo del mercado.</p>
            </div>
          </div>

          {/* Columna Derecha: Gráfico y Recomendaciones */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gráfico de Evolución */}
            <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                Evolución de Precio
              </h3>
              <PriceHistoryChart gameId={game.id} API_URL={API_URL} />
            </div>

            {/* RECOMENDADOR (Opción A) */}
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
