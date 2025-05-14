import React from "react";

const toastColors = {
  success: '#28a745',
  info: '#0074d9',
  error: '#ff4136'
};

function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        minWidth: 200,
        background: toastColors[type] || '#333',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'rgba(0,0,0,0.1)',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '4px 10px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: 16
        }}
        title="Cerrar"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
