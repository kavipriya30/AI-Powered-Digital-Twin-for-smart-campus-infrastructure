/**
 * Alert Routes
 * Handles alert endpoints
 */

import express from 'express';
import { 
  getAlerts, 
  getAlert, 
  createAlert, 
  updateAlert, 
  deleteAlert,
  acknowledgeAlert,
  resolveAlert,
  getAlertStats,
  getActiveAlerts,
  markAsRead
} from '../controllers/alertController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Read routes
router.get('/stats', getAlertStats);
router.get('/active', getActiveAlerts);
router.get('/:id', getAlert);
router.get('/', getAlerts);

// Write routes
router.post('/', createAlert);
router.put('/:id/read', markAsRead);
router.put('/:id/acknowledge', acknowledgeAlert);
router.put('/:id/resolve', resolveAlert);
router.put('/:id', updateAlert);

// Admin routes
router.delete('/:id', authorize('admin'), deleteAlert);

export default router;
