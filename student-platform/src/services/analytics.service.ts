import apiService from './api.service';

export interface DashboardStats {
    totalAttempts: number;
    avgScore: number;
    recentActivity: any[];
}

export interface PerformanceStats {
    subjects: {
        subject: string;
        accuracy: number;
        attempts: number;
    }[];
}

class AnalyticsService {
    getDashboardStats() {
        return apiService.get<{ data: DashboardStats }>('/analytics/dashboard');
    }

    getPerformanceStats() {
        return apiService.get<{ data: PerformanceStats }>('/analytics/performance');
    }
}

export default new AnalyticsService();
