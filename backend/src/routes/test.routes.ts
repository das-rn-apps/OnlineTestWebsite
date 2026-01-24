import { Router } from 'express';
import * as testController from '../controllers/test.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/rbac.middleware';

const router = Router();

// Public routes
router.get('/', optionalAuth, testController.getAllTests);
router.get('/:id', optionalAuth, testController.getTestById);

// Private routes
router.get('/:id/full', authenticate, testController.getFullTest);

// Admin routes
router.post('/', authenticate, isAdmin, testController.createTest);
router.put('/:id', authenticate, isAdmin, testController.updateTest);
router.put('/:id/publish', authenticate, isAdmin, testController.publishTest);
router.delete('/:id', authenticate, isAdmin, testController.deleteTest);

export default router;
