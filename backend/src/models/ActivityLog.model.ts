import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
    userId?: mongoose.Types.ObjectId;
    action: string;
    entity: string;
    entityId?: mongoose.Types.ObjectId;
    description: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    status: 'success' | 'failure';
    errorMessage?: string;
    createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        action: {
            type: String,
            required: true,
        },
        entity: {
            type: String,
            required: true,
        },
        entityId: {
            type: Schema.Types.ObjectId,
        },
        description: {
            type: String,
            required: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
        ipAddress: String,
        userAgent: String,
        status: {
            type: String,
            required: true,
            enum: ['success', 'failure'],
            default: 'success',
        },
        errorMessage: String,
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ entity: 1 });
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

const ActivityLog: Model<IActivityLog> = mongoose.model<IActivityLog>(
    'ActivityLog',
    activityLogSchema
);

export default ActivityLog;
