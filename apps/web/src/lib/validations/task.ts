import { TaskStatus } from "@/types/task";
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters"),
  // YYYY-MM-DD
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  status: z.enum(Object.values(TaskStatus) as [string, ...string[]]),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;