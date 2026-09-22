import { Controller, Get } from '@nestjs/common';
import { TaskSchedulerService, SchedulerStatus } from './task-scheduler.service';

@Controller('api/scheduler')
export class SchedulerStatusController {
  constructor(private readonly taskSchedulerService: TaskSchedulerService) {}

  @Get('status')
  getStatus(): SchedulerStatus {
    return this.taskSchedulerService.getStatus();
  }
}
