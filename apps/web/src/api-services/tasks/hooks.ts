import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useTaskStore } from "../../store/taskStore";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  toggleTaskComplete,
  updateTask,
} from "./requests";
import type {
  CreateTasksRequest,
  QueryTasksRequest,
  Task,
  TasksListResponse,
  UpdateTasksRequest,
} from "./types";

export function useGetTasks(
  params?: QueryTasksRequest,
  options?: UseQueryOptions
) {
  return useQuery({
    queryKey: ["tasks", "list", params],
    queryFn: async () => {
      const response = await getTasks(params);
      return response.data as TasksListResponse;
    },
    ...options,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useGetTaskById(id: string, options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["tasks", "detail", id],

    queryFn: async () => await getTaskById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateTask() {
  const { addTask, replaceTaskId, deleteTask } = useTaskStore();
  

  return useMutation<
    Awaited<ReturnType<typeof createTask>>,
    Error,
    CreateTasksRequest,
    { tempId: string }
  >({
    mutationFn: async (data: CreateTasksRequest) => {
      return await createTask(data);
    },
    onMutate: (data) => {
      console.log("OnMutate data", data);
      const tempId = nanoid();
      const tempTask = { ...data, _id: tempId };
      addTask(tempTask);
      return { tempId };
    },
    onSuccess: (response, _data, context) => {
      console.log("OnSuccess data", response, _data, context);
      if (context?.tempId && response.data._id) {
        replaceTaskId(context.tempId, response.data._id);
      }
    },
    onError: (_err, _data, context) => {
      if (context?.tempId) {
        deleteTask(context.tempId);
        console.log(
          "onError useTaskStore.getState()",
          useTaskStore.getState()
        );
      }
    },
  });
}

export function useUpdateTask() {
  const updateTaskStore = useTaskStore((state) => state.updateTask);
  const getTaskById = useTaskStore((state) => state.getTaskById);

  return useMutation<
    Awaited<ReturnType<typeof updateTask>>,
    Error,
    { id: string; data: UpdateTasksRequest },
    { previousTask: Task | undefined }
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTasksRequest;
    }) => {
      return await updateTask(id, data);
    },
    onMutate: ({ id, data }) => {
      const previousTask = getTaskById(id);
      updateTaskStore(id, data as Partial<Task>);
      return { previousTask };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousTask) {
        updateTaskStore(id, context.previousTask);
      }
    },
  });
}

export function useDeleteTask() {
  const deleteTaskStore = useTaskStore((state) => state.deleteTask);
  const getTaskById = useTaskStore((state) => state.getTaskById);
  const addTask = useTaskStore((state) => state.addTask);

  return useMutation<
    Awaited<ReturnType<typeof deleteTask>>,
    Error,
    string,
    { deletedTask: Task | undefined }
  >({
    mutationFn: async (id: string) => {
      return await deleteTask(id);
    },
    onMutate: (id) => {
      const deletedTask = getTaskById(id);
      deleteTaskStore(id);
      return { deletedTask };
    },
    onError: (_err, _id, context) => {
      if (context?.deletedTask) {
        addTask(context.deletedTask);
      }
    },
  });
}

export function useToggleTaskComplete() {
  const toggleTaskCompleteStore = useTaskStore(
    (state) => state.toggleTaskComplete
  );

  return useMutation<
    Awaited<ReturnType<typeof toggleTaskComplete>>,
    Error,
    string,
    { id: string }
  >({
    mutationFn: async (id: string) => {
      return await toggleTaskComplete(id);
    },
    onMutate: (id) => {
      toggleTaskCompleteStore(id);
      return { id };
    },
    onError: (_err, id) => {
      // Revert the toggle on error
      toggleTaskCompleteStore(id);
    },
  });
}
