import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  getProfile,
  updateProfile,
  updateProfileImage,
  getUsers,
} from '../controllers/user.controller.js';
import { updateLastActive } from '../middlewares/user.middleware.js';

const userRoutes = Router();

userRoutes.use(authenticateToken, updateLastActive);

userRoutes.get('/me', getProfile);

userRoutes.patch('/me', updateProfile);

userRoutes.patch('/me/image', updateProfileImage);

userRoutes.get('/', getUsers);

export default userRoutes;
