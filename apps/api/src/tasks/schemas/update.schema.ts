import { createTaskSchema } from './create.schema';

export const updateTaskSchema = createTaskSchema.fork(
  ['title', 'dueDate'],
  (schema) => schema.optional(),
).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});