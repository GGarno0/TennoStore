import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const CartModal = ({ isOpen, onClose, cart, onRemoveFromCart, onUpdateQuantity, onCheckout }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!isOpen) return;

    // Actualizar 'now' inmediatamente al abrir para evitar desfases
    setNow(Date.now());

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0);

  const formatTime = (addedAt) => {
    const limit = 10 * 60 * 1000; // 10 minutos
    const elapsed = now - addedAt;
    const remaining = Math.max(0, limit - elapsed);
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/80 flex justify-end z-50 backdrop-blur-sm transition-opacity">
      <div className="bg-gray-900 w-full md:max-w-md h-full shadow-2xl flex flex-col border-l border-gray-700 animate-slide-in-right">
        
        {/* Cabecera del carrito */}
        <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Tu Carrito</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <p className="text-lg font-medium">Tu carrito está vacío</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item, index) => (
                <li key={item.id} className="bg-gray-800/50 p-4 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all shadow-sm">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold leading-snug break-words pr-2">{item.titulo}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-cyan-400 font-black text-lg">{(item.precio * item.quantity).toFixed(2)}€</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          parseFloat(formatTime(item.addedAt)) < 2 
                            ? 'text-red-400 border-red-500/30 bg-red-950/20 animate-pulse' 
                            : 'text-gray-400 border-gray-700 bg-gray-900'
                        }`}>
                          {formatTime(item.addedAt)} MIN RESTANTES
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-gray-500 hover:text-red-400 hover:bg-red-900/20 p-2.5 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                      title="Eliminar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Control de Cantidad */}
                  <div className="flex items-center gap-4 bg-gray-900/80 w-fit px-3 py-2 rounded-xl border border-white/5 shadow-inner">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      disabled={item.quantity <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4"></path></svg>
                    </button>
                    <span className="text-white font-black text-sm min-w-[24px] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer con el total y botón de pago */}
        <div className="p-6 border-t border-gray-800 bg-gray-900 sticky bottom-0">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-lg">Total</span>
            <span className="text-3xl font-bold text-white">{total.toFixed(2)}€</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={onCheckout}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <span>Ir a la Pasarela de Pago</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
        
      </div>
    </div>,
    document.body
  );
};

export default CartModal;
