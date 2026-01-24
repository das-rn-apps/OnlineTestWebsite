import { create } from 'zustand';
import api from '../services/api.service';

interface Test {
    _id: string;
    title: string;
    type: string;
    duration: number;
    totalMarks: number;
    difficulty: string;
    isPaid: boolean;
    price?: number;
}

interface TestState {
    tests: Test[];
    selectedTest: Test | null;
    isLoading: boolean;
    fetchTests: (filters?: any) => Promise<void>;
    fetchTestById: (id: string) => Promise<void>;
}

export const useTestStore = create<TestState>((set) => ({
    tests: [],
    selectedTest: null,
    isLoading: false,

    fetchTests: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const response = await api.get('/tests', filters);
            set({ tests: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    fetchTestById: async (id: string) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/tests/${id}`);
            set({ selectedTest: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
}));
