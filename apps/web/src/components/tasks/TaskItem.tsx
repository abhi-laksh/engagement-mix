import { Task, TaskStatus } from "@/types/task";
import { Box, Card, Group, Text } from "@mantine/core";
import {
    IconCircleCheck,
    IconCircleDashedX,
    IconProgress,
    IconTimeDuration0
} from "@tabler/icons-react";


interface TaskItemProps {
  task: Task;
}

const statusConfig = {
  [TaskStatus.NOT_STARTED]: {
    icon: IconTimeDuration0,
    color: "#6B7280",
    text: "Not Started"
  },
  [TaskStatus.IN_PROGRESS]: {
    icon: IconProgress,
    color: "#3B82F6",
    text: "In Progress"
  },
  [TaskStatus.COMPLETED]: {
    icon: IconCircleCheck,
    color: "#10B981",
    text: "Completed"
  },
  [TaskStatus.CANCELLED]: {
    icon: IconCircleDashedX,
    color: "#EF4444",
    text: "Cancelled"
  }
};

export default function TaskItem({ task }: TaskItemProps) {
  const statusInfo = statusConfig[task.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <Box className="flex-1 mr-4">
            <Text size="lg" fw={600} className="mb-2">
              {task.title}
            </Text>
            <Text size="sm" c="dimmed" className="line-clamp-2">
              {task.description}
            </Text>
          </Box>
          
          <div className="flex flex-col items-end space-y-2 min-w-fit">
            <Group gap="xs" className="flex-nowrap">
              <StatusIcon size={18} color={statusInfo.color} />
              <Text size="sm" fw={500} style={{ color: statusInfo.color }}>
                {statusInfo.text}
              </Text>
            </Group>
            
            <Text size="xs" c="dimmed">
              {task.dueDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: '2-digit', 
                year: 'numeric' 
              })}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}