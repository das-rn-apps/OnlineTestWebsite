import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAttemptStore } from '../../store/attemptStore';

const TestAttempt: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        currentAttempt,
        questions,
        currentQuestionIndex,
        timeRemaining,
        isLoading,
        startTest,
        submitAnswer,
        submitTest,
        setCurrentQuestionIndex,
        setTimeRemaining,
        getAnswer,
    } = useAttemptStore();

    const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
    const [isMarkedForReview, setIsMarkedForReview] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());

    useEffect(() => {
        if (id) {
            startTest(id, 'en').catch(() => {
                alert('Failed to start test');
                navigate('/tests');
            });
        }
    }, [id]);

    // Timer
    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(timeRemaining - 1);
            if (timeRemaining <= 1) {
                handleSubmitTest();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    // Load saved answer when question changes
    useEffect(() => {
        if (questions.length > 0) {
            const currentQuestion = questions[currentQuestionIndex];
            const savedAnswer = getAnswer(currentQuestion._id);
            setSelectedAnswer(savedAnswer?.userAnswer || null);
            setIsMarkedForReview(savedAnswer?.isMarkedForReview || false);
            setQuestionStartTime(Date.now());
        }
    }, [currentQuestionIndex, questions]);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerChange = (answer: any) => {
        setSelectedAnswer(answer);
    };

    const handleSaveAndNext = async () => {
        if (!currentQuestion) return;

        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

        try {
            await submitAnswer(currentQuestion._id, selectedAnswer, isMarkedForReview, timeSpent);

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        } catch (error) {
            alert('Failed to save answer');
        }
    };

    const handleMarkForReview = async () => {
        if (!currentQuestion) return;

        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

        try {
            await submitAnswer(currentQuestion._id, selectedAnswer, true, timeSpent);
            setIsMarkedForReview(true);

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        } catch (error) {
            alert('Failed to mark for review');
        }
    };

    const handleSubmitTest = async () => {
        if (!window.confirm('Are you sure you want to submit the test?')) return;

        try {
            const result = await submitTest();
            console.log('Test submitted successfully', result);
            navigate(`/results/${currentAttempt?._id}`);
        } catch (error) {
            alert('Failed to submit test');
        }
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading || !currentQuestion) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading test...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="text-lg font-semibold">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </div>
                    <div className={`text-xl font-bold ${timeRemaining < 300 ? 'text-danger-600' : 'text-primary-600'}`}>
                        {formatTime(timeRemaining)}
                    </div>
                    <button onClick={handleSubmitTest} className="btn btn-success">
                        Submit Test
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Question Area */}
                    <div className="lg:col-span-3">
                        <div className="card">
                            <div className="mb-4">
                                <span className="text-sm text-gray-500">
                                    Marks: +{currentQuestion.marks} | -{currentQuestion.negativeMarks}
                                </span>
                            </div>

                            <div className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: currentQuestion.text.en }} />

                            {/* Options for MCQ */}
                            {currentQuestion.type === 'mcq' && currentQuestion.options && (
                                <div className="space-y-3">
                                    {currentQuestion.options.map((option) => (
                                        <label
                                            key={option.id}
                                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedAnswer === option.id
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-300 hover:border-primary-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="answer"
                                                value={option.id}
                                                checked={selectedAnswer === option.id}
                                                onChange={() => handleAnswerChange(option.id)}
                                                className="mr-3"
                                            />
                                            <span className="font-medium mr-2">{option.id}.</span>
                                            <span>{option.text.en}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* Input for Integer */}
                            {currentQuestion.type === 'integer' && (
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="Enter your answer"
                                    value={selectedAnswer || ''}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                />
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between mt-8">
                                <button
                                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    className="btn btn-secondary"
                                >
                                    Previous
                                </button>

                                <div className="flex gap-3">
                                    <button onClick={handleMarkForReview} className="btn btn-secondary">
                                        Mark for Review
                                    </button>
                                    <button onClick={handleSaveAndNext} className="btn btn-primary">
                                        Save & Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Palette */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <h3 className="font-semibold mb-4">Question Palette</h3>

                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {questions.map((q, index) => {
                                    const answer = getAnswer(q._id);
                                    const isAnswered = answer?.userAnswer !== undefined && answer?.userAnswer !== null;
                                    const isReviewed = answer?.isMarkedForReview;

                                    return (
                                        <button
                                            key={q._id}
                                            onClick={() => setCurrentQuestionIndex(index)}
                                            className={`w-10 h-10 rounded-lg font-medium ${index === currentQuestionIndex
                                                ? 'bg-primary-600 text-white'
                                                : isReviewed
                                                    ? 'bg-warning-500 text-white'
                                                    : isAnswered
                                                        ? 'bg-success-500 text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-success-500 rounded"></div>
                                    <span>Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-warning-500 rounded"></div>
                                    <span>Marked for Review</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                    <span>Not Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-primary-600 rounded"></div>
                                    <span>Current</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestAttempt;
