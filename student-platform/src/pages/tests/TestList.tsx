import React, { useEffect } from 'react';
import { useTestStore } from '../../store/testStore';
import { Link, useSearchParams } from 'react-router-dom';

const TestList: React.FC = () => {
    const { tests, isLoading, fetchTests } = useTestStore();
    const [searchParams] = useSearchParams();
    const examId = searchParams.get('examId');

    useEffect(() => {
        fetchTests(examId ? { examId } : {});
    }, [examId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading tests...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Available Tests</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                    <div key={test._id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">{test.title}</h3>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${test.difficulty === 'easy'
                                        ? 'bg-success-100 text-success-700'
                                        : test.difficulty === 'medium'
                                            ? 'bg-warning-100 text-warning-700'
                                            : 'bg-danger-100 text-danger-700'
                                    }`}
                            >
                                {test.difficulty}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                                <span>Type:</span>
                                <span className="font-medium capitalize">{test.type.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Duration:</span>
                                <span className="font-medium">{test.duration} mins</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Total Marks:</span>
                                <span className="font-medium">{test.totalMarks}</span>
                            </div>
                        </div>

                        {test.isPaid && (
                            <div className="mb-4 text-primary-600 font-bold">₹{test.price}</div>
                        )}

                        <Link
                            to={`/test-attempt/${test._id}`}
                            className="btn btn-primary w-full"
                        >
                            Start Test
                        </Link>
                    </div>
                ))}
            </div>

            {tests.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No tests available</p>
                </div>
            )}
        </div>
    );
};

export default TestList;
