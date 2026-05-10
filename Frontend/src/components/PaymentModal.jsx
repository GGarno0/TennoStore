import React, { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, total, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Simple masking/formatting could be added here
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      return 'Número de tarjeta inválido (deben ser 16 dígitos)';
    }
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      return 'Formato de fecha inválido (MM/AA)';
    }
    if (!/^\d{3}$/.test(formData.cvv)) {
      return 'CVV inválido (3 dígitos)';
    }
    if (formData.name.length < 3) {
      return 'Nombre del titular demasiado corto';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    // Simular retraso de red
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] backdrop-blur-md">
      <div className="bg-gray-900 w-full max-w-md p-8 rounded-3xl border border-gray-700 shadow-2xl animate-scale-up">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            Pasarela de Pago
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="mb-6 bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total a pagar:</span>
            <span className="text-2xl font-bold text-white">{total.toFixed(2)}€</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-400 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-1 ml-1">Titular de la Tarjeta</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Nombre como aparece en la tarjeta"
              required 
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-1 ml-1">Número de Tarjeta</label>
            <input 
              type="text" 
              name="cardNumber" 
              placeholder="0000 0000 0000 0000"
              required 
              maxLength="16"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-1 ml-1">Fecha (MM/AA)</label>
              <input 
                type="text" 
                name="expiryDate" 
                placeholder="12/25"
                required 
                maxLength="5"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-1 ml-1">CVV</label>
              <input 
                type="password" 
                name="cvv" 
                placeholder="***"
                required 
                maxLength="3"
                value={formData.cvv}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl mt-4 shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                <span>Procesando pago...</span>
              </>
            ) : (
              <>
                <span>Confirmar y Pagar {total.toFixed(2)}€</span>
              </>
            )}
          </button>
        </form>
        
        <p className="text-[10px] text-gray-500 text-center mt-6 uppercase tracking-tighter">
          Pago seguro encriptado • TennoStore Simulation Gateway
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;
