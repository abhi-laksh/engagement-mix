import { Task } from "@/types/task";
import { Box, Text } from "@mantine/core";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Box className="text-center py-12">
        <Text size="lg" c="dimmed">
          No tasks yet. Create your first task to get started!
        </Text>
      </Box>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}