import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ApiError } from '../utils/ApiResponse';
import { ROLES } from '../config/constants';

export const requireRole = (...allowedRoles: string[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(ApiError.unauthorized('Authentication required'));
        }

        if (!req.user.roleName || !allowedRoles.includes(req.user.roleName)) {
            return next(ApiError.forbidden('Insufficient permissions'));
        }

        next();
    };
};

export const requirePermission = (...requiredPermissions: string[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(ApiError.unauthorized('Authentication required'));
        }

        const userPermissions = req.user.permissions || [];
        const hasPermission = requiredPermissions.every((permission) =>
            userPermissions.includes(permission)
        );

        if (!hasPermission) {
            return next(ApiError.forbidden('Insufficient permissions'));
        }

        next();
    };
};

export const isStudent = requireRole(ROLES.STUDENT);
export const isAdmin = requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN);
export const isSuperAdmin = requireRole(ROLES.SUPER_ADMIN);
export const isExaminer = requireRole(ROLES.EXAMINER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
