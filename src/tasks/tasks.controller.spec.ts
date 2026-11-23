import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  const tasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: tasksService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should delegate create to TasksService', async () => {
    const dto = { title: 'Tarea', userId: '6af691f7ad6c0c0e2753eaf2' };
    tasksService.create.mockResolvedValue({ _id: '1', ...dto });

    const result = await controller.create(dto);

    expect(tasksService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ _id: '1', ...dto });
  });
});
