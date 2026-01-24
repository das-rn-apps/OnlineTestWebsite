import mongoose, { Schema, Document, Model } from 'mongoose';

interface ISubject {
    name: string;
    code: string;
    topics: Array<{
        name: string;
        code: string;
        subtopics?: string[];
    }>;
}

export interface IExam extends Document {
    name: string;
    code: string;
    description: string;
    category: 'government' | 'engineering' | 'medical' | 'banking' | 'railway';
    subjects: ISubject[];
    instructions?: string;
    isActive: boolean;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const examSchema = new Schema<IExam>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
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
        category: {
            type: String,
            required: true,
            enum: ['government', 'engineering', 'medical', 'banking', 'railway'],
        },
        subjects: [
            {
                name: { type: String, required: true },
                code: { type: String, required: true },
                topics: [
                    {
                        name: { type: String, required: true },
                        code: { type: String, required: true },
                        subtopics: [String],
                    },
                ],
            },
        ],
        instructions: String,
        isActive: {
            type: Boolean,
            default: true,
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

// examSchema.index({ code: 1 });
examSchema.index({ category: 1 });
examSchema.index({ isActive: 1 });
// Add this near the bottom of your Exam model file, before export
examSchema.virtual('tests', {
    ref: 'Test',           // The model to link to
    localField: '_id',     // The field in Exam
    foreignField: 'examId' // The field in Test that matches localField
});

// Important: This allows virtuals to show up in res.json()
examSchema.set('toObject', { virtuals: true });
examSchema.set('toJSON', { virtuals: true });

const Exam: Model<IExam> = mongoose.model<IExam>('Exam', examSchema);

export default Exam;
