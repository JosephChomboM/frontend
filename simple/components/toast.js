// Toast notification component
class Toast {
  constructor() {
    this.toast = null;
    this.timeout = null;
    this.init();
  }

  init() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed bottom-4 right-4 z-50';
      document.body.appendChild(toastContainer);
    }
    
    this.toastContainer = document.getElementById('toast-container');
  }

  show(message, type = 'success', duration = 3000) {
    // Clear any existing toast
    this.clear();
    
    // Create new toast element
    this.toast = document.createElement('div');
    
    // Set appropriate color based on type
    let bgColor, textColor, icon;
    switch (type) {
      case 'success':
        bgColor = 'bg-green-500';
        textColor = 'text-white';
        icon = '<i class="fas fa-check-circle mr-2"></i>';
        break;
      case 'error':
        bgColor = 'bg-red-500';
        textColor = 'text-white';
        icon = '<i class="fas fa-exclamation-circle mr-2"></i>';
        break;
      case 'info':
        bgColor = 'bg-blue-500';
        textColor = 'text-white';
        icon = '<i class="fas fa-info-circle mr-2"></i>';
        break;
      case 'warning':
        bgColor = 'bg-yellow-500';
        textColor = 'text-white';
        icon = '<i class="fas fa-exclamation-triangle mr-2"></i>';
        break;
      default:
        bgColor = 'bg-gray-700';
        textColor = 'text-white';
        icon = '<i class="fas fa-bell mr-2"></i>';
    }
    
    // Set toast content and styles
    this.toast.className = `${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg flex items-center transition-opacity duration-500 opacity-0`;
    this.toast.innerHTML = `
      ${icon}
      <span>${message}</span>
      <button class="ml-auto text-white opacity-70 hover:opacity-100 focus:outline-none">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add to container
    this.toastContainer.appendChild(this.toast);
    
    // Add event listener to close button
    const closeButton = this.toast.querySelector('button');
    closeButton.addEventListener('click', () => this.clear());
    
    // Trigger animation to fade in
    setTimeout(() => {
      this.toast.classList.remove('opacity-0');
      this.toast.classList.add('opacity-100');
    }, 10);
    
    // Set timeout to auto-dismiss
    this.timeout = setTimeout(() => this.clear(), duration);
  }

  clear() {
    // Clear any existing timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    
    // Remove toast if it exists
    if (this.toast) {
      // Add fade out animation
      this.toast.classList.remove('opacity-100');
      this.toast.classList.add('opacity-0');
      
      // Remove after animation completes
      setTimeout(() => {
        if (this.toast && this.toast.parentNode) {
          this.toast.parentNode.removeChild(this.toast);
        }
        this.toast = null;
      }, 500); // Match the duration of the CSS transition
    }
  }
}
