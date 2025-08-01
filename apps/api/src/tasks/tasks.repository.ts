import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SortOrder, TaskStatus } from '../shared/constants';
import { CreateTaskDto } from './dtos/create.dto';
import { QueryTasksDto } from './dtos/query.dto';
import { UpdateTaskDto } from './dtos/update.dto';
import { Task, TaskDocument } from './schemas/db.schema';

export interface TasksQueryResult {
  tasks: TaskDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class TasksRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    const highestOrder = await this.getHighestOrder();
    const taskData = {
      ...createTaskDto,
      order: highestOrder + 1,
    };
    const createdTask = new this.taskModel(taskData);
    return createdTask.save();
  }

  async findAll(queryDto: QueryTasksDto): Promise<TasksQueryResult> {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = queryDto;

    const skip = (page - 1) * limit;
    const filter: Record<string, any> = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy] = sortOrder === SortOrder.ASC ? 1 : -1;

    const [tasks, total] = await Promise.all([
      this.taskModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.taskModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      tasks,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findById(id: string): Promise<TaskDocument | null> {
    return this.taskModel.findById(id).exec();
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument | null> {
    return this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<TaskDocument | null> {
    return this.taskModel.findByIdAndDelete(id).exec();
  }

  async reorderTasks(taskIds: string[]): Promise<void> {
    const bulkOps = taskIds.map((taskId, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(taskId) },
        update: { $set: { order: index } },
      },
    }));

    await this.taskModel.bulkWrite(bulkOps);
  }

  async findByIds(taskIds: string[]): Promise<TaskDocument[]> {
    const objectIds = taskIds.map((id) => new Types.ObjectId(id));
    return this.taskModel.find({ _id: { $in: objectIds } }).exec();
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
  ): Promise<TaskDocument | null> {
    return this.taskModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  private async getHighestOrder(): Promise<number> {
    const task = await this.taskModel
      .findOne()
      .sort({ order: -1 })
      .select('order')
      .exec();

    return task?.order ?? -1;
  }
}
