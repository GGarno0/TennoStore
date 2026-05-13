import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const NotificationToast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgStyles = {
    success: 'bg-green-900/80 border-green-500/50 text-green-300',
    error: 'bg-red-900/80 border-red-500/50 text-red-300',
    info: 'bg-cyan-900/80 border-cyan-500/50 text-cyan-300'
  };

  return createPortal(
    <div className={`fixed top-6 right-6 z-[100] min-w-[300px] p-4 rounded-2xl backdrop-blur-xl border shadow-2xl animate-slide-in-right flex items-center gap-3 ${bgStyles[type]}`}>
      <div className="flex-shrink-0">
        {type === 'success' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        {type === 'error' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        {type === 'info' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
      </div>
      <div className="flex-1 font-bold text-sm">
        {message}
      </div>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>,
    document.body
  );
};

export default NotificationToast;
