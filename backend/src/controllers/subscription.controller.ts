import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError, ApiResponse } from '../utils/ApiResponse';
import Subscription from '../models/Subscription.model';
import Coupon from '../models/Coupon.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { getPaginationParams, getPaginationMeta, getSkipLimit } from '../utils/pagination';

class SubscriptionController {
    /**
     * Create Subscription (Initiate Purchase)
     */
    createSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { planType, durationDays = 30, couponCode } = req.body;
        const userId = req.user?.userId;

        // Base prices (Mock)
        const prices: Record<string, number> = {
            basic: 499,
            premium: 999,
            ultimate: 1499
        };

        if (!Object.prototype.hasOwnProperty.call(prices, planType)) {
            throw ApiError.badRequest('Invalid plan type');
        }

        let amount = prices[planType];
        let discount = 0;
        let couponId = null;

        // Apply Coupon
        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true
            });

            // Re-validate coupon logic (simplified)
            if (coupon) {
                const now = new Date();
                if (now >= coupon.validFrom && now <= coupon.validUntil) {
                    if (!coupon.maxUsage || coupon.usageCount < coupon.maxUsage) {
                        if (coupon.discountType === 'percentage') {
                            discount = (amount * coupon.discountValue) / 100;
                            if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
                        } else {
                            discount = coupon.discountValue;
                        }
                        if (discount > amount) discount = amount;
                        couponId = coupon._id;
                    }
                }
            }
        }

        const finalAmount = amount - discount;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + durationDays);

        const subscription = await Subscription.create({
            userId,
            planType,
            planName: `${planType.toUpperCase()} Monthly Plan`,
            amount: finalAmount,
            originalAmount: amount, // Assuming we add this field or just use amount as paid amount
            discount,
            couponId,
            startDate,
            endDate,
            isActive: false, // Pending payment
            paymentStatus: 'pending'
        });

        res.status(201).json(ApiResponse.success('Subscription created, proceed to payment', subscription));
    });

    /**
     * Verify Payment (Mock)
     */
    verifyPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { subscriptionId, paymentId, status } = req.body;

        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            throw ApiError.notFound('Subscription not found');
        }

        if (status === 'success') {
            subscription.paymentStatus = 'completed';
            subscription.paymentId = paymentId;
            subscription.isActive = true;
            await subscription.save();

            // Increment coupon usage
            if (subscription.couponId) {
                await Coupon.findByIdAndUpdate(subscription.couponId, { $inc: { usageCount: 1 } });
            }
        } else {
            subscription.paymentStatus = 'failed';
            await subscription.save();
        }

        res.json(ApiResponse.success('Payment status updated', subscription));
    });

    /**
     * Get My Subscriptions
     */
    getMySubscriptions = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user?.userId;
        const subscriptions = await Subscription.find({ userId }).sort({ createdAt: -1 });
        res.json(ApiResponse.success('Subscriptions fetched successfully', subscriptions));
    });

    /**
     * Get All Subscriptions (Admin)
     */
    getAllSubscriptions = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { page, limit, sort, order } = getPaginationParams(req.query);
        const { skip, limit: limitValue } = getSkipLimit(page, limit);

        const [subscriptions, total] = await Promise.all([
            Subscription.find()
                .sort({ [sort]: order === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limitValue)
                .populate('userId', 'name email'),
            Subscription.countDocuments(),
        ]);

        res.json(
            ApiResponse.success(
                'Subscriptions fetched successfully',
                subscriptions,
                getPaginationMeta(page, limit, total)
            )
        );
    });
}

export default new SubscriptionController();
