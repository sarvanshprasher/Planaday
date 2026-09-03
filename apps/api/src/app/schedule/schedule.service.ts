import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

type ScheduleBlockStatus = 'planned' | 'in_progress' | 'done' | 'skipped';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ScheduleBlockCreateInput) {
    return this.prisma.scheduleBlock.create({ data });
  }

  async findByDate(date: string) {
    return this.prisma.scheduleBlock.findMany({
      where: { date },
      orderBy: { startHour: 'asc' },
    });
  }

  async updateStatus(id: string, status: ScheduleBlockStatus) {
    return this.prisma.scheduleBlock.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string) {
    return this.prisma.scheduleBlock.delete({ where: { id } });
  }
}
