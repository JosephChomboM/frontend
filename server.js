const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos de la carpeta build
app.use(express.static(path.join(__dirname, 'build')));

// Redirigir cualquier ruta al index.html (para React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
