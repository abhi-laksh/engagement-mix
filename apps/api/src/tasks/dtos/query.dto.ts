import { ApiProperty } from '@nestjs/swagger';
import { SortOrder, TASK_SORT_FIELDS, TaskStatus } from '../../shared/constants';

export class QueryTasksDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
    default: 1,
  })
  page?: number;

  @ApiProperty({
    description: 'Number of tasks per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10,
  })
  limit?: number;

  @ApiProperty({
    description: 'Filter tasks by status',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    required: false,
  })
  status?: TaskStatus;

  @ApiProperty({
    description: 'Search tasks by title or description',
    example: 'documentation',
    maxLength: 100,
    required: false,
  })
  search?: string;

  @ApiProperty({
    description: 'Field to sort by',
    enum: TASK_SORT_FIELDS,
    example: 'createdAt',
    required: false,
    default: 'createdAt',
  })
  sortBy?: string;

  @ApiProperty({
    description: 'Sort order',
    enum: SortOrder,
    example: SortOrder.DESC,
    required: false,
    default: SortOrder.DESC,
  })
  sortOrder?: SortOrder;
}



export class TasksResponseDto {
  @ApiProperty({
    description: 'Array of tasks',
    type: [Object],
  })
  tasks: any[];

  @ApiProperty({
    description: 'Total number of tasks',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of tasks per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;
}