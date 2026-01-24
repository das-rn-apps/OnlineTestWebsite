import apiService from './api.service';

export interface Subscription {
    _id: string;
    planName: string;
    planType: string;
    amount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    paymentStatus: string;
}

class SubscriptionService {
    getMySubscriptions() {
        return apiService.get<{ data: Subscription[] }>('/subscriptions/my');
    }

    createSubscription(data: { planType: string; couponCode?: string }) {
        return apiService.post<{ data: Subscription }>('/subscriptions', data);
    }
}

export default new SubscriptionService();
