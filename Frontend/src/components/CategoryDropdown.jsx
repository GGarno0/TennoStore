import React, { useState, useRef, useEffect } from 'react';

const CategoryDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full md:w-72" ref={dropdownRef}>
      {/* Etiqueta superior opcional para look premium */}
      <div className="absolute -top-2 left-4 px-2 bg-gray-900/80 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/70 z-20 rounded-full border border-cyan-500/20">
        Filtrar por Género
      </div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gray-800/40 border transition-all duration-500 rounded-2xl py-4 px-6 text-white flex justify-between items-center backdrop-blur-md group hover:bg-gray-800/60 ${
          isOpen 
            ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]' 
            : 'border-gray-700/50 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-all duration-300 ${isOpen ? 'bg-cyan-500/20' : 'bg-gray-700/30'}`}>
            <svg className={`w-5 h-5 transition-colors ${isOpen ? 'text-cyan-400' : 'text-gray-400 group-hover:text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <span className={`font-black uppercase tracking-widest text-[13px] transition-all duration-300 ${isOpen ? 'text-cyan-400' : 'text-white group-hover:text-cyan-300'}`}>
            {value === 'Todas' ? 'Todos los géneros' : value}
          </span>
        </div>
        <div className={`p-1 transition-all duration-500 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-gray-300 group-hover:text-cyan-400'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Menú Desplegable */}
      <div 
        className={`absolute top-[calc(100%+0.75rem)] right-0 min-w-[280px] bg-gray-900/95 border border-gray-700/80 rounded-2xl overflow-hidden backdrop-blur-3xl z-[100] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_20px_rgba(34,211,238,0.1)] transition-all duration-500 origin-top-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-4 invisible'
        }`}
      >
        <div className="p-2">
          <ul className="max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {options.map((cat) => (
              <li
                key={cat}
                onClick={() => {
                  onChange(cat);
                  setIsOpen(false);
                }}
                className={`group px-4 py-3 rounded-xl cursor-pointer transition-all flex items-center justify-between mb-1 last:mb-0 ${
                  value === cat
                    ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-cyan-500/40'
                    : 'hover:bg-gray-800/90 hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    value === cat ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-gray-500 group-hover:bg-cyan-400'
                  }`}></div>
                  <span className={`text-sm font-black uppercase tracking-wider transition-colors ${
                    value === cat ? 'text-white' : 'text-gray-200 group-hover:text-white'
                  }`}>
                    {cat === 'Todas' ? 'Todos los géneros' : cat}
                  </span>
                </div>
                
                {value === cat && (
                  <div className="bg-cyan-500/20 p-1 rounded-md">
                    <svg className="w-3.5 h-3.5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown;
