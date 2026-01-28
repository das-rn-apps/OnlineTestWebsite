import apiService from './api.service';

export interface User {
    _id: string;
    name: string;
    email: string;
    roleId: {
        _id: string;
        name: string;
        displayName: string;
    } | string;
    isActive: boolean;
    createdAt: string;
}

export interface UserListResponse {
    data: User[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

class UserService {
    getUsers(params?: any) {
        return apiService.get<UserListResponse>('/users', params);
    }

    updateUserRole(userId: string, roleId: string) {
        return apiService.put(`/users/${userId}/role`, { roleId });
    }

    deleteUser(userId: string) {
        return apiService.delete(`/users/${userId}`);
    }
}

export default new UserService();
