import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde el directorio actual
app.use(express.static(__dirname));

// Ruta para el dashboard
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Ruta para solicitud de material
app.get('/solicitud-material', (req, res) => {
  res.sendFile(join(__dirname, 'solicitud-material.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});