import { HTTP_STATUS } from '../config/constants';

export class ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };

    constructor(success: boolean, message: string, data?: T, meta?: any) {
        this.success = success;
        this.message = message;
        if (data !== undefined) this.data = data;
        if (meta) this.meta = meta;
    }

    static success<T>(message: string, data?: T, meta?: any): ApiResponse<T> {
        return new ApiResponse(true, message, data, meta);
    }

    static error(message: string, data?: any): ApiResponse {
        return new ApiResponse(false, message, data);
    }
}

export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    details?: any;

    constructor(
        statusCode: number,
        message: string,
        isOperational = true,
        details?: any,
        stack = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(message: string, details?: any): ApiError {
        return new ApiError(HTTP_STATUS.BAD_REQUEST, message, true, details);
    }

    static unauthorized(message = 'Unauthorized'): ApiError {
        return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
    }

    static forbidden(message = 'Forbidden'): ApiError {
        return new ApiError(HTTP_STATUS.FORBIDDEN, message);
    }

    static notFound(message = 'Resource not found'): ApiError {
        return new ApiError(HTTP_STATUS.NOT_FOUND, message);
    }

    static conflict(message: string): ApiError {
        return new ApiError(HTTP_STATUS.CONFLICT, message);
    }

    static internal(message = 'Internal server error'): ApiError {
        return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, false);
    }
}
