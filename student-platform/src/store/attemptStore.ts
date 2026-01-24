import { create } from 'zustand';
import api from '../services/api.service';

interface Question {
    _id: string;
    type: 'mcq' | 'integer' | 'paragraph';
    text: { en: string; hi?: string };
    options?: Array<{ id: string; text: { en: string; hi?: string } }>;
    marks: number;
    negativeMarks: number;
}

interface Attempt {
    _id: string;
    testId: string;
    startTime: Date;
    status: string;
}

interface Answer {
    questionId: string;
    userAnswer?: string | number;
    isMarkedForReview: boolean;
    timeSpent: number;
}

interface AttemptState {
    currentAttempt: Attempt | null;
    questions: Question[];
    answers: Map<string, Answer>;
    currentQuestionIndex: number;
    timeRemaining: number;
    isLoading: boolean;

    startTest: (testId: string, language: string) => Promise<void>;
    submitAnswer: (questionId: string, answer: any, isMarkedForReview: boolean, timeSpent: number) => Promise<void>;
    submitTest: () => Promise<any>;
    setCurrentQuestionIndex: (index: number) => void;
    setTimeRemaining: (time: number) => void;
    getAnswer: (questionId: string) => Answer | undefined;
}

export const useAttemptStore = create<AttemptState>((set, get) => ({
    currentAttempt: null,
    questions: [],
    answers: new Map(),
    currentQuestionIndex: 0,
    timeRemaining: 0,
    isLoading: false,

    startTest: async (testId: string, language: string = 'en') => {
        set({ isLoading: true });
        try {
            const response = await api.post('/attempts/start', { testId, language });
            const { attempt, questions, test } = response.data;

            set({
                currentAttempt: attempt,
                questions,
                timeRemaining: test.duration * 60, // Convert to seconds
                currentQuestionIndex: 0,
                answers: new Map(),
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    submitAnswer: async (questionId: string, userAnswer: any, isMarkedForReview: boolean, timeSpent: number) => {
        const { currentAttempt, answers } = get();
        if (!currentAttempt) return;

        try {
            await api.post(`/attempts/${currentAttempt._id}/answer`, {
                questionId,
                userAnswer,
                isMarkedForReview,
                timeSpent,
            });

            const newAnswers = new Map(answers);
            newAnswers.set(questionId, { questionId, userAnswer, isMarkedForReview, timeSpent });
            set({ answers: newAnswers });
        } catch (error) {
            throw error;
        }
    },

    submitTest: async () => {
        const { currentAttempt } = get();
        if (!currentAttempt) throw new Error('No active attempt');

        try {
            const response = await api.post(`/attempts/${currentAttempt._id}/submit`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    setCurrentQuestionIndex: (index: number) => {
        set({ currentQuestionIndex: index });
    },

    setTimeRemaining: (time: number) => {
        set({ timeRemaining: time });
    },

    getAnswer: (questionId: string) => {
        return get().answers.get(questionId);
    },
}));
