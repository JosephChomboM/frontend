class App {


  constructor() {
    // Estado global de la aplicación (ejemplo simplificado)
    this.state = {
      troncales: [],  // Ej: [{ id: 1, segmentos: [...] }, ...]
      activeTab: null // Almacena un string como "troncal-1" o "segmento-1-2"
      // ... otros campos
    };
    
    this.init();
  }

  init() {
    this.createContainers();
    this.initComponents();
    this.setupGlobalEvents();
  }

  createContainers() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;
    
    appContainer.innerHTML = `
      <div id="header-container"></div>
      <div id="main-container" class="container mx-auto px-4 py-6">
        <!-- Contenedor para ConfigForm -->
        <div id="config-form-container"></div>
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Sidebar/Navigator -->
          <div id="structure-panel-container"></div>
          <!-- Contenido principal -->
          <div id="detail-container" class="lg:col-span-3">
            <!-- Contenedor para ModuleSelector -->
            <div id="module-selector-container"></div>
            <!-- Contenedor para TroncalForm -->
            <div id="troncal-detail"></div>
          </div>
        </div>
      </div>
    `;
  }

  initComponents() {
    new Header(document.getElementById("header-container"));
    new ConfigForm(document.getElementById("config-form-container"), {
      projectPath: "",
      masterTable: "",
      validatorName: ""
    });
    
    window.modal = new Modal();
    
    this.structurePanel = new StructurePanel(
      document.getElementById("structure-panel-container"),
      { 
        troncales: this.state.troncales,
        activeTab: this.state.activeTab 
      }
    );
    
    this.moduleSelector = new ModuleSelector(
      document.getElementById("module-selector-container"),
      { 
        troncal: this.state.troncales.length > 0 ? this.state.troncales[0] : null,
        onModuleSelectionChange: (data) => {
          console.log("Cambio en module selector:", data);
          let troncal = this.state.troncales.find(t => t.id === data.troncalId);
          if (!troncal) {
            troncal = { id: data.troncalId, moduleConfig: { universeModules: {} } };
            this.state.troncales.push(troncal);
          }
          if (!troncal.moduleConfig) troncal.moduleConfig = { universeModules: {} };
          if (!troncal.moduleConfig.universeModules) troncal.moduleConfig.universeModules = {};
          troncal.moduleConfig.universeModules[data.moduleId] = data.value;
          this.moduleSelector.updateConfig({ troncal });
        }
      }
    );
  
    const handleDeleteTroncal = (id) => {
      console.log("Eliminar troncal", id);
      
      // Actualiza el estado (elimina y renumera)
      this.state.troncales = this.state.troncales.filter(t => t.id !== id);
      this.state.troncales.forEach((t, index) => { t.id = index + 1; });
      
      // Actualiza el StructurePanel
      this.structurePanel.state.troncales = this.state.troncales;
      this.structurePanel.render();
      
      // Actualiza TroncalForm usando el contenedor "troncal-detail"
      const troncalDetail = document.getElementById("troncal-detail");
      if (this.state.troncales.length > 0) {
        new TroncalForm(troncalDetail, this.state.troncales[0], {
          onFieldChange: (field, value) => {
            console.log("Actualizando troncal campo", field, "a", value);
          },
          onDelete: handleDeleteTroncal,
          onEditSegment: (troncalId, segId) => {
            console.log("Editar segmento", segId, "de troncal", troncalId);
          },
          onDeleteSegment: (troncalId, segId) => {
            console.log("Eliminar segmento", segId, "de troncal", troncalId);
          }
        });
      } else {
        troncalDetail.innerHTML = `
          <div id="main-content" class="bg-white rounded-xl shadow-md p-6">
            <div id="troncal-detail">
              <div class="text-center py-8 text-gray-500">
                <i class="fas fa-info-circle text-4xl mb-2 opacity-30"></i>
                <p>Seleccione o agregue una Troncal para configurarla.</p>
              </div>
            </div>
          </div>
        `;
      }
      //autoGenerateSAS();
    };
  
    // Instancia inicial: usar "troncal-detail" como contenedor para TroncalForm
    const troncalDetail = document.getElementById("troncal-detail");
    if (this.state.troncales.length > 0) {
      new TroncalForm(troncalDetail, this.state.troncales[0], {
        onFieldChange: (field, value) => {
          console.log("Actualizando troncal campo", field, "a", value);
        },
        onDelete: handleDeleteTroncal,
        onEditSegment: (troncalId, segId) => {
          console.log("Editar segmento", segId, "de troncal", troncalId);
        },
        onDeleteSegment: (troncalId, segId) => {
          console.log("Eliminar segmento", segId, "de troncal", troncalId);
        }
      });
    } else {
      troncalDetail.innerHTML = `
        <div id="main-content" class="bg-white rounded-xl shadow-md p-6">
          <div id="troncal-detail">
            <div class="text-center py-8 text-gray-500">
              <i class="fas fa-info-circle text-4xl mb-2 opacity-30"></i>
              <p>Seleccione o agregue una Troncal para configurarla.</p>
            </div>
          </div>
        </div>
      `;
    }
  }

  setupGlobalEvents() {
    // Escucha el evento switchTab para actualizar el estado activeTab y refrescar el panel
    document.addEventListener('switchTab', (e) => {
      const { tabId } = e.detail;
      console.log('Cambiando a tab:', tabId);
      this.state.activeTab = tabId;
      this.structurePanel.state.activeTab = tabId;
      this.structurePanel.updateStructureTree();
    
      // Si el tab corresponde a una troncal, actualizar tanto el ModuleSelector como el TroncalForm
      if (tabId.startsWith('troncal-')) {
        const troncalId = parseInt(tabId.split('-')[1]);
        const selectedTroncal = this.state.troncales.find(t => t.id === troncalId) || null;
        this.moduleSelector.updateConfig({ troncal: selectedTroncal });
    
        // Actualizar la sección de detalle (TroncalForm) con la troncal seleccionada
        const troncalDetail = document.getElementById('troncal-detail');
        new TroncalForm(troncalDetail, selectedTroncal, {
          onFieldChange: (field, value) => {
            console.log('Actualizando troncal campo', field, 'a', value);
            // Aquí asegúrate de actualizar el objeto en el estado,
            // por ejemplo: selectedTroncal[field] = value;
          },
          onDelete: (id) => {
            console.log('Eliminar troncal', id);
          },
          onEditSegment: (troncalId, segId) => {
            console.log('Editar segmento', segId, 'de troncal', troncalId);
          },
          onDeleteSegment: (troncalId, segId) => {
            console.log('Eliminar segmento', segId, 'de troncal', troncalId);
          }
        });
      }
    });
    // Ejemplo de un evento global: escuchar el evento "loadConfig"
    document.addEventListener('loadConfig', () => {
      console.log('Evento loadConfig capturado en App');
    });

    // Escucha el evento "openAddTroncal" para mostrar el modal correspondiente
    document.addEventListener('openAddTroncal', () => {
      console.log('Evento openAddTroncal capturado en App');
      if (window.modal && typeof window.modal.showAddTroncalModal === 'function') {
        window.modal.showAddTroncalModal();
      }
    });

    // Escucha el evento "openSASModal"
    document.addEventListener('openSASModal', () => {
      console.log('Evento openSASModal capturado en App');
    });
    
    // Escucha el evento "addTroncales" para agregar nuevas troncales
    document.addEventListener('addTroncales', (e) => {
      const { count } = e.detail;
      console.log(`Agregando ${count} troncales`);
      
      // Crea y agrega nuevas troncales al estado
      for (let i = 0; i < count; i++) {
        const newId = this.getNextTroncalId();
        const newTroncal = this.createDefaultTroncal(newId);
        this.state.troncales.push(newTroncal);
      }
      
      // Actualiza el sidebar con las nuevas troncales
      this.structurePanel.updateStructureTree();
      
      // Actualiza settings del ModuleSelector
      if (this.state.troncales.length > 0) {
        this.moduleSelector.updateConfig({ troncal: this.state.troncales[0] });
      
        // Re-instanciar TroncalForm para mostrar los campos en vez del mensaje vacío
        const troncalDetailContainer = document.getElementById('troncal-detail');
        new TroncalForm(troncalDetailContainer, this.state.troncales[0], {
          onFieldChange: (field, value) => {
            console.log('Actualizando troncal campo', field, 'a', value);
          },
          onDelete: (id) => {
            console.log('Eliminar troncal', id);
          },
          onEditSegment: (troncalId, segId) => {
            console.log('Editar segmento', segId, 'de troncal', troncalId);
          },
          onDeleteSegment: (troncalId, segId) => {
            console.log('Eliminar segmento', segId, 'de troncal', troncalId);
          }
        });
      }
    });
  }
    // Dentro del método deleteTroncal() de App.js
  deleteTroncal(id) {
    console.log('Eliminar troncal', id);
    this.state.troncales = this.state.troncales.filter(t => t.id !== id);
    this.state.troncales.forEach((t, index) => { t.id = index + 1; });
    this.structurePanel.state.troncales = this.state.troncales;
    this.structurePanel.updateStructureTree();
    //autoGenerateSAS();
    
    // Obtener contenedores de detalle y module selector
    const troncalDetail = document.getElementById('troncal-detail');
    const moduleSelectorContainer = document.getElementById('module-selector-container');
    
    if (this.state.troncales.length === 0) {
      troncalDetail.innerHTML = `
        <div id="main-content" class="bg-white rounded-xl shadow-md p-6">
          <div id="troncal-detail">
            <div class="text-center py-8 text-gray-500">
              <i class="fas fa-info-circle text-4xl mb-2 opacity-30"></i>
              <p>Seleccione o agregue una Troncal para configurarla.</p>
            </div>
          </div>
        </div>`;
      // Limpiar el module-selector cuando no hay troncales
      moduleSelectorContainer.innerHTML = '';
    } else {
      this.state.activeTab = "troncal-1";
      StructurePanel.handleSwitchTab("troncal-1");
      new TroncalForm(troncalDetail, this.state.troncales[0], {
        onFieldChange: (field, value) => {
          console.log('Actualizando troncal campo', field, 'a', value);
        },
        onDelete: this.deleteTroncal.bind(this),
        onEditSegment: (troncalId, segId) => {
          console.log('Editar segmento', segId, 'de troncal', troncalId);
        },
        onDeleteSegment: (troncalId, segId) => {
          console.log('Eliminar segmento', segId, 'de troncal', troncalId);
        }
      });
    }
    // (Opcional) Puedes agregar notificaciones aquí
    //showToast && showToast(`Troncal ${id} eliminada`, "success");
  }

  // Función auxiliar para obtener el siguiente ID de troncal
  getNextTroncalId() {
    if (this.state.troncales.length === 0) return 1;
    return Math.max(...this.state.troncales.map(t => t.id)) + 1;
  }
  createDefaultTroncal(newId) {
    return {
      id: newId,
      segmentos: []
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});