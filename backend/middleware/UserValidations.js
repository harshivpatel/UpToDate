const bcrypt = require('bcrypt');
const Joi = require("joi");

// User Registration Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        userName: Joi.string()
            .min(3)
            .max(12)
            .required()
            .messages({
                "string.empty": "Username is required",
                "string.min": "Username must be at least 3 characters",
                "string.max": "Username must not exceed 12 characters",
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Invalid email format",
            }),

        password: Joi.string()
            .min(8)
            .max(20)
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
            .required()
            .messages({
                "string.empty": "Password is required",
                "string.min": "Password must be at least 8 characters",
                "string.max": "Password cannot be more than 20 characters",
                "string.pattern.base": "Password must have at least one uppercase letter, one lowercase letter, and one number",
            }),
    });

    return schema.validate(data, { abortEarly: false });
};

// User Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Invalid email format",
            }),

        password: Joi.string()
            .required()
            .messages({
                "string.empty": "Password is required",
            }),
    });

    return schema.validate(data);
};

// Export the validation functions
module.exports = { registerValidation, loginValidation };
