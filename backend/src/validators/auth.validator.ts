import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(100),
    phone: Joi.string().optional().pattern(/^[0-9]{10}$/),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
});
