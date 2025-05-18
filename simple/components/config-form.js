// ConfigForm component
class ConfigForm {
  constructor(parentElement, config = {}) {
    this.parentElement = parentElement;
    this.config = config;
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.parentElement.innerHTML = `
      <div class="bg-white rounded-xl shadow-md p-4 mb-6">
        <h2 class="text-lg font-medium text-gray-700 mb-2">Configuración General</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Campo 1: Ruta del proyecto -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ruta del proyecto:</label>
            <input
              type="text"
              id="projectPath"
              value="${this.config.projectPath || ''}"
              class="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="\\plnsasintp01.datalake.local\VI_DESA_01_sasdata17..."
            />
            <p class="text-xs text-gray-500 mt-1">Directorio ra del proyecto.</p>
          </div>
          <!-- Campo 2: Master Table -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Master Table:</label>
            <input
              type="text"
              id="masterTable"
              value="${this.config.masterTable || ''}"
              class="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
            <p class="text-xs text-gray-500 mt-1">Ingrese el nombre de la master table global.</p>
          </div>
          <!-- Campo 3: Nombre del Validador -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Validador:</label>
            <input
              type="text"
              id="validatorName"
              value="${this.config.validatorName || ''}"
              class="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
            <p class="text-xs text-gray-500 mt-1">Nombre de la persona que realiza la validación.</p>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Event listeners para los campos de entrada
    const projectPathInput = document.getElementById('projectPath');
    const masterTableInput = document.getElementById('masterTable');
    const validatorNameInput = document.getElementById('validatorName');

    if (projectPathInput) {
      projectPathInput.addEventListener('input', (e) => {
        this.config.projectPath = e.target.value;
        // Emitir evento de cambio
        const event = new CustomEvent('configChanged', { 
          detail: { type: 'projectPath', value: e.target.value }
        });
        document.dispatchEvent(event);
      });
    }

    if (masterTableInput) {
      masterTableInput.addEventListener('input', (e) => {
        this.config.masterTable = e.target.value;
        // Emitir evento de cambio
        const event = new CustomEvent('configChanged', { 
          detail: { type: 'masterTable', value: e.target.value }
        });
        document.dispatchEvent(event);
      });
    }

    if (validatorNameInput) {
      validatorNameInput.addEventListener('input', (e) => {
        this.config.validatorName = e.target.value;
        // Emitir evento de cambio
        const event = new CustomEvent('configChanged', { 
          detail: { type: 'validatorName', value: e.target.value }
        });
        document.dispatchEvent(event);
      });
    }
  }

  // Mu00e9todo para actualizar los valores desde el exterior
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.render();
    this.setupEventListeners();
  }
}
