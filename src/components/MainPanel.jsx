import React, { useState, useEffect, useCallback, useRef, memo } from "react";

// Funciu00f3n debounce para retrasar actualizaciones
function useDebounce(callback, delay) {
  const timerRef = useRef(null);
  
  return useCallback((...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callback(...args);
      timerRef.current = null;
    }, delay);
  }, [callback, delay]);
}

// Input optimizado con estado local para mayor fluidez al escribir
const InputDebounced = memo(function InputDebounced({ value, onChange, delay = 150, ...props }) {
  const [localValue, setLocalValue] = useState(value || '');
  const debouncedUpdate = useDebounce(onChange, delay);
  
  // Actualizar el valor local si cambia la prop externa
  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);
  
  // Actualizar instantáneamente el valor local, pero debounce la actualización del estado global
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);  // Actualización inmediata del campo
    debouncedUpdate(newValue);  // Actualización diferida del estado global
  }, [debouncedUpdate]);
  
  return (
    <input
      value={localValue}
      onChange={handleChange}
      {...props}
    />
  );
});

// Componente optimizado para textareas de variables - IMPORTANTE: defino fuera para evitar recreaciones
const TextareaDebounced = memo(function TextareaDebounced({ initialValue, onSave, ...props }) {
  const [localValue, setLocalValue] = useState(initialValue);
  
  // Actualiza el estado local cuando cambia la prop
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);
  
  // Solo guarda cuando el usuario termina de editar
  const handleBlur = useCallback(() => {
    if (localValue !== initialValue) {
      onSave(localValue);
    }
  }, [localValue, initialValue, onSave]);
  
  return (
    <textarea
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      {...props}
    />
  );
});

function MainPanel({ troncal, segmento, onUpdateTroncal, onUpdateTroncalParsed, onToggleSegmentos, onUpdateSegmentsCount }) {

  if (!troncal) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-info-circle text-4xl mb-2 opacity-30"></i>
          <p>Seleccione o agregue una Troncal para configurarla.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Troncal {troncal.id}</h3>
        {/* Aquí podrías agregar botón de eliminar si lo deseas */}
      </div>

      {/* 4 filas x 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Fila 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Identificador:</label>
          <InputDebounced
            type="text"
            value={troncal.cod || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'cod', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Flag_Troncal:</label>
          <InputDebounced
            type="text"
            value={troncal.flag || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'flag', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: f_troncal1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target:</label>
          <InputDebounced
            type="text"
            value={troncal.target || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'target', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Fila 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PD:</label>
          <InputDebounced
            type="text"
            value={troncal.pd || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'pd', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">XB:</label>
          <InputDebounced
            type="text"
            value={troncal.xb || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'xb', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Variable Monto:</label>
          <InputDebounced
            type="text"
            value={troncal.monto || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'monto', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Fila 3 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Variable Tiempo:</label>
          <InputDebounced
            type="text"
            value={troncal.byvar || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'byvar', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Train Min Mes:</label>
          <InputDebounced
            type="text"
            value={troncal.trainMinMes || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'trainMinMes', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Train Max Mes:</label>
          <InputDebounced
            type="text"
            value={troncal.trainMaxMes || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'trainMaxMes', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Fila 4 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Cerrado:</label>
          <InputDebounced
            type="text"
            value={troncal.defCld || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'defCld', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OOT Min Mes:</label>
          <InputDebounced
            type="text"
            value={troncal.ootMinMes || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'ootMinMes', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OOT Max Mes:</label>
          <InputDebounced
            type="text"
            value={troncal.ootMaxMes || ''}
            onChange={value => onUpdateTroncal(troncal.id, 'ootMaxMes', value)}
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* All Universe */}
      <div className="border-t pt-4">
        <h4 className="text-lg font-medium mb-3">All Universe</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variables Numéricas:</label>
            <TextareaDebounced 
              initialValue={troncal.universeNum || ''} 
              onSave={(value) => onUpdateTroncalParsed(troncal.id, 'universeNum', value)}
              rows={7}
              className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: VAR1, VAR2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variables Categóricas:</label>
            <TextareaDebounced 
              initialValue={troncal.universeCat || ''} 
              onSave={(value) => onUpdateTroncalParsed(troncal.id, 'universeCat', value)}
              rows={7}
              className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: VAR3, VAR4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drivers Numéricos:</label>
            <TextareaDebounced 
              initialValue={troncal.universeDriNum || ''} 
              onSave={(value) => onUpdateTroncalParsed(troncal.id, 'universeDriNum', value)}
              rows={7}
              className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: DRIV_NUM1, DRIV_NUM2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drivers Categóricos:</label>
            <TextareaDebounced 
              initialValue={troncal.universeDriCat || ''} 
              onSave={(value) => onUpdateTroncalParsed(troncal.id, 'universeDriCat', value)}
              rows={7}
              className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: DRIV_CAT1, DRIV_CAT2"
            />
          </div>
        </div>
      </div>

      {/* Segmentos */}
      <div className="mt-6 border-t pt-4">
        <label className="inline-flex items-center cursor-pointer mb-4">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={troncal.segmentos && troncal.segmentos.length >= 2}
            onChange={e => onToggleSegmentos(troncal.id, e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          <span className="ml-3 text-sm font-medium text-gray-700">Activar Segmentos</span>
        </label>

        {troncal.segmentos && troncal.segmentos.length >= 2 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variable Segmentadora:</label>
              <InputDebounced
                type="text"
                value={troncal.varSegmentadora || ''}
                onChange={value => onUpdateTroncal(troncal.id, 'varSegmentadora', value)}
                className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Segs:</label>
              <input type="number" min={2} value={troncal.segmentos && troncal.segmentos.length >= 2 ? troncal.segmentos.length : 2} onChange={e => onUpdateSegmentsCount(troncal.id, e.target.value)} className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Segmento</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Vars Num</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Vars Cat</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Driv Num</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Driv Cat</th>
                </tr>
              </thead>
              <tbody>
                {troncal.segmentos && troncal.segmentos.length >= 2 ? troncal.segmentos.map(seg => (
                  <tr className="border-b border-gray-200" key={seg.id}>
                    <td className="px-4 py-2 font-medium text-gray-700">Segmento {seg.id}</td>
                    <td className="px-4 py-2 text-gray-600">{seg.variablesNum || '-'}</td>
                    <td className="px-4 py-2 text-gray-600">{seg.variablesCat || '-'}</td>
                    <td className="px-4 py-2 text-gray-600">{seg.driversNum || '-'}</td>
                    <td className="px-4 py-2 text-gray-600">{seg.driversCat || '-'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center py-2 text-gray-500">Debe tener al menos 2 segmentos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default memo(MainPanel);
