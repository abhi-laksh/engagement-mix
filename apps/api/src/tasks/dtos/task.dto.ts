import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../shared/constants';

export class TaskDto {
  @ApiProperty({
    description: 'Unique identifier of the task',
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the task',
    example: 'Complete project documentation',
    maxLength: 100,
  })
  title: string;

  @ApiProperty({
    description: 'Description of the task',
    example: 'Write comprehensive documentation for the new task management system',
    required: false,
    maxLength: 500,
  })
  description?: string;

  @ApiProperty({
    description: 'Due date of the task',
    example: '2024-12-25T00:00:00.000Z',
    type: Date,
  })
  dueDate: Date;

  @ApiProperty({
    description: 'Current status of the task',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Order of the task for sorting',
    example: 0,
  })
  order: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-12-20T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-12-20T15:30:00.000Z',
  })
  updatedAt: Date;
}