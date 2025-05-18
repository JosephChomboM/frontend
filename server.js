const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

// Definir la ruta a la carpeta build (donde están los archivos React compilados)
const buildPath = path.join(__dirname, 'build');

console.log('Sirviendo archivos desde:', buildPath);

// Verificar que la carpeta build existe
if (!fs.existsSync(buildPath)) {
  console.error('ERROR: No se encontró la carpeta build. Por favor ejecute \'npm run build\' primero.');
  process.exit(1);
}

// Verificar que el archivo index.html existe
if (!fs.existsSync(path.join(buildPath, 'index.html'))) {
  console.error('ERROR: No se encontró el archivo index.html en la carpeta build.');
  process.exit(1);
}

// Servir archivos estáticos de la carpeta build
app.use(express.static(buildPath));

// Redirigir cualquier ruta al index.html (para React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`WF Scoring VI Configurator - Servidor corriendo en http://localhost:${PORT}`);
  
  // Abrir automáticamente el navegador
  const url = `http://localhost:${PORT}`;
  let command;
  
  switch (process.platform) {
    case 'win32':
      command = `start "" "${url}"`;
      break;
    case 'darwin':
      command = `open "${url}"`;
      break;
    default:
      command = `xdg-open "${url}"`;
  }
  
  exec(command, (err) => {
    if (err) {
      console.error('No se pudo abrir el navegador automáticamente:', err);
      console.log('Por favor, abra manualmente este enlace en su navegador:', url);
    }
  });
});

// Manejar cierre gracioso de la aplicación
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});
