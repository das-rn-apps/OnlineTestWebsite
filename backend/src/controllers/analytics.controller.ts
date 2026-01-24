import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import Attempt from '../models/Attempt.model';
import mongoose from 'mongoose';
import Result from '../models/Result.model';
import { AuthRequest } from '../middleware/auth.middleware';

class AnalyticsController {
    /**
     * Get Student Dashboard Stats
     */
    getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user?.userId;

        // Total Attempts
        const totalAttempts = await Attempt.countDocuments({
            userId,
            status: { $in: ['submitted', 'auto_submitted'] },
        });

        // Average Score and Total Tests Taken (from Results)
        const resultStats = await Result.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    avgPercentage: { $avg: '$percentage' },
                    totalTests: { $sum: 1 }
                }
            }
        ]);

        const avgScore = resultStats.length > 0 ? Math.round(resultStats[0].avgPercentage * 10) / 10 : 0;

        const recentActivity = await Attempt.find({
            userId,
            status: { $in: ['submitted', 'auto_submitted'] },
        })
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate('testId', 'title type');

        res.json(
            ApiResponse.success('Dashboard stats fetched successfully', {
                totalAttempts,
                avgScore,
                recentActivity,
            })
        );
    });

    /**
     * Get Overall Performance (Subject Wise)
     */
    getPerformanceStats = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user?.userId;

        // Aggregate subject performance from all results
        const subjectPerformance = await Result.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $unwind: '$subjectWise' },
            {
                $group: {
                    _id: '$subjectWise.subject',
                    totalScore: { $sum: '$subjectWise.score' },
                    totalMarks: { $sum: '$subjectWise.totalMarks' },
                    attempts: { $sum: 1 }
                }
            },
            {
                $project: {
                    subject: '$_id',
                    accuracy: {
                        $cond: [
                            { $gt: ['$totalMarks', 0] },
                            { $multiply: [{ $divide: ['$totalScore', '$totalMarks'] }, 100] },
                            0
                        ]
                    },
                    attempts: 1,
                    _id: 0
                }
            }
        ]);

        res.json(
            ApiResponse.success('Performance stats fetched successfully', { subjects: subjectPerformance })
        );
    });
}

export default new AnalyticsController();
