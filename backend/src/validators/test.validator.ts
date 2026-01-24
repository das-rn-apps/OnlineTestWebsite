import Joi from 'joi';

export const createTestSchema = Joi.object({
    examId: Joi.string().required(),
    title: Joi.string().required().min(3).max(200),
    type: Joi.string().required().valid('full_length', 'sectional', 'topic_wise', 'pyq', 'practice'),
    duration: Joi.number().required().min(1),
    totalMarks: Joi.number().required().min(1),
    difficulty: Joi.string().optional().valid('easy', 'medium', 'hard'),
    config: Joi.object({
        shuffleQuestions: Joi.boolean().optional(),
        shuffleOptions: Joi.boolean().optional(),
        showTimer: Joi.boolean().optional(),
        allowResume: Joi.boolean().optional(),
        showSolutions: Joi.boolean().optional(),
        negativeMarking: Joi.boolean().optional(),
        language: Joi.array().items(Joi.string().valid('en', 'hi')).optional(),
    }).optional(),
    isPaid: Joi.boolean().optional(),
    price: Joi.number().optional().min(0),
    scheduledStartTime: Joi.date().optional(),
    scheduledEndTime: Joi.date().optional(),
    instructions: Joi.array().items(Joi.string()).optional(),
});

export const updateTestSchema = Joi.object({
    title: Joi.string().optional().min(3).max(200),
    duration: Joi.number().optional().min(1),
    totalMarks: Joi.number().optional().min(1),
    difficulty: Joi.string().optional().valid('easy', 'medium', 'hard'),
    config: Joi.object().optional(),
    isPaid: Joi.boolean().optional(),
    price: Joi.number().optional().min(0),
    scheduledStartTime: Joi.date().optional(),
    scheduledEndTime: Joi.date().optional(),
    instructions: Joi.array().items(Joi.string()).optional(),
    isPublished: Joi.boolean().optional(),
});
