import React from "react";

function TroncalDetail({ troncal }) {
  if (!troncal) {
    return (
      <section className="troncal-detail">
        <p style={{ color: '#888' }}>Seleccione o agregue una Troncal para configurarla.</p>
      </section>
    );
  }

  return (
    <section className="troncal-detail" style={{ padding: 24 }}>
      <h2>Detalle de Troncal</h2>
      <div style={{ marginBottom: 12 }}>
        <label>
          <strong>ID:</strong> {troncal.id}
        </label>
      </div>
      <div>
        <label>
          <strong>Nombre:</strong>{' '}
          <input
            type="text"
            value={troncal.nombre}
            disabled
            style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </label>
      </div>
      {/* Aquí puedes agregar más campos editables en el futuro */}
    </section>
  );
}

export default TroncalDetail;
