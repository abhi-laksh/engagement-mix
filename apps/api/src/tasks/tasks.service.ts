import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '../shared/constants';
import { throwIfInvalidObjectId } from '../shared/utils';
import { CreateTaskDto } from './dtos/create.dto';
import { QueryTasksDto } from './dtos/query.dto';
import { UpdateTaskDto } from './dtos/update.dto';
import { TaskDocument } from './schemas/db.schema';
import { TasksQueryResult, TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    return this.tasksRepository.create(createTaskDto);
  }

  async findAll(queryDto: QueryTasksDto): Promise<TasksQueryResult> {
    return this.tasksRepository.findAll(queryDto);
  }

  async findOne(id: string): Promise<TaskDocument> {
    throwIfInvalidObjectId(id);

    const task = await this.tasksRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    throwIfInvalidObjectId(id);

    const updatedTask = await this.tasksRepository.update(id, updateTaskDto);
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    throwIfInvalidObjectId(id);

    const deletedTask = await this.tasksRepository.delete(id);
    if (!deletedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async reorderTasks(taskIds: string[]): Promise<void> {
    // Validate all task IDs
    taskIds.forEach((id) => throwIfInvalidObjectId(id, 'taskId'));

    // Verify all tasks exist
    const existingTasks = await this.tasksRepository.findByIds(taskIds);
    if (existingTasks.length !== taskIds.length) {
      throw new NotFoundException('One or more tasks not found');
    }

    await this.tasksRepository.reorderTasks(taskIds);
  }

  async toggleComplete(id: string): Promise<TaskDocument> {
    throwIfInvalidObjectId(id);

    const task = await this.tasksRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const newStatus =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.NOT_STARTED
        : TaskStatus.COMPLETED;

    const updatedTask = await this.tasksRepository.updateTaskStatus(
      id,
      newStatus,
    );
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return updatedTask;
  }
}
