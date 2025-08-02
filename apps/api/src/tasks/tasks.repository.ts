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

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskDocument> {
    const highestOrder = await this.getHighestOrder();
    const taskData = {
      ...createTaskDto,
      order: highestOrder + 1,
      createdBy: userId,
    };
    const createdTask = new this.taskModel(taskData);
    return createdTask.save();
  }

  async findAll(queryDto: QueryTasksDto, userId: string): Promise<TasksQueryResult> {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      dueDate,
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

    if (dueDate) {
      // Create date range for the entire day (00:00:00 to 23:59:59)
      const startOfDay = new Date(dueDate + 'T00:00:00.000Z');
      const endOfDay = new Date(dueDate + 'T23:59:59.999Z');
      filter.dueDate = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy] = sortOrder === SortOrder.ASC ? 1 : -1;

    const [tasks, total] = await Promise.all([
      this.taskModel
        .find({ ...filter, createdBy: userId })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.taskModel.countDocuments({ ...filter, createdBy: userId }).exec(),
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

  async findById(id: string, userId: string): Promise<TaskDocument | null> {
    return this.taskModel.findOne({ _id: id, createdBy: userId }).exec();
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<TaskDocument | null> {
    return this.taskModel
      .findByIdAndUpdate(
        id,
        { ...updateTaskDto, createdBy: userId },
        { new: true },
      )
      .exec();
  }

  async delete(id: string, userId: string): Promise<TaskDocument | null> {
    return this.taskModel.findByIdAndDelete({ _id: id, createdBy: userId }).exec();
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

  async findByIds(taskIds: string[], userId: string): Promise<TaskDocument[]> {
    const objectIds = taskIds.map((id) => new Types.ObjectId(id));
    return this.taskModel.find({ _id: { $in: objectIds }, createdBy: userId }).exec();
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    userId: string,
  ): Promise<TaskDocument | null> {
    return this.taskModel
      .findByIdAndUpdate({ _id: id, createdBy: userId }, { status }, { new: true })
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
