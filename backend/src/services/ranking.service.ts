import Result from '../models/Result.model';

class RankingService {
    /**
     * Calculate rank and percentile for a result
     */
    async calculateRankAndPercentile(resultId: string): Promise<void> {
        const result = await Result.findById(resultId);
        if (!result) {
            throw new Error('Result not found');
        }

        // Get all results for the same test
        const allResults = await Result.find({ testId: result.testId }).sort({
            totalScore: -1,
            totalTimeSpent: 1,
        });

        const totalAttempts = allResults.length;

        // Find rank
        let rank = 1;
        for (const r of allResults) {
            if (r._id.toString() === result._id.toString()) {
                break;
            }
            rank++;
        }

        // Calculate percentile
        const percentile = totalAttempts > 1 ? ((totalAttempts - rank) / (totalAttempts - 1)) * 100 : 100;

        // Update result
        result.rank = rank;
        result.percentile = Math.round(percentile * 100) / 100;
        result.totalAttempts = totalAttempts;

        await result.save();
    }

    /**
     * Recalculate ranks for all results of a test
     */
    async recalculateTestRanks(testId: string): Promise<void> {
        const allResults = await Result.find({ testId }).sort({
            totalScore: -1,
            totalTimeSpent: 1,
        });

        const totalAttempts = allResults.length;

        for (let i = 0; i < allResults.length; i++) {
            const rank = i + 1;
            const percentile = totalAttempts > 1 ? ((totalAttempts - rank) / (totalAttempts - 1)) * 100 : 100;

            allResults[i].rank = rank;
            allResults[i].percentile = Math.round(percentile * 100) / 100;
            allResults[i].totalAttempts = totalAttempts;

            await allResults[i].save();
        }
    }
}

export default new RankingService();
