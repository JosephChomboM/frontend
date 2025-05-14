import React, { useState } from "react";

function ModalAgregarTroncal({ open, onClose, onConfirm }) {
  const [cantidad, setCantidad] = useState(1);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Agregar Troncal(es)</h3>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ¿Cuántas troncales deseas agregar?
        </label>
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={e => setCantidad(Number(e.target.value))}
          className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800">
            Cancelar
          </button>
          <button onClick={() => onConfirm(cantidad)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalAgregarTroncal;
