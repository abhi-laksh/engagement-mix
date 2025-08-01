import * as Joi from 'joi';
import { SortOrder, TASK_SORT_FIELDS, TaskStatus } from '../../shared/constants';

export const queryTasksSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must not exceed 100',
  }),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .messages({
      'any.only': 'Status must be one of: NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELLED',
    }),
  search: Joi.string().trim().max(100).messages({
    'string.max': 'Search query must not exceed 100 characters',
  }),
  sortBy: Joi.string()
    .valid(...TASK_SORT_FIELDS)
    .default('createdAt')
    .messages({
      'any.only': `Sort field must be one of: ${TASK_SORT_FIELDS.join(', ')}`,
    }),
  sortOrder: Joi.string()
    .valid(...Object.values(SortOrder))
    .default(SortOrder.DESC)
    .messages({
      'any.only': 'Sort order must be either "asc" or "desc"',
    }),
});

