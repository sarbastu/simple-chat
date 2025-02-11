import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  getProfile,
  updateProfile,
  updateProfileImage,
} from '../controllers/user.controller.js';

const userRoutes = Router();

userRoutes.get('/', authenticateToken, getProfile);
userRoutes.patch('/', authenticateToken, updateProfile);
userRoutes.post('/image', authenticateToken, updateProfileImage);

export default userRoutes;
