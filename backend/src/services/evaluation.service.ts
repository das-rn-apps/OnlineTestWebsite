import Answer from '../models/Answer.model';
import Question from '../models/Question.model';
import Attempt from '../models/Attempt.model';
import Section from '../models/Section.model';
import Test from '../models/Test.model';
import { ApiError } from '../utils/ApiResponse';

interface EvaluationResult {
    totalScore: number;
    totalMarks: number;
    percentage: number;
    totalQuestions: number;
    attempted: number;
    correct: number;
    incorrect: number;
    unattempted: number;
    markedForReview: number;
    sectionWise: any[];
    subjectWise: any[];
    topicWise: any[];
    averageTimePerQuestion: number;
    totalTimeSpent: number;
    strengths: string[];
    weaknesses: string[];
}

class EvaluationService {
    /**
     * Evaluate a test attempt
     */
    async evaluateAttempt(attemptId: string): Promise<EvaluationResult> {
        const attempt = await Attempt.findById(attemptId);
        if (!attempt) {
            throw ApiError.notFound('Attempt not found');
        }

        const test = await Test.findById(attempt.testId);
        if (!test) {
            throw ApiError.notFound('Test not found');
        }

        // Get all answers for this attempt
        const answers = await Answer.find({ attemptId }).populate('questionId');

        // Get all questions for this test
        const sections = await Section.find({ testId: test._id });
        const sectionIds = sections.map((s) => s._id);
        const allQuestions = await Question.find({ sectionId: { $in: sectionIds } });

        let totalScore = 0;
        let totalMarks = 0;
        let attempted = 0;
        let correct = 0;
        let incorrect = 0;
        let markedForReview = 0;

        const sectionMap = new Map();
        const subjectMap = new Map();
        const topicMap = new Map();

        // Evaluate each answer
        for (const answer of answers) {
            const question = answer.questionId as any;

            if (!question) continue;

            totalMarks += question.marks;

            if (answer.isMarkedForReview) {
                markedForReview++;
            }

            if (answer.isAttempted && answer.userAnswer !== undefined && answer.userAnswer !== null) {
                attempted++;

                // Check if answer is correct
                const isCorrect = this.checkAnswer(question, answer.userAnswer);
                answer.isCorrect = isCorrect;

                if (isCorrect) {
                    correct++;
                    answer.marksAwarded = question.marks;
                    totalScore += question.marks;
                } else {
                    incorrect++;
                    answer.marksAwarded = -question.negativeMarks;
                    totalScore -= question.negativeMarks;
                }

                await answer.save();

                // Update section-wise stats
                this.updateStats(sectionMap, question.sectionId.toString(), {
                    marks: question.marks,
                    awarded: answer.marksAwarded,
                    attempted: 1,
                    correct: isCorrect ? 1 : 0,
                    incorrect: isCorrect ? 0 : 1,
                });

                // Update subject-wise stats
                this.updateStats(subjectMap, question.subject, {
                    marks: question.marks,
                    awarded: answer.marksAwarded,
                    attempted: 1,
                    correct: isCorrect ? 1 : 0,
                    incorrect: isCorrect ? 0 : 1,
                });

                // Update topic-wise stats
                this.updateStats(topicMap, question.topic, {
                    marks: question.marks,
                    awarded: answer.marksAwarded,
                    attempted: 1,
                    correct: isCorrect ? 1 : 0,
                    incorrect: isCorrect ? 0 : 1,
                });
            }
        }

        const unattempted = allQuestions.length - attempted;
        const percentage = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;

        // Build section-wise analysis
        const sectionWise = await this.buildSectionAnalysis(sectionMap, sections);

        // Build subject-wise analysis
        const subjectWise = this.buildAnalysis(subjectMap);

        // Build topic-wise analysis
        const topicWise = this.buildAnalysis(topicMap);

        // Identify strengths and weaknesses
        const { strengths, weaknesses } = this.identifyStrengthsWeaknesses(topicWise);

        // Calculate time metrics
        const totalTimeSpent = attempt.timeSpent;
        const averageTimePerQuestion = attempted > 0 ? totalTimeSpent / attempted : 0;

        return {
            totalScore,
            totalMarks,
            percentage,
            totalQuestions: allQuestions.length,
            attempted,
            correct,
            incorrect,
            unattempted,
            markedForReview,
            sectionWise,
            subjectWise,
            topicWise,
            averageTimePerQuestion,
            totalTimeSpent,
            strengths,
            weaknesses,
        };
    }

    /**
     * Check if answer is correct
     */
    private checkAnswer(question: any, userAnswer: any): boolean {
        if (question.type === 'mcq') {
            return String(userAnswer).toLowerCase() === String(question.correctAnswer).toLowerCase();
        } else if (question.type === 'integer') {
            return Number(userAnswer) === Number(question.correctAnswer);
        }
        return false;
    }

    /**
     * Update statistics map
     */
    private updateStats(map: Map<string, any>, key: string, stats: any) {
        if (!map.has(key)) {
            map.set(key, {
                totalMarks: 0,
                score: 0,
                attempted: 0,
                correct: 0,
                incorrect: 0,
            });
        }

        const current = map.get(key);
        current.totalMarks += stats.marks;
        current.score += stats.awarded;
        current.attempted += stats.attempted;
        current.correct += stats.correct;
        current.incorrect += stats.incorrect;
    }

    /**
     * Build section-wise analysis
     */
    private async buildSectionAnalysis(sectionMap: Map<string, any>, sections: any[]) {
        const analysis = [];

        for (const section of sections) {
            const stats = sectionMap.get(section._id.toString()) || {
                totalMarks: 0,
                score: 0,
                attempted: 0,
                correct: 0,
                incorrect: 0,
            };

            const accuracy = stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 0;

            analysis.push({
                sectionId: section._id,
                sectionName: section.name,
                score: stats.score,
                totalMarks: stats.totalMarks,
                accuracy,
                attempted: stats.attempted,
                correct: stats.correct,
                incorrect: stats.incorrect,
            });
        }

        return analysis;
    }

    /**
     * Build generic analysis
     */
    private buildAnalysis(map: Map<string, any>) {
        const analysis = [];

        for (const [key, stats] of map.entries()) {
            const accuracy = stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 0;

            analysis.push({
                name: key,
                score: stats.score,
                totalMarks: stats.totalMarks,
                accuracy,
                attempted: stats.attempted,
                correct: stats.correct,
                incorrect: stats.incorrect,
            });
        }

        return analysis;
    }

    /**
     * Identify strengths and weaknesses
     */
    private identifyStrengthsWeaknesses(topicWise: any[]) {
        const strengths: string[] = [];
        const weaknesses: string[] = [];

        for (const topic of topicWise) {
            if (topic.attempted >= 3) {
                // Only consider topics with at least 3 questions
                if (topic.accuracy >= 75) {
                    strengths.push(topic.name);
                } else if (topic.accuracy < 50) {
                    weaknesses.push(topic.name);
                }
            }
        }

        return { strengths, weaknesses };
    }
}

export default new EvaluationService();
