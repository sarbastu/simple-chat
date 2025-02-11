import { Router } from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';

const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.delete('/logout', logout);

export default authRoutes;
