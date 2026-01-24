import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../services/api.service';

interface User {
    _id: string;
    name: string;
    email: string;
    roleName: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user, accessToken, refreshToken) => {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
                set({ user, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'admin-auth-storage',
        }
    )
);
