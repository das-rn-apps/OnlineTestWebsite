import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    phone?: string;
    roleId: mongoose.Types.ObjectId;
    profileImage?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    lastLogin?: Date;
    preferences: {
        language: 'en' | 'hi';
        notifications: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        roleId: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
        },
        profileImage: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        lastLogin: Date,
        preferences: {
            language: {
                type: String,
                enum: ['en', 'hi'],
                default: 'en',
            },
            notifications: {
                type: Boolean,
                default: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
// userSchema.index({ email: 1 });
userSchema.index({ roleId: 1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
