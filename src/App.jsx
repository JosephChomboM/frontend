import React, { useState, useCallback } from "react";
import Header from "./components/Header";
import Toast from "./components/Toast";
import ModalAgregarTroncal from "./components/ModalAgregarTroncal";
import ModalSAS from "./components/ModalSAS";
import ConfigForm from "./components/ConfigForm";
import StructurePanel from "./components/StructurePanel";
import MainPanel from "./components/MainPanel";
import ModuleSelector from "./components/ModuleSelector";
import "./App.css";

function App() {
  // Estado global
  const [troncales, setTroncales] = useState([]); // Lista de troncales
  const [toast, setToast] = useState({ message: "", type: "success" });
  // Estado para modales
  const [showAgregarTroncal, setShowAgregarTroncal] = useState(false);
  const [showSAS, setShowSAS] = useState(false);
  // Placeholder para SAS generado
  const [sasCode] = useState("/* SAS code aquí */");

  // Estado para configuración general
  const [projectPath, setProjectPath] = useState("");
  const [masterTable, setMasterTable] = useState("");
  const [validatorName, setValidatorName] = useState("");

  // Estado de tab activo (troncal o segmento)
  const [activeTab, setActiveTab] = useState({ type: null, troncalId: null, segId: null });
  
  // Estado para configuraciu00f3n de mu00f3dulos
  const [moduleConfig, setModuleConfig] = useState({
    executionLevel: 'troncal',
    modules: {
      exploratory: true,
      univariate: true,
      bivariate: true,
      scoring: true,
      validation: false
    },
    selectedSegment: null
  });

  // Derivados para pasar a paneles
  const activeTroncalId = activeTab.type === 'troncal' ? activeTab.troncalId : (activeTab.type === 'segmento' ? activeTab.troncalId : null);
  const activeSegmento = activeTab.type === 'segmento' ? { troncalId: activeTab.troncalId, segId: activeTab.segId } : null;

  // Handlers
  // Sidebar sigue usando esto para agregar rápido 1 troncal


  const handleAddMultipleTroncales = (cantidad) => {
    if (!cantidad || cantidad < 1) {
      setToast({ message: "Ingrese un número válido de troncales", type: "error" });
      return;
    }
    const currentLength = troncales.length;
    const nuevas = Array.from({ length: cantidad }, (_, i) => ({
      id: currentLength + i + 1,
      nombre: `Troncal ${currentLength + i + 1}`
    }));
    setTroncales(prev => {
      const updated = [...prev, ...nuevas];
      const newId = updated.length;
      setActiveTab({ type: 'troncal', troncalId: newId, segId: null });
      return updated;
    });
    setShowAgregarTroncal(false);
    setToast({ message: `Se agregaron ${cantidad} troncales`, type: "success" });
  };



  const handleDeleteTroncal = (id) => {
    setTroncales(troncales.filter(t => t.id !== id));
    if (activeTroncalId === id) {
      setActiveTab({ type: null, troncalId: null, segId: null });
    }
    setToast({ message: `Troncal ${id} eliminada`, type: "info" });
  };

  const handleCloseToast = () => setToast({ ...toast, message: "" });

  // Header handlers
  const handleLoadConfig = () => {
    // Aquí puedes implementar la carga de configuración (JSON)
    setToast({ message: "Funcionalidad de carga de config no implementada", type: "info" });
  };
  const handleOpenAddTroncal = () => setShowAgregarTroncal(true);
  const handleOpenSASModal = () => setShowSAS(true);
  const handleCloseSASModal = () => setShowSAS(false);

  // Descarga de SAS y JSON (placeholders)
  const handleDownloadSAS = () => {
    const blob = new Blob([sasCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codigo.sas";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleDownloadJSON = () => {
    const data = JSON.stringify({ troncales }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handlers para MainPanel (memorizados para evitar recreaciones)
  const handleUpdateTroncal = useCallback((troncalId, field, value) => {
    setTroncales(prevTroncales => prevTroncales.map(t => 
      t.id === troncalId ? { ...t, [field]: value } : t
    ));
  }, []);

  const handleUpdateTroncalParsed = useCallback((troncalId, field, value) => {
    // Unifica texto en un set (sin repeticiones)
    const parseVariables = text => [...new Set(text.split(/\s|,|;/).map(v => v.trim()).filter(v => v))].join(" ");
    setTroncales(prevTroncales => prevTroncales.map(t => 
      t.id === troncalId ? { ...t, [field]: parseVariables(value) } : t
    ));
  }, []);

  const handleToggleSegmentos = useCallback((troncalId, checked) => {
    setTroncales(prevTroncales => prevTroncales.map(t => {
      if (t.id !== troncalId) return t;
      if (checked) {
        return {
          ...t,
          segmentos: t.segmentos && t.segmentos.length >= 2 ? t.segmentos : [
            { id: 1, variablesNum: "", variablesCat: "", driversNum: "", driversCat: "" },
            { id: 2, variablesNum: "", variablesCat: "", driversNum: "", driversCat: "" }
          ]
        };
      } else {
        return { ...t, segmentos: [], varSegmentadora: "" };
      }
    }));
  }, []);

  const handleUpdateSegmentsCount = useCallback((troncalId, newCount) => {
    setTroncales(prevTroncales => prevTroncales.map(t => {
      if (t.id !== troncalId) return t;
      let n = parseInt(newCount);
      if (isNaN(n) || n < 2) return t;
      let segs = t.segmentos ? [...t.segmentos] : [];
      if (segs.length === 0) {
        segs = Array.from({ length: n }, (_, i) => ({ id: i + 1, variablesNum: "", variablesCat: "", driversNum: "", driversCat: "" }));
      } else if (n > segs.length) {
        let startId = segs[segs.length - 1].id + 1;
        for (let i = startId; i < startId + (n - segs.length); i++) {
          segs.push({ id: i, variablesNum: "", variablesCat: "", driversNum: "", driversCat: "" });
        }
      } else if (n < segs.length) {
        segs = segs.slice(0, n);
      }
      return { ...t, segmentos: segs };
    }));
  }, []);

  // Handler para cambios en la selección de módulos
  const handleModuleSelectionChange = useCallback((moduleSelectionData) => {
    // Manejar diferentes acciones
    if (moduleSelectionData.action === 'toggleSegments') {
      handleToggleSegmentos(moduleSelectionData.troncalId, moduleSelectionData.value);
      return;
    } else if (moduleSelectionData.action === 'updateTroncal') {
      handleUpdateTroncal(moduleSelectionData.troncalId, moduleSelectionData.field, moduleSelectionData.value);
      return;
    } else if (moduleSelectionData.action === 'updateSegmentsCount') {
      handleUpdateSegmentsCount(moduleSelectionData.troncalId, moduleSelectionData.value);
      return;
    } else if (moduleSelectionData.action === 'toggleModule') {
      // Actualizar la selección de un módulo
      setTroncales(prevTroncales => {
        return prevTroncales.map(troncal => {
          if (troncal.id === moduleSelectionData.troncalId) {
            // Inicializar moduleConfig si no existe
            const currentModuleConfig = troncal.moduleConfig || { 
              universeModules: {
                exploratory: true,
                univariate: true,
                bivariate: true,
                scoring: true,
                validation: false
              },
              segmentModules: {},  // Ahora será un objeto con segmentos como claves
              executionTarget: 'universe',
              selectedSegment: null
            };
            
            // Asegurarse de que segmentModules siempre esté inicializado
            if (!currentModuleConfig.segmentModules) {
              currentModuleConfig.segmentModules = {};
            }
            
            // Si estamos en el contexto de segmento
            if (moduleSelectionData.context === 'segment') {
              const segmentId = moduleSelectionData.segmentId;
              
              // Asegurarse de que existe la configuración para este segmento
              if (!currentModuleConfig.segmentModules[segmentId]) {
                currentModuleConfig.segmentModules[segmentId] = {
                  exploratory: true,
                  univariate: true,
                  bivariate: true,
                  scoring: true,
                  validation: false
                };
              }
              
              // Actualizar el módulo seleccionado para este segmento específico
              return {
                ...troncal,
                moduleConfig: {
                  ...currentModuleConfig,
                  segmentModules: {
                    ...currentModuleConfig.segmentModules,
                    [segmentId]: {
                      ...currentModuleConfig.segmentModules[segmentId],
                      [moduleSelectionData.moduleId]: moduleSelectionData.value
                    }
                  }
                }
              };
            } else {
              // Si estamos en el contexto de universo
              return {
                ...troncal,
                moduleConfig: {
                  ...currentModuleConfig,
                  universeModules: {
                    ...currentModuleConfig.universeModules,
                    [moduleSelectionData.moduleId]: moduleSelectionData.value
                  }
                }
              };
            }
          }
          return troncal;
        });
      });
      return;
    } else if (moduleSelectionData.action === 'setExecutionTarget') {
      // Actualizar el objetivo de ejecución
      setTroncales(prevTroncales => {
        return prevTroncales.map(troncal => {
          if (troncal.id === moduleSelectionData.troncalId) {
            // Inicializar moduleConfig si no existe
            const currentModuleConfig = troncal.moduleConfig || { 
              selectedModules: {
                exploratory: true,
                univariate: true,
                bivariate: true,
                scoring: true,
                validation: false
              },
              executionTarget: 'universe',
              selectedSegment: null
            };
            
            return {
              ...troncal,
              moduleConfig: {
                ...currentModuleConfig,
                executionTarget: moduleSelectionData.target
              }
            };
          }
          return troncal;
        });
      });
      return;
    } else if (moduleSelectionData.action === 'setSelectedSegment') {
      // Actualizar el segmento seleccionado
      setTroncales(prevTroncales => {
        return prevTroncales.map(troncal => {
          if (troncal.id === moduleSelectionData.troncalId) {
            // Inicializar moduleConfig si no existe
            const currentModuleConfig = troncal.moduleConfig || { 
              universeModules: {
                exploratory: true,
                univariate: true,
                bivariate: true,
                scoring: true,
                validation: false
              },
              segmentModules: {},
              executionTarget: 'universe',
              selectedSegment: null
            };
            
            // Asegurarse de que segmentModules siempre esté inicializado
            if (!currentModuleConfig.segmentModules) {
              currentModuleConfig.segmentModules = {};
            }
            
            // Asegurarse de que existe la configuración para este segmento
            const segmentId = moduleSelectionData.segmentId;
            if (segmentId && !currentModuleConfig.segmentModules[segmentId]) {
              currentModuleConfig.segmentModules[segmentId] = {
                exploratory: true,
                univariate: true,
                bivariate: true,
                scoring: true,
                validation: false
              };
            }
            
            return {
              ...troncal,
              moduleConfig: {
                ...currentModuleConfig,
                selectedSegment: segmentId
              }
            };
          }
          return troncal;
        });
      });
      return;
    }
    
    // Actualizar la configuración de módulos
    setModuleConfig(moduleSelectionData);
    
    // Actualizar el troncal activo con la nueva configuración
    if (activeTroncalId) {
      setTroncales(prevTroncales => {
        return prevTroncales.map(troncal => {
          if (troncal.id === activeTroncalId) {
            // Si hay datos de segmentos, actualizamos el troncal
            if (moduleSelectionData.hasSegments) {
              // Actualizar o crear segmentos si es necesario
              const segmentos = moduleSelectionData.segmentCount > 0 ? 
                Array.from({ length: moduleSelectionData.segmentCount }, (_, index) => {
                  // Preservar segmentos existentes o crear nuevos
                  const existingSegment = troncal.segmentos && troncal.segmentos[index];
                  return existingSegment || {
                    id: (index + 1).toString(),
                    name: `Segmento ${index + 1}`,
                    variablesNum: "", 
                    variablesCat: "", 
                    driversNum: "", 
                    driversCat: ""
                  };
                }) : [];
                
              return {
                ...troncal,
                segmentos,
                varSegmentadora: moduleSelectionData.segmentVariable,
                moduleConfig: {
                  selectedModules: moduleSelectionData.selectedModules,
                  executionTarget: moduleSelectionData.executionTarget,
                  selectedSegment: moduleSelectionData.selectedSegment
                }
              };
            } else {
              // Si no hay segmentos, eliminarlos
              return {
                ...troncal,
                segmentos: [],
                varSegmentadora: '',
                moduleConfig: {
                  selectedModules: moduleSelectionData.selectedModules,
                  executionTarget: 'universe' // Sin segmentos, solo se puede ejecutar en universo
                }
              };
            }
          }
          return troncal;
        });
      });
    }
    
    console.log('Configuración de módulos actualizada:', moduleSelectionData);
  }, [activeTroncalId, handleToggleSegmentos]);

  return (
    <div className="bg-gray-100 font-sans text-gray-800">
      <Header
        onLoadConfig={handleLoadConfig}
        onOpenAddTroncal={handleOpenAddTroncal}
        onOpenSASModal={handleOpenSASModal}
      />
      <div className="container mx-auto px-4 py-6">
        <ConfigForm
          projectPath={projectPath}
          setProjectPath={setProjectPath}
          masterTable={masterTable}
          validatorName={validatorName}
          setMasterTable={setMasterTable}
          setValidatorName={setValidatorName}
        />
      
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar/Navigator */}
          <div className="lg:col-span-1">
            <StructurePanel
              troncales={troncales}
              activeTroncalId={activeTroncalId}
              activeSegmento={activeSegmento}
              onSelectTroncal={id => setActiveTab({ type: 'troncal', troncalId: id, segId: null })}
              onSelectSegmento={(troncalId, segId) => setActiveTab({ type: 'segmento', troncalId, segId })}
              onDeleteTroncal={handleDeleteTroncal}
            />
          </div>
          {/* Main Content: Troncal detail */}
          <div className="lg:col-span-3">
            {activeTab.type === 'troncal' && activeTroncalId && (
              <>
                <ModuleSelector
                  troncal={troncales.find(t => t.id === activeTroncalId)}
                  onModuleSelectionChange={handleModuleSelectionChange}
                />
                <MainPanel
                  troncal={troncales.find(t => t.id === activeTroncalId)}
                  onUpdateTroncal={handleUpdateTroncal}
                  onUpdateTroncalParsed={handleUpdateTroncalParsed}
                  onToggleSegmentos={handleToggleSegmentos}
                  onUpdateSegmentsCount={handleUpdateSegmentsCount}
                />
              </>
            )}
          </div>
        </div>
      <ModalAgregarTroncal
        open={showAgregarTroncal}
        onClose={() => setShowAgregarTroncal(false)}
        onConfirm={handleAddMultipleTroncales}
      />
      <ModalSAS
        open={showSAS}
        onClose={handleCloseSASModal}
        sasCode={sasCode}
        onDownloadSAS={handleDownloadSAS}
        onDownloadJSON={handleDownloadJSON}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={handleCloseToast}
      />
      </div>
    </div>
  );
}

export default App;
