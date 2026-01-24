import { Router } from 'express';
import couponController from '../controllers/coupon.controller';
import { authenticate } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/rbac.middleware';

const router: Router = Router();

router.use(authenticate);

// Public/Student routes
router.post('/validate', couponController.validateCoupon);

// Admin routes
router.use(isAdmin);
router.post('/', couponController.createCoupon);
router.get('/', couponController.getAllCoupons);
router.patch('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);

export default router;
