import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Prisma } from '../../generated/prisma';
import { ScheduleService } from './schedule.service';

type ScheduleBlockStatus = 'planned' | 'in_progress' | 'done' | 'skipped';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async create(@Body() data: Prisma.ScheduleBlockCreateInput) {
    return this.scheduleService.create(data);
  }

  @Get()
  async findByDate(@Query('date') date: string) {
    return this.scheduleService.findByDate(date);
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body('status') status: ScheduleBlockStatus) {
    return this.scheduleService.updateStatus(id, status);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.scheduleService.delete(id);
  }
}
