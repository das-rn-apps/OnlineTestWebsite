import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => response.data,
            async (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Try to refresh token
                    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                    if (refreshToken) {
                        try {
                            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                                refreshToken,
                            });
                            const { accessToken } = response.data.data;
                            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

                            // Retry original request
                            if (error.config) {
                                error.config.headers.Authorization = `Bearer ${accessToken}`;
                                return this.api.request(error.config);
                            }
                        } catch {
                            // Refresh failed, logout
                            localStorage.clear();
                            window.location.href = '/login';
                        }
                    }
                }
                return Promise.reject(error.response?.data || error);
            }
        );
    }

    get<T = any>(url: string, params?: any) {
        return this.api.get<any, T>(url, { params });
    }

    post<T = any>(url: string, data?: any) {
        return this.api.post<any, T>(url, data);
    }

    put<T = any>(url: string, data?: any) {
        return this.api.put<any, T>(url, data);
    }

    delete<T = any>(url: string) {
        return this.api.delete<any, T>(url);
    }
}

export default new ApiService();
