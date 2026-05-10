import React, { useState } from 'react';

const StatusIndicator = ({ status }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={`mb-8 p-4 rounded-xl flex items-center justify-between font-semibold tracking-wide ${status.includes('OK') ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
      <div className="flex-1 text-center">
        {status ? status : 'Verificando conexión...'}
      </div>
      <button 
        onClick={() => setVisible(false)}
        className="text-gray-400 hover:text-white transition-colors ml-4 p-1"
        title="Cerrar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
};

export default StatusIndicator;
