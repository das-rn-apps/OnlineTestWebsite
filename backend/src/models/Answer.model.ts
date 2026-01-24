import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnswer extends Document {
    attemptId: mongoose.Types.ObjectId;
    questionId: mongoose.Types.ObjectId;
    userAnswer?: string | number;
    isAttempted: boolean;
    isMarkedForReview: boolean;
    isCorrect?: boolean;
    marksAwarded?: number;
    timeSpent: number;
    answeredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>(
    {
        attemptId: {
            type: Schema.Types.ObjectId,
            ref: 'Attempt',
            required: true,
        },
        questionId: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: true,
        },
        userAnswer: {
            type: Schema.Types.Mixed,
        },
        isAttempted: {
            type: Boolean,
            default: false,
        },
        isMarkedForReview: {
            type: Boolean,
            default: false,
        },
        isCorrect: Boolean,
        marksAwarded: Number,
        timeSpent: {
            type: Number,
            default: 0,
        },
        answeredAt: Date,
    },
    {
        timestamps: true,
    }
);

// answerSchema.index({ attemptId: 1 });/
answerSchema.index({ questionId: 1 });
answerSchema.index({ attemptId: 1, questionId: 1 }, { unique: true });

const Answer: Model<IAnswer> = mongoose.model<IAnswer>('Answer', answerSchema);

export default Answer;
