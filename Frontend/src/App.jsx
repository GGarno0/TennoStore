import { useEffect, useState } from 'react';
import GameCard from './components/GameCard';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import AdminPanel from './components/AdminPanel';
import PaymentModal from './components/PaymentModal';
import GameDetailModal from './components/GameDetailModal';
import FloatingLines from './components/FloatingLines/FloatingLines';
import LatestGamesCarousel from './components/LatestGamesCarousel';
import UserProfile from './components/UserProfile';
import PriceHistoryChart from './components/PriceHistoryChart';
import CategoryDropdown from './components/CategoryDropdown';
import NotificationToast from './components/NotificationToast';
import Footer from './components/Footer';

// Importación de iconos de plataformas
import iconPC from './assets/platforms/icon-pc.svg';
import iconPS from './assets/platforms/icon-play2.svg';
import iconXbox from './assets/platforms/icon-xbx.svg';
import iconSwitch from './assets/platforms/icon-swt.svg';

// Configuración estática del fondo para evitar re-renderizados innecesarios (Parpadeo)
const BG_GRADIENT = ['#A855F7', '#22D3EE', '#FFFFFF'];
const BG_WAVES = ['top', 'middle', 'bottom'];
const BG_LINE_COUNT = [10, 15, 20];
const BG_LINE_DIST = [8, 6, 4];

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Cart state - Independiente por usuario (C10)
  const getCartKey = (u) => u ? `cart_${u.id}` : 'cart_guest';
  
  const [cart, setCart] = useState(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const savedCart = localStorage.getItem(getCartKey(currentUser));
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [showCart, setShowCart] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Efecto para cambiar de carrito al cambiar de usuario
  useEffect(() => {
    const savedCart = localStorage.getItem(getCartKey(user));
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [user?.id]);

  // Guardar carrito en la clave específica del usuario actual
  useEffect(() => {
    localStorage.setItem(getCartKey(user), JSON.stringify(cart));
  }, [cart, user?.id]);

  // Gestión del tiempo de expiración del carrito
  useEffect(() => {
    const checkExpiration = () => {
      if (cart.length === 0) return;
      const now = Date.now();
      const expirationTime = 10 * 60 * 1000;
      
      const expiredItems = cart.filter(item => (now - item.addedAt) >= expirationTime);
      
      if (expiredItems.length > 0) {
        expiredItems.forEach(item => {
          handleRemoveFromCart(item.id); // Devolución automática de stock
        });
      }
    };

    // Revisar al montar el componente (por si expiró con el navegador cerrado)
    checkExpiration();

    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [cart]);

  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedPlatform, setSelectedPlatform] = useState('Todas');
  const [notification, setNotification] = useState(null);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // URL de la API del backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchGames = () => {
    fetch(`${API_URL}/api/games`)
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchGames();

    // Efecto visual para el header al hacer scroll
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [API_URL]);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setShowAuthModal(false);
    setCurrentView('store');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setCart([]); // Vaciar carrito al salir
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentView('store'); // Volver a la tienda al salir
  };

  const handleAddToCart = async (game) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === game.id);
      if (existing) {
        return prev.map(item => 
          item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...game, quantity: 1, addedAt: Date.now() }];
    });
  };

  const handleUpdateQuantity = async (gameId, delta) => {
    const item = cart.find(i => i.id === gameId);
    if (!item) return;

    if (delta > 0) {
      // Intentar reservar una unidad más en el backend
      try {
        const res = await fetch(`${API_URL}/api/games/reserve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ gameId })
        });
        if (res.ok) {
          setCart(prev => prev.map(i => i.id === gameId ? { ...i, quantity: i.quantity + 1 } : i));
          fetchGames();
        } else {
          const data = await res.json();
          notify(data.error || 'No se pudo aumentar la cantidad', 'error');
        }
      } catch (err) {
        console.error(err);
      }
    } else if (delta < 0 && item.quantity > 1) {
      // Liberar una unidad en el backend
      try {
        await fetch(`${API_URL}/api/games/cancel-reservation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ gameId })
        });
        setCart(prev => prev.map(i => i.id === gameId ? { ...i, quantity: i.quantity - 1 } : i));
        fetchGames();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRemoveFromCart = async (gameId) => {
    const item = cart.find(i => i.id === gameId);
    if (!item) return;

    // Actualización local y sincronización de stock con el server
    setCart(prev => prev.filter(i => i.id !== gameId));

    // Devolver TODAS las unidades reservadas al stock
    try {
      // Podríamos hacer un loop o crear un endpoint bulk, pero por ahora devolvemos N veces
      for (let i = 0; i < item.quantity; i++) {
        await fetch(`${API_URL}/api/games/cancel-reservation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ gameId })
        });
      }
      fetchGames();
    } catch (err) {
      console.error('Error devolviendo el stock:', err);
    }
  };

  const handlePaymentSuccess = async () => {
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0);
    
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ total, items: cart })
      });

      if (res.ok) {
        notify('¡Pago realizado con éxito! Gracias por tu compra.');
        setCart([]); // Vaciar carrito
        setShowPaymentModal(false);
        setShowCart(false);
      }
    } catch (err) {
      console.error('Error al confirmar pedido:', err);
      notify('Hubo un error al procesar tu pedido.', 'error');
    }
  };

  const handleShowDetail = (game) => {
    setSelectedGame(game);
    setShowDetailModal(true);
  };

  const [currentView, setCurrentView] = useState('store'); // 'store' o 'admin'

  // Lógica de filtrado
  const filteredGames = games
    .filter(game => {
      const matchesSearch = game.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || game.categoria === selectedCategory;
      const matchesPlatform = selectedPlatform === 'Todas' || (game.plataforma && game.plataforma.includes(selectedPlatform));
      return matchesSearch && matchesCategory && matchesPlatform;
    })
    .sort((a, b) => {
      if (!searchTerm) return 0;
      const aStarts = a.titulo.toLowerCase().startsWith(searchTerm.toLowerCase());
      const bStarts = b.titulo.toLowerCase().startsWith(searchTerm.toLowerCase());
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.titulo.localeCompare(b.titulo); // Orden alfabético si ambos coinciden igual
    });

  const categories = ['Todas', ...new Set(games.map(g => g.categoria).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-x-hidden">
      <div className="p-8">
        {/* Toast de Notificaciones */}
      {notification && (
        <NotificationToast 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FloatingLines 
          linesGradient={BG_GRADIENT}
          enabledWaves={BG_WAVES}
          lineCount={BG_LINE_COUNT}
          lineDistance={BG_LINE_DIST}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        
        {/* Cabecera Sticky */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          scrolled 
            ? 'bg-gray-900/80 backdrop-blur-lg border-gray-700 py-3 shadow-2xl' 
            : 'bg-transparent border-transparent py-8'
        }`}>
          <div className="max-w-6xl mx-auto px-8 flex justify-between items-center gap-4">
            <div className="transition-all duration-500">
              <h1 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-500 ${
                scrolled ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'
              }`}>
                TennoStore
              </h1>
              {!scrolled && (
                <p className="text-gray-400 text-sm md:text-lg mt-1 animate-fade-in">Busca y compara precios de tus juegos favoritos</p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
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
                      {!scrolled && <span className="font-bold text-xs uppercase tracking-widest hidden lg:inline">Admin</span>}
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
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-gray-900">
                        {cart.length}
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

        {/* Espaciador para el header fixed */}
        <div className={`transition-all duration-500 ${scrolled ? 'h-24' : 'h-40'}`}></div>

        {currentView === 'admin' && user && user.is_admin ? (
          <AdminPanel 
            token={token} 
            API_URL={API_URL} 
            onGoBack={() => { setCurrentView('store'); fetchGames(); }} 
          />
        ) : currentView === 'profile' && user ? (
          <UserProfile 
            user={user}
            token={token}
            API_URL={API_URL}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            onGoBack={() => setCurrentView('store')}
          />
        ) : (
          <>
            {/* Carrusel de Novedades */}
            <LatestGamesCarousel games={games} onShowDetail={handleShowDetail} />

            {/* Selector de Plataformas (Estética premium) */}
            <div className="relative flex flex-wrap justify-center gap-6 mb-12 bg-gray-800/40 p-4 rounded-3xl border border-gray-700/50 backdrop-blur-md">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-4 bg-gray-900/80 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/80 z-20 rounded-full border border-cyan-400/20">
                Seleccionar Plataforma
              </div>
              {[
                { id: 'Todas', name: 'Todas', icon: 'M4 6h16M4 12h16M4 18h16', isPath: true },
                { id: 'PC', name: 'PC', icon: iconPC, isPath: false },
                { id: 'PLAYSTATION', name: 'PS', icon: iconPS, isPath: false },
                { id: 'XBOX', name: 'Xbox', icon: iconXbox, isPath: false },
                { id: 'NINTENDO', name: 'Switch', icon: iconSwitch, isPath: false }
              ].map(plat => (
                <button
                  key={plat.id}
                  onClick={() => setSelectedPlatform(plat.id)}
                  className={`group flex items-center gap-3 px-8 py-3 rounded-2xl transition-all duration-300 font-black text-[11px] uppercase tracking-[0.2em] border ${
                    selectedPlatform === plat.id 
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-xl shadow-cyan-500/20 scale-110 border-transparent' 
                      : 'text-gray-300 hover:text-white bg-gray-800/50 border-gray-700 hover:border-gray-500 hover:bg-gray-700/50'
                  }`}
                >
                  {plat.isPath ? (
                    <svg className={`w-5 h-5 ${selectedPlatform === plat.id ? 'text-white' : 'text-cyan-400 group-hover:text-cyan-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={plat.icon} />
                    </svg>
                  ) : (
                    <img 
                      src={plat.icon} 
                      alt={plat.name} 
                      className={`w-5 h-5 transition-all duration-300 ${
                        selectedPlatform === plat.id 
                          ? 'brightness-200 invert' 
                          : 'opacity-70 group-hover:opacity-100 group-hover:brightness-125 invert'
                      }`}
                    />
                  )}
                  {plat.name}
                </button>
              ))}
            </div>

            {/* Buscador y filtros */}
            <div className="mb-8 flex flex-col md:flex-row gap-6 items-center">
              <div className="relative flex-1 w-full group">
                <div className="absolute -top-2 left-4 px-2 bg-gray-900/80 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-purple-500/70 z-20 rounded-full border border-purple-500/20">
                  Búsqueda
                </div>
                <svg className="w-5 h-5 absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input 
                  type="text" 
                  placeholder="Buscar juegos por título..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all backdrop-blur-md placeholder-gray-600 font-semibold"
                />
              </div>
              
              <CategoryDropdown 
                value={selectedCategory} 
                onChange={setSelectedCategory} 
                options={categories} 
              />
            </div>

            {/* Listado de juegos */}
            <div className="mb-6 flex justify-between items-center bg-gray-900/40 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
              <h2 className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-2">
                <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
                {selectedCategory === 'Todas' ? 'Todos los Juegos' : `Juegos de ${selectedCategory}`}
                {searchTerm && <span className="text-cyan-400 text-sm ml-2"> (Filtrando por "{searchTerm}")</span>}
              </h2>
              <span className="bg-purple-900/50 text-purple-200 text-xs font-bold px-4 py-1.5 rounded-full border border-purple-500/30 uppercase tracking-widest">
                {filteredGames.length} resultados
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-2">
                {filteredGames.map((game) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    token={token} 
                    API_URL={API_URL} 
                    onShowAuth={() => setShowAuthModal(true)} 
                    onAddToCart={handleAddToCart}
                    onShowDetail={handleShowDetail}
                  />
                ))}
              </div>
            )}
            
            {filteredGames.length === 0 && !loading && (
              <div className="text-center text-gray-500 mt-10 p-12 bg-gray-800/20 rounded-3xl border border-dashed border-gray-700">
                No se encontraron juegos que coincidan con tu búsqueda.
              </div>
            )}
          </>
        )}

        {/* Modal del Carrito */}
        <CartModal 
          isOpen={showCart} 
          onClose={() => setShowCart(false)} 
          cart={cart}
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={() => setShowPaymentModal(true)}
        />

        {/* Pasarela de Pago */}
        <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)}
          total={cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0)}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Modal de Detalle de Juego con Recomendador */}
        <GameDetailModal 
          game={selectedGame}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onSelectGame={setSelectedGame}
          onAddToCart={(g) => { handleAddToCart(g); setShowDetailModal(false); }}
          API_URL={API_URL}
          token={token}
        />

        {/* Modal de Autenticación */}
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            onLogin={handleLogin} 
            API_URL={API_URL} 
          />
        )}
      </div>
    </div>
      
    <Footer />
  </div>
);
}

export default App;
