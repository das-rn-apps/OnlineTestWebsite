import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api.service';
import { STORAGE_KEYS } from '../utils/constants';

interface User {
    _id: string;
    email: string;
    name: string;
    roleId: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const response = await api.post('/auth/login', { email, password });
                    const { user, accessToken, refreshToken } = response.data;

                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const response = await api.post('/auth/register', { name, email, password });
                    const { user, accessToken, refreshToken } = response.data;

                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                set({ user: null, isAuthenticated: false });
            },

            checkAuth: async () => {
                const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                if (!token) {
                    set({ isAuthenticated: false, user: null });
                    return;
                }

                try {
                    const response = await api.get('/auth/me');
                    set({ user: response.data, isAuthenticated: true });
                } catch {
                    set({ isAuthenticated: false, user: null });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
