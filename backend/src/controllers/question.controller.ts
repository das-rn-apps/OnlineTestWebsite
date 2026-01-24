import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse, ApiError } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import Question from '../models/Question.model';
import { getPaginationParams, getPaginationMeta, getSkipLimit } from '../utils/pagination';

export const createQuestion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const question = await Question.create({
        ...req.body,
        // createdBy: req.user?.userId,
    });
    res.status(201).json(ApiResponse.success('Question created', question));
});
export const getQuestions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, sort, order } = getPaginationParams(req.query);
    const { skip, limit: limitValue } = getSkipLimit(page, limit);

    const [questions, total] = await Promise.all([
        Question.find()
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limitValue),
        Question.countDocuments(),
    ]);

    res.json(ApiResponse.success('Questions retrieved', questions, getPaginationMeta(page, limit, total)));
});
export const getQuestionsBySectionId = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, sort, order } = getPaginationParams(req.query);
    const { skip, limit: limitValue } = getSkipLimit(page, limit);

    const filter: any = { sectionId: req.params.sectionId };

    const [questions, total] = await Promise.all([
        Question.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limitValue),
        Question.countDocuments(filter),
    ]);

    res.json(ApiResponse.success('Questions retrieved', questions, getPaginationMeta(page, limit, total)));
});

export const getQuestionById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const question = await Question.findById(req.params.id);
    if (!question) throw ApiError.notFound('Question not found');
    res.json(ApiResponse.success('Question retrieved', question));
});

export const updateQuestion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) throw ApiError.notFound('Question not found');
    res.json(ApiResponse.success('Question updated', question));
});

export const deleteQuestion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const question = await Question.findById(req.params.id);
    if (!question) throw ApiError.notFound('Question not found');
    await question.deleteOne();
    res.json(ApiResponse.success('Question deleted'));
});

export const bulkCreateQuestions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { questions } = req.body;
    const createdQuestions = await Question.insertMany(
        questions.map((q: any) => ({ ...q, createdBy: req.user?.userId }))
    );
    res.status(201).json(ApiResponse.success('Questions created', createdQuestions));
});
