export const ROLES = {
    STUDENT: 'student',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
    EXAMINER: 'examiner',
} as const;

export const PERMISSIONS = {
    // User permissions
    USER_READ: 'user:read',
    USER_WRITE: 'user:write',
    USER_DELETE: 'user:delete',

    // Exam permissions
    EXAM_READ: 'exam:read',
    EXAM_WRITE: 'exam:write',
    EXAM_DELETE: 'exam:delete',

    // Test permissions
    TEST_READ: 'test:read',
    TEST_WRITE: 'test:write',
    TEST_DELETE: 'test:delete',
    TEST_PUBLISH: 'test:publish',

    // Question permissions
    QUESTION_READ: 'question:read',
    QUESTION_WRITE: 'question:write',
    QUESTION_DELETE: 'question:delete',

    // Result permissions
    RESULT_READ_ALL: 'result:read:all',
    RESULT_RECALCULATE: 'result:recalculate',

    // Analytics permissions
    ANALYTICS_READ_ALL: 'analytics:read:all',

    // Subscription permissions
    SUBSCRIPTION_MANAGE: 'subscription:manage',

    // Coupon permissions
    COUPON_MANAGE: 'coupon:manage',
} as const;

export const TEST_TYPES = {
    FULL_LENGTH: 'full_length',
    SECTIONAL: 'sectional',
    TOPIC_WISE: 'topic_wise',
    PREVIOUS_YEAR: 'previous_year',
    PRACTICE: 'practice',
} as const;

export const QUESTION_TYPES = {
    MCQ: 'mcq',
    INTEGER: 'integer',
    PARAGRAPH: 'paragraph',
} as const;

export const DIFFICULTY_LEVELS = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
} as const;

export const ATTEMPT_STATUS = {
    IN_PROGRESS: 'in_progress',
    SUBMITTED: 'submitted',
    AUTO_SUBMITTED: 'auto_submitted',
    ABANDONED: 'abandoned',
} as const;

export const PAYMENT_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
} as const;

export const EXAM_CATEGORIES = {
    GOVERNMENT: 'government',
    ENGINEERING: 'engineering',
    MEDICAL: 'medical',
    BANKING: 'banking',
    RAILWAY: 'railway',
} as const;

export const LANGUAGES = {
    ENGLISH: 'en',
    HINDI: 'hi',
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
} as const;
