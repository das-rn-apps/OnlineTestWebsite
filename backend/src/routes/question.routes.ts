import { Router } from 'express';
import * as questionController from '../controllers/question.controller';
import { authenticate } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/rbac.middleware';

const router = Router();

router.post('/', authenticate, isAdmin, questionController.createQuestion);
router.get('/', authenticate, isAdmin, questionController.getQuestions);
router.post('/bulk', authenticate, isAdmin, questionController.bulkCreateQuestions);
router.get('/section/:sectionId', authenticate, questionController.getQuestionsBySectionId);
router.get('/:id', authenticate, questionController.getQuestionById);
router.put('/:id', authenticate, isAdmin, questionController.updateQuestion);
router.delete('/:id', authenticate, isAdmin, questionController.deleteQuestion);

export default router;
