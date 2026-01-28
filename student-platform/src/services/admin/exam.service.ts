import apiService from '../../services/api.service';

export interface Exam {
    _id: string;
    name: string;
    code: string;
    category: string;
    isActive: boolean;
    createdAt: string;
    createdBy: { name: string } | string;
}

export interface CreateExamDTO {
    name: string;
    code: string;
    description: string;
    category: string;
    subjects: any[]; // Simplified for now
    instructions?: string;
}

class AdminExamService {
    getAllExams(params?: any) {
        return apiService.get<{ data: Exam[]; meta: any }>('/exams', params);
    }

    createExam(data: CreateExamDTO) {
        return apiService.post<Exam>('/exams', data);
    }

    updateExam(id: string, data: Partial<CreateExamDTO> & { isActive?: boolean }) {
        return apiService.put<Exam>(`/exams/${id}`, data);
    }

    deleteExam(id: string) {
        return apiService.delete(`/exams/${id}`);
    }
}

export default new AdminExamService();
