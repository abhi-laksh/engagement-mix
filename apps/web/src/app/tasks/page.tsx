"use client";

import SortableTaskList from "@/components/tasks/SortableTaskList";
import { AddTaskModal, EditTaskModal } from "@/components/tasks/TaskFormModal";
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
  const { tasks, setTasks } = useTaskStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Initialize with mock data on first load
  useEffect(() => {
    if (tasks.length === 0) {
      setTasks(mockTasks);
    }
  }, [tasks.length, setTasks]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" align="center" mb="xl">
        <Title order={1} size="h2">
          My Tasks
        </Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setIsAddModalOpen(true)}
          size="md"
        >
          Add Task
        </Button>
      </Group>

      <SortableTaskList tasks={tasks} onEditTask={handleEditTask} />

      <AddTaskModal
        opened={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditTaskModal
        opened={isEditModalOpen}
        onClose={handleCloseEditModal}
        task={editingTask}
      />
    </Container>
  );
}