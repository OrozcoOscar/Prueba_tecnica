import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  createUserHandler,
  listUsersHandler,
  updateRoleHandler,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.use(authenticate, requireRole([Role.ADMIN]));

router.get('/', listUsersHandler);
router.post('/', createUserHandler);
router.patch('/:id/role', updateRoleHandler);

export default router;
