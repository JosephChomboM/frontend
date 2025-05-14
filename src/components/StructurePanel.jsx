import React from "react";

function StructurePanel({ troncales, activeTroncalId, activeSegmento, onSelectTroncal, onSelectSegmento, onDeleteTroncal }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-lg font-medium text-white flex items-center">
          <i className="fas fa-sitemap mr-3"></i> Estructura
        </h2>
      </div>
      <div className="sidebar-panel p-4">
        {troncales.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-diagram-project text-4xl mb-2 opacity-30"></i>
            <p>No hay troncales configuradas aún.</p>
          </div>
        ) : (
          <div>
            {troncales.map(troncal => (
              <div key={troncal.id} className="mb-2">
                <div
                  onClick={() => onSelectTroncal(troncal.id)}
                  className={`flex items-center p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors ${activeSegmento == null && activeTroncalId === troncal.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                >
                  <i className="fas fa-project-diagram text-blue-600 mr-3"></i>
                  <span className="font-medium">Troncal {troncal.id}</span>
                  <button
                    className="ml-auto text-red-500 hover:text-red-700 px-2"
                    onClick={e => { e.stopPropagation(); onDeleteTroncal(troncal.id); }}
                    title="Eliminar"
                  >
                    ×
                  </button>
                </div>
                {/* Segmentos si >=2 */}
                {troncal.segmentos && troncal.segmentos.length >= 2 && (
                  <div className="pl-8">
                    {troncal.segmentos.map(seg => (
                      <div
                        key={seg.id}
                        onClick={() => onSelectSegmento(troncal.id, seg.id)}
                        className={`flex items-center p-2 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors ${activeSegmento && activeSegmento.troncalId === troncal.id && activeSegmento.segId === seg.id ? 'bg-indigo-50 border-l-2 border-indigo-500' : ''}`}
                      >
                        <i className="fas fa-layer-group text-indigo-500 mr-2"></i>
                        <span className="text-sm">Segmento {seg.id}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StructurePanel;
