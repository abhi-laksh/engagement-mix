import { Task } from "@/types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskItem from "./TaskItem";

interface DraggableTaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export default function DraggableTaskItem({ task, onEdit }: DraggableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskItem 
        task={task} 
        onEdit={onEdit}
        dragHandleProps={listeners}
      />
    </div>
  );
}