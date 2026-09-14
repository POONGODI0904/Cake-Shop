import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px'
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: toast.type === 'error' ? '#FFF1F2' : toast.type === 'info' ? '#F0F9FF' : '#F0FDF4',
              border: `1.5px solid ${toast.type === 'error' ? '#FDA4AF' : toast.type === 'info' ? '#BAE6FD' : '#86EFAC'}`,
              color: toast.type === 'error' ? '#9F1239' : toast.type === 'info' ? '#0369A1' : '#166534',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              fontSize: '0.92rem',
              fontWeight: 500,
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {toast.type === 'error' && <AlertCircle size={20} color="#E11D48" />}
              {toast.type === 'info' && <Info size={20} color="#0284C7" />}
              {toast.type === 'success' && <CheckCircle2 size={20} color="#16A34A" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: 'inherit', opacity: 0.7, padding: '2px' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
