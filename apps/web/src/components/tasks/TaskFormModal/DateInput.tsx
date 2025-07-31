"use client";

import { Box, Popover, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconCalendarEvent } from "@tabler/icons-react";
import { useState } from "react";
import { Control, Controller, FieldError } from "react-hook-form";

interface DateInputProps {
  name: string;
  control: Control<any>;
  error?: FieldError;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function DateInput({ 
  name,
  control,
  error, 
  label = "Due Date",
  placeholder = "Select due date",
  required = false
}: DateInputProps) {
  const [opened, setOpened] = useState(false);

  return (
    <Box>
      <Text size="sm" fw={500} mb="sm">
        {label} {required && <span className="text-red-500">*</span>}
      </Text>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover
            opened={opened}
            onChange={setOpened}
            position="bottom-start"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <div
                role="button"
                onClick={() => setOpened(true)}
                className="w-full p-3 cursor-pointer border-2 border-gray-300 rounded-md hover:border-blue-400 focus:border-blue-500 focus:outline-none transition-colors flex items-center gap-3 bg-white"
              >
                <IconCalendarEvent size={18} className="text-gray-500" />
                <Text size="md" className="flex-1 text-left">
                  {field.value ? new Date(field.value).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: '2-digit', 
                    year: 'numeric' 
                  }) : placeholder}
                </Text>
              </div>
            </Popover.Target>
            <Popover.Dropdown>
              <DatePicker
                value={field.value ? new Date(field.value) : null}
                onChange={(value: Date | string | null) => {
                  if (value) {
                    if (value instanceof Date) {
                      const dateString = value.toISOString().split('T')[0];
                      field.onChange(dateString);
                    } else if (typeof value === 'string') {
                      field.onChange(value);
                    }
                  } else {
                    field.onChange('');
                  }
                  setOpened(false);
                }}
                size="md"
              />
            </Popover.Dropdown>
          </Popover>
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