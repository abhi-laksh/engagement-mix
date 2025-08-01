import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JoiValidationPipe } from '../shared/pipes/joi-validation.pipe';
import { CreateTaskDto } from './dtos/create.dto';
import {
  QueryTasksDto,
  TasksResponseDto,
} from './dtos/query.dto';
import { TaskDto } from './dtos/task.dto';
import { UpdateTaskDto } from './dtos/update.dto';
import { createTaskSchema } from './schemas/create.schema';
import { queryTasksSchema } from './schemas/query.schema';
import { updateTaskSchema } from './schemas/update.schema';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto, description: 'Task creation data' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: TaskDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @UsePipes(new JoiValidationPipe(createTaskSchema, 'body'))
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tasks with filtering, sorting, and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    type: TasksResponseDto,
  })
  @UsePipes(new JoiValidationPipe(queryTasksSchema, 'query'))
  async findAll(@Query() queryDto: QueryTasksDto) {
    return this.tasksService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: TaskDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid task ID format',
  })
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific task' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  @ApiBody({ type: UpdateTaskDto, description: 'Task update data' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or task ID format',
  })
  @UsePipes(new JoiValidationPipe(updateTaskSchema, 'body'))
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific task' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Task deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid task ID format',
  })
  async remove(@Param('id') id: string) {
    await this.tasksService.remove(id);
    return { message: 'Task deleted successfully' };
  }

  @Patch(':id/toggle-complete')
  @ApiOperation({ summary: 'Toggle task completion status' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  @ApiResponse({
    status: 200,
    description: 'Task completion status toggled',
    type: TaskDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid task ID format',
  })
  async toggleComplete(@Param('id') id: string) {
    return this.tasksService.toggleComplete(id);
  }
}
