import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  async create(@Body() payload: any) {
    const user = await this.userModel.findById(payload.userId);
    if (!user) {
      throw new NotFoundException(
        `Usuario con ID ${payload.userId} no encontrado`,
      );
    }

    return this.taskModel.create(payload);
  }

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }
}
