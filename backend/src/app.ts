import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config/env';
import { errorHandler, notFound } from './middleware/error.middleware';
import logger from './services/logger.service';

// Import routes
import authRoutes from './routes/auth.routes';
import examRoutes from './routes/exam.routes';
import testRoutes from './routes/test.routes';
import attemptRoutes from './routes/attempt.routes';
import resultRoutes from './routes/result.routes';
import questionRoutes from './routes/question.routes';
import userRoutes from './routes/user.routes';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS
app.use(cors(config.cors));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Request logging
app.use((_req, _res, next) => {
    logger.http(`${_req.method} ${_req.url}`);
    next();
});

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/results', resultRoutes);
// Additional routes can be added here:
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/subscriptions', subscriptionRoutes);
// app.use('/api/coupons', couponRoutes);
// app.use('/api/admin', adminRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
