import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse, ApiError } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import Result from '../models/Result.model';
import Answer from '../models/Answer.model';
import { getPaginationParams, getPaginationMeta, getSkipLimit } from '../utils/pagination';

/**
 * @route   GET /api/results/:attemptId
 * @desc    Get result for an attempt
 * @access  Private (own results only)
 */
export const getResultByAttemptId = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await Result.findOne({ attemptId: req.params.attemptId })
        .populate('testId', 'title type duration totalMarks')
        .populate('userId', 'name email');

    if (!result) {
        throw ApiError.notFound('Result not found');
    }

    // Check ownership (or admin)
    if (result.userId._id.toString() !== req.user?.userId && req.user?.roleName !== 'admin') {
        throw ApiError.forbidden('Access denied');
    }

    res.json(ApiResponse.success('Result retrieved', result));
});

/**
 * @route   GET /api/results/my-results
 * @desc    Get user's all results
 * @access  Private
 */
export const getMyResults = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { testId } = req.query;
    const { page, limit, sort, order } = getPaginationParams(req.query);

    const filter: any = { userId: req.user?.userId };
    if (testId) filter.testId = testId;

    const { skip, limit: limitValue } = getSkipLimit(page, limit);

    const [results, total] = await Promise.all([
        Result.find(filter)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limitValue)
            .populate('testId', 'title type duration totalMarks'),
        Result.countDocuments(filter),
    ]);

    res.json(
        ApiResponse.success('Results retrieved', results, getPaginationMeta(page, limit, total))
    );
});

/**
 * @route   GET /api/results/:attemptId/detailed
 * @desc    Get detailed result with question-wise analysis
 * @access  Private
 */
export const getDetailedResult = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await Result.findOne({ attemptId: req.params.attemptId })
        .populate('testId')
        .populate('userId', 'name email');

    if (!result) {
        throw ApiError.notFound('Result not found');
    }

    // Check ownership
    if (result.userId._id.toString() !== req.user?.userId && req.user?.roleName !== 'admin') {
        throw ApiError.forbidden('Access denied');
    }

    // Get all answers with questions
    const answers = await Answer.find({ attemptId: req.params.attemptId }).populate('questionId');

    // Build question-wise analysis
    const questionWiseAnalysis = answers.map((answer) => {
        const question = answer.questionId as any;
        return {
            questionId: question._id,
            questionText: question.text,
            type: question.type,
            userAnswer: answer.userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: answer.isCorrect,
            marksAwarded: answer.marksAwarded,
            timeSpent: answer.timeSpent,
            isMarkedForReview: answer.isMarkedForReview,
            explanation: question.explanation,
            difficulty: question.difficulty,
            subject: question.subject,
            topic: question.topic,
        };
    });

    res.json(
        ApiResponse.success('Detailed result retrieved', {
            result,
            questionWiseAnalysis,
        })
    );
});

/**
 * @route   GET /api/results/:attemptId/comparison
 * @desc    Compare with topper/average
 * @access  Private
 */
export const getComparison = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await Result.findOne({ attemptId: req.params.attemptId });

    if (!result) {
        throw ApiError.notFound('Result not found');
    }

    // Check ownership
    if (result.userId.toString() !== req.user?.userId) {
        throw ApiError.forbidden('Access denied');
    }

    // Get topper result
    const topperResult = await Result.findOne({ testId: result.testId })
        .sort({ totalScore: -1, totalTimeSpent: 1 })
        .limit(1);

    // Get average score
    const avgStats = await Result.aggregate([
        { $match: { testId: result.testId } },
        {
            $group: {
                _id: null,
                avgScore: { $avg: '$totalScore' },
                avgPercentage: { $avg: '$percentage' },
                avgTimeSpent: { $avg: '$totalTimeSpent' },
            },
        },
    ]);

    const average = avgStats[0] || {
        avgScore: 0,
        avgPercentage: 0,
        avgTimeSpent: 0,
    };

    res.json(
        ApiResponse.success('Comparison data retrieved', {
            yourScore: result.totalScore,
            yourPercentage: result.percentage,
            yourRank: result.rank,
            yourPercentile: result.percentile,
            topperScore: topperResult?.totalScore || 0,
            topperPercentage: topperResult?.percentage || 0,
            averageScore: Math.round(average.avgScore * 100) / 100,
            averagePercentage: Math.round(average.avgPercentage * 100) / 100,
            totalAttempts: result.totalAttempts,
        })
    );
});
