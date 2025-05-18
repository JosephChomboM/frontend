class SegmentEditModal {
  constructor() {
    this.modalId = 'segment-edit-modal';
    this.injectModal();
    this.modal = document.getElementById(this.modalId);
  }
  
  // Inyecta el HTML del modal con el estilo actualizado
  injectModal() {
    if (document.getElementById(this.modalId)) return;
    const modalHTML = `
      <div id="${this.modalId}" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl w-full">
          <h3 id="segment-edit-modal-title" class="text-lg font-bold text-gray-900 mb-4">Editar Segmento</h3>
          <!-- Variables Numéricas -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Variables Numéricas:</label>
            <textarea 
              id="segment-edit-num" 
              rows="2"
              class="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm font-mono
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: VAR1, VAR2"
            ></textarea>
          </div>
          <!-- Variables Categóricas -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Variables Categóricas:</label>
            <textarea 
              id="segment-edit-cat" 
              rows="2"
              class="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm font-mono
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: VAR3, VAR4"
            ></textarea>
          </div>
          <!-- Drivers Numéricos -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Drivers Numéricos:</label>
            <textarea 
              id="segment-edit-dri-num" 
              rows="2"
              class="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm font-mono
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: DRIV_NUM1, DRIV_NUM2"
            ></textarea>
          </div>
          <!-- Drivers Categóricos -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Drivers Categóricos:</label>
            <textarea 
              id="segment-edit-dri-cat" 
              rows="2"
              class="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm font-mono
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: DRIV_CAT1, DRIV_CAT2"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button id="segment-edit-cancel" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800">
              Cancelar
            </button>
            <button id="segment-edit-save" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white">
              Guardar
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
  
  show(segment, onSave) {
    if (!segment || !this.modal) return;
    document.getElementById('segment-edit-modal-title').textContent = `Editar Segmento ${segment.id}`;
    document.getElementById('segment-edit-num').value = segment.variablesNum || '';
    document.getElementById('segment-edit-cat').value = segment.variablesCat || '';
    document.getElementById('segment-edit-dri-num').value = segment.driversNum || '';
    document.getElementById('segment-edit-dri-cat').value = segment.driversCat || '';
    this.modal.classList.remove('hidden');
    
    const saveBtn = document.getElementById('segment-edit-save');
    const cancelBtn = document.getElementById('segment-edit-cancel');
    
    saveBtn.onclick = () => {
      const updatedSegment = {
        id: segment.id,
        variablesNum: document.getElementById('segment-edit-num').value,
        variablesCat: document.getElementById('segment-edit-cat').value,
        driversNum: document.getElementById('segment-edit-dri-num').value,
        driversCat: document.getElementById('segment-edit-dri-cat').value,
      };
      onSave(updatedSegment);
      this.hide();
    };
    
    cancelBtn.onclick = () => {
      this.hide();
    };
  }
  
  hide() {
    if (this.modal) {
      this.modal.classList.add('hidden');
    }
  }
}

class SegmentDeleteModal {
  constructor() {
    this.modalId = 'segment-delete-modal';
    this.injectModal();
    this.modal = document.getElementById(this.modalId);
  }
  
  injectModal() {
    if (document.getElementById(this.modalId)) return;
    const modalHTML = `
      <div id="${this.modalId}" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl w-full">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Eliminar Segmento</h3>
          <p class="mb-4">¿Estás seguro de eliminar este segmento?</p>
          <div class="flex justify-end gap-3">
            <button id="segment-delete-cancel" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800">
              Cancelar
            </button>
            <button id="segment-delete-confirm" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
  
  show(onConfirm) {
    if (!this.modal) return;
    this.modal.classList.remove('hidden');
    
    const confirmBtn = document.getElementById('segment-delete-confirm');
    const cancelBtn = document.getElementById('segment-delete-cancel');
    
    confirmBtn.onclick = () => {
      onConfirm();
      this.hide();
    };
    
    cancelBtn.onclick = () => {
      this.hide();
    };
  }
  
  hide() {
    if (this.modal) {
      this.modal.classList.add('hidden');
    }
  }
}

window.SegmentEditModal = SegmentEditModal;
window.SegmentDeleteModal = SegmentDeleteModal;