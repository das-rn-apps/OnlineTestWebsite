import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISection extends Document {
    testId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    duration?: number;
    order: number;
    subjectCode?: string;
    createdAt: Date;
    updatedAt: Date;
}

const sectionSchema = new Schema<ISection>(
    {
        testId: {
            type: Schema.Types.ObjectId,
            ref: 'Test',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: String,
        duration: {
            type: Number,
            min: 0,
        },
        order: {
            type: Number,
            required: true,
            min: 1,
        },
        subjectCode: String,
    },
    {
        timestamps: true,
    }
);

sectionSchema.index({ testId: 1 });
sectionSchema.index({ testId: 1, order: 1 });

const Section: Model<ISection> = mongoose.model<ISection>('Section', sectionSchema);

export default Section;
