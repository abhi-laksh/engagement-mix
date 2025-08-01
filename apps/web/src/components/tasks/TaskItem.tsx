import { useTaskStore } from "@/store/taskStore";
import { Task, TaskStatus } from "@/types/task";
import { ActionIcon, Box, Card, Checkbox, Group, Menu, Text } from "@mantine/core";
import {
    IconAdjustments,
    IconCircleCheck,
    IconCircleDashedX,
    IconEdit,
    IconMenuOrder,
    IconProgress,
    IconTimeDuration0,
    IconTrash
} from "@tabler/icons-react";


interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  dragHandleProps?: any;
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

export default function TaskItem({ task, onEdit, dragHandleProps }: TaskItemProps) {
  const { toggleTaskComplete, deleteTask } = useTaskStore();
  const statusInfo = statusConfig[task.status];
  const StatusIcon = statusInfo.icon;
  const isCompleted = task.status === TaskStatus.COMPLETED;

  const handleToggleComplete = () => {
    toggleTaskComplete(task.id);
  };

  const handleEdit = () => {
    onEdit?.(task);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-4 group">
      <div className="flex items-center gap-3">
        {/* Left side: Checkbox and Drag Handle */}
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isCompleted}
            onChange={handleToggleComplete}
            size="md"
            className="flex-shrink-0"
          />
          
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            className={`${dragHandleProps ? 'cursor-grab' : 'cursor-default'} opacity-50 group-hover:opacity-100 transition-opacity`}
            {...(dragHandleProps || {})}
          >
            <IconMenuOrder size={16} />
          </ActionIcon>
        </div>

        {/* Main content */}
        <Box className="flex-1">
          <div className="flex justify-between items-start">
            <Box className="flex-1 mr-4">
              <Text 
                size="lg" 
                fw={600} 
                className={`mb-2 ${isCompleted ? 'line-through text-gray-500' : ''}`}
              >
                {task.title}
              </Text>
              <Text 
                size="sm" 
                c="dimmed" 
                className={`line-clamp-2 ${isCompleted ? 'line-through' : ''}`}
              >
                {task.description}
              </Text>
            </Box>
            
            <div className="flex items-center gap-3 min-w-fit">
              {/* Status indicator */}
              <div className="flex flex-col items-end space-y-2">
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

              {/* Actions menu */}
              <Menu shadow="md" width={150}>
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="md"
                    className="opacity-50 group-hover:opacity-100 transition-opacity"
                  >
                    <IconAdjustments size={16} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={handleEdit}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={handleDelete}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        </Box>
      </div>
    </Card>
  );
}