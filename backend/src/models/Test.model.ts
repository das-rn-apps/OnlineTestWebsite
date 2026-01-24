import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITestConfig {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showResults: boolean;
    allowReview: boolean;
    allowResume: boolean;
    negativeMarking: boolean;
    sectionWiseTimer: boolean;
    language: ('en' | 'hi')[];
}

export interface ITest extends Document {
    examId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    type: 'full_length' | 'sectional' | 'topic_wise' | 'previous_year' | 'practice';
    duration: number;
    totalMarks: number;
    passingMarks?: number;
    instructions?: string;
    config: ITestConfig;
    isPaid: boolean;
    price?: number;
    isFree: boolean;
    scheduledStartTime?: Date;
    scheduledEndTime?: Date;
    isPublished: boolean;
    isDraft: boolean;
    tags?: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    year?: number;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const testSchema = new Schema<ITest>(
    {
        examId: {
            type: Schema.Types.ObjectId,
            ref: 'Exam',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: String,
        type: {
            type: String,
            required: true,
            enum: ['full_length', 'sectional', 'topic_wise', 'previous_year', 'practice'],
        },
        duration: {
            type: Number,
            required: true,
            min: 1,
        },
        totalMarks: {
            type: Number,
            required: true,
            min: 0,
        },
        passingMarks: Number,
        instructions: String,
        config: {
            shuffleQuestions: { type: Boolean, default: false },
            shuffleOptions: { type: Boolean, default: false },
            showResults: { type: Boolean, default: true },
            allowReview: { type: Boolean, default: true },
            allowResume: { type: Boolean, default: false },
            negativeMarking: { type: Boolean, default: true },
            sectionWiseTimer: { type: Boolean, default: false },
            language: {
                type: [String],
                enum: ['en', 'hi'],
                default: ['en'],
            },
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        price: Number,
        isFree: {
            type: Boolean,
            default: true,
        },
        scheduledStartTime: Date,
        scheduledEndTime: Date,
        isPublished: {
            type: Boolean,
            default: false,
        },
        isDraft: {
            type: Boolean,
            default: true,
        },
        tags: [String],
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium',
        },
        year: Number,
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

testSchema.index({ examId: 1 });
testSchema.index({ type: 1 });
testSchema.index({ isPublished: 1 });
testSchema.index({ isPaid: 1 });
testSchema.index({ scheduledStartTime: 1 });

const Test: Model<ITest> = mongoose.model<ITest>('Test', testSchema);

export default Test;
