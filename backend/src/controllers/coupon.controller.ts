import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError, ApiResponse } from '../utils/ApiResponse';
import Coupon from '../models/Coupon.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { getPaginationParams, getPaginationMeta, getSkipLimit } from '../utils/pagination';

class CouponController {
    /**
     * Create a new coupon (Admin only)
     */
    createCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { code } = req.body;

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            throw ApiError.badRequest('Coupon code already exists');
        }

        const coupon = await Coupon.create({
            ...req.body,
            createdBy: req.user?.userId,
        });

        res.status(201).json(ApiResponse.success('Coupon created successfully', coupon));
    });

    /**
     * Get all coupons (Admin only)
     */
    getAllCoupons = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { page, limit, sort, order } = getPaginationParams(req.query);
        const { skip, limit: limitValue } = getSkipLimit(page, limit);

        const [coupons, total] = await Promise.all([
            Coupon.find()
                .sort({ [sort]: order === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limitValue)
                .populate('createdBy', 'name email'),
            Coupon.countDocuments(),
        ]);

        res.json(
            ApiResponse.success(
                'Coupons fetched successfully',
                coupons,
                getPaginationMeta(page, limit, total)
            )
        );
    });

    /**
     * Check/Validate Coupon
     */
    validateCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { code, amount } = req.body; // amount is the purchase amount to check minPurchase

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!coupon) {
            throw ApiError.notFound('Invalid or expired coupon');
        }

        const now = new Date();
        if (now < coupon.validFrom || now > coupon.validUntil) {
            throw ApiError.badRequest('Coupon is expired');
        }

        if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
            throw ApiError.badRequest('Coupon usage limit exceeded');
        }

        if (amount && coupon.minPurchaseAmount && amount < coupon.minPurchaseAmount) {
            throw ApiError.badRequest(`Minimum purchase amount of ${coupon.minPurchaseAmount} required`);
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (amount * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed amount
        if (discount > amount) {
            discount = amount;
        }

        res.json(ApiResponse.success(
            'Coupon is valid',
            {
                coupon: {
                    code: coupon.code,
                    description: coupon.description,
                    discount,
                    discountType: coupon.discountType,
                    discountValue: coupon.discountValue
                },
                isValid: true
            }
        ));
    });

    /**
     * Update Coupon (Admin only)
     */
    updateCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });

        if (!coupon) {
            throw ApiError.notFound('Coupon not found');
        }

        res.json(ApiResponse.success('Coupon updated successfully', coupon));
    });

    /**
     * Delete Coupon (Admin only)
     */
    deleteCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            throw ApiError.notFound('Coupon not found');
        }

        res.json(ApiResponse.success('Coupon deleted successfully'));
    });
}

export default new CouponController();
