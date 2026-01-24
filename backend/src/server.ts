import app from './app';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import logger from './services/logger.service';

const startServer = async () => {
    try {
        // Connect to database
        await connectDatabase();

        // Start server
        const server = app.listen(config.port, () => {
            logger.info(`Server running in ${config.env} mode on port ${config.port}`);
        });

        // Graceful shutdown
        const gracefulShutdown = () => {
            logger.info('Received shutdown signal, closing server gracefully...');
            server.close(() => {
                logger.info('Server closed');
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Forcing shutdown...');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
