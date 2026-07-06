/**
 * Express Application
 * Main application configuration and route registration
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/authRoutes.js';
import buildingRoutes from './routes/buildingRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import energyRoutes from './routes/energyRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';

// Import error handler
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/predictions', predictionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API info
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'Campus Digital Twin API',
    version: '1.0.0',
    description: 'AI-Powered Digital Twin for Smart Campus Infrastructure',
    endpoints: {
      auth: '/api/auth',
      buildings: '/api/buildings',
      sensors: '/api/sensors',
      energy: '/api/energy',
      alerts: '/api/alerts',
      predictions: '/api/predictions'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

export default app;
