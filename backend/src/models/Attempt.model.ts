import mongoose, { Schema, Document, Model } from 'mongoose';

interface IAttemptConfig {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    language: 'en' | 'hi';
}

export interface IAttempt extends Document {
    userId: mongoose.Types.ObjectId;
    testId: mongoose.Types.ObjectId;
    startTime: Date;
    endTime?: Date;
    submittedAt?: Date;
    timeSpent: number;
    status: 'in_progress' | 'submitted' | 'auto_submitted' | 'abandoned';
    config: IAttemptConfig;
    questionOrder: mongoose.Types.ObjectId[];
    sectionTimings?: Array<{
        sectionId: mongoose.Types.ObjectId;
        timeSpent: number;
    }>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
}

const attemptSchema = new Schema<IAttempt>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        testId: {
            type: Schema.Types.ObjectId,
            ref: 'Test',
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endTime: Date,
        submittedAt: Date,
        timeSpent: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            required: true,
            enum: ['in_progress', 'submitted', 'auto_submitted', 'abandoned'],
            default: 'in_progress',
        },
        config: {
            shuffleQuestions: { type: Boolean, default: false },
            shuffleOptions: { type: Boolean, default: false },
            language: {
                type: String,
                enum: ['en', 'hi'],
                default: 'en',
            },
        },
        questionOrder: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Question',
            },
        ],
        sectionTimings: [
            {
                sectionId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Section',
                },
                timeSpent: Number,
            },
        ],
        ipAddress: String,
        userAgent: String,
    },
    {
        timestamps: true,
    }
);

attemptSchema.index({ userId: 1, testId: 1 });
attemptSchema.index({ status: 1 });
attemptSchema.index({ startTime: 1 });

const Attempt: Model<IAttempt> = mongoose.model<IAttempt>('Attempt', attemptSchema);

export default Attempt;
