import { Router } from 'express';
import {
  getUserInfo,
  login,
  signup,
  updateProfile,
  updateProfileImage,
} from '../controllers/AuthController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.post('/update-profile', verifyToken, updateProfile);
authRoutes.post('/upload-profile-image', verifyToken, updateProfileImage);

export default authRoutes;
