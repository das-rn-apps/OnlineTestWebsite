import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiResponse';
import authService from '../services/auth.service';
import User from '../models/User.model';
import Role from '../models/Role.model';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        roleId: string;
        roleName?: string;
        permissions?: string[];
    };
}

export const authenticate = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
) => {
    try {
        const token = authService.extractTokenFromHeader(req.headers.authorization);
        const payload = authService.verifyAccessToken(token);
        const user = await User.findById(payload.userId).populate('roleId');
        if (!user || !user.isActive) {
            throw ApiError.unauthorized('User not found or inactive');
        }

        const role = await Role.findById(user.roleId);

        req.user = {
            userId: payload.userId,
            email: payload.email,
            roleId: payload.roleId,
            roleName: role?.name,
            permissions: role?.permissions,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export const optionalAuth = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authService.extractTokenFromHeader(authHeader);
        const payload = authService.verifyAccessToken(token);

        const user = await User.findById(payload.userId).populate('roleId');
        if (user && user.isActive) {
            const role = await Role.findById(user.roleId);
            req.user = {
                userId: payload.userId,
                email: payload.email,
                roleId: payload.roleId,
                roleName: role?.name,
                permissions: role?.permissions,
            };
        }

        next();
    } catch (error) {
        next();
    }
};
