import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../shared/constants';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
    example: 'Complete project documentation',
    maxLength: 100,
  })
  title: string;

  @ApiProperty({
    description: 'Description of the task',
    example:
      'Write comprehensive documentation for the new task management system',
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
    description: 'Initial status of the task',
    enum: TaskStatus,
    example: TaskStatus.NOT_STARTED,
    required: false,
    default: TaskStatus.NOT_STARTED,
  })
  status?: TaskStatus;
}
