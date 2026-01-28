import apiService from '../../services/api.service';

export interface Coupon {
    _id: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'flat';
    discountValue: number;
    maxDiscount?: number;
    minPurchaseAmount?: number;
    validFrom: string;
    validUntil: string;
    usageCount: number;
    maxUsage?: number;
    isActive: boolean;
}

export interface CreateCouponDTO {
    code: string;
    description: string;
    discountType: 'percentage' | 'flat';
    discountValue: number;
    maxDiscount?: number;
    minPurchaseAmount?: number;
    validFrom: string;
    validUntil: string;
    maxUsage?: number;
    isActive: boolean;
}

class AdminCouponService {
    getAllCoupons(params?: any) {
        return apiService.get<{ data: Coupon[]; meta: any }>('/coupons', params);
    }

    createCoupon(data: CreateCouponDTO) {
        return apiService.post<Coupon>('/coupons', data);
    }

    updateCoupon(id: string, data: Partial<CreateCouponDTO>) {
        return apiService.put<Coupon>(`/coupons/${id}`, data);
    }

    deleteCoupon(id: string) {
        return apiService.delete(`/coupons/${id}`);
    }
}

export default new AdminCouponService();
