/**
 * Prediction Routes
 * Handles AI/ML prediction endpoints
 */

import express from 'express';
import { 
  getPredictions, 
  getPrediction, 
  getPredictionStats,
  getMaintenancePredictions,
  getEnergyPredictions,
  getAnomalyPredictions,
  generatePrediction,
  updatePredictionStatus,
  getCampusRiskAssessment
} from '../controllers/predictionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Read routes
router.get('/stats', getPredictionStats);
router.get('/maintenance', getMaintenancePredictions);
router.get('/energy', getEnergyPredictions);
router.get('/anomalies', getAnomalyPredictions);
router.get('/risk-assessment', getCampusRiskAssessment);
router.get('/:id', getPrediction);
router.get('/', getPredictions);

// Write routes
router.post('/generate', authorize('admin', 'maintenance', 'energy_manager'), generatePrediction);
router.put('/:id/status', authorize('admin', 'maintenance', 'energy_manager'), updatePredictionStatus);

export default router;
