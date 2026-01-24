import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse, ApiError } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import Section from '../models/Section.model';
import Question from '../models/Question.model';

export const createSection = asyncHandler(async (req: AuthRequest, res: Response) => {
    const section = await Section.create({
        ...req.body,
        createdBy: req.user?.userId,
    });
    res.status(201).json(ApiResponse.success('Section created', section));
});

export const getSectionsByTestId = asyncHandler(async (req: AuthRequest, res: Response) => {
    const sections = await Section.find({ testId: req.params.testId }).sort({ order: 1 });
    res.json(ApiResponse.success('Sections retrieved', sections));
});

export const updateSection = asyncHandler(async (req: AuthRequest, res: Response) => {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!section) throw ApiError.notFound('Section not found');
    res.json(ApiResponse.success('Section updated', section));
});

export const deleteSection = asyncHandler(async (req: AuthRequest, res: Response) => {
    const section = await Section.findById(req.params.id);
    if (!section) throw ApiError.notFound('Section not found');

    await Question.deleteMany({ sectionId: section._id });
    await section.deleteOne();

    res.json(ApiResponse.success('Section deleted'));
});
