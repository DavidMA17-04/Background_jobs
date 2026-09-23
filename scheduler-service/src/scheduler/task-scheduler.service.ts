import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// Un job que ya se envió (o se está enviando) al worker.
export interface JobRecord {
  taskId: string;
  type: string;
  timestamp: string;
  status: 'CONFIRMED' | 'FAILED' | 'PENDING';
  error?: string;
}

// Resumen que ve el dashboard.
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
  // Contador para armar IDs: JOB-001, JOB-002, ...
  private jobCounter = 1;

  // En Docker apunta a http://worker-service:3001
  private readonly workerUrl = process.env.WORKER_SERVICE_URL || 'http://localhost:3001';

  // Solo guarda los últimos 10 jobs en memoria.
  private readonly recentJobs: JobRecord[] = [];
  private readonly intervalSeconds = 10;

  constructor(private readonly httpService: HttpService) {}

  // Calcula a qué hora toca el próximo disparo (cada 10 segundos).
  public getNextExecutionTime(): Date {
    const now = new Date();
    const currentSeconds = now.getSeconds();
    const remainder = currentSeconds % this.intervalSeconds;
    const secondsToAdd = remainder === 0 && now.getMilliseconds() < 200 ? 0 : this.intervalSeconds - remainder;
    return new Date(now.getTime() + secondsToAdd * 1000 - now.getMilliseconds());
  }

  // Datos que consume el dashboard.
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

  // Se ejecuta solo, cada 10 segundos.
  @Cron('*/10 * * * * *')
  async handleCron() {
    const taskId = `JOB-${String(this.jobCounter++).padStart(3, '0')}`;
    const timestamp = new Date().toISOString();
    const type = 'GENERATE_REPORT';

    // Lo registramos como pendiente mientras hablamos con el worker.
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
      // POST síncrono: espera a que el worker termine.
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
      // Si el worker no responde o falla la red.
      jobRecord.status = 'FAILED';
      jobRecord.error = error.message;
      console.error(`[SCHEDULER] Error comunicando con Worker: ${error.message}`);
    }
  }
}
