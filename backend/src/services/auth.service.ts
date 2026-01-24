import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import { ApiError } from '../utils/ApiResponse';

export interface TokenPayload {
    userId: string;
    email: string;
    roleId: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

class AuthService {
    /**
     * Hash password using bcrypt
     */
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    /**
     * Compare password with hash
     */
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Generate JWT access token
     */
    generateAccessToken(payload: TokenPayload): string {
        const options: SignOptions = {
            expiresIn: config.jwt.accessExpiry as any,
        };
        return jwt.sign(payload, config.jwt.accessSecret as string, options);
    }

    /**
     * Generate JWT refresh token
     */
    generateRefreshToken(payload: TokenPayload): string {
        const options: SignOptions = {
            expiresIn: config.jwt.refreshExpiry as any,
        };
        return jwt.sign(payload, config.jwt.refreshSecret as string, options);
    }

    /**
     * Generate both access and refresh tokens
     */
    generateTokenPair(payload: TokenPayload): TokenPair {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }

    /**
     * Verify access token
     */
    verifyAccessToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
        } catch (error) {
            throw ApiError.unauthorized('Invalid or expired token');
        }
    }

    /**
     * Verify refresh token
     */
    verifyRefreshToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
        } catch (error) {
            throw ApiError.unauthorized('Invalid or expired refresh token');
        }
    }

    /**
     * Extract token from Authorization header
     */
    extractTokenFromHeader(authHeader?: string): string {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('No token provided');
        }
        return authHeader.substring(7);
    }
}

export default new AuthService();
