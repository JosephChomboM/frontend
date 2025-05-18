// Modal component for dialogs
class Modal {
  constructor() {
    this.modalContainer = null;
    this.init();
  }

  init() {
    // Create modal container if it doesn't exist
    if (!document.getElementById('modal-container')) {
      const modalContainer = document.createElement('div');
      modalContainer.id = 'modal-container';
      modalContainer.className = 'fixed inset-0 z-50 hidden';
      document.body.appendChild(modalContainer);
    }
    
    this.modalContainer = document.getElementById('modal-container');
  }

  // Show modal for adding troncales
  showAddTroncalModal() {
    this.modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center';
    this.modalContainer.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black bg-opacity-50"></div>
        <div class="modal-content bg-white rounded-xl shadow-2xl z-10 max-w-sm mx-4 overflow-hidden">
        <div class="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
          <h3 class="text-lg font-bold text-gray-900 mb-3">Agregar Troncal(es)</h3>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ¿Cuántas troncales deseas agregar?
          </label>
          <input 
            type="number" 
            id="troncales-count" 
            min="1" 
            value="1" 
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div class="flex justify-end gap-3 mt-4">
            <button 
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
              id="modal-cancel"
            >
              Cancelar
            </button>
            <button 
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
              id="modal-confirm"
            >
              Agregar
            </button>
          </div>
        </div>

      </div>
    `;
    
    // Add event listeners
    document.getElementById('modal-cancel').addEventListener('click', () => this.close());
    
    // Add event listener to backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }
    
    document.getElementById('modal-confirm').addEventListener('click', () => {
      const count = parseInt(document.getElementById('troncales-count').value) || 1;
      // Dispatch event
      const event = new CustomEvent('addTroncales', { detail: { count } });
      document.dispatchEvent(event);
      this.close();
    });
  }

  // Show SAS code modal
  showSASModal(sasCode = '/* Codigo SAS autogenerado */', jsonConfig = '{}') {
    this.modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center';
    this.modalContainer.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black bg-opacity-50"></div>
      <div class="modal-content bg-white rounded-lg shadow-xl z-10 w-full max-w-4xl mx-4 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h3 class="text-lg font-medium text-white">Código SAS Generado</h3>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <div class="bg-gray-800 text-white p-4 rounded-md overflow-auto max-h-96">
              <pre><code>${sasCode}</code></pre>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none" 
              id="download-json"
            >
              <i class="fas fa-download mr-2"></i>Descargar JSON
            </button>
            <button 
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none" 
              id="download-sas"
            >
              <i class="fas fa-download mr-2"></i>Descargar SAS
            </button>
            <button 
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none" 
              id="modal-close"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('modal-close').addEventListener('click', () => this.close());
    
    // Add event listener to backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }
    
    document.getElementById('download-sas').addEventListener('click', () => {
      this.downloadFile(sasCode, 'codigo.sas', 'text/plain');
    });
    
    document.getElementById('download-json').addEventListener('click', () => {
      this.downloadFile(jsonConfig, 'config.json', 'application/json');
    });
  }
  showTroncalDeleteModal(id, callback) {
    this.modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center';
    this.modalContainer.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black bg-opacity-50"></div>
      <div class="modal-content bg-white rounded-xl shadow-2xl z-10 max-w-sm mx-4 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-3">Eliminar Troncal ${id}</h3>
        <p class="mb-4">¿Está seguro de eliminar la Troncal ${id}?</p>
        <div class="flex justify-end gap-3">
          <button id="modal-cancel" class="px-4 py-2 border rounded-md text-sm text-gray-700">Cancelar</button>
          <button id="modal-confirm" class="px-4 py-2 bg-red-600 text-white rounded-md text-sm">Eliminar</button>
        </div>
      </div>
    `;
    this.modalContainer.classList.remove('hidden');
    document.getElementById('modal-cancel').addEventListener('click', () => this.close());
    document.getElementById('modal-confirm').addEventListener('click', () => {
      callback(); // Llama al callback (deleteTroncal)
      this.close();
    });
  }
  // Helper to download files
  downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Close modal
  close() {
    this.modalContainer.className = 'fixed inset-0 z-50 hidden';
    this.modalContainer.innerHTML = '';
  }
}


window.Modal = Modal;

