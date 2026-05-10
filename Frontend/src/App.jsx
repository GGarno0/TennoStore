import { useEffect, useState } from 'react';
import StatusIndicator from './components/StatusIndicator';
import GameCard from './components/GameCard';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import AdminPanel from './components/AdminPanel';
import PaymentModal from './components/PaymentModal';
import GameDetailModal from './components/GameDetailModal';

function App() {
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Cart state
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Gestión del tiempo de expiración del carrito
  useEffect(() => {
    if (cart.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expirationTime = 10 * 60 * 1000;
      
      const expiredItems = cart.filter(item => (now - item.addedAt) >= expirationTime);
      
      if (expiredItems.length > 0) {
        expiredItems.forEach(item => {
          handleRemoveFromCart(item.id);
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cart]);

  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // URL de la API del backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchGames = () => {
    fetch(`${API_URL}/api/games`)
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching games:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Pedir estado del backend
    fetch(`${API_URL}/api/status`)
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('Error: No se pudo conectar al Backend'));

    // Pedir la lista de juegos
    fetchGames();
  }, [API_URL]);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setShowAuthModal(false);
    setCurrentView('store'); // Resetear vista al entrar
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
          alert(data.error || 'No se pudo aumentar la cantidad');
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

    // Quitarlo del carrito
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
        alert('¡Pago realizado con éxito! Gracias por tu compra.');
        setCart([]); // Vaciar carrito
        setShowPaymentModal(false);
        setShowCart(false);
      }
    } catch (err) {
      console.error('Error al confirmar pedido:', err);
      alert('Hubo un error al procesar tu pedido en el servidor.');
    }
  };

  const handleShowDetail = (game) => {
    setSelectedGame(game);
    setShowDetailModal(true);
  };

  const [currentView, setCurrentView] = useState('store'); // 'store' o 'admin'

  // Lógica de filtrado
  const filteredGames = games.filter(game => {
    const matchesSearch = game.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || game.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todas', ...new Set(games.map(g => g.categoria).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera con Login y Carrito */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-6 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              TennoStore
            </h1>
            <p className="text-gray-400 text-sm md:text-lg mt-1">Busca y compara precios de tus juegos favoritos</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Solo mostrar opciones de la tienda si estamos en la tienda */}
            {currentView === 'store' && (
              <>
                {user && user.is_admin && (
                  <button 
                    onClick={() => setCurrentView('admin')}
                    className="bg-gray-800 hover:bg-gray-700 text-purple-400 px-4 py-3 rounded-xl border border-gray-600 transition-colors flex items-center gap-2"
                    title="Panel de Administración"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span className="font-bold text-xs uppercase tracking-widest hidden lg:inline">Admin</span>
                  </button>
                )}
                
                <button 
                  onClick={() => setShowCart(true)}
                  className="relative bg-gray-800 hover:bg-gray-700 text-cyan-400 p-3 rounded-xl border border-gray-600 transition-colors flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-gray-900">
                      {cart.length}
                    </span>
                  )}
                </button>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700">
                <span className="text-gray-300 font-medium">Hola, <span className="text-cyan-400">{user.username}</span></span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-900/50 hover:bg-red-800/80 text-red-200 px-3 py-1.5 rounded-lg transition-colors border border-red-700/50 text-sm font-semibold"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl border border-gray-600 transition-colors font-semibold"
              >
                Identificarse
              </button>
            )}
          </div>
        </header>

        {currentView === 'admin' && user && user.is_admin ? (
          <AdminPanel 
            token={token} 
            API_URL={API_URL} 
            onGoBack={() => { setCurrentView('store'); fetchGames(); }} 
          />
        ) : (
          <>
            {/* Indicador de estado */}
            <StatusIndicator status={status} />

            {/* Buscador y filtros */}
            <div className="mb-10 flex flex-col md:flex-row gap-6 items-center">
              <div className="relative flex-1 w-full">
                <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input 
                  type="text" 
                  placeholder="Buscar juegos por título..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-all placeholder-gray-600"
                />
              </div>
              
              <div className="relative w-full md:w-72 group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 pointer-events-none z-10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                </div>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl py-4 pl-12 pr-10 text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer font-bold hover:bg-gray-800"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-900 text-white">
                      {cat === 'Todas' ? 'Todos los géneros' : cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Listado de juegos */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-300">
                {selectedCategory === 'Todas' ? 'Todos los Juegos' : `Juegos de ${selectedCategory}`}
                {searchTerm && <span className="text-cyan-400 text-sm ml-2"> (Filtrando por "{searchTerm}")</span>}
              </h2>
              <span className="text-gray-500 text-sm">{filteredGames.length} resultados</span>
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
  );
}

export default App;
