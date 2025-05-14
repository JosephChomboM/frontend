import React from "react";

function Header({ onLoadConfig, onOpenAddTroncal, onOpenSASModal }) {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Título */}
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-10 rounded-full p-2">
            <i className="fas fa-chart-line text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-white">WF Scoring VI Configurator</h1>
        </div>
        {/* Botones principales */}
        <div className="flex items-center space-x-3">
          {/* Botón para cargar config (JSON) */}
          <button onClick={onLoadConfig} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center">
            <i className="fas fa-folder-open mr-2"></i> Cargar Config
          </button>
          {/* Botón para agregar troncales */}
          <button onClick={onOpenAddTroncal} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center">
            <i className="fas fa-plus mr-2"></i> Agregar Troncal
          </button>
          {/* Botón para mostrar modal con Código SAS */}
          <button onClick={onOpenSASModal} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center">
            <i className="fas fa-download mr-2"></i> Descargar Config & SAS
          </button>
        </div>
      </div>
    </header>
  );
}



export default Header;
