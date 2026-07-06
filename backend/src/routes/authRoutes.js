/**
 * Auth Routes
 * Handles authentication endpoints
 */

import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  updateProfile, 
  updatePassword,
  getUsers,
  deleteUser 
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(protect);

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

// Admin routes
router.get('/users', authorize('admin'), getUsers);
router.delete('/users/:id', authorize('admin'), deleteUser);

export default router;
