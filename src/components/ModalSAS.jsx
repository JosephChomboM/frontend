import React from "react";

function ModalSAS({ open, onClose, sasCode, onDownloadSAS, onDownloadJSON }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl mx-4 shadow-2xl w-full">
        <h3 className="text-xl font-semibold mb-4">Código SAS (Auto-Generado)</h3>
        <textarea
          rows={20}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={sasCode}
          readOnly
        ></textarea>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800">
            Volver
          </button>
          <button onClick={onDownloadSAS} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white">
            Descargar SAS
          </button>
          <button onClick={onDownloadJSON} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
            Descargar JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalSAS;
