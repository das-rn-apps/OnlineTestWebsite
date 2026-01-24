import mongoose, { Schema, Document, Model } from 'mongoose';

interface ISectionAnalysis {
    sectionId: mongoose.Types.ObjectId;
    sectionName: string;
    score: number;
    totalMarks: number;
    accuracy: number;
    attempted: number;
    correct: number;
    incorrect: number;
}

interface ISubjectAnalysis {
    subject: string;
    score: number;
    totalMarks: number;
    accuracy: number;
    attempted: number;
    correct: number;
    incorrect: number;
}

interface ITopicAnalysis {
    topic: string;
    score: number;
    totalMarks: number;
    accuracy: number;
    attempted: number;
    correct: number;
    incorrect: number;
}

export interface IResult extends Document {
    attemptId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    testId: mongoose.Types.ObjectId;
    totalScore: number;
    totalMarks: number;
    percentage: number;
    totalQuestions: number;
    attempted: number;
    correct: number;
    incorrect: number;
    unattempted: number;
    markedForReview: number;
    rank?: number;
    percentile?: number;
    totalAttempts?: number;
    sectionWise: ISectionAnalysis[];
    subjectWise: ISubjectAnalysis[];
    topicWise: ITopicAnalysis[];
    averageTimePerQuestion: number;
    totalTimeSpent: number;
    strengths: string[];
    weaknesses: string[];
    createdAt: Date;
    updatedAt: Date;
}

const resultSchema = new Schema<IResult>(
    {
        attemptId: {
            type: Schema.Types.ObjectId,
            ref: 'Attempt',
            required: true,
            unique: true,
        },
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
        totalScore: {
            type: Number,
            required: true,
            default: 0,
        },
        totalMarks: {
            type: Number,
            required: true,
        },
        percentage: {
            type: Number,
            required: true,
            default: 0,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
        attempted: {
            type: Number,
            default: 0,
        },
        correct: {
            type: Number,
            default: 0,
        },
        incorrect: {
            type: Number,
            default: 0,
        },
        unattempted: {
            type: Number,
            default: 0,
        },
        markedForReview: {
            type: Number,
            default: 0,
        },
        rank: Number,
        percentile: Number,
        totalAttempts: Number,
        sectionWise: [
            {
                sectionId: Schema.Types.ObjectId,
                sectionName: String,
                score: Number,
                totalMarks: Number,
                accuracy: Number,
                attempted: Number,
                correct: Number,
                incorrect: Number,
            },
        ],
        subjectWise: [
            {
                subject: String,
                score: Number,
                totalMarks: Number,
                accuracy: Number,
                attempted: Number,
                correct: Number,
                incorrect: Number,
            },
        ],
        topicWise: [
            {
                topic: String,
                score: Number,
                totalMarks: Number,
                accuracy: Number,
                attempted: Number,
                correct: Number,
                incorrect: Number,
            },
        ],
        averageTimePerQuestion: {
            type: Number,
            default: 0,
        },
        totalTimeSpent: {
            type: Number,
            default: 0,
        },
        strengths: [String],
        weaknesses: [String],
    },
    {
        timestamps: true,
    }
);

// resultSchema.index({ attemptId: 1 });
resultSchema.index({ userId: 1, testId: 1 });
resultSchema.index({ rank: 1 });
resultSchema.index({ percentile: 1 });

const Result: Model<IResult> = mongoose.model<IResult>('Result', resultSchema);

export default Result;
