import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  getProfile,
  getUsers,
  updateProfile,
  updateProfileImage,
} from '../controllers/user.controller.js';
import { updateLastActive } from '../middlewares/user.middleware.js';

const userRoutes = Router();

userRoutes.use(authenticateToken, updateLastActive);

userRoutes.get('/', getUsers);

userRoutes.get('/profile', getProfile);

userRoutes.post('/image', updateProfileImage);

userRoutes.patch('/profile', updateProfile);

export default userRoutes;
