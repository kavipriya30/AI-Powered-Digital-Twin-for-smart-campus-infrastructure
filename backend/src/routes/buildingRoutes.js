/**
 * Building Routes
 * Handles building endpoints
 */

import express from 'express';
import { 
  getBuildings, 
  getBuilding, 
  createBuilding, 
  updateBuilding, 
  deleteBuilding,
  getCampusOverview,
  updateBuildingHealth,
  getBuildingModel
} from '../controllers/buildingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Public read routes (for authenticated users)
router.get('/overview', getCampusOverview);
router.get('/:id/model', getBuildingModel);
router.get('/:id', getBuilding);
router.get('/', getBuildings);

// Admin only routes
router.post('/', authorize('admin', 'maintenance'), createBuilding);
router.put('/:id', authorize('admin', 'maintenance'), updateBuilding);
router.put('/:id/health', authorize('admin', 'maintenance', 'energy_manager'), updateBuildingHealth);
router.delete('/:id', authorize('admin'), deleteBuilding);

export default router;
