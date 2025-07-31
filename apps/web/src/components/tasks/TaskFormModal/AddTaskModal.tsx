"use client";

import { CreateTaskFormData, createTaskSchema } from "@/lib/validations/task";
import { CreateTaskData, TaskStatus } from "@/types/task";
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
import { useForm } from "react-hook-form";
import DateInput from "./DateInput";
import StatusInput from "./StatusInput";

interface AddTaskModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => void;
}

export default function AddTaskModal({ opened, onClose, onSubmit }: AddTaskModalProps) {
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

  const handleSubmit = (data: CreateTaskFormData) => {
    onSubmit({
      ...data,
      status: data.status as TaskStatus
    });
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Add New Task"
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
              Create Task
            </Button>
          </Group>
        </div>
      </form>
    </Modal>
  );
}