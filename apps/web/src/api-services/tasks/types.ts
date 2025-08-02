// Task API types - reusing existing types with DRY principles
import { CreateTaskData, Task, TaskStatus } from "../../types/task";

// Reuse existing Task interface as API response
export type TasksResponse = Task & {
  order: number; // API-specific field
};

// Reuse existing CreateTaskData
export type CreateTasksRequest = CreateTaskData;

// Use Partial utility type for updates
export type UpdateTasksRequest = Partial<CreateTaskData>;

// Sort order enum (API-specific)
export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

// Query parameters for API
export interface QueryTasksRequest {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  search?: string;
  sortBy?: keyof Task;
  sortOrder?: SortOrder;
  dueDate?: string; // YYYY-MM-DD format
}

// Paginated response wrapper
export interface TasksListResponse {
  tasks: TasksResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Simple API response for delete
export interface DeleteTasksResponse {
  message: string;
}

// Re-export commonly used types
export { TaskStatus };
export type { CreateTaskData, Task };

