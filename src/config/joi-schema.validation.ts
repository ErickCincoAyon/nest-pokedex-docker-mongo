import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MONGODB: Joi.required(),
    PORT: Joi.number().default(3000),
    PAGINATION_LIMIT: Joi.number().default(10),
    PAGINATION_OFFSET: Joi.number().default(0),
})