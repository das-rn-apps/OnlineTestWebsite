import apiService from '../../services/api.service';

export interface AdminSubscription {
    _id: string;
    userId: { name: string; email: string };
    planType: string;
    planName: string;
    amount: number;
    paymentStatus: string;
    isActive: boolean;
    createdAt: string;
}

class AdminSubscriptionService {
    getAllSubscriptions(params?: any) {
        return apiService.get<{ data: AdminSubscription[]; meta: any }>('/subscriptions', params);
    }
}

export default new AdminSubscriptionService();
