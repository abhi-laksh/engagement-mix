"use client";

import { useCreateTask, useGetTasks, useUpdateTask } from "@/api-services/tasks";
import SortableTaskList from "@/components/tasks/SortableTaskList";
import TaskFormModal from "@/components/tasks/TaskFormModal/TaskFormModal";
import { CreateTaskFormData } from "@/lib/validations/task";
import { useTaskStore } from "@/store/taskStore";
import { Task, TaskStatus } from "@/types/task";
import { Button, Container, Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";

// Mock data for initial load
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the new task management system including API endpoints, component usage, and deployment instructions.",
    dueDate: new Date("2024-12-25"),
    status: TaskStatus.IN_PROGRESS,
    createdAt: new Date("2024-12-15"),
    updatedAt: new Date("2024-12-20"),
  },
  {
    id: "2", 
    title: "Review code changes",
    description: "Review and approve pending pull requests for the authentication module.",
    dueDate: new Date("2024-12-23"),
    status: TaskStatus.NOT_STARTED,
    createdAt: new Date("2024-12-18"),
    updatedAt: new Date("2024-12-18"),
  },
  {
    id: "3",
    title: "Deploy to production",
    description: "Deploy the latest version of the application to production environment after testing.",
    dueDate: new Date("2024-12-30"),
    status: TaskStatus.COMPLETED,
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-22"),
  },
  {
    id: "4",
    title: "Update dependencies",
    description: "Update all npm packages to their latest versions and test for compatibility issues.",
    dueDate: new Date("2024-12-28"),
    status: TaskStatus.CANCELLED,
    createdAt: new Date("2024-12-16"),
    updatedAt: new Date("2024-12-21"),
  },
];

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Use query hooks
  const { data: tasksData, isLoading } = useGetTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  
  // Access zustand store for getting tasks from normalized state
  const allTasks = useTaskStore(state => state.allTasks);
  const tasksById = useTaskStore(state => state.tasksById);
  const setTasks = useTaskStore(state => state.setTasks);
  
  // Get tasks array from normalized state
  const tasks = allTasks.map(id => tasksById[id]).filter(Boolean);

  // Initialize with server data when available, fallback to mock data
  useEffect(() => {
    if ((tasksData as any)?.data?.tasks) {
      setTasks((tasksData as any).data.tasks);
    } else if (tasks.length === 0 && !isLoading) {
      // Fallback to mock data if no server data and not loading
      setTasks(mockTasks);
    }
  }, [tasksData, setTasks, tasks.length, isLoading]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleFormSubmit = (data: CreateTaskFormData, task?: Task | null) => {
    if (task) {
      // Edit mode
      updateTaskMutation.mutate({
        id: task.id,
        data: {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          status: data.status as TaskStatus,
        }
      });
    } else {
      // Add mode
      createTaskMutation.mutate({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        status: data.status as TaskStatus,
      });
    }
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" align="center" mb="xl">
        <Title order={1} size="h2">
          My Tasks
        </Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleAddTask}
          size="md"
        >
          Add Task
        </Button>
      </Group>

      <SortableTaskList tasks={tasks} onEditTask={handleEditTask} />

      <TaskFormModal
        opened={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
}