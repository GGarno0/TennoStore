import React from 'react';
import iconPC from '../assets/platforms/icon-pc.svg';
import iconPS from '../assets/platforms/icon-play2.svg';
import iconXbox from '../assets/platforms/icon-xbx.svg';
import iconSwitch from '../assets/platforms/icon-swt.svg';

const Header = ({ 
  scrolled, 
  currentView, 
  setCurrentView, 
  user, 
  handleLogout, 
  setShowAuthModal, 
  setShowCart, 
  cartLength,
  searchTerm,
  setSearchTerm,
  selectedPlatform,
  setSelectedPlatform,
  isSearchExpanded,
  setIsSearchExpanded
}) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
      scrolled 
        ? 'bg-gray-900/80 backdrop-blur-lg border-gray-700 py-3 shadow-2xl' 
        : 'bg-transparent border-transparent py-8'
    }`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex justify-between items-center relative">
        {/* Logo */}
        <div className="justify-self-start cursor-pointer z-10 flex items-center gap-4" onClick={() => { setCurrentView('store'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
          <h1 className={`font-black tracking-tighter transition-all duration-500 flex items-center select-none ${
            scrolled ? 'text-xl md:text-2xl' : 'text-2xl sm:text-4xl md:text-5xl'
          }`}>
            <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Tenno</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-[length:200%_auto] animate-shimmer drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] pr-1.5">Store</span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full ml-1.5 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse"></span>
          </h1>
        </div>

        {/* Central Search/Filter */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          {currentView === 'store' && (
            <div className="flex items-center gap-2 bg-gray-800/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md animate-fade-in shadow-xl shadow-black/20">
              <div className={`flex items-center gap-1 transition-all duration-500 overflow-hidden ${isSearchExpanded ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                {[
                  { id: 'Todas', icon: 'M4 6h16M4 12h16M4 18h16', isPath: true },
                  { id: 'PC', icon: iconPC, isPath: false },
                  { id: 'PLAYSTATION', icon: iconPS, isPath: false },
                  { id: 'XBOX', icon: iconXbox, isPath: false },
                  { id: 'NINTENDO', icon: iconSwitch, isPath: false }
                ].map(plat => (
                  <button
                    key={plat.id}
                    onClick={() => setSelectedPlatform(plat.id)}
                    className={`rounded-xl transition-all duration-500 ${
                      scrolled ? 'p-1.5' : 'p-2'
                    } ${
                      selectedPlatform === plat.id 
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 scale-105' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={plat.id}
                  >
                    {plat.isPath ? (
                      <svg className={`transition-all duration-500 ${scrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={plat.icon} /></svg>
                    ) : (
                      <img src={plat.icon} alt={plat.id} className={`invert transition-all duration-500 ${scrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${selectedPlatform === plat.id ? 'brightness-200' : 'opacity-70'}`} />
                    )}
                  </button>
                ))}
              </div>

              <div className={`relative flex items-center transition-all duration-500 ease-out ${isSearchExpanded ? (scrolled ? 'w-64' : 'w-80') : (scrolled ? 'w-8' : 'w-10')}`}>
                <button 
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  className={`absolute left-0 z-10 rounded-xl transition-all duration-500 ${scrolled ? 'p-1.5' : 'p-2'} ${isSearchExpanded ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                >
                  <svg className={`transition-all duration-500 ${scrolled ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
                <input 
                  type="text"
                  placeholder="Buscar juegos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`bg-gray-900/50 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 transition-all duration-500 ${
                    scrolled ? 'py-1.5 pl-8 pr-8 text-xs' : 'py-2 pl-10 pr-10 text-sm'
                  } ${
                    isSearchExpanded ? 'w-full opacity-100 scale-100' : 'w-0 opacity-0 scale-95 pointer-events-none'
                  }`}
                />
                {isSearchExpanded && (
                  <button 
                    onClick={() => { setIsSearchExpanded(false); setSearchTerm(''); }}
                    className={`absolute right-2 text-gray-400 hover:text-white bg-gray-800 rounded-full border border-gray-700 transition-all duration-500 ${scrolled ? 'p-0.5' : 'p-1'}`}
                  >
                    <svg className={`transition-all duration-500 ${scrolled ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-1 md:gap-4 z-10">
          {/* Soporte 24/7 */}
          <button 
            className={`hidden lg:flex items-center justify-center relative bg-gray-800/40 hover:bg-gray-700/50 border border-white/5 rounded-xl transition-all duration-500 group ${
              scrolled ? 'p-1.5 opacity-60 scale-90' : 'p-2.5 opacity-100'
            }`}
            title="Soporte Técnico 24/7"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
          </button>

          {currentView === 'store' && (
            <>
              {user && user.is_admin && (
                <button 
                  onClick={() => setCurrentView('admin')}
                  className={`bg-gray-800 hover:bg-gray-700 text-purple-400 rounded-xl border border-gray-600 transition-all flex items-center gap-2 ${
                    scrolled ? 'px-3 py-2' : 'px-4 py-3'
                  }`}
                  title="Panel de Administración"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {!scrolled && <span className="font-bold text-[10px] uppercase tracking-widest hidden lg:inline">Admin</span>}
                </button>
              )}
              
              <button 
                onClick={() => setShowCart(true)}
                className={`relative bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-xl border border-gray-600 transition-all flex items-center justify-center ${
                  scrolled ? 'p-2' : 'p-3'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {cartLength > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-gray-900">
                    {cartLength}
                  </span>
                )}
              </button>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentView('profile')}
                className={`bg-gray-800 hover:bg-gray-700 text-purple-400 rounded-xl border border-gray-600 transition-all flex items-center justify-center ${
                  scrolled ? 'p-2' : 'p-3'
                }`}
                title="Mi Perfil"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              <button 
                onClick={handleLogout}
                className={`bg-red-900/40 hover:bg-red-800/60 text-red-300 rounded-xl border border-red-700/30 transition-all flex items-center justify-center ${
                  scrolled ? 'p-2' : 'p-3'
                }`}
                title="Cerrar Sesión"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className={`bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-gray-600 transition-all font-semibold ${
                scrolled ? 'px-4 py-2 text-sm' : 'px-5 py-2.5'
              }`}
            >
              Identificarse
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
