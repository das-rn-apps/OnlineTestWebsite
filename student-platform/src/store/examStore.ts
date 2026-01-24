import { create } from 'zustand';
import api from '../services/api.service';

interface Exam {
    _id: string;
    name: string;
    code: string;
    description: string;
    category: string;
    isActive: boolean;
    tests: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ExamState {
    exams: Exam[];
    selectedExam: Exam | null;
    isLoading: boolean;
    fetchExams: (filters?: any) => Promise<void>;
    fetchExamById: (id: string) => Promise<void>;
}

export const useExamStore = create<ExamState>((set) => ({
    exams: [],
    selectedExam: null,
    isLoading: false,

    fetchExams: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const response = await api.get('/exams', filters);
            set({ exams: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    fetchExamById: async (id: string) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/exams/${id}`);
            set({ selectedExam: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
}));
