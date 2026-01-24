import Joi from 'joi';

export const createExamSchema = Joi.object({
    name: Joi.string().required().min(3).max(200),
    code: Joi.string().required().min(2).max(50).uppercase(),
    description: Joi.string().optional(),
    category: Joi.string().required(),
    subjects: Joi.array().items(
        Joi.object({
            code: Joi.string().required(),
            name: Joi.string().required(),
            topics: Joi.array().items(Joi.string()),
            subtopics: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    topics: Joi.array().items(Joi.string()),
                })
            ),
        })
    ),
    instructions: Joi.array().items(Joi.string()),
    isActive: Joi.boolean().optional(),
});

export const updateExamSchema = Joi.object({
    name: Joi.string().optional().min(3).max(200),
    description: Joi.string().optional(),
    category: Joi.string().optional(),
    subjects: Joi.array().optional(),
    instructions: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
});
