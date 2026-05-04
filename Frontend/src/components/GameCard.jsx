import React from 'react';

const GameCard = ({ game }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-cyan-500/50">
      {/* Imagen temporal con las iniciales */}
      <div className="h-48 bg-gray-700 flex items-center justify-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-cyan-600/40 opacity-50 group-hover:opacity-80 transition-opacity"></div>
         <span className="text-gray-400 font-bold text-xl z-10">{game.titulo.substring(0, 2).toUpperCase()}</span>
      </div>
      
      {/* Información del juego */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-100 leading-tight">{game.titulo}</h3>
          <span className="bg-cyan-900/50 text-cyan-300 text-xs font-bold px-2 py-1 rounded">
            {game.categoria || 'Juego'}
          </span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-white">${game.precio}</span>
          <span className={`text-sm ${game.stock > 10 ? 'text-green-400' : 'text-orange-400'}`}>
            Stock: {game.stock}
          </span>
        </div>
        
        <button className="w-full mt-5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-2 rounded-lg transition-all shadow-md">
          Comprar
        </button>
      </div>
    </div>
  );
};

export default GameCard;
