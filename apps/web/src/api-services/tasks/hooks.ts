import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  toggleTaskComplete,
  updateTask
} from "./requests";
import type { CreateTasksRequest, QueryTasksRequest, UpdateTasksRequest } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useGetTasks(params?: QueryTasksRequest, options?: any) {
  return useQuery({
    queryKey: ["tasks", "list", params],
    queryFn: async () => await getTasks(params),
    ...options,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useGetTaskById(id: string, options?: any) {
  return useQuery({
    queryKey: ["tasks", "detail", id],
    queryFn: async () => await getTaskById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: async (data: CreateTasksRequest) => {
      return await createTask(data);
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTasksRequest }) => {
      return await updateTask(id, data);
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteTask(id);
    },
  });
}

export function useToggleTaskComplete() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await toggleTaskComplete(id);
    },
  });
}