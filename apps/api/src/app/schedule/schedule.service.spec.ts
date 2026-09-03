import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prisma: {
    scheduleBlock: {
      create: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      scheduleBlock: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a schedule block', async () => {
    const input = {
      date: '2026-08-20',
      startHour: 9,
      endHour: 10,
      title: 'Design review',
      category: 'work',
      status: 'planned',
      createdBy: 'user',
    };
    const created = { id: '1', ...input };
    prisma.scheduleBlock.create.mockResolvedValue(created);

    await expect(service.create(input)).resolves.toEqual(created);
    expect(prisma.scheduleBlock.create).toHaveBeenCalledWith({ data: input });
  });

  it('should find blocks for a given date', async () => {
    const items = [{ id: '1', date: '2026-08-20', startHour: 9, endHour: 10, title: 'Task', status: 'planned', createdBy: 'user' }];
    prisma.scheduleBlock.findMany.mockResolvedValue(items);

    await expect(service.findByDate('2026-08-20')).resolves.toEqual(items);
    expect(prisma.scheduleBlock.findMany).toHaveBeenCalledWith({
      where: { date: '2026-08-20' },
      orderBy: { startHour: 'asc' },
    });
  });

  it('should update the status', async () => {
    const updated = { id: '1', date: '2026-08-20', startHour: 9, endHour: 10, title: 'Task', status: 'done', createdBy: 'user' };
    prisma.scheduleBlock.update.mockResolvedValue(updated);

    await expect(service.updateStatus('1', 'done')).resolves.toEqual(updated);
    expect(prisma.scheduleBlock.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { status: 'done' },
    });
  });

  it('should delete a schedule block', async () => {
    const deleted = { id: '1', date: '2026-08-20', startHour: 9, endHour: 10, title: 'Task', status: 'planned', createdBy: 'user' };
    prisma.scheduleBlock.delete.mockResolvedValue(deleted);

    await expect(service.delete('1')).resolves.toEqual(deleted);
    expect(prisma.scheduleBlock.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
