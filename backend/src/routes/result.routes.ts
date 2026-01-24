import { Router } from 'express';
import * as resultController from '../controllers/result.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.get('/my-results', authenticate, resultController.getMyResults);
router.get('/:attemptId', authenticate, resultController.getResultByAttemptId);
router.get('/:attemptId/detailed', authenticate, resultController.getDetailedResult);
router.get('/:attemptId/comparison', authenticate, resultController.getComparison);

export default router;
