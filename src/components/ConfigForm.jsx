import React from "react";

function ConfigForm({ projectPath, setProjectPath, masterTable, validatorName, setMasterTable, setValidatorName }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h2 className="text-lg font-medium text-gray-700 mb-2">Configuración General</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Campo 1: Ruta del proyecto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ruta del proyecto:</label>
          <input
            type="text"
            value={projectPath}
            onChange={e => setProjectPath(e.target.value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: D:/WorkflowSurf"
          />
          <p className="text-xs text-gray-500 mt-1">Directorio raíz del proyecto.</p>
        </div>
        {/* Campo 2: Master Table */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Master Table:</label>
          <input
            type="text"
            value={masterTable}
            onChange={e => setMasterTable(e.target.value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder=""
          />
          <p className="text-xs text-gray-500 mt-1">Ingrese el nombre de la master table global.</p>
        </div>
        {/* Campo 3: Nombre del Validador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Validador:</label>
          <input
            type="text"
            value={validatorName}
            onChange={e => setValidatorName(e.target.value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Cuy Magico"
          />
          <p className="text-xs text-gray-500 mt-1">Ingrese el nombre del validador del modelo.</p>
        </div>
      </div>
    </div>
  );
}

export default ConfigForm;
