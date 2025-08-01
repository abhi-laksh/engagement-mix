import * as Joi from 'joi';

const otpLength = Number(process.env.OTP_LENGTH || '6');

export const verifyOtpSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  otp: Joi.string()
    .length(otpLength)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': `OTP must be exactly ${otpLength} digits`,
      'string.pattern.base': 'OTP must contain only numbers',
      'any.required': 'OTP is required',
    }),
});