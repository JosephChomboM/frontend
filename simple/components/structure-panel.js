class StructurePanel {
  /**
   * @param {HTMLElement} parentElement - Contenedor donde se renderiza el panel.
   * @param {Object} state - Objeto con la información:
   *    { troncales: Array, activeTab: String }
   */
  constructor(parentElement, state) {
    this.parentElement = parentElement;
    // El estado se inyecta desde App (por ejemplo, app.state)
    this.state = state;
    this.render();
  }

  render() {
    // Renderiza la estructura base del panel
    this.parentElement.innerHTML = `
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 class="text-lg font-medium text-white flex items-center">
            <i class="fas fa-sitemap mr-3"></i> Estructura
          </h2>
        </div>
        <div class="sidebar-panel p-4">
          <div id="structure-tree">
            <div class="text-center py-8 text-gray-500">
              <i class="fas fa-diagram-project text-4xl mb-2 opacity-30"></i>
              <p>No hay troncales configuradas aún.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    // Renderiza la lista de troncales/segmentos
    this.updateStructureTree();
  }

  updateStructureTree() {
    const container = this.parentElement.querySelector('#structure-tree');
    if (!this.state.troncales || this.state.troncales.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <i class="fas fa-diagram-project text-4xl mb-2 opacity-30"></i>
          <p>No hay troncales configuradas aún.</p>
        </div>
      `;
      return;
    }
    let html = "";
    // Recorre cada troncal
    this.state.troncales.forEach(troncal => {
      const troncalTabId = `troncal-${troncal.id}`;
      // Se aplica una clase si es el tab activo
      const activeClass = (this.state.activeTab === troncalTabId) 
        ? 'bg-blue-50 border-l-4 border-blue-500' 
        : '';
      html += `
        <div class="mb-2">
          <div onclick="StructurePanel.handleSwitchTab('${troncalTabId}')" 
               class="flex items-center p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors ${activeClass}">
            <i class="fas fa-project-diagram text-blue-600 mr-3"></i>
            <span class="font-medium">Troncal ${troncal.id}</span>
          </div>
      `;
      // Si existen 2 o más segmentos, se renderizan sus subitems
      if (troncal.segmentos && troncal.segmentos.length >= 2) {
        html += `<div class="pl-8">`;
        troncal.segmentos.forEach(seg => {
          const segTabId = `segmento-${troncal.id}-${seg.id}`;
          const activeSegClass = (this.state.activeTab === segTabId)
            ? 'bg-indigo-50 border-l-2 border-indigo-500'
            : '';
          html += `
            <div onclick="StructurePanel.handleSwitchTab('${segTabId}')"
                 class="flex items-center p-2 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors ${activeSegClass}">
              <i class="fas fa-layer-group text-indigo-500 mr-2"></i>
              <span class="text-sm">Segmento ${seg.id}</span>
            </div>
          `;
        });
        html += `</div>`;
      }
      html += `</div>`;
    });
    container.innerHTML = html;
  }

  // Método estático para manejar el clic y disparar un evento global de cambio de tab
  static handleSwitchTab(tabId) {
    // Se actualiza el estado a nivel de aplicación a través de un evento
    const event = new CustomEvent('switchTab', { detail: { tabId } });
    document.dispatchEvent(event);
  }
}

window.StructurePanel = StructurePanel;