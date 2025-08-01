import * as Joi from 'joi';
import { TaskStatus } from '../../shared/constants';

export const createTaskSchema = Joi.object({
  title: Joi.string().required().trim().max(100).messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must not exceed 100 characters',
  }),
  description: Joi.string().allow('').trim().max(500).messages({
    'string.max': 'Description must not exceed 500 characters',
  }),
  dueDate: Joi.date().required().messages({
    'date.base': 'Due date must be a valid date',
    'any.required': 'Due date is required',
  }),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .default(TaskStatus.NOT_STARTED)
    .messages({
      'any.only': 'Status must be one of: NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELLED',
    }),
});