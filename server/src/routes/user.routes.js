import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  getProfile,
  updateProfile,
  getUsers,
} from '../controllers/user.controller.js';
import { updateLastActive } from '../middlewares/user.middleware.js';
import upload from '../config/multer.js';

const userRoutes = Router();

userRoutes.use(authenticateToken, updateLastActive);

userRoutes.get('/me', getProfile);

userRoutes.patch('/me', upload.single('image'), updateProfile);

userRoutes.get('/', getUsers);

export default userRoutes;
