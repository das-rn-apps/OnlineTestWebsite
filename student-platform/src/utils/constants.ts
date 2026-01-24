export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    EXAMS: '/exams',
    EXAM_DETAIL: '/exams/:id',
    TESTS: '/tests',
    TEST_DETAIL: '/tests/:id',
    TEST_ATTEMPT: '/test-attempt/:id',
    RESULTS: '/results',
    RESULT_DETAIL: '/results/:attemptId',
    PROFILE: '/profile',
    DASHBOARD: '/dashboard',
} as const;

export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
} as const;
