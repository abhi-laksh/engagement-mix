"use client";

import { TaskStatus } from "@/types/task";
import { Box, Text } from "@mantine/core";
import {
    IconCircleCheck,
    IconCircleDashedX,
    IconProgress,
    IconTimeDuration0
} from "@tabler/icons-react";
import { Control, Controller, FieldError } from "react-hook-form";

interface StatusInputProps {
  name: string;
  control: Control<any>;
  error?: FieldError;
  label?: string;
}

const statusOptions = [
  {
    value: TaskStatus.NOT_STARTED,
    label: "Not Started",
    icon: IconTimeDuration0,
    color: "#6B7280"
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: "In Progress", 
    icon: IconProgress,
    color: "#3B82F6"
  },
  {
    value: TaskStatus.COMPLETED,
    label: "Completed",
    icon: IconCircleCheck,
    color: "#10B981"
  },
  {
    value: TaskStatus.CANCELLED,
    label: "Cancelled",
    icon: IconCircleDashedX,
    color: "#EF4444"
  }
];

export default function StatusInput({ 
  name,
  control,
  error,
  label = "Status" 
}: StatusInputProps) {
  return (
    <Box>
      <Text size="sm" fw={500} mb="xs">
        {label}
      </Text>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = field.value === option.value;
              
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(option.value)}
                  className={`p-3 cursor-pointer rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                    isSelected 
                      ? 'border-blue-500 shadow-md bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Icon size={18} color={option.color} />
                  <Text size="sm" fw={500} style={{ color: option.color }}>
                    {option.label}
                  </Text>
                </button>
              );
            })}
          </div>
        )}
      />
      {error && (
        <Text size="sm" c="red" mt="xs">
          {error.message}
        </Text>
      )}
    </Box>
  );
}