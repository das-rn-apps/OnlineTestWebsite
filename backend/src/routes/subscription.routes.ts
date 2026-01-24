import { Router } from 'express';
import subscriptionController from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/rbac.middleware';

const router: Router = Router();

router.use(authenticate);

// Student routes
router.post('/', subscriptionController.createSubscription);
router.post('/verify', subscriptionController.verifyPayment);
router.get('/my', subscriptionController.getMySubscriptions);

// Admin routes
router.get('/', isAdmin, subscriptionController.getAllSubscriptions);

export default router;
