import { Router } from 'express';
import * as examController from '../controllers/exam.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import { isAdmin, isSuperAdmin } from '../middleware/rbac.middleware';

const router = Router();

// Public routes
router.get('/', optionalAuth, examController.getAllExams);
router.get('/:id', optionalAuth, examController.getExamById);

// Admin routes
router.post('/', authenticate, isAdmin, examController.createExam);
router.put('/:id', authenticate, isAdmin, examController.updateExam);
router.delete('/:id', authenticate, isSuperAdmin, examController.deleteExam);

export default router;
