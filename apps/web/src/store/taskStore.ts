import { CreateTaskData, Task, TaskStatus } from '@/types/task';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

interface TaskActions {
  addTask: (task: CreateTaskData) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  getTaskById: (id: string) => Task | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksCount: () => number;
  getCompletedTasksCount: () => number;
}

type TaskStore = TaskState & TaskActions;

const generateId = () => Date.now().toString();

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const useTaskStore = create<TaskStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      addTask: (taskData: CreateTaskData) => {
        const newTask: Task = {
          id: generateId(),
          ...taskData,
          dueDate: new Date(taskData.dueDate),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
          error: null,
        }), false, 'addTask');
      },

      updateTask: (id: string, updates: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
          error: null,
        }), false, 'updateTask');
      },

      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          error: null,
        }), false, 'deleteTask');
      },

      toggleTaskComplete: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: task.status === TaskStatus.COMPLETED 
                    ? TaskStatus.NOT_STARTED 
                    : TaskStatus.COMPLETED,
                  updatedAt: new Date(),
                }
              : task
          ),
          error: null,
        }), false, 'toggleTaskComplete');
      },

      reorderTasks: (startIndex: number, endIndex: number) => {
        set((state) => {
          const tasks = [...state.tasks];
          const [reorderedItem] = tasks.splice(startIndex, 1);
          tasks.splice(endIndex, 0, reorderedItem);
          
          return {
            tasks: tasks.map((task, index) => ({
              ...task,
              updatedAt: new Date(),
            })),
            error: null,
          };
        }, false, 'reorderTasks');
      },


      setTasks: (tasks: Task[]) => {
        set({ tasks, error: null }, false, 'setTasks');
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading }, false, 'setLoading');
      },

      setError: (error: string | null) => {
        set({ error }, false, 'setError');
      },

      clearError: () => {
        set({ error: null }, false, 'clearError');
      },

      getTaskById: (id: string) => {
        return get().tasks.find((task) => task.id === id);
      },

      getTasksByStatus: (status: TaskStatus) => {
        return get().tasks.filter((task) => task.status === status);
      },

      getTasksCount: () => {
        return get().tasks.length;
      },

      getCompletedTasksCount: () => {
        return get().tasks.filter((task) => task.status === TaskStatus.COMPLETED).length;
      },
    }),
    {
      name: 'task-store',
    }
  )
);