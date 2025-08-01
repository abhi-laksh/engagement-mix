import { CreateTaskData, Task, TaskStatus } from '@/types/task';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TaskState {
  allTasks: string[];
  tasksById: Record<string, Task>;
}

interface TaskActions {
  addTask: (task: CreateTaskData | (CreateTaskData & { id: string }) | Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  replaceTaskId: (tempId: string, realId: string) => void;
  setTasks: (tasks: Task[]) => void;
  getTaskById: (id: string) => Task | undefined;
}

type TaskStore = TaskState & TaskActions;

const initialState: TaskState = {
  allTasks: [],
  tasksById: {},
};

export const useTaskStore = create<TaskStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      addTask: (taskData: CreateTaskData | (CreateTaskData & { id: string }) | Task) => {
        let newTask: Task;
        
        if ('createdAt' in taskData) {
          // Already a Task
          newTask = taskData as Task;
        } else {
          // CreateTaskData with or without id
          const createData = taskData as CreateTaskData | (CreateTaskData & { id: string });
          newTask = {
            id: 'id' in createData ? createData.id : nanoid(),
            title: createData.title,
            description: createData.description,
            dueDate: new Date(createData.dueDate),
            status: createData.status,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
        
        set((state) => ({
          allTasks: [...state.allTasks, newTask.id],
          tasksById: { ...state.tasksById, [newTask.id]: newTask },
        }), false, 'addTask');
      },

      updateTask: (id: string, updates: Partial<Task>) => {
        set((state) => {
          const task = state.tasksById[id];
          if (!task) return state;
          
          return {
            tasksById: {
              ...state.tasksById,
              [id]: { ...task, ...updates, updatedAt: new Date() }
            },
          };
        }, false, 'updateTask');
      },

      deleteTask: (id: string) => {
        set((state) => {
          const { [id]: deleted, ...restTasks } = state.tasksById;
          return {
            allTasks: state.allTasks.filter(taskId => taskId !== id),
            tasksById: restTasks,
          };
        }, false, 'deleteTask');
      },

      toggleTaskComplete: (id: string) => {
        set((state) => {
          const task = state.tasksById[id];
          if (!task) return state;
          
          const newStatus = task.status === TaskStatus.COMPLETED 
            ? TaskStatus.NOT_STARTED 
            : TaskStatus.COMPLETED;
            
          return {
            tasksById: {
              ...state.tasksById,
              [id]: { ...task, status: newStatus, updatedAt: new Date() }
            },
          };
        }, false, 'toggleTaskComplete');
      },

      reorderTasks: (startIndex: number, endIndex: number) => {
        set((state) => {
          const allTasks = [...state.allTasks];
          const [reorderedId] = allTasks.splice(startIndex, 1);
          allTasks.splice(endIndex, 0, reorderedId);
          
          return {
            allTasks,
          };
        }, false, 'reorderTasks');
      },

      replaceTaskId: (tempId: string, realId: string) => {
        set((state) => {
          const task = state.tasksById[tempId];
          if (!task) return state;
          
          const { [tempId]: tempTask, ...restTasks } = state.tasksById;
          return {
            allTasks: state.allTasks.map(id => id === tempId ? realId : id),
            tasksById: { ...restTasks, [realId]: { ...tempTask, id: realId } },
          };
        }, false, 'replaceTaskId');
      },

      setTasks: (tasks: Task[]) => {
        const tasksById = tasks.reduce((acc, task) => {
          acc[task.id] = task;
          return acc;
        }, {} as Record<string, Task>);
        
        set({ 
          allTasks: tasks.map(task => task.id),
          tasksById,
        }, false, 'setTasks');
      },

      getTaskById: (id: string) => {
        return get().tasksById[id];
      },
    }),
    {
      name: 'task-store',
    }
  )
);