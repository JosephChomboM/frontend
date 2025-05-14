import React from "react";

function Sidebar({ troncales, activeTroncalId, onAddTroncal, onSelectTroncal, onDeleteTroncal }) {
  return (
    <aside className="sidebar" style={{ minWidth: 200, borderRight: '1px solid #eee', padding: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <button onClick={onAddTroncal} style={{ width: '100%' }}>+ Agregar Troncal</button>
      </div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {troncales.length === 0 && <li style={{ color: '#aaa' }}>No hay troncales</li>}
          {troncales.map(troncal => (
            <li key={troncal.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
              <button
                style={{
                  flex: 1,
                  background: troncal.id === activeTroncalId ? '#0074d9' : '#f5f5f5',
                  color: troncal.id === activeTroncalId ? '#fff' : '#222',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  marginRight: 8
                }}
                onClick={() => onSelectTroncal(troncal.id)}
              >
                {troncal.nombre}
              </button>
              <button
                style={{ background: '#ff4136', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}
                onClick={() => onDeleteTroncal(troncal.id)}
                title="Eliminar"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
