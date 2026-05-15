import React, { useState, useEffect } from 'react';

const LatestGamesCarousel = ({ games, onShowDetail }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Obtener los últimos 5 juegos añadidos (asumiendo que IDs más altos son más recientes)
  const latestGames = [...games]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  useEffect(() => {
    if (latestGames.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === latestGames.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [latestGames.length]);

  if (latestGames.length === 0) return null;

  return (
    <div className="relative mb-12 group overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-gray-900/40 backdrop-blur-md h-[300px] md:h-[450px]">
      {/* Indicador de "Novedades" */}
      <div className="absolute top-3 md:top-6 left-6 z-20 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-[8px] md:text-xs font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg uppercase tracking-widest animate-pulse">
        Novedades Destacadas
      </div>

      {/* Slides */}
      <div className="relative w-full h-full">
        {latestGames.map((game, index) => (
          <div
            key={game.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentIndex 
                ? 'opacity-100 scale-100 translate-x-0' 
                : 'opacity-0 scale-110 translate-x-full'
            }`}
          >
            {/* Imagen de fondo desenfocada */}
            <div 
              className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-30"
              style={{ backgroundImage: `url(${game.imagen_url || 'https://via.placeholder.com/800x450'})` }}
            />
            
            <div className="relative h-full flex flex-col md:flex-row items-center justify-center md:justify-between p-6 pt-14 md:pt-16 md:p-16 gap-4 md:gap-8">
              {/* Contenido Texto */}
              <div className="flex-1 text-center md:text-left z-10 w-full">
                <h3 className="text-xl sm:text-2xl md:text-5xl font-black text-white mb-2 md:mb-4 drop-shadow-lg uppercase tracking-tighter leading-tight line-clamp-2 md:line-clamp-none">
                  {game.titulo}
                </h3>
                <p className="text-cyan-400 text-sm md:text-lg font-bold mb-4 md:mb-6 flex items-center justify-center md:justify-start gap-2">
                  <span className="bg-cyan-500/20 px-2 py-0.5 md:px-3 md:py-1 rounded-lg border border-cyan-500/30">
                    {game.categoria}
                  </span>
                  <span className="text-white/50">•</span>
                  <span className="text-xl md:text-2xl text-white">{game.precio}€</span>
                </p>
                <button
                  onClick={() => onShowDetail(game)}
                  className="bg-white text-gray-900 px-6 py-2 md:px-8 md:py-3 rounded-xl font-black hover:bg-cyan-400 transition-all transform hover:scale-105 shadow-xl uppercase text-[10px] md:text-sm"
                >
                  Ver Detalles
                </button>
              </div>

              {/* Imagen Carátula */}
              <div className="flex-shrink-0 z-10">
                <img
                  src={game.imagen_url || 'https://via.placeholder.com/300x450'}
                  alt={game.titulo}
                  className="h-48 md:h-80 w-auto rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-white/10 transform rotate-3 group-hover:rotate-0 transition-transform duration-500 cursor-pointer"
                  onClick={() => onShowDetail(game)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles Navegación */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {latestGames.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-12 bg-cyan-400' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestGamesCarousel;
