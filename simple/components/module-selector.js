// ModuleSelector component - Versión simplificada sin segmentos
class ModuleSelector {
  constructor(parentElement, config = {}) {
    this.parentElement = parentElement;
    this.troncal = config.troncal || null;
    // Si no se pasa un onModuleSelectionChange, usamos uno que actualiza el objeto troncal
    this.onModuleSelectionChange =
      config.onModuleSelectionChange ||
      ((data) => {
        console.log('Default onModuleSelectionChange handler:', data);
        // Asegurarse de que exista la estructura en la troncal
        if (!this.troncal.moduleConfig) {
          this.troncal.moduleConfig = { universeModules: {} };
        }
        if (!this.troncal.moduleConfig.universeModules) {
          this.troncal.moduleConfig.universeModules = {};
        }
        // Actualizamos el estado del test (por ejemplo, "ml_replica")
        this.troncal.moduleConfig.universeModules[data.moduleId] = data.value;
      });

    // Lista de módulos disponibles (predefinidos para demostración)
    this.availableModules = [
      {
        id: 'population',
        name: 'Population descriptive',
        tests: [{ id: 'population_descriptive', name: 'Describe' }]
      },
      {
        id: 'segmentation',
        name: 'Segmentation',
        tests: [{ id: 'segmentation_test', name: 'Segmentation' }]
      },
      {
        id: 'feature',
        name: 'Feature engineering',
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
        tests: [
          { id: 'backtesting_calibration', name: 'Calibración' },
          { id: 'backtesting_stability', name: 'Bucket stability' },
          { id: 'backtesting_psi', name: 'Psi' }
        ]
      },
      {
        id: 'ml',
        name: 'Machine Learning',
        tests: [
          { id: 'ml_benchmarking', name: 'Benchmarking ML' },
          { id: 'ml_replica', name: 'Replica ML' }
        ]
      }
    ];

    // Control de módulos expandidos
    this.expandedModules = {};

    if (this.troncal) {
      // Garantizar que moduleConfig y universeModules existan
      if (!this.troncal.moduleConfig) {
        this.troncal.moduleConfig = { universeModules: {} };
      }
      if (!this.troncal.moduleConfig.universeModules) {
        this.troncal.moduleConfig.universeModules = {};
      }
      this.render();
      this.setupEventListeners();
    }
  }

  render() {
    if (!this.troncal) {
      this.parentElement.innerHTML = '';
      return;
    }

    this.parentElement.innerHTML = `
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-lg font-medium text-gray-700 mb-4 flex items-center">
          <i class="fas fa-cogs mr-2"></i>
          Módulos a ejecutar
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4" id="modules-grid">
          ${this.renderModules()}
        </div>
      </div>
    `;
  }

  renderModules() {
    if (!this.troncal || !this.availableModules) return '';

    return this.availableModules
      .map((module) => {
        // Obtener tests seleccionados
        const selectedTests = {};
        let moduleSelected = false;

        if (
          this.troncal.moduleConfig &&
          this.troncal.moduleConfig.universeModules
        ) {
          module.tests.forEach((test) => {
            selectedTests[test.id] =
              !!this.troncal.moduleConfig.universeModules[test.id];
            if (selectedTests[test.id]) moduleSelected = true;
          });
        }

        // Contar tests seleccionados
        const selectedCount = Object.values(selectedTests).filter(Boolean)
          .length;
        const totalTests = module.tests.length;
        const isExpanded = this.expandedModules[module.id] || false;

        return `
          <div class="rounded-lg overflow-hidden module-card" data-module-id="${module.id}">
            <div 
              class="module-header py-2 px-3 cursor-pointer transition-colors border ${
                moduleSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-100"
              }"
              data-module-id="${module.id}"
            >
              <div class="flex justify-between items-center">
                <div class="font-medium text-gray-800">${module.name}</div>
                <div class="flex items-center">
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mr-2">${selectedCount}/${totalTests}</span>
                  <button 
                    class="module-expand flex items-center justify-center p-1 rounded-full hover:bg-gray-200 transition-colors"
                    data-module-id="${module.id}"
                  >
                    ${
                      isExpanded
                        ? '<i class="fas fa-chevron-up"></i>'
                        : '<i class="fas fa-chevron-down"></i>'
                    }
                  </button>
                </div>
              </div>
            </div>
            ${
              isExpanded
                ? `
            <div class="p-3 pt-2 border border-t-0 border-gray-200 rounded-b-lg divide-y divide-gray-100 module-tests">
              ${module.tests
                .map((test) => {
                  const isTestSelected = selectedTests[test.id] || false;
                  return `
                  <div 
                    class="test-item flex items-center py-2 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                    data-module-id="${module.id}"
                    data-test-id="${test.id}"
                  >
                    <div class="mr-3">
                      <div class="test-checkbox w-4 h-4 rounded flex items-center justify-center ${
                        isTestSelected
                          ? "bg-blue-500 text-white"
                          : "border border-gray-400"
                      }">
                        ${isTestSelected ? '<i class="fas fa-check text-xs"></i>' : ""}
                      </div>
                    </div>
                    <div class="text-sm text-gray-700">${test.name}</div>
                  </div>
                `;
                })
                .join("")}
            </div>
          `
                : ""
            }
          </div>
        `;
      })
      .join("");
  }

  setupEventListeners() {
    // EventListeners para cabeceras de módulos
    const moduleHeaders = document.querySelectorAll(".module-header");
    moduleHeaders.forEach((header) => {
      header.addEventListener("click", (e) => {
        if (!e.target.closest(".module-expand")) {
          const moduleId = e.currentTarget.dataset.moduleId;
          this.handleModuleHeaderClick(moduleId);
        }
      });
    });

    // Botones de expandir/contraer
    const expandButtons = document.querySelectorAll(".module-expand");
    expandButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const moduleId = e.currentTarget.dataset.moduleId;
        this.expandedModules[moduleId] = !this.expandedModules[moduleId];
        this.render();
        this.setupEventListeners();
      });
    });

    // Items de test (selección individual)
    const testItems = document.querySelectorAll(".test-item");
    testItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const moduleId = e.currentTarget.dataset.moduleId;
        const testId = e.currentTarget.dataset.testId;
        this.handleTestItemClick(moduleId, testId);
      });
    });

    // Capturar clics en los checkboxes (dentro de cada test)
    const testCheckboxes = document.querySelectorAll(".test-checkbox");
    testCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("click", (e) => {
        e.stopPropagation();
        const testItem = e.target.closest(".test-item");
        if (testItem) {
          const moduleId = testItem.dataset.moduleId;
          const testId = testItem.dataset.testId;
          this.handleTestItemClick(moduleId, testId);
        }
      });
    });
  }

  handleModuleHeaderClick(moduleId) {
    console.log("Click en cabecera de módulo:", moduleId);
    const module = this.availableModules.find((m) => m.id === moduleId);
    if (!module) {
      console.error("Módulo no encontrado:", moduleId);
      return;
    }

    // Asegurarse de que exista la estructura en la troncal
    if (!this.troncal.moduleConfig) {
      this.troncal.moduleConfig = { universeModules: {} };
    }
    if (!this.troncal.moduleConfig.universeModules) {
      this.troncal.moduleConfig.universeModules = {};
    }

    // Verificar si todos los tests están seleccionados
    let allSelected = true;
    module.tests.forEach((test) => {
      if (!this.troncal.moduleConfig.universeModules[test.id]) {
        allSelected = false;
      }
    });
    console.log(
      "Estado actual de selección:",
      allSelected ? "Todos seleccionados" : "No todos seleccionados"
    );
    const newState = !allSelected;
    module.tests.forEach((test) => {
      console.log(`Cambiando estado de test ${test.id} a ${newState}`);
      this.onModuleSelectionChange({
        action: "toggleModule",
        troncalId: this.troncal.id,
        moduleId: test.id,
        value: newState
      });
    });

    console.log("Actualizando interfaz después de cambiar estado del módulo");
    this.render();
    this.setupEventListeners();
  }

  handleTestItemClick(moduleId, testId) {
    console.log("Click en test:", moduleId, testId);
    // Asegurarse de que exista la estructura en la troncal
    if (!this.troncal.moduleConfig) {
      this.troncal.moduleConfig = { universeModules: {} };
    }
    if (!this.troncal.moduleConfig.universeModules) {
      this.troncal.moduleConfig.universeModules = {};
    }

    const isSelected = !!this.troncal.moduleConfig.universeModules[testId];
    console.log("Estado actual del test:", isSelected ? "Seleccionado" : "No seleccionado");

    this.onModuleSelectionChange({
      action: "toggleModule",
      troncalId: this.troncal.id,
      moduleId: testId,
      value: !isSelected
    });
    console.log("Actualizando interfaz después de cambiar estado del test");
    this.render();
    this.setupEventListeners();
  }

  // Método para actualizar la configuración desde el exterior
  updateConfig(config) {
    this.troncal = config.troncal || this.troncal;
    if (config.troncal && config.troncal.id !== (this.troncal ? this.troncal.id : null)) {
      this.expandedModules = {};
    }
    this.render();
    this.setupEventListeners();
  }
}

window.ModuleSelector = ModuleSelector;