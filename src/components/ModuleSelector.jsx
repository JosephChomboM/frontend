import React, { useState, useEffect } from 'react';

function ModuleSelector({ troncal, onModuleSelectionChange }) {
  // Estados para las pestañas y opciones
  const [activeTab, setActiveTab] = useState('universe'); // 'universe' o 'segment'
  const [executeInAll, setExecuteInAll] = useState(false); // Toggle para ejecutar en todo el troncal
  const [expandedModules, setExpandedModules] = useState({}); // Objeto para rastrear qué módulos están expandidos
  
  // Lista de módulos disponibles
  const availableModules = [
    { 
      id: 'population', 
      name: 'Population descriptive', 
      icon: 'fa-users', 
      tests: [
        { id: 'population_descriptive', name: 'Describe' }
      ]
    },
    { 
      id: 'segmentation', 
      name: 'Segmentation', 
      icon: 'fa-object-group', 
      tests: [
        { id: 'segmentation_test', name: 'Segmentation' }
      ]
    },
    { 
      id: 'feature', 
      name: 'Feature engineering', 
      icon: 'fa-gears', 
      tests: [
        { id: 'feature_bivariate', name: 'Bivariado' },
        { id: 'feature_correlation', name: 'Correlación' },
        { id: 'feature_fillrate', name: 'Fillrate' },
        { id: 'feature_missings', name: 'Missings' },
        { id: 'feature_univariate', name: 'Univariado' }
      ]
    },
    { 
      id: 'performance', 
      name: 'Performance', 
      icon: 'fa-chart-line', 
      tests: [
        { id: 'performance_bootstraping', name: 'Bootstraping' },
        { id: 'performance_gini', name: 'Gini' },
        { id: 'performance_monotonicity', name: 'Monotonicidad' },
        { id: 'performance_precision', name: 'Precisión' },
        { id: 'performance_replica', name: 'Replica' }
      ]
    },
    { 
      id: 'backtesting', 
      name: 'Backtesting', 
      icon: 'fa-clock-rotate-left', 
      tests: [
        { id: 'backtesting_calibration', name: 'Calibración' },
        { id: 'backtesting_stability', name: 'Bucket stability' },
        { id: 'backtesting_psi', name: 'Psi' }
      ]
    },
    { 
      id: 'ml', 
      name: 'Machine Learning', 
      icon: 'fa-robot', 
      tests: [
        { id: 'ml_benchmarking', name: 'Benchmarking ML' },
        { id: 'ml_replica', name: 'Replica ML' }
      ]
    }
  ];
  
  // Actualizar estado cuando cambia el troncal o los segmentos
  useEffect(() => {
    if (!troncal) return;
    
    // Comprobar si hay segmentos disponibles
    const hasSegments = troncal.segmentos && troncal.segmentos.length >= 2;
    
    // Si no hay segmentos y la pestaña activa es segmento, cambiar a universo
    if (!hasSegments && activeTab === 'segment') {
      setActiveTab('universe');
    }
    
    // Si el troncal tiene configuración, actualizar el estado del toggle
    if (troncal.moduleConfig && troncal.moduleConfig.executionTarget === 'all') {
      setExecuteInAll(true);
    } else {
      setExecuteInAll(false);
    }
  }, [troncal, activeTab]);

  // No mostrar si no hay troncal seleccionado
  if (!troncal) return null;
  
  // Comprobar si hay segmentos disponibles
  const hasSegments = troncal.segmentos && troncal.segmentos.length >= 2;

  // Manejar cambio en el toggle de ejecutar en todo el troncal
  const handleExecuteInAllChange = (checked) => {
    setExecuteInAll(checked);
    onModuleSelectionChange({
      action: 'setExecutionTarget',
      troncalId: troncal.id,
      target: checked ? 'all' : activeTab === 'universe' ? 'universe' : 'segment'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
        <i className="fas fa-cogs mr-2"></i>
        Configuración de Ejecución
      </h2>

      {/* PASO 1: Toggle para activar segmentos */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <label className="inline-flex items-center cursor-pointer mb-4">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={hasSegments}
            onChange={(e) => onModuleSelectionChange({
              action: 'toggleSegments',
              troncalId: troncal.id,
              value: e.target.checked
            })}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          <span className="ml-3 text-sm font-medium text-gray-700">Activar Segmentos</span>
        </label>
      </div>

      {/* PASO 2: Si tiene segmentos, pedir datos de segmentación */}
      {hasSegments && (
        <div className="mb-6 pb-4 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variable Segmentadora:</label>
              <input
                type="text"
                className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={troncal.varSegmentadora || ''}
                onChange={(e) => onModuleSelectionChange({
                  action: 'updateTroncal',
                  troncalId: troncal.id,
                  field: 'varSegmentadora',
                  value: e.target.value
                })}
                placeholder="Ej: REGION, EDAD, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Segs:</label>
              <input 
                type="number" 
                min={2} 
                value={troncal.segmentos.length} 
                onChange={(e) => onModuleSelectionChange({
                  action: 'updateSegmentsCount',
                  troncalId: troncal.id,
                  value: e.target.value
                })}
                className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>
        </div>
      )}

      {/* PASO 3: Toggle para ejecutar en todo el troncal */}
      {hasSegments && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={executeInAll}
              onChange={(e) => handleExecuteInAllChange(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Ejecutar en Todo el Troncal (Universo + Segmentos)</span>
          </label>
        </div>
      )}

      {/* PASO 4: Pestañas para Universo/Segmento */}
      {!executeInAll && (
        <div className="mb-6">
          {/* Encabezados de las pestañas */}
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === 'universe' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('universe');
                onModuleSelectionChange({
                  action: 'setExecutionTarget',
                  troncalId: troncal.id,
                  target: 'universe'
                });
              }}
            >
              Universo
            </button>
            
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === 'segment' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                if (hasSegments) {
                  setActiveTab('segment');
                  onModuleSelectionChange({
                    action: 'setExecutionTarget',
                    troncalId: troncal.id,
                    target: 'segment'
                  });
                }
              }}
              disabled={!hasSegments}
            >
              Segmento
              {hasSegments && (
                <select
                  className="ml-2 border border-gray-300 rounded px-2 py-0 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={(troncal.moduleConfig && troncal.moduleConfig.selectedSegment) || (troncal.segmentos && troncal.segmentos[0] ? troncal.segmentos[0].id : '')}
                  onChange={(e) => {
                    setActiveTab('segment');
                    onModuleSelectionChange({
                      action: 'setExecutionTarget',
                      troncalId: troncal.id,
                      target: 'segment'
                    });
                    onModuleSelectionChange({
                      action: 'setSelectedSegment',
                      troncalId: troncal.id,
                      segmentId: e.target.value
                    });
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {troncal.segmentos.map(seg => (
                    <option key={seg.id} value={seg.id}>
                      {seg.id}
                    </option>
                  ))}
                </select>
              )}
            </button>
          </div>
        </div>
      )}

      {/* PASO 5: Módulos a ejecutar */}
      <div className="pt-2">
        {/* Mostrar módulos disponibles */}
        <div className="text-sm font-medium text-gray-700 mb-3">
          Módulos a ejecutar en {
            executeInAll ? 'Todo el Troncal (Universo + Segmentos)' : 
            activeTab === 'universe' ? 'Universo' : 
            `Segmento ${(troncal.moduleConfig && troncal.moduleConfig.selectedSegment) || ''}`
          }:
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableModules.map(module => {
            let moduleSelected = false;
            let selectedTests = {};
            
            // Determinar el contexto y el segmento seleccionado si estamos en ese contexto
            const context = activeTab; // 'universe' o 'segment'
            const segmentId = activeTab === 'segment' ? 
                          (troncal.moduleConfig && troncal.moduleConfig.selectedSegment) : null;
            
            // Determinar si el módulo está seleccionado según el contexto
            if (executeInAll) {
              // Si ejecutamos todo, usamos la configuración de universo
              if (troncal.moduleConfig && troncal.moduleConfig.universeModules) {
                // Verificar si algún test del módulo está seleccionado
                module.tests.forEach(test => {
                  if (troncal.moduleConfig.universeModules[test.id]) {
                    moduleSelected = true;
                    selectedTests[test.id] = true;
                  } else {
                    selectedTests[test.id] = false;
                  }
                });
              }
            } else if (activeTab === 'universe') {
              // Si estamos en la pestaña de universo
              if (troncal.moduleConfig && troncal.moduleConfig.universeModules) {
                // Verificar si algún test del módulo está seleccionado
                module.tests.forEach(test => {
                  if (troncal.moduleConfig.universeModules[test.id]) {
                    moduleSelected = true;
                    selectedTests[test.id] = true;
                  } else {
                    selectedTests[test.id] = false;
                  }
                });
              }
            } else if (activeTab === 'segment') {
              // Si estamos en la pestaña de segmento, necesitamos el segmento seleccionado
              const selectedSegmentId = troncal.moduleConfig && troncal.moduleConfig.selectedSegment;
              
              // Asegurarse de que segmentModules esté inicializado
              if (troncal.moduleConfig && !troncal.moduleConfig.segmentModules) {
                troncal.moduleConfig.segmentModules = {};
              }
              
              if (selectedSegmentId && troncal.moduleConfig && troncal.moduleConfig.segmentModules) {
                // Verificar si existe configuración para este segmento
                const segmentConfig = troncal.moduleConfig.segmentModules[selectedSegmentId];
                if (segmentConfig) {
                  // Verificar si algún test del módulo está seleccionado
                  module.tests.forEach(test => {
                    if (segmentConfig[test.id]) {
                      moduleSelected = true;
                      selectedTests[test.id] = true;
                    } else {
                      selectedTests[test.id] = false;
                    }
                  });
                }
              }
            }
            
            // Calcular el número de pruebas seleccionadas
            const selectedCount = Object.values(selectedTests).filter(Boolean).length;
            const totalTests = module.tests.length;
            
            // Verificar si este módulo está expandido
            const isExpanded = expandedModules[module.id] || false;
            
            return (
              <div key={module.id} className="rounded-lg overflow-hidden">
                {/* Cabecera del módulo (cuadrado) */}
                <div 
                  className={`py-2 px-3 cursor-pointer transition-colors border ${
                    moduleSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    // Toggle all tests in this module
                    const allSelected = totalTests === selectedCount;
                    
                    // Toggle all tests with a single value (true if none/some are selected, false if all are selected)
                    module.tests.forEach(test => {
                      onModuleSelectionChange({
                        action: 'toggleModule',
                        troncalId: troncal.id,
                        moduleId: test.id,
                        value: !allSelected, // Si todos están seleccionados, deseleccionar todos; si no, seleccionar todos
                        context: context,
                        segmentId: segmentId
                      });
                    });
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-gray-800">{module.name}</div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mr-2">{selectedCount}/{totalTests}</span>
                      <button 
                        className="text-xs text-blue-600 focus:outline-none" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedModules(prev => ({
                            ...prev,
                            [module.id]: !isExpanded
                          }));
                        }}
                      >
                        {isExpanded ? (
                          <i className="fas fa-chevron-up"></i>
                        ) : (
                          <i className="fas fa-chevron-down"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Listado de pruebas (tests) del módulo */}
                {isExpanded && (
                  <div className="p-3 pt-2 border border-t-0 border-gray-200 rounded-b-lg divide-y divide-gray-100">
                    {module.tests.map(test => {
                      const isTestSelected = selectedTests[test.id] || false;
                      
                      return (
                        <div 
                          key={test.id}
                          className="flex items-center py-2 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                          onClick={() => {
                            onModuleSelectionChange({
                              action: 'toggleModule',
                              troncalId: troncal.id,
                              moduleId: test.id,
                              value: !isTestSelected,
                              context: context,
                              segmentId: segmentId
                            });
                          }}
                        >
                          <div className="mr-3">
                            <div className={`w-4 h-4 rounded flex items-center justify-center ${
                              isTestSelected ? 'bg-blue-500 text-white' : 'border border-gray-400'
                            }`}>
                              {isTestSelected && <i className="fas fa-check text-xs"></i>}
                            </div>
                          </div>
                          <div className="text-sm text-gray-700">{test.name}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón de acción principal */}
      <div className="mt-6 flex justify-end">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => {
            // Aquí se podría disparar una acción especial, como iniciar la ejecución
            if (!troncal.moduleConfig) {
              alert('No hay pruebas configuradas para ejecutar');
              return;
            }
            
            let selectedTests = [];
            const executionTarget = executeInAll ? 'all' : activeTab === 'segment' ? 'segment' : 'universe';
            
            // Determinar qué pruebas están seleccionadas según el contexto
            if (executeInAll || activeTab === 'universe') {
              // Si ejecutamos todo o estamos en la pestaña de universo
              if (troncal.moduleConfig.universeModules) {
                selectedTests = Object.entries(troncal.moduleConfig.universeModules)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([id]) => {
                    // Encontrar el nombre de la prueba basado en el ID
                    let testName = id;
                    for (const module of availableModules) {
                      const test = module.tests.find(t => t.id === id);
                      if (test) {
                        testName = `${module.name}: ${test.name}`;
                        break;
                      }
                    }
                    return testName;
                  });
              }
            } else if (activeTab === 'segment') {
              // Si estamos en la pestaña de segmento, necesitamos el segmento seleccionado
              const selectedSegmentId = troncal.moduleConfig.selectedSegment;
              
              // Asegurarse de que segmentModules esté inicializado
              if (!troncal.moduleConfig.segmentModules) {
                troncal.moduleConfig.segmentModules = {};
              }
              
              if (selectedSegmentId && troncal.moduleConfig.segmentModules && 
                  troncal.moduleConfig.segmentModules[selectedSegmentId]) {
                selectedTests = Object.entries(troncal.moduleConfig.segmentModules[selectedSegmentId])
                  .filter(([_, isSelected]) => isSelected)
                  .map(([id]) => {
                    // Encontrar el nombre de la prueba basado en el ID
                    let testName = id;
                    for (const module of availableModules) {
                      const test = module.tests.find(t => t.id === id);
                      if (test) {
                        testName = `${module.name}: ${test.name}`;
                        break;
                      }
                    }
                    return testName;
                  });
              }
            }
            
            if (selectedTests.length === 0) {
              alert('No hay pruebas seleccionadas para ejecutar');
              return;
            }
            
            // Agrupar pruebas por módulo para una mejor presentación
            const groupedTests = selectedTests.reduce((groups, test) => {
              const [moduleName, testName] = test.split(': ');
              if (!groups[moduleName]) {
                groups[moduleName] = [];
              }
              groups[moduleName].push(testName);
              return groups;
            }, {});
            
            // Formatear el mensaje agrupando por módulo
            let testsMessage = "";
            Object.entries(groupedTests).forEach(([moduleName, tests]) => {
              testsMessage += "\n" + moduleName + ":\n";
              tests.forEach(test => {
                testsMessage += "  - " + test + "\n";
              });
            });
            
            const executionMode = executionTarget === 'all' ? 'Todo el troncal (universo + segmentos)' : 
                               executionTarget === 'universe' ? 'Solo universo' : 
                               'Solo segmento ' + (troncal.moduleConfig.selectedSegment || (troncal.segmentos && troncal.segmentos[0] ? troncal.segmentos[0].id : ''));
              
            alert("Ejecutando pruebas:" + testsMessage + "\n\nDonde: " + executionMode + "\n\nTotal: " + selectedTests.length + " pruebas");
          }}
        >
          <i className="fas fa-play mr-2"></i>
          Ejecutar Pruebas
        </button>
      </div>
    </div>
  );
}

export default ModuleSelector;
