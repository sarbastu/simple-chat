import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { updateLastActive } from '../middlewares/user.middleware.js';
import { getMessages, sendMessage } from '../controllers/message.controller.js';

const messageRoutes = Router();

messageRoutes.use(authenticateToken, updateLastActive);

messageRoutes.get('/', getMessages);

messageRoutes.post('/', sendMessage);

export default messageRoutes;
