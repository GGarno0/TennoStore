import React from 'react';
import CategoryDropdown from './CategoryDropdown';

const FilterBar = ({ 
  selectedCategory, 
  setSelectedCategory, 
  searchTerm, 
  showOnlyOffers, 
  setShowOnlyOffers, 
  filteredCount, 
  categories 
}) => {
  return (
    <div id="games-list-section" className="mb-6 flex flex-col md:flex-row justify-between items-center bg-gray-900/40 p-4 md:p-6 rounded-3xl backdrop-blur-md border border-white/5 gap-6 relative z-30 shadow-xl shadow-black/20">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <span className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)]"></span>
        <h2 className="text-xl md:text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {selectedCategory === 'Todas' ? 'Todos los Juegos' : `Juegos de ${selectedCategory}`}
          {searchTerm && <span className="text-cyan-400 text-sm ml-2 hidden lg:inline font-medium"> (Filtrando por "{searchTerm}")</span>}
        </h2>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        {/* Filtro de Ofertas */}
        <button
          onClick={() => setShowOnlyOffers(!showOnlyOffers)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 font-black text-[10px] uppercase tracking-[0.1em] ${
            showOnlyOffers 
              ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] scale-105' 
              : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:border-red-500/50 hover:text-red-400'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Ofertas
        </button>

        <span className="bg-purple-900/40 text-purple-200 text-[10px] font-black px-4 py-2.5 rounded-xl border border-purple-500/20 uppercase tracking-[0.2em] whitespace-nowrap shadow-inner">
          {filteredCount} RESULTADOS
        </span>

        {/* Filtro por Género */}
        <div className="relative">
          <CategoryDropdown 
            value={selectedCategory} 
            onChange={setSelectedCategory} 
            options={categories} 
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
