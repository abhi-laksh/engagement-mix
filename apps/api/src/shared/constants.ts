export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export const TASK_SORT_FIELDS = [
  'title',
  'status',
  'dueDate',
  'createdAt',
  'updatedAt',
] as const;

export type TaskSortField = (typeof TASK_SORT_FIELDS)[number];