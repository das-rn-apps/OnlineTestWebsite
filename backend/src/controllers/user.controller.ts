import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse, ApiError } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';
import { getPaginationParams, getPaginationMeta, getSkipLimit } from '../utils/pagination';

export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { search, roleId } = req.query;
    const { page, limit, sort, order } = getPaginationParams(req.query);

    const filter: any = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }
    if (roleId) filter.roleId = roleId;

    const { skip, limit: limitValue } = getSkipLimit(page, limit);

    const [users, total] = await Promise.all([
        User.find(filter)
            .select('-password')
            .populate('roleId', 'name displayName')
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limitValue),
        User.countDocuments(filter),
    ]);

    res.json(ApiResponse.success('Users retrieved', users, getPaginationMeta(page, limit, total)));
});

export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id)
        .select('-password')
        .populate('roleId', 'name displayName');

    if (!user) throw ApiError.notFound('User not found');
    res.json(ApiResponse.success('User retrieved', user));
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
    ).select('-password');

    if (!user) throw ApiError.notFound('User not found');
    res.json(ApiResponse.success('User updated', user));
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) throw ApiError.notFound('User not found');
    await user.deleteOne();
    res.json(ApiResponse.success('User deleted'));
});

export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { roleId } = req.body;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { roleId },
        { new: true }
    ).select('-password').populate('roleId');

    if (!user) throw ApiError.notFound('User not found');
    res.json(ApiResponse.success('User role updated', user));
});
