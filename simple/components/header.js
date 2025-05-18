class Header {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.parentElement.innerHTML = `
      <header class="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <!-- Título -->
          <div class="flex items-center space-x-4">
            <div class="bg-white bg-opacity-10 rounded-full p-2">
              <i class="fas fa-chart-line text-white text-xl"></i>
            </div>
            <h1 class="text-2xl font-bold text-white">WorkFlow Scoring VI v2.0</h1>
          </div>
          <!-- Botones principales -->
          <div class="flex items-center space-x-3">
            <button id="btn-load-config" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center">
              <i class="fas fa-folder-open mr-2"></i> Cargar Config
            </button>
            <button id="btn-add-troncal" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center">
              <i class="fas fa-plus mr-2"></i> Agregar Troncal
            </button>
            <button id="btn-download-sas" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center">
              <i class="fas fa-download mr-2"></i> Descargar Config & SAS
            </button>
          </div>
        </div>
      </header>
    `;
  }

  setupEventListeners() {
    const btnLoadConfig = document.getElementById('btn-load-config');
    if (btnLoadConfig) {
      btnLoadConfig.addEventListener('click', () => {
        const event = new CustomEvent('loadConfig');
        document.dispatchEvent(event);
      });
    }

    const btnAddTroncal = document.getElementById('btn-add-troncal');
    if (btnAddTroncal) {
      btnAddTroncal.addEventListener('click', () => {
        const event = new CustomEvent('openAddTroncal');
        document.dispatchEvent(event);
      });
    }

    const btnDownloadSas = document.getElementById('btn-download-sas');
    if (btnDownloadSas) {
      btnDownloadSas.addEventListener('click', () => {
        const event = new CustomEvent('openSASModal');
        document.dispatchEvent(event);
      });
    }
  }
}

window.Header = Header;