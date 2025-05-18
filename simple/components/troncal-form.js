class TroncalForm {
  /**
   * @param {HTMLElement} parentElement - Contenedor donde se renderiza el formulario.
   * @param {Object} troncal - Objeto con los datos de la troncal.
   * @param {Object} options - Callbacks: onFieldChange, onDelete, onEditSegment, onDeleteSegment
   */
  constructor(parentElement, troncal, options = {}) {
    // Se asume que se le pasa el contenedor "detail-container" y no el "troncal-detail"
    this.parentElement = parentElement;
    this.troncal = troncal;
    this.onFieldChange = options.onFieldChange || function() {};
    this.onDelete = options.onDelete || function() {};
    this.onEditSegment = options.onEditSegment || function() {};
    this.onDeleteSegment = options.onDeleteSegment || function() {};
    this.render();
  }

  render() {
    // Vaciar el contenedor padre para reemplazar el contenido existente
    this.parentElement.innerHTML = "";

    // Crear el contenedor "main-content"
    const container = document.createElement("div");
    container.id = "main-content";
    container.className = "bg-white rounded-xl shadow-md p-6";
    this.parentElement.appendChild(container);

    // Crear el contenedor "troncal-detail" dentro de "main-content"
    const detail = document.createElement("div");
    detail.id = "troncal-detail";
    container.appendChild(detail);

    if (!this.troncal) {
      detail.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <i class="fas fa-info-circle text-4xl mb-2 opacity-30"></i>
          <p>Seleccione o agregue una Troncal para configurarla.</p>
        </div>
      `;
    } else {
      const id = this.troncal.id;
      this.updateAllUniverse();
      detail.innerHTML = `
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">Troncal ${id}</h3>
          <button id="delete-troncal-${id}" class="text-red-500 hover:text-red-700 flex items-center">
            <i class="fas fa-trash-alt mr-1"></i> Eliminar
          </button>
        </div>
        <!-- Formulario de campos principales -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          ${this.renderInputField("Identificador", "cod", this.troncal.cod)}
          ${this.renderInputField("Flag_Troncal", "flag", this.troncal.flag, "Ej: f_troncal1")}
          ${this.renderInputField("Target", "target", this.troncal.target)}
          ${this.renderInputField("PD", "pd", this.troncal.pd)}
          ${this.renderInputField("XB", "xb", this.troncal.xb)}
          ${this.renderInputField("Variable Monto", "monto", this.troncal.monto)}
          ${this.renderInputField("Variable Tiempo", "byvar", this.troncal.byvar)}
          ${this.renderInputField("Train Min Mes", "trainMinMes", this.troncal.trainMinMes)}
          ${this.renderInputField("Train Max Mes", "trainMaxMes", this.troncal.trainMaxMes)}
          ${this.renderInputField("Default Cerrado", "defCld", this.troncal.defCld)}
          ${this.renderInputField("OOT Min Mes", "ootMinMes", this.troncal.ootMinMes)}
          ${this.renderInputField("OOT Max Mes", "ootMaxMes", this.troncal.ootMaxMes)}
        </div>
        <!-- All Universe -->
        <div class="border-t pt-4 mb-6">
          <h4 class="text-lg font-medium mb-3">All Universe</h4>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            ${this.renderTextAreaField("Variables Numéricas", "universeNum", this.troncal.universeNum, "Ej: VAR1, VAR2")}
            ${this.renderTextAreaField("Variables Categóricas", "universeCat", this.troncal.universeCat, "Ej: VAR3, VAR4")}
            ${this.renderTextAreaField("Drivers Numéricos", "universeDriNum", this.troncal.universeDriNum, "Ej: DRIV_NUM1, DRIV_NUM2")}
            ${this.renderTextAreaField("Drivers Categóricos", "universeDriCat", this.troncal.universeDriCat, "Ej: DRIV_CAT1, DRIV_CAT2")}
          </div>
        </div>
        <!-- Segmentos -->
        <div id="segments-container-${id}">
          ${this.renderSegments()}
        </div>
      `;
    }
    if (this.troncal) {
      this.setupInputListeners();
      this.setupDeleteListener(this.troncal.id);
    }
  }
  
  updateAllUniverse() {
    if (this.troncal.segmentos && this.troncal.segmentos.length >= 2) {
      const parseValues = (str) =>
        str.split(/[\s,]+/).map(item => item.trim()).filter(item => item !== "");
      const computedNum = new Set(), computedCat = new Set(), computedDriNum = new Set(), computedDriCat = new Set();
      this.troncal.segmentos.forEach(seg => {
        parseValues(seg.variablesNum || '').forEach(val => computedNum.add(val));
        parseValues(seg.variablesCat || '').forEach(val => computedCat.add(val));
        parseValues(seg.driversNum || '').forEach(val => computedDriNum.add(val));
        parseValues(seg.driversCat || '').forEach(val => computedDriCat.add(val));
      });
      const unionValues = (computedStr, currentStr) => {
        const computedSet = new Set(parseValues(computedStr));
        const currentSet = new Set(parseValues(currentStr));
        return Array.from(new Set([...computedSet, ...currentSet])).join(" ");
      };
      this.troncal.universeNum = unionValues(Array.from(computedNum).join(" "), this.troncal.universeNum || "");
      this.troncal.universeCat = unionValues(Array.from(computedCat).join(" "), this.troncal.universeCat || "");
      this.troncal.universeDriNum = unionValues(Array.from(computedDriNum).join(" "), this.troncal.universeDriNum || "");
      this.troncal.universeDriCat = unionValues(Array.from(computedDriCat).join(" "), this.troncal.universeDriCat || "");
    }
  }
  
  renderInputField(label, field, value, placeholder="") {
    const type = field === "numSegs" ? "number" : "text";
    const extra = field === "numSegs" ? 'min="1"' : '';
    return `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">${label}:</label>
        <input type="${type}" value="${value || ''}" data-field="${field}" placeholder="${placeholder}"
          class="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" ${extra}/>
      </div>
    `;
  }

  renderTextAreaField(label, field, value, placeholder="") {
    return `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">${label}:</label>
        <textarea rows="7" data-field="${field}" placeholder="${placeholder}"
          class="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">${value || ''}</textarea>
      </div>
    `;
  }
  
  renderSegments() {
    const id = this.troncal.id;
    const toggleHTML = `
      <label class="inline-flex items-center cursor-pointer mb-4">
        <input type="checkbox" class="sr-only" id="toggle-segments-${id}" ${this.troncal.segmentos.length >= 2 ? 'checked' : ''} />
        <div class="w-11 h-6 rounded-full relative transition-colors duration-300 ${this.troncal.segmentos.length >= 2 ? 'bg-blue-600' : 'bg-gray-200'}">
          <span class="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-transform duration-300 ${this.troncal.segmentos.length >= 2 ? 'translate-x-5' : ''}"></span>
        </div>
        <span class="ml-3 text-sm font-medium text-gray-700">Activar Segmentos</span>
      </label>
    `;
    const segmentsHTML = `
      <div id="segment-options-${id}" class="${this.troncal.segmentos.length < 2 ? 'hidden' : ''}">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          ${this.renderInputField('Variable Segmentadora', 'varSegmentadora', this.troncal.varSegmentadora)}
          ${this.renderInputField('Nº de Segs', 'numSegs', (this.troncal.segmentos.length >= 2 ? this.troncal.segmentos.length : 2))}
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left font-medium text-gray-600">Segmento</th>
                <th class="px-4 py-2 text-left font-medium text-gray-600">Vars Num</th>
                <th class="px-4 py-2 text-left font-medium text-gray-600">Vars Cat</th>
                <th class="px-4 py-2 text-left font-medium text-gray-600">Driv Num</th>
                <th class="px-4 py-2 text-left font-medium text-gray-600">Driv Cat</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody id="segments-table-body-${id}">
              ${this.renderSegmentsTable()}
            </tbody>
          </table>
        </div>
      </div>
    `;
    return `
      <div class="mt-6 border-t pt-4">
        ${toggleHTML}
        ${segmentsHTML}
      </div>
    `;
  }

  renderSegmentsTable() {
    const id = this.troncal.id;
    if (this.troncal.segmentos.length < 2) {
      return `
        <tr>
          <td colspan="6" class="text-center py-2 text-gray-500">Debe tener al menos 2 segmentos.</td>
        </tr>
      `;
    }
    return this.troncal.segmentos.map(seg => `
      <tr class="border-b border-gray-200">
        <td class="px-4 py-2 font-medium text-gray-700 break-words max-w-[100px] overflow-hidden truncate">Segmento ${seg.id}</td>
        <td class="px-4 py-2 text-gray-600 break-words max-w-[100px] overflow-hidden truncate">${seg.variablesNum || '-'}</td>
        <td class="px-4 py-2 text-gray-600 break-words max-w-[100px] overflow-hidden truncate">${seg.variablesCat || '-'}</td>
        <td class="px-4 py-2 text-gray-600 break-words max-w-[100px] overflow-hidden truncate">${seg.driversNum || '-'}</td>
        <td class="px-4 py-2 text-gray-600 break-words max-w-[100px] overflow-hidden truncate">${seg.driversCat || '-'}</td>
        <td class="px-4 py-2">
          <button class="edit-segment btn text-blue-500 hover:text-blue-700 text-sm mr-2" data-seg-id="${seg.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-segment btn text-red-500 hover:text-red-700 text-sm" data-seg-id="${seg.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }
  
  setupInputListeners() {
    const inputs = this.parentElement.querySelectorAll('input[data-field], textarea[data-field]');
    inputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const field = e.target.getAttribute('data-field'),
              value = e.target.value;
        if (field === 'numSegs') {
          let desiredNum = parseInt(value);
          if (!isNaN(desiredNum) && desiredNum > 0) {
            let current = this.troncal.segmentos || [];
            if (current.length < desiredNum) {
              for (let i = current.length + 1; i <= desiredNum; i++) {
                current.push({ id: i, variablesNum: "", variablesCat: "", driversNum: "", driversCat: "" });
              }
            } else if (current.length > desiredNum) {
              current.splice(desiredNum);
            }
            this.troncal.segmentos = current;
          }
        } else {
          this.troncal[field] = value;
          this.onFieldChange(field, value);
        }
        this.render();
      });
    });
  
    const toggleSegmentsCheckbox = this.parentElement.querySelector(`#toggle-segments-${this.troncal.id}`);
    if (toggleSegmentsCheckbox) {
      toggleSegmentsCheckbox.addEventListener('change', (e) => {
        const isActive = e.target.checked,
              segOptions = this.parentElement.querySelector(`#segment-options-${this.troncal.id}`);
        if (isActive) {
          segOptions.classList.remove('hidden');
          if (!this.troncal.segmentos || this.troncal.segmentos.length < 2) {
            this.troncal.segmentos = [
              { id: 1, variablesNum: "", variablesCat: "", driversNum: "", driversCat: "" },
              { id: 2, variablesNum: "", variablesCat: "", driversNum: "", driversCat: "" }
            ];
          }
        } else {
          segOptions.classList.add('hidden');
          this.troncal.segmentos = [];
          this.troncal.varSegmentadora = "";
        }
        this.render();
      });
    }
  
    const editBtns = this.parentElement.querySelectorAll('.edit-segment');
    editBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const segId = parseInt(e.currentTarget.getAttribute('data-seg-id')),
              segment = this.troncal.segmentos.find(s => s.id === segId);
        if (segment) {
          const editModal = new SegmentEditModal();
          editModal.show(segment, (updatedSegment) => {
            const index = this.troncal.segmentos.findIndex(s => s.id === segId);
            if (index !== -1) {
              this.troncal.segmentos[index] = updatedSegment;
              this.onEditSegment(this.troncal.id, segId);
              this.render();
            }
          });
        }
      });
    });
  
    const deleteBtns = this.parentElement.querySelectorAll('.delete-segment');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const segId = parseInt(e.currentTarget.getAttribute('data-seg-id'));
        const deleteModal = new SegmentDeleteModal();
        deleteModal.show(() => {
          this.troncal.segmentos = this.troncal.segmentos.filter(s => s.id !== segId);
          this.onDeleteSegment(this.troncal.id, segId);
          this.render();
        });
      });
    });
  }
  
  setupDeleteListener(id) {
    const delBtn = document.getElementById(`delete-troncal-${id}`);
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        console.log("Botón eliminar clickeado");
        window.modal.showTroncalDeleteModal(id, () => {
          window.app.deleteTroncal(id);
        });
      });
    }
  }
}

window.TroncalForm = TroncalForm;