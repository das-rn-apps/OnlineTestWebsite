import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse, ApiError } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import Test from '../models/Test.model';
import Section from '../models/Section.model';
import Question from '../models/Question.model';
import { getPaginationParams, getPaginationMeta, getSkipLimit } from '../utils/pagination';

/**
 * @route   GET /api/tests
 * @desc    Get all tests
 * @access  Public
 */
export const getAllTests = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { examId, type, isPaid, isPublished, search } = req.query;
    const { page, limit, sort, order } = getPaginationParams(req.query);

    const filter: any = {};
    if (examId) filter.examId = examId;
    if (type) filter.type = type;
    if (isPaid !== undefined) filter.isPaid = isPaid === 'true';
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    if (search) {
        filter.$or = [{ title: { $regex: search, $options: 'i' } }];
    }

    const { skip, limit: limitValue } = getSkipLimit(page, limit);

    const [tests, total] = await Promise.all([
        Test.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limitValue)
            .populate('examId', 'name code')
            .populate('createdBy', 'name email'),
        Test.countDocuments(filter),
    ]);

    res.json(
        ApiResponse.success('Tests retrieved', tests, getPaginationMeta(page, limit, total))
    );
});

/**
 * @route   GET /api/tests/:id
 * @desc    Get test details
 * @access  Public
 */
export const getTestById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const test = await Test.findById(req.params.id)
        .populate('examId', 'name code')
        .populate('createdBy', 'name email');

    if (!test) {
        throw ApiError.notFound('Test not found');
    }

    // Get section count
    const sectionCount = await Section.countDocuments({ testId: test._id });

    res.json(
        ApiResponse.success('Test retrieved', {
            ...test.toObject(),
            sectionCount,
        })
    );
});

/**
 * @route   GET /api/tests/:id/full
 * @desc    Get complete test with questions
 * @access  Private (requires access check)
 */
export const getFullTest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const test = await Test.findById(req.params.id).populate('examId');

    if (!test) {
        throw ApiError.notFound('Test not found');
    }

    if (!test.isPublished) {
        throw ApiError.forbidden('Test is not published');
    }

    // TODO: Check user access/subscription

    const sections = await Section.find({ testId: test._id }).sort({ order: 1 });

    const sectionsWithQuestions = await Promise.all(
        sections.map(async (section) => {
            const questions = await Question.find({ sectionId: section._id });
            return {
                ...section.toObject(),
                questions,
            };
        })
    );

    res.json(
        ApiResponse.success('Full test retrieved', {
            test,
            sections: sectionsWithQuestions,
        })
    );
});

/**
 * @route   POST /api/tests
 * @desc    Create test
 * @access  Admin
 */
export const createTest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const testData = {
        ...req.body,
        // createdBy: req.user?.userId,
    };

    const test = await Test.create(testData);

    res.status(201).json(ApiResponse.success('Test created', test));
});

/**
 * @route   PUT /api/tests/:id
 * @desc    Update test
 * @access  Admin
 */
export const updateTest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const test = await Test.findById(req.params.id);

    if (!test) {
        throw ApiError.notFound('Test not found');
    }

    Object.assign(test, req.body);
    await test.save();

    res.json(ApiResponse.success('Test updated', test));
});

/**
 * @route   PUT /api/tests/:id/publish
 * @desc    Publish/unpublish test
 * @access  Admin
 */
export const publishTest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const test = await Test.findById(req.params.id);

    if (!test) {
        throw ApiError.notFound('Test not found');
    }

    test.isPublished = req.body.isPublished;
    test.isDraft = !req.body.isPublished;
    await test.save();

    res.json(
        ApiResponse.success(
            `Test ${test.isPublished ? 'published' : 'unpublished'}`,
            test
        )
    );
});

/**
 * @route   DELETE /api/tests/:id
 * @desc    Delete test
 * @access  Admin
 */
export const deleteTest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const test = await Test.findById(req.params.id);

    if (!test) {
        throw ApiError.notFound('Test not found');
    }

    // Delete associated sections and questions
    const sections = await Section.find({ testId: test._id });
    const sectionIds = sections.map((s) => s._id);

    await Question.deleteMany({ sectionId: { $in: sectionIds } });
    await Section.deleteMany({ testId: test._id });
    await test.deleteOne();

    res.json(ApiResponse.success('Test deleted'));
});
