import mongoose, { Schema, Document, Model } from 'mongoose';

interface ILanguageText {
    en: string;
    hi?: string;
}

interface IOption {
    id: string;
    text: ILanguageText;
}

export interface IQuestion extends Document {
    sectionId: mongoose.Types.ObjectId;
    type: 'mcq' | 'integer' | 'paragraph';
    text: ILanguageText;
    paragraph?: ILanguageText;
    options?: IOption[];
    correctAnswer: string | number;
    explanation?: ILanguageText;
    marks: number;
    negativeMarks: number;
    difficulty: 'easy' | 'medium' | 'hard';
    subject: string;
    topic: string;
    subtopic?: string;
    tags?: string[];
    isPYQ: boolean;
    year?: number;
    images?: string[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
    {
        sectionId: {
            type: Schema.Types.ObjectId,
            ref: 'Section',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['mcq', 'integer', 'paragraph'],
        },
        text: {
            en: { type: String, required: true },
            hi: String,
        },
        paragraph: {
            en: String,
            hi: String,
        },
        options: [
            {
                id: { type: String, required: true },
                text: {
                    en: { type: String, required: true },
                    hi: String,
                },
            },
        ],
        correctAnswer: {
            type: Schema.Types.Mixed,
            required: true,
        },
        explanation: {
            en: String,
            hi: String,
        },
        marks: {
            type: Number,
            required: true,
            min: 0,
        },
        negativeMarks: {
            type: Number,
            default: 0,
            min: 0,
        },
        difficulty: {
            type: String,
            required: true,
            enum: ['easy', 'medium', 'hard'],
        },
        subject: {
            type: String,
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        subtopic: String,
        tags: [String],
        isPYQ: {
            type: Boolean,
            default: false,
        },
        year: Number,
        images: [String],
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

questionSchema.index({ sectionId: 1 });
questionSchema.index({ subject: 1, topic: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ isPYQ: 1 });

const Question: Model<IQuestion> = mongoose.model<IQuestion>('Question', questionSchema);

export default Question;
