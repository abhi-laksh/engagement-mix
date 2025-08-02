import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtPayload } from 'src/auth/types/auth.type';
import { JoiValidationPipe } from '../shared/pipes/joi-validation.pipe';
import { CreateTaskDto } from './dtos/create.dto';
import { QueryTasksDto, TasksResponseDto } from './dtos/query.dto';
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
  @ApiBearerAuth()
  @UsePipes(new JoiValidationPipe(createTaskSchema, 'body'))
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.tasksService.create(createTaskDto, user);
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
  @ApiBearerAuth()
  @UsePipes(new JoiValidationPipe(queryTasksSchema, 'query'))
  async findAll(@Query() queryDto: QueryTasksDto, @GetUser() user: JwtPayload) {
    return this.tasksService.findAll(queryDto, user);
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
  @ApiBearerAuth()
  async findOne(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.tasksService.findOne(id, user);
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
  @ApiBearerAuth()
  @UsePipes(new JoiValidationPipe(updateTaskSchema, 'body'))
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
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
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @GetUser() user: JwtPayload) {
    await this.tasksService.remove(id, user);
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
  @ApiBearerAuth()
  async toggleComplete(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.tasksService.toggleComplete(id, user);
  }
}
