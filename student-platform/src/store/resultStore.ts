import { create } from 'zustand';
import api from '../services/api.service';

interface Result {
    _id: string;
    totalScore: number;
    totalMarks: number;
    percentage: number;
    rank?: number;
    percentile?: number;
    correct: number;
    incorrect: number;
    unattempted: number;
}

interface ResultState {
    results: Result[];
    selectedResult: any | null;
    isLoading: boolean;
    fetchMyResults: () => Promise<void>;
    fetchResultByAttemptId: (attemptId: string) => Promise<void>;
    fetchDetailedResult: (attemptId: string) => Promise<void>;
}

export const useResultStore = create<ResultState>((set) => ({
    results: [],
    selectedResult: null,
    isLoading: false,

    fetchMyResults: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/results/my-results');
            set({ results: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    fetchResultByAttemptId: async (attemptId: string) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/results/${attemptId}`);
            set({ selectedResult: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    fetchDetailedResult: async (attemptId: string) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/results/${attemptId}/detailed`);
            set({ selectedResult: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
}));
