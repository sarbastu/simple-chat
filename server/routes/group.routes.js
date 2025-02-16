import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { updateLastActive } from '../middlewares/user.middleware.js';
import {
  addMemberToGroup,
  createGroup,
  getGroups,
  leaveGroup,
  removeMemberFromGroup,
} from '../controllers/group.controller.js';

const groupRoutes = Router();

groupRoutes.use(authenticateToken, updateLastActive);

groupRoutes.get('/', getGroups);

groupRoutes.post('/', createGroup);
groupRoutes.post('/:groupId/members/:targetUserId', addMemberToGroup);

groupRoutes.delete('/:groupId/members/:targetUserId', removeMemberFromGroup);
groupRoutes.delete('/:groupId', leaveGroup);

export default groupRoutes;
