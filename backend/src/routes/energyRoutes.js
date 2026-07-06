/**
 * Energy Routes
 * Handles energy consumption endpoints
 */

import express from 'express';
import { 
  getEnergyLogs, 
  getEnergySummary,
  getEnergyByBuilding,
  createEnergyLog,
  getRealTimeEnergy,
  getEnergyOptimization,
  getEnergyTrends
} from '../controllers/energyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Read routes
router.get('/summary', getEnergySummary);
router.get('/realtime', getRealTimeEnergy);
router.get('/optimization', getEnergyOptimization);
router.get('/trends', getEnergyTrends);
router.get('/building/:buildingId', getEnergyByBuilding);
router.get('/', getEnergyLogs);

// Write routes (admin, energy manager)
router.post('/', authorize('admin', 'energy_manager'), createEnergyLog);

export default router;
