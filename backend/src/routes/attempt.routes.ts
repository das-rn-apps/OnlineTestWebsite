import { Router } from 'express';
import * as attemptController from '../controllers/attempt.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.post('/start', authenticate, attemptController.startAttempt);
router.get('/my-attempts', authenticate, attemptController.getMyAttempts);
router.get('/:id', authenticate, attemptController.getAttemptById);
router.post('/:id/answer', authenticate, attemptController.submitAnswer);
router.post('/:id/submit', authenticate, attemptController.submitAttempt);

export default router;
