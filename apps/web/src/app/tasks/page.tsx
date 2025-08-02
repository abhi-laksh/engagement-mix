"use client";

import {
  useCreateTask,
  useGetTasks,
  useUpdateTask
} from "@/api-services/tasks";
import { TaskStatus as APITaskStatus, QueryTasksRequest, TasksListResponse } from "@/api-services/tasks/types";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FilterTask from "@/components/tasks/FilterTask";
import SortableTaskList from "@/components/tasks/SortableTaskList";
import TaskFormModal from "@/components/tasks/TaskFormModal/TaskFormModal";
import { CreateTaskFormData } from "@/lib/validations/task";
import { useAuthStore } from "@/store/authStore";
import { useTaskStore } from "@/store/taskStore";
import { Task, TaskStatus } from "@/types/task";
import { Button, Container, Group, Title } from "@mantine/core";
import { IconLogout, IconPlus } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function TasksPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Create query parameters from URL
  const queryParams = useMemo((): QueryTasksRequest => {
    const params: QueryTasksRequest = {};
    
    const status = searchParams.get("status");
    const dueDate = searchParams.get("dueDate");
    
    // Only add non-empty values
    if (status && status.trim() !== "") {
      params.status = status as APITaskStatus;
    }
    
    if (dueDate && dueDate.trim() !== "") {
      params.dueDate = dueDate;
    }
    
    return params;
  }, [searchParams]);

  // Use mutation and query hooks
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const { data: tasksData } = useGetTasks(queryParams) as { data: TasksListResponse | undefined };

  // Access zustand stores
  const { setTasks } = useTaskStore();
  const allTasks = useTaskStore((state) => state.allTasks);
  const tasksById = useTaskStore((state) => state.tasksById);
  const { user, clearAuth } = useAuthStore();

  // Update store when data changes
  useEffect(() => {
    if (tasksData && tasksData.tasks) {
      setTasks(tasksData.tasks);
    }
  }, [tasksData, setTasks]);

  // Get tasks array from normalized state
  const tasks = allTasks.map((id) => tasksById[id]).filter(Boolean);

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
        id: task._id,
        data: {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          status: data.status as TaskStatus,
        },
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

  const handleLogout = () => {
    clearAuth();
    router.push("/auth");
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" align="center" mb="xl">
        <div>
          <Title order={1} size="h2">
            My Tasks
          </Title>
          {user && (
            <Title order={6} size="sm" c="dimmed">
              Welcome, {user.email}
            </Title>
          )}
        </div>
        <Group gap="sm">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleAddTask}
            size="md"
          >
            Add Task
          </Button>
          <Button
            variant="outline"
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
            size="md"
            color="red"
          >
            Logout
          </Button>
        </Group>
      </Group>

      <FilterTask />

      <SortableTaskList onEditTask={handleEditTask} />

      <TaskFormModal
        opened={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
}

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <TasksPageContent />
    </ProtectedRoute>
  );
}
