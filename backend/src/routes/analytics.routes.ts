import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = Router();

router.use(authenticate);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/performance', analyticsController.getPerformanceStats);

export default router;
