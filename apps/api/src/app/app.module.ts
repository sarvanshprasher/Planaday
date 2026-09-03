import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedule/schedule.module';
import { PrismaModule } from './prisma/prisma.module';
import { AgentModule } from './agent/agent.module';
@Module({
  imports: [PrismaModule, ScheduleModule, AgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
