import express from 'express';
import { botHandler } from './index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta principal - Webhook del bot
app.post('/', async (req, res) => {
  try {
    const response = await botHandler(req);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

// Ruta de información del bot
app.get('/', (req, res) => {
  res.json({
    name: 'Ceska University Bot',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manejador 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 Webhook: http://localhost:${PORT}/`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
});
