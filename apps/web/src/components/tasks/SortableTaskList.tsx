import { useTaskStore } from "@/store/taskStore";
import { Task } from "@/types/task";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    restrictToVerticalAxis,
    restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Box, Text } from "@mantine/core";
import DraggableTaskItem from "./DraggableTaskItem";

interface SortableTaskListProps {
  tasks: Task[];
  onEditTask?: (task: Task) => void;
}

export default function SortableTaskList({ tasks, onEditTask }: SortableTaskListProps) {
  const { reorderTasks } = useTaskStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      
      reorderTasks(oldIndex, newIndex);
    }
  };

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {tasks.map((task) => (
            <DraggableTaskItem
              key={task.id}
              task={task}
              onEdit={onEditTask}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}