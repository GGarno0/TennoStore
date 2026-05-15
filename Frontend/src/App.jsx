import { useEffect, useState, useMemo } from 'react';
import GameCard from './components/GameCard';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import AdminPanel from './components/AdminPanel';
import PaymentModal from './components/PaymentModal';
import GameDetailModal from './components/GameDetailModal';
import FloatingLines from './components/FloatingLines/FloatingLines';
import LatestGamesCarousel from './components/LatestGamesCarousel';
import UserProfile from './components/UserProfile';
import NotificationToast from './components/NotificationToast';
import Footer from './components/Footer';
import Header from './components/Header';
import FilterBar from './components/FilterBar';

// Configuración del fondo animado
const BG_GRADIENT = ['#A855F7', '#22D3EE', '#FFFFFF'];
const BG_WAVES = ['top', 'middle', 'bottom'];
const BG_LINE_COUNT = [10, 15, 20];
const BG_LINE_DIST = [8, 6, 4];

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [currentView, setCurrentView] = useState('store');
  
  // Estado global de la app
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Generar un ID temporal para usuarios sin registrar
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('session_id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('session_id', id);
    }
    return id;
  });

  // Gestionamos el carrito separando usuarios registrados de invitados
  const getCartKey = (u) => u ? `cart_${u.id}` : 'cart_guest';
  const [cart, setCart] = useState(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const savedCart = localStorage.getItem(getCartKey(currentUser));
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [showCart, setShowCart] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 9;
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showOnlyOffers, setShowOnlyOffers] = useState(false);

  // Mantiene la ficha del juego actualizada si cambia el stock general
  useEffect(() => {
    if (selectedGame) {
      const updatedGame = games.find(g => g.id === selectedGame.id);
      if (updatedGame && updatedGame.stock !== selectedGame.stock) {
        setSelectedGame(updatedGame);
      }
    }
  }, [games]);

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedPlatform, setSelectedPlatform] = useState('Todas');
  const [notification, setNotification] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Efectos para guardar el carrito y el token
  useEffect(() => {
    const savedCart = localStorage.getItem(getCartKey(user));
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem(getCartKey(user), JSON.stringify(cart));
  }, [cart, user?.id]);

  // Comprobador periódico de carritos caducados (10 min)
  useEffect(() => {
    const checkExpiration = () => {
      if (cart.length === 0) return;
      const now = Date.now();
      const expirationTime = 10 * 60 * 1000; // 10 minutos
      
      const expiredItems = cart.filter(item => (now - item.addedAt) >= expirationTime);
      
      if (expiredItems.length > 0) {
        // Limpiamos los productos que lleven más de 10 min
        // y recargamos el catálogo para ver el stock actualizado
        setCart(prev => prev.filter(item => (now - item.addedAt) < expirationTime));
        fetchGames(); // Refrescamos el catálogo para ver los juegos devueltos
        notify('Los artículos de tu carrito han expirado y el stock se ha liberado.', 'error');
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [cart]);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
  };

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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedPlatform, showOnlyOffers]);

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
    setCart([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentView('store');
  };

  const handleAddToCart = (game) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === game.id);
      if (existing) {
        return prev.map(item => 
          item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...game, quantity: 1, addedAt: Date.now() }];
    });

    // Actualizamos el stock visualmente al instante
    setGames(prevGames => prevGames.map(g => 
      g.id === game.id ? { ...g, stock: Math.max(0, g.stock - 1) } : g
    ));
    if (selectedGame && selectedGame.id === game.id) {
      setSelectedGame(prev => ({ ...prev, stock: Math.max(0, prev.stock - 1) }));
    }
  };

  const handleUpdateQuantity = async (gameId, delta) => {
    const item = cart.find(i => i.id === gameId);
    if (!item) return;

    if (delta > 0) {
      await handleAddToCart(item);
    } else if (delta < 0 && item.quantity > 1) {
      try {
        const res = await fetch(`${API_URL}/api/games/cancel-reservation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({ gameId, quantity: 1, sessionId })
        });
        if (res.ok) {
          setCart(prev => prev.map(i => i.id === gameId ? { ...i, quantity: i.quantity - 1 } : i));
          fetchGames();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRemoveFromCart = async (gameId) => {
    const item = cart.find(i => i.id === gameId);
    if (!item) return;

    try {
      // Liberamos todo el stock del juego de golpe
      const res = await fetch(`${API_URL}/api/games/cancel-reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ gameId, quantity: item.quantity, sessionId })
      });

      if (res.ok) {
        setCart(prev => prev.filter(i => i.id !== gameId));
        fetchGames();
      }
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
        setCart([]);
        setShowPaymentModal(false);
        setShowCart(false);
      }
    } catch (err) {
      notify('Hubo un error al procesar tu pedido.', 'error');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const section = document.getElementById('games-list-section');
    if (section) {
      window.scrollTo({ top: section.offsetTop - 120, behavior: 'smooth' });
    }
  };

  // Buscador y filtros combinados
  const filteredGames = useMemo(() => {
    return games
      .filter(game => {
        const matchesSearch = game.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || game.categoria === selectedCategory;
        const matchesPlatform = selectedPlatform === 'Todas' || (game.plataforma && game.plataforma.includes(selectedPlatform));
        const matchesOffer = !showOnlyOffers || (game.precio_anterior && parseFloat(game.precio_anterior) > parseFloat(game.precio));
        return matchesSearch && matchesCategory && matchesPlatform && matchesOffer;
      })
      .sort((a, b) => {
        if (!searchTerm) return 0;
        const aStarts = a.titulo.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bStarts = b.titulo.toLowerCase().startsWith(searchTerm.toLowerCase());
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.titulo.localeCompare(b.titulo);
      });
  }, [games, searchTerm, selectedCategory, selectedPlatform, showOnlyOffers]);

  const categories = useMemo(() => ['Todas', ...new Set(games.map(g => g.categoria).filter(Boolean))], [games]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-x-hidden">
      {notification && (
        <NotificationToast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

      <div className="fixed inset-0 z-0 pointer-events-none">
        <FloatingLines linesGradient={BG_GRADIENT} enabledWaves={BG_WAVES} lineCount={BG_LINE_COUNT} lineDistance={BG_LINE_DIST} bendRadius={5.0} bendStrength={-0.5} interactive={true} parallax={true} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Header 
          scrolled={scrolled} 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          user={user} 
          handleLogout={handleLogout} 
          setShowAuthModal={setShowAuthModal} 
          setShowCart={setShowCart} 
          cartLength={cart.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          isSearchExpanded={isSearchExpanded}
          setIsSearchExpanded={setIsSearchExpanded}
        />

        <div className={`transition-all duration-500 ${scrolled ? 'h-24' : 'h-40'}`}></div>

        {currentView === 'admin' && user?.is_admin ? (
          <AdminPanel token={token} API_URL={API_URL} onGoBack={() => { setCurrentView('store'); fetchGames(); }} />
        ) : currentView === 'profile' && user ? (
          <UserProfile user={user} token={token} API_URL={API_URL} onLogout={handleLogout} onUpdateUser={handleUpdateUser} onGoBack={() => setCurrentView('store')} />
        ) : (
          <>
            <LatestGamesCarousel games={games} onShowDetail={(g) => { setSelectedGame(g); setShowDetailModal(true); }} />
            
            <FilterBar 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
              searchTerm={searchTerm} 
              showOnlyOffers={showOnlyOffers} 
              setShowOnlyOffers={setShowOnlyOffers} 
              filteredCount={filteredGames.length} 
              categories={categories} 
            />

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-2">
                  {filteredGames.slice((currentPage - 1) * gamesPerPage, currentPage * gamesPerPage).map((game) => (
                    <GameCard key={game.id} game={game} token={token} API_URL={API_URL} onShowAuth={() => setShowAuthModal(true)} onAddToCart={handleAddToCart} onShowDetail={(g) => { setSelectedGame(g); setShowDetailModal(true); }} />
                  ))}
                </div>

                {filteredGames.length > gamesPerPage && (
                  <div className="mt-12 flex justify-center items-center gap-2 animate-fade-in pb-10">
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="p-3 rounded-xl bg-gray-800/90 border border-white/10 text-gray-400 hover:text-cyan-400 disabled:opacity-10 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg></button>
                    {/* ... más botones de paginación ... */}
                    <div className="flex items-center gap-2 px-2 bg-gray-950/40 p-1.5 rounded-2xl border border-white/5 mx-2">
                      {Array.from({ length: Math.ceil(filteredGames.length / gamesPerPage) }).map((_, i) => (
                        <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={`w-12 h-12 rounded-xl font-black text-sm transition-all border ${currentPage === i + 1 ? 'bg-cyan-500 text-white border-white/20 shadow-lg scale-110' : 'bg-gray-800/40 border-white/5 text-gray-500 hover:text-white'}`}>{i + 1}</button>
                      ))}
                    </div>
                    <button onClick={() => handlePageChange(Math.ceil(filteredGames.length / gamesPerPage))} disabled={currentPage === Math.ceil(filteredGames.length / gamesPerPage)} className="p-3 rounded-xl bg-gray-800/90 border border-white/10 text-gray-400 hover:text-cyan-400 disabled:opacity-10 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg></button>
                  </div>
                )}
              </>
            )}
            
            {filteredGames.length === 0 && !loading && (
              <div className="text-center text-gray-500 mt-10 p-12 bg-gray-800/20 rounded-3xl border border-dashed border-gray-700">No se encontraron juegos.</div>
            )}
          </>
        )}

        <CartModal isOpen={showCart} onClose={() => setShowCart(false)} cart={cart} onRemoveFromCart={handleRemoveFromCart} onUpdateQuantity={handleUpdateQuantity} onCheckout={() => setShowPaymentModal(true)} />
        <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} total={cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0)} onPaymentSuccess={handlePaymentSuccess} />
        <GameDetailModal game={selectedGame} isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} onSelectGame={setSelectedGame} onAddToCart={handleAddToCart} onShowAuth={() => setShowAuthModal(true)} API_URL={API_URL} token={token} />
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} API_URL={API_URL} />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
