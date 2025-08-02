"use client";

import { TaskStatus } from "@/types/task";
import { ActionIcon, Group, NativeSelect } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import DateInput from "./TaskFormModal/DateInput";

interface FilterForm {
  status: string;
  dueDate: string;
}

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: TaskStatus.NOT_STARTED, label: "Not Started" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.COMPLETED, label: "Completed" },
  { value: TaskStatus.CANCELLED, label: "Cancelled" },
];

export default function FilterTask() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { control, watch, setValue } = useForm<FilterForm>({
    defaultValues: {
      status: searchParams.get("status") || "",
      dueDate: searchParams.get("dueDate") || "",
    },
  });

  const watchedValues = watch();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value.trim() !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl);
  };

  // Update URL when form values change
  useEffect(() => {
    updateFilter("status", watchedValues.status);
  }, [watchedValues.status]);

  useEffect(() => {
    updateFilter("dueDate", watchedValues.dueDate);
  }, [watchedValues.dueDate]);

  const clearAllFilters = () => {
    setValue("status", "");
    setValue("dueDate", "");
    router.replace(window.location.pathname);
  };

  const hasFilters = watchedValues.status || watchedValues.dueDate;

  return (
    <Group gap="xs" align="end" mb="md">
      <NativeSelect
        data={statusOptions}
        value={watchedValues.status}
        onChange={(event) => setValue("status", event.currentTarget.value)}
        size="lg"
        w={200} 
        className="text-sm"
      />
      
      <div style={{ width: 150 }}>
        <DateInput
          name="dueDate"
          control={control}
          label=""
          placeholder="Filter by date"
        />
      </div>

      {hasFilters && (
        <ActionIcon
          variant="outline"
          color="red"
          size="input-lg"
          onClick={clearAllFilters}
        >
          <IconX size={24} />
        </ActionIcon>
      )}
    </Group>
  );
}