import React from 'react';
import { createPortal } from 'react-dom';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'danger' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: 'from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-red-900/20',
    info: 'from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-cyan-900/20'
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-scale-up">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-2xl bg-gray-800 border ${type === 'danger' ? 'border-red-500/30 text-red-400' : 'border-cyan-500/30 text-cyan-400'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white">{title}</h2>
        </div>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-2xl transition-all border border-gray-700"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 bg-gradient-to-r ${typeStyles[type]} text-white font-bold py-3 rounded-2xl transition-all shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
