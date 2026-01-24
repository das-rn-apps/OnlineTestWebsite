import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxDiscount?: number;
    validFrom: Date;
    validUntil: Date;
    isActive: boolean;
    maxUsage?: number;
    usageCount: number;
    maxUsagePerUser?: number;
    applicableExams?: mongoose.Types.ObjectId[];
    applicablePlans?: string[];
    minPurchaseAmount?: number;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        discountType: {
            type: String,
            required: true,
            enum: ['percentage', 'fixed'],
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        maxDiscount: {
            type: Number,
            min: 0,
        },
        validFrom: {
            type: Date,
            required: true,
        },
        validUntil: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        maxUsage: {
            type: Number,
            min: 0,
        },
        usageCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        maxUsagePerUser: {
            type: Number,
            min: 0,
        },
        applicableExams: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Exam',
            },
        ],
        applicablePlans: [String],
        minPurchaseAmount: {
            type: Number,
            min: 0,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validUntil: 1 });

const Coupon: Model<ICoupon> = mongoose.model<ICoupon>('Coupon', couponSchema);

export default Coupon;
