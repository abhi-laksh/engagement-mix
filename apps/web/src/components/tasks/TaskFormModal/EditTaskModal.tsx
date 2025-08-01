"use client";

import { CreateTaskFormData, createTaskSchema } from "@/lib/validations/task";
import { useTaskStore } from "@/store/taskStore";
import { Task, TaskStatus } from "@/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Button,
    Group,
    Modal,
    Stack,
    Text,
    TextInput,
    Textarea
} from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import DateInput from "./DateInput";
import StatusInput from "./StatusInput";

interface EditTaskModalProps {
  opened: boolean;
  onClose: () => void;
  task: Task | null;
}

export default function EditTaskModal({ opened, onClose, task }: EditTaskModalProps) {
  const { updateTask } = useTaskStore();

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date().toISOString().split('T')[0],
      status: TaskStatus.NOT_STARTED,
    },
  });

  // Update form when task changes
  useEffect(() => {
    if (task && opened) {
      form.reset({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.toISOString().split('T')[0],
        status: task.status,
      });
    }
  }, [task, opened, form]);

  const handleSubmit = (data: CreateTaskFormData) => {
    if (!task) return;
    
    updateTask(task.id, {
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate),
      status: data.status as TaskStatus,
    });
    
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!task) return null;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Edit Task"
      size="lg"
      centered
      styles={{
        body: { padding: 0 },
        header: { padding: '1rem 1.5rem', borderBottom: '1px solid #e9ecef' },
      }}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
        <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
          <Stack gap="lg">
            <Box>
              <Text size="sm" fw={500} mb="sm">
                Title
              </Text>
              <TextInput
                {...form.register("title")}
                placeholder="Enter task title"
                error={form.formState.errors.title?.message}
                size="md"
                required
              />
            </Box>

            <Box>
              <Text size="sm" fw={500} mb="sm">
                Description
              </Text>
              <Textarea
                {...form.register("description")}
                placeholder="Enter task description"
                error={form.formState.errors.description?.message}
                size="md"
                rows={4}
              />
            </Box>

            <DateInput
              name="dueDate"
              control={form.control}
              error={form.formState.errors.dueDate}
              required
            />

            <StatusInput
              name="status"
              control={form.control}
              error={form.formState.errors.status}
            />
          </Stack>
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <Group justify="flex-end">
            <Button variant="subtle" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={form.formState.isSubmitting}
              disabled={!form.formState.isValid && form.formState.isSubmitted}
            >
              Update Task
            </Button>
          </Group>
        </div>
      </form>
    </Modal>
  );
}