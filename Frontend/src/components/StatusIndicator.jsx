import React from 'react';

const StatusIndicator = ({ status }) => {
  return (
    <div className={`mb-8 p-4 rounded-lg flex items-center justify-center font-semibold tracking-wide ${status.includes('OK') ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
      {status ? status : 'Verificando conexión...'}
    </div>
  );
};

export default StatusIndicator;
