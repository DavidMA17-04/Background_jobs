import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface JobRecord {
  taskId: string;
  type: string;
  timestamp: string;
  status: 'CONFIRMED' | 'FAILED' | 'PENDING';
  error?: string;
}

export interface SchedulerStatus {
  service: string;
  status: 'ACTIVE' | 'IDLE';
  cronExpression: string;
  intervalSeconds: number;
  serverTime: string;
  nextExecutionTime: string;
  totalJobsEmitted: number;
  recentJobs: JobRecord[];
}

@Injectable()
export class TaskSchedulerService {
  private jobCounter = 1;
  private readonly workerUrl = process.env.WORKER_SERVICE_URL || 'http://localhost:3001';
  private readonly recentJobs: JobRecord[] = [];
  private readonly intervalSeconds = 10;

  constructor(private readonly httpService: HttpService) {}

  public getNextExecutionTime(): Date {
    const now = new Date();
    const currentSeconds = now.getSeconds();
    const remainder = currentSeconds % this.intervalSeconds;
    const secondsToAdd = remainder === 0 && now.getMilliseconds() < 200 ? 0 : this.intervalSeconds - remainder;
    return new Date(now.getTime() + secondsToAdd * 1000 - now.getMilliseconds());
  }

  public getStatus(): SchedulerStatus {
    const now = new Date();
    return {
      service: 'scheduler-service',
      status: 'ACTIVE',
      cronExpression: '*/10 * * * * *',
      intervalSeconds: this.intervalSeconds,
      serverTime: now.toISOString(),
      nextExecutionTime: this.getNextExecutionTime().toISOString(),
      totalJobsEmitted: this.jobCounter - 1,
      recentJobs: [...this.recentJobs],
    };
  }

  @Cron('*/10 * * * * *')
  async handleCron() {
    const taskId = `JOB-${String(this.jobCounter++).padStart(3, '0')}`;
    const timestamp = new Date().toISOString();
    const type = 'GENERATE_REPORT';

    const jobRecord: JobRecord = {
      taskId,
      type,
      timestamp,
      status: 'PENDING',
    };

    this.recentJobs.unshift(jobRecord);
    if (this.recentJobs.length > 10) {
      this.recentJobs.pop();
    }

    console.log(`[SCHEDULER] Ejecutando Background Job ${taskId}`);
    console.log(`[SCHEDULER] Enviando ${taskId} al Worker...`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.workerUrl}/api/jobs/process`, {
          taskId,
          type,
          timestamp,
        }),
      );

      if (response.status === 200 || response.status === 201) {
        jobRecord.status = 'CONFIRMED';
        console.log(`[SCHEDULER] Worker confirmó ${taskId}`);
      }
    } catch (error) {
      jobRecord.status = 'FAILED';
      jobRecord.error = error.message;
      console.error(`[SCHEDULER] Error comunicando con Worker: ${error.message}`);
    }
  }
}
