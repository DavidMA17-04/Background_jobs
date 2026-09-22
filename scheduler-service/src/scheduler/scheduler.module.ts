import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TaskSchedulerService } from './task-scheduler.service';
import { SchedulerStatusController } from './scheduler-status.controller';

@Module({
  imports: [HttpModule],
  controllers: [SchedulerStatusController],
  providers: [TaskSchedulerService],
})
export class SchedulerModule {}
