// client/src/components/Toast.jsx
import  { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  // type: 'success' | 'error' | 'info' | 'warning'
  const styles = {
    success: 'bg-green-600 text-white border-green-700',
    error: 'bg-red-600 text-white border-red-700',
    info: 'bg-brand-blue text-white border-blue-800',
    warning: 'bg-amber-600 text-white border-amber-700',
  };

  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border transform transition-all duration-300 animate-slide-in ${styles[type] || styles.info}`}
    >
      {/* Icon based on type */}
      {type === 'success' && <span className="text-xl">✅</span>}
      {type === 'error' && <span className="text-xl">❌</span>}
      {type === 'warning' && <span className="text-xl">⚠️</span>}
      {type === 'info' && <span className="text-xl">ℹ️</span>}

      <p className="font-medium text-sm max-w-xs">{message}</p>

      <button
        onClick={onClose}
        className="ml-auto text-white/80 hover:text-white text-xl leading-none"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;