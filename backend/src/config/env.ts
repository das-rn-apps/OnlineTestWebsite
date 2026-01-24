import dotenv from 'dotenv';

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),

    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/test-series-platform',
        options: {
            maxPoolSize: 10,
            minPoolSize: 5,
            socketTimeoutMS: 45000,
        },
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '1h',
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    },

    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },

    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
        uploadPath: process.env.UPLOAD_PATH || './uploads',
    },

    email: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM || 'noreply@testseries.com',
    },

    payment: {
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
    },

    frontendUrls: {
        student: process.env.STUDENT_APP_URL || 'http://localhost:5173',
        admin: process.env.ADMIN_APP_URL || 'http://localhost:5174',
    },

    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
};
