import { Controller, Get } from '@nestjs/common';
import { TaskSchedulerService, SchedulerStatus } from './task-scheduler.service';

// Endpoint que usa el dashboard para pintar el estado del cron.
@Controller('api/scheduler')
export class SchedulerStatusController {
  constructor(private readonly taskSchedulerService: TaskSchedulerService) {}

  // GET /api/scheduler/status
  @Get('status')
  getStatus(): SchedulerStatus {
    return this.taskSchedulerService.getStatus();
  }
}
