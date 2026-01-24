import { Router } from 'express';
import * as sectionController from '../controllers/section.controller';
import { authenticate } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/rbac.middleware';

const router = Router();

router.post('/', authenticate, isAdmin, sectionController.createSection);
router.get('/test/:testId', authenticate, sectionController.getSectionsByTestId);
router.put('/:id', authenticate, isAdmin, sectionController.updateSection);
router.delete('/:id', authenticate, isAdmin, sectionController.deleteSection);

export default router;
