import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse, ApiError } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import Exam from '../models/Exam.model';
import { getPaginationParams, getPaginationMeta, getSkipLimit } from '../utils/pagination';

/**
 * @route   GET /api/exams
 * @desc    Get all exams
 * @access  Public
 */
export const getAllExams = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { category, isActive, search } = req.query;
    const { page, limit, sort, order } = getPaginationParams(req.query);

    const filter: any = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
        ];
    }

    const { skip, limit: limitValue } = getSkipLimit(page, limit);

    const [exams, total] = await Promise.all([
        Exam.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limitValue)
            .populate('createdBy', 'name email'),
        Exam.countDocuments(filter),
    ]);

    res.json(
        ApiResponse.success('Exams retrieved', exams, getPaginationMeta(page, limit, total))
    );
});

/**
 * @route   GET /api/exams/:id
 * @desc    Get exam by ID
 * @access  Public
 */
export const getExamById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const exam = await Exam.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate({
            path: 'tests',
            match: { isPublished: true } // Optional: only show published tests
        });

    if (!exam) {
        throw ApiError.notFound('Exam not found');
    }

    res.json(ApiResponse.success('Exam and associated tests retrieved', exam));
});

/**
 * @route   POST /api/exams
 * @desc    Create exam
 * @access  Admin
 */
export const createExam = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, code, description, category, subjects, instructions, createdBy } = req.body;

    // Check if exam code already exists
    const existingExam = await Exam.findOne({ code });
    if (existingExam) {
        throw ApiError.conflict('Exam with this code already exists');
    }

    const exam = await Exam.create({
        name,
        code,
        description,
        category,
        subjects,
        instructions,
        createdBy: req.user?.userId || createdBy,
    });

    res.status(201).json(ApiResponse.success('Exam created', exam));
});

/**
 * @route   PUT /api/exams/:id
 * @desc    Update exam
 * @access  Admin
 */
export const updateExam = asyncHandler(async (req: AuthRequest, res: Response) => {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
        throw ApiError.notFound('Exam not found');
    }

    const { name, description, category, subjects, instructions, isActive } = req.body;

    if (name) exam.name = name;
    if (description) exam.description = description;
    if (category) exam.category = category;
    if (subjects) exam.subjects = subjects;
    if (instructions !== undefined) exam.instructions = instructions;
    if (isActive !== undefined) exam.isActive = isActive;

    await exam.save();

    res.json(ApiResponse.success('Exam updated', exam));
});

/**
 * @route   DELETE /api/exams/:id
 * @desc    Delete exam
 * @access  Super Admin
 */
export const deleteExam = asyncHandler(async (req: AuthRequest, res: Response) => {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
        throw ApiError.notFound('Exam not found');
    }

    await exam.deleteOne();

    res.json(ApiResponse.success('Exam deleted'));
});
