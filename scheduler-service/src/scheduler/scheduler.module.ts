import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TaskSchedulerService } from './task-scheduler.service';
import { SchedulerStatusController } from './scheduler-status.controller';

// Junta las piezas del scheduler:
// - HttpModule: para llamar al worker
// - TaskSchedulerService: el cron que dispara los jobs
// - SchedulerStatusController: el endpoint que lee el dashboard
@Module({
  imports: [HttpModule],
  controllers: [SchedulerStatusController],
  providers: [TaskSchedulerService],
})
export class SchedulerModule {}
