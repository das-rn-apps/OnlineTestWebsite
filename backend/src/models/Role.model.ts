import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRole extends Document {
    name: 'student' | 'admin' | 'super_admin' | 'examiner';
    displayName: string;
    permissions: string[];
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            enum: ['student', 'admin', 'super_admin', 'examiner'],
        },
        displayName: {
            type: String,
            required: true,
        },
        permissions: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// roleSchema.index({ name: 1 });

const Role: Model<IRole> = mongoose.model<IRole>('Role', roleSchema);

export default Role;
