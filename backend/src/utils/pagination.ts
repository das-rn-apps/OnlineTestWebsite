export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const getPaginationParams = (query: any): Required<PaginationParams> => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const sort = query.sort || 'createdAt';
    const order = query.order === 'asc' ? 'asc' : 'desc';

    return { page, limit, sort, order };
};

export const getPaginationMeta = (
    page: number,
    limit: number,
    total: number
) => {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
};

export const getSkipLimit = (page: number, limit: number) => {
    return {
        skip: (page - 1) * limit,
        limit,
    };
};
