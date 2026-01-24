import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse, ApiError } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import Attempt from '../models/Attempt.model';
import Test from '../models/Test.model';
import Section from '../models/Section.model';
import Question from '../models/Question.model';
import Answer from '../models/Answer.model';
import Result from '../models/Result.model';
import { shuffleArray } from '../utils/shuffle';
import evaluationService from '../services/evaluation.service';
import rankingService from '../services/ranking.service';
import { getPaginationMeta, getPaginationParams, getSkipLimit } from '@/utils/pagination';

/**
 * @route   POST /api/attempts/start
 * @desc    Start a test attempt
 * @access  Private
 */
export const startAttempt = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { testId, language } = req.body;

    const test = await Test.findById(testId);
    if (!test) {
        throw ApiError.notFound('Test not found');
    }

    if (!test.isPublished) {
        throw ApiError.forbidden('Test is not published');
    }

    // Check if user already has an in-progress attempt
    const existingAttempt = await Attempt.findOne({
        userId: req.user?.userId,
        testId,
        status: 'in_progress',
    });

    if (existingAttempt && !test.config.allowResume) {
        throw ApiError.conflict('You already have an in-progress attempt for this test');
    }

    if (existingAttempt && test.config.allowResume) {
        // Return existing attempt
        res.json(ApiResponse.success('Resuming existing attempt', existingAttempt));
        return;
    }

    // Get all questions for this test
    const sections = await Section.find({ testId }).sort({ order: 1 });
    const sectionIds = sections.map((s) => s._id);
    const questions = await Question.find({ sectionId: { $in: sectionIds } });

    // Shuffle questions if configured
    let questionOrder = questions.map((q) => q._id);
    if (test.config.shuffleQuestions) {
        questionOrder = shuffleArray(questionOrder);
    }

    // Create attempt
    const attempt = await Attempt.create({
        userId: req.user?.userId,
        testId,
        startTime: new Date(),
        config: {
            shuffleQuestions: test.config.shuffleQuestions,
            shuffleOptions: test.config.shuffleOptions,
            language: language || 'en',
        },
        questionOrder,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
    });

    // Create empty answers for all questions
    const answers = questions.map((q) => ({
        attemptId: attempt._id,
        questionId: q._id,
        isAttempted: false,
        isMarkedForReview: false,
        timeSpent: 0,
    }));

    await Answer.insertMany(answers);

    // Prepare questions for response (remove correct answers)
    const questionsForResponse = questions.map((q) => {
        const qObj = q.toObject() as any;
        delete qObj.correctAnswer;
        delete qObj.explanation;
        return qObj;
    });

    res.status(201).json(
        ApiResponse.success('Test attempt started', {
            attempt,
            questions: questionsForResponse,
            test: {
                _id: test._id,
                title: test.title,
                duration: test.duration,
                totalMarks: test.totalMarks,
                config: test.config,
            },
        })
    );
});

/**
 * @route   GET /api/attempts/:id
 * @desc    Get attempt details
 * @access  Private (own attempts only)
 */
export const getAttemptById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt) {
        throw ApiError.notFound('Attempt not found');
    }

    // Check ownership
    if (attempt.userId.toString() !== req.user?.userId) {
        throw ApiError.forbidden('Access denied');
    }

    const answers = await Answer.find({ attemptId: attempt._id });

    res.json(
        ApiResponse.success('Attempt retrieved', {
            attempt,
            answers,
        })
    );
});

/**
 * @route   POST /api/attempts/:id/answer
 * @desc    Submit answer for a question
 * @access  Private
 */
export const submitAnswer = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { questionId, userAnswer, isMarkedForReview, timeSpent } = req.body;

    const attempt = await Attempt.findById(req.params.id);

    if (!attempt) {
        throw ApiError.notFound('Attempt not found');
    }

    // Check ownership
    if (attempt.userId.toString() !== req.user?.userId) {
        throw ApiError.forbidden('Access denied');
    }

    // Check if attempt is still in progress
    if (attempt.status !== 'in_progress') {
        throw ApiError.badRequest('Attempt is already submitted');
    }

    // Find or create answer
    let answer = await Answer.findOne({
        attemptId: attempt._id,
        questionId,
    });

    if (!answer) {
        answer = new Answer({
            attemptId: attempt._id,
            questionId,
        });
    }

    answer.userAnswer = userAnswer;
    answer.isAttempted = userAnswer !== undefined && userAnswer !== null;
    answer.isMarkedForReview = isMarkedForReview || false;
    answer.timeSpent = timeSpent || 0;
    answer.answeredAt = new Date();

    await answer.save();

    res.json(ApiResponse.success('Answer submitted', answer));
});

/**
 * @route   POST /api/attempts/:id/submit
 * @desc    Submit test
 * @access  Private
 */
export const submitAttempt = asyncHandler(async (req: AuthRequest, res: Response) => {
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt) {
        throw ApiError.notFound('Attempt not found');
    }

    // Check ownership
    if (attempt.userId.toString() !== req.user?.userId) {
        throw ApiError.forbidden('Access denied');
    }

    // Check if already submitted
    if (attempt.status !== 'in_progress') {
        throw ApiError.badRequest('Attempt is already submitted');
    }

    // Update attempt
    attempt.status = 'submitted';
    attempt.endTime = new Date();
    attempt.submittedAt = new Date();
    attempt.timeSpent = Math.floor(
        (attempt.endTime.getTime() - attempt.startTime.getTime()) / 1000
    );
    await attempt.save();

    // Evaluate the attempt
    const evaluation = await evaluationService.evaluateAttempt(attempt._id.toString());

    // Create result
    const result = await Result.create({
        attemptId: attempt._id,
        userId: attempt.userId,
        testId: attempt.testId,
        ...evaluation,
    });

    // Calculate rank and percentile
    await rankingService.calculateRankAndPercentile(result._id.toString());

    // Fetch updated result
    const updatedResult = await Result.findById(result._id);

    res.json(
        ApiResponse.success('Test submitted successfully', {
            attempt,
            result: updatedResult,
        })
    );
});

/**
 * @route   GET /api/attempts/my-attempts
 * @desc    Get user's all attempts
 * @access  Private
 */
export const getMyAttempts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { testId, status } = req.query;
    const { page, limit, sort, order } = getPaginationParams(req.query);

    const filter: any = { userId: req.user?.userId };
    if (testId) filter.testId = testId;
    if (status) filter.status = status;

    const { skip, limit: limitValue } = getSkipLimit(page, limit);

    const [attempts, total] = await Promise.all([
        Attempt.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limitValue)
            .populate('testId', 'title type duration totalMarks'),
        Attempt.countDocuments(filter),
    ]);

    res.json(
        ApiResponse.success('Attempts retrieved', attempts, getPaginationMeta(page, limit, total))
    );
});
