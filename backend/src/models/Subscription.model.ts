import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
    userId: mongoose.Types.ObjectId;
    planType: 'free' | 'basic' | 'premium' | 'ultimate';
    planName: string;
    examAccess: mongoose.Types.ObjectId[];
    testAccess: mongoose.Types.ObjectId[];
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    amount: number;
    currency: string;
    paymentId?: string;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    couponId?: mongoose.Types.ObjectId;
    discount?: number;
    createdAt: Date;
    updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        planType: {
            type: String,
            required: true,
            enum: ['free', 'basic', 'premium', 'ultimate'],
        },
        planName: {
            type: String,
            required: true,
        },
        examAccess: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Exam',
            },
        ],
        testAccess: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Test',
            },
        ],
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        paymentId: String,
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        couponId: {
            type: Schema.Types.ObjectId,
            ref: 'Coupon',
        },
        discount: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ isActive: 1 });
subscriptionSchema.index({ endDate: 1 });

const Subscription: Model<ISubscription> = mongoose.model<ISubscription>(
    'Subscription',
    subscriptionSchema
);

export default Subscription;
