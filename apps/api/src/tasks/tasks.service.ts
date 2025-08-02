import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/auth.type';
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

  async create(createTaskDto: CreateTaskDto, user: JwtPayload): Promise<TaskDocument> {
    return this.tasksRepository.create(createTaskDto, user.sub);
  }

  async findAll(queryDto: QueryTasksDto, user: JwtPayload): Promise<TasksQueryResult> {
    return this.tasksRepository.findAll(queryDto, user.sub);
  }

  async findOne(id: string, user: JwtPayload): Promise<TaskDocument> {
    throwIfInvalidObjectId(id);

    const task = await this.tasksRepository.findById(id, user.sub);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: JwtPayload,
  ): Promise<TaskDocument> {
    throwIfInvalidObjectId(id);

    const updatedTask = await this.tasksRepository.update(id, updateTaskDto, user.sub);
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return updatedTask;
  }

  async remove(id: string, user: JwtPayload): Promise<void> {
    throwIfInvalidObjectId(id);

    const deletedTask = await this.tasksRepository.delete(id, user.sub);
    if (!deletedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async toggleComplete(id: string, user: JwtPayload): Promise<TaskDocument> {
    throwIfInvalidObjectId(id);

    const task = await this.tasksRepository.findById(id, user.sub);

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
      user.sub,
    );

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return updatedTask;
  }
}
