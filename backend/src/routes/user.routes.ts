import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/rbac.middleware';

const router = Router();

router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.get('/:id', authenticate, isAdmin, userController.getUserById);
router.put('/:id', authenticate, isAdmin, userController.updateUser);
router.put('/:id/role', authenticate, isAdmin, userController.updateUserRole);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

export default router;
