import { del, get, patch, post } from "../handler";
import { TASKS_ENDPOINTS } from "./constants";
import type {
  CreateTasksRequest,
  DeleteTasksResponse,
  QueryTasksRequest,
  TasksListResponse,
  TasksResponse,
  UpdateTasksRequest
} from "./types";

export const createTask = async (data: CreateTasksRequest) =>
  await post<TasksResponse, CreateTasksRequest>(
    TASKS_ENDPOINTS.CREATE_TASK,
    data
  );

export const getTasks = async (params?: QueryTasksRequest) =>
  await get<TasksListResponse>(TASKS_ENDPOINTS.GET_TASKS, {
    query: params,
  });

export const getTaskById = async (id: string) =>
  await get<TasksResponse>(TASKS_ENDPOINTS.GET_TASK_BY_ID, {
    pathParams: { id },
  });

export const updateTask = async (id: string, data: UpdateTasksRequest) =>
  await patch<TasksResponse, UpdateTasksRequest>(
    TASKS_ENDPOINTS.UPDATE_TASK,
    data,
    { pathParams: { id } }
  );

export const deleteTask = async (id: string) =>
  await del<DeleteTasksResponse>(TASKS_ENDPOINTS.DELETE_TASK, {
    pathParams: { id },
  });

export const toggleTaskComplete = async (id: string) =>
  await patch<TasksResponse, TasksResponse>(
    TASKS_ENDPOINTS.TOGGLE_COMPLETE,
    undefined,
    { pathParams: { id } }
  );