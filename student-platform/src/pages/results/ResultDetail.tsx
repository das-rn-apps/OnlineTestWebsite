import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResultStore } from '../../store/resultStore';

const ResultDetail: React.FC = () => {
    const { attemptId } = useParams<{ attemptId: string }>();
    const { selectedResult, isLoading, fetchResultByAttemptId } = useResultStore();

    useEffect(() => {
        if (attemptId) {
            fetchResultByAttemptId(attemptId);
        }
    }, [attemptId]);

    if (isLoading || !selectedResult) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading result...</div>
            </div>
        );
    }

    const result = selectedResult;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="card mb-6 text-center">
                        <h1 className="text-3xl font-bold mb-2">Test Result</h1>
                        <p className="text-gray-600">{result.testId?.title}</p>
                    </div>

                    {/* Score Card */}
                    <div className="card mb-6 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                        <div className="text-center">
                            <div className="text-6xl font-bold mb-2">
                                {result.totalScore}/{result.totalMarks}
                            </div>
                            <div className="text-2xl mb-4">{result.percentage.toFixed(2)}%</div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                {result.rank && (
                                    <div>
                                        <div className="text-3xl font-bold">{result.rank}</div>
                                        <div className="text-sm opacity-90">Your Rank</div>
                                    </div>
                                )}
                                {result.percentile && (
                                    <div>
                                        <div className="text-3xl font-bold">{result.percentile.toFixed(2)}</div>
                                        <div className="text-sm opacity-90">Percentile</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-gray-800">{result.totalQuestions}</div>
                            <div className="text-sm text-gray-600">Total Questions</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-success-600">{result.correct}</div>
                            <div className="text-sm text-gray-600">Correct</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-danger-600">{result.incorrect}</div>
                            <div className="text-sm text-gray-600">Incorrect</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-gray-600">{result.unattempted}</div>
                            <div className="text-sm text-gray-600">Unattempted</div>
                        </div>
                    </div>

                    {/* Section-wise Analysis */}
                    {result.sectionWise && result.sectionWise.length > 0 && (
                        <div className="card mb-6">
                            <h2 className="text-xl font-bold mb-4">Section-wise Analysis</h2>
                            <div className="space-y-3">
                                {result.sectionWise.map((section: any, index: number) => (
                                    <div key={index} className="border-b pb-3 last:border-b-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">{section.sectionName}</span>
                                            <span className="text-primary-600 font-bold">
                                                {section.score}/{section.totalMarks}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>Accuracy: {section.accuracy.toFixed(1)}%</span>
                                            <span>Correct: {section.correct}</span>
                                            <span>Incorrect: {section.incorrect}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Subject-wise Analysis */}
                    {result.subjectWise && result.subjectWise.length > 0 && (
                        <div className="card mb-6">
                            <h2 className="text-xl font-bold mb-4">Subject-wise Analysis</h2>
                            <div className="space-y-3">
                                {result.subjectWise.map((subject: any, index: number) => (
                                    <div key={index} className="border-b pb-3 last:border-b-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">{subject.subject}</span>
                                            <span className="text-primary-600 font-bold">
                                                {subject.score}/{subject.totalMarks}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full"
                                                style={{ width: `${subject.accuracy}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Accuracy: {subject.accuracy.toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {result.strengths && result.strengths.length > 0 && (
                            <div className="card">
                                <h3 className="text-lg font-bold mb-3 text-success-600">Strengths</h3>
                                <ul className="space-y-2">
                                    {result.strengths.map((strength: string, index: number) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <span className="text-success-600">✓</span>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.weaknesses && result.weaknesses.length > 0 && (
                            <div className="card">
                                <h3 className="text-lg font-bold mb-3 text-danger-600">Areas to Improve</h3>
                                <ul className="space-y-2">
                                    {result.weaknesses.map((weakness: string, index: number) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <span className="text-danger-600">!</span>
                                            <span>{weakness}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center">
                        <Link to={`/results/${attemptId}/detailed`} className="btn btn-primary">
                            View Detailed Analysis
                        </Link>
                        <Link to="/tests" className="btn btn-secondary">
                            Take Another Test
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultDetail;
