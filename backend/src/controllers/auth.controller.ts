import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse, ApiError } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';
import Role from '../models/Role.model';
import authService from '../services/auth.service';
import { ROLES } from '../config/constants';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student
 * @access  Public
 */
export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw ApiError.conflict('User with this email already exists');
    }

    // Get student role
    const studentRole = await Role.findOne({ name: ROLES.STUDENT });
    if (!studentRole) {
        throw ApiError.internal('Student role not found');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        phone,
        roleId: studentRole._id,
    });

    // Generate tokens
    const tokens = authService.generateTokenPair({
        userId: user._id.toString(),
        email: user.email,
        roleId: studentRole._id.toString(),
    });

    // Remove password from response
    const { password: _, ...userResponse } = user.toObject();

    res.status(201).json(
        ApiResponse.success('Registration successful', {
            user: userResponse,
            ...tokens,
        })
    );
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password').populate('roleId');
    if (!user) {
        throw ApiError.unauthorized('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
        throw ApiError.forbidden('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw ApiError.unauthorized('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    // const role = await Role.findById(user.roleId);
    const tokens = authService.generateTokenPair({
        userId: user._id.toString(),
        email: user.email,
        roleId: user.roleId._id.toString(),
    });
    // Remove password from response
    const { password: _, ...userResponse } = user.toObject();

    res.json(
        ApiResponse.success('Login successful', {
            user: userResponse,
            ...tokens,
        })
    );
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw ApiError.badRequest('Refresh token is required');
    }

    // Verify refresh token
    const payload = authService.verifyRefreshToken(refreshToken);

    // Verify user still exists
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
        throw ApiError.unauthorized('Invalid refresh token');
    }

    // Generate new access token
    const accessToken = authService.generateAccessToken({
        userId: payload.userId,
        email: payload.email,
        roleId: payload.roleId,
    });

    res.json(
        ApiResponse.success('Token refreshed', {
            accessToken,
        })
    );
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
export const logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
    // In a stateless JWT system, logout is handled client-side
    // Optionally, implement token blacklisting here
    res.json(ApiResponse.success('Logout successful'));
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?.userId).populate('roleId');

    if (!user) {
        throw ApiError.notFound('User not found');
    }

    res.json(ApiResponse.success('User retrieved', user));
});
