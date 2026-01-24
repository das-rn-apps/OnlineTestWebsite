import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '../utils/ApiResponse';
import { HTTP_STATUS } from '../config/constants';
import logger from '../services/logger.service';

export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let error = err;

    // Convert non-ApiError errors to ApiError
    if (!(error instanceof ApiError)) {
        const statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        const message = error.message || 'Internal server error';
        error = new ApiError(statusCode, message, false);
    }

    const apiError = error as ApiError;

    // Log error
    if (!apiError.isOperational) {
        logger.error('Unhandled error:', {
            message: apiError.message,
            stack: apiError.stack,
            url: req.url,
            method: req.method,
        });
    }

    // Send response
    res.status(apiError.statusCode).json(
        ApiResponse.error(apiError.message, apiError.details)
    );
};

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
    next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};
