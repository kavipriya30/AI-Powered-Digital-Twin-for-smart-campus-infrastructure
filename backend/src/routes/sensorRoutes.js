/**
 * Sensor Routes
 * Handles sensor endpoints
 */

import express from 'express';
import { 
  getSensors, 
  getSensor, 
  createSensor, 
  updateSensor, 
  deleteSensor,
  updateReading,
  getSensorHistory,
  getSensorTypes,
  getSensorsByBuilding
} from '../controllers/sensorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Read routes
router.get('/types', getSensorTypes);
router.get('/building/:buildingId', getSensorsByBuilding);
router.get('/:id/history', getSensorHistory);
router.get('/:id', getSensor);
router.get('/', getSensors);

// Admin routes
router.post('/', authorize('admin', 'maintenance'), createSensor);
router.put('/:id', authorize('admin', 'maintenance'), updateSensor);
router.put('/:id/readings', updateReading);
router.delete('/:id', authorize('admin'), deleteSensor);

export default router;
