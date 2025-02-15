import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  acceptContact,
  getContactRequests,
  getContacts,
  removeContact,
  requestContact,
} from '../controllers/contact.controller.js';
import { updateLastActive } from '../middlewares/user.middleware.js';

const contactRoutes = Router();

contactRoutes.use(authenticateToken, updateLastActive);

contactRoutes.get('/', getContacts);
contactRoutes.get('/pending', getContactRequests);

contactRoutes.post('/request', requestContact);

contactRoutes.patch('/:contactId', acceptContact);

contactRoutes.delete('/:contactId', removeContact);

export default contactRoutes;
