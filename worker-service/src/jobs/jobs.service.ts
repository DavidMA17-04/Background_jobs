import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { JobResponseDto } from './dto/job-response.dto';

// Un job que ya se terminó de procesar.
export interface ProcessedJobRecord {
  taskId: string;
  type: string;
  receivedAt: string;
  processedAt: string;
  durationMs: number;
  status: string;
}

@Injectable()
export class JobsService {
  // Estado actual: si está ocupado y con qué job.
  private isProcessing: boolean = false;
  private currentTaskId: string | null = null;
  private currentJobStartedAt: string | null = null;
  private totalProcessed: number = 0;

  // Solo guarda los últimos 10 jobs en memoria.
  private readonly recentJobs: ProcessedJobRecord[] = [];

  // Simula generar un reporte y responde PROCESSED.
  async processJob(createJobDto: CreateJobDto): Promise<JobResponseDto> {
    const { taskId, type, timestamp } = createJobDto;

    this.isProcessing = true;
    this.currentTaskId = taskId;
    const startTime = Date.now();
    this.currentJobStartedAt = new Date(startTime).toISOString();

    console.log(`[WORKER] ${taskId} recibido`);
    console.log(`[WORKER] Generando reporte...`);

    try {
      // No hay un reporte real: espera 1 segundo para simular el trabajo.
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      this.isProcessing = false;
      this.currentTaskId = null;
      this.currentJobStartedAt = null;
    }

    console.log(`[WORKER] ${taskId} procesado correctamente`);

    const endTime = Date.now();
    const processedAt = new Date(endTime).toISOString();
    this.totalProcessed++;

    const record: ProcessedJobRecord = {
      taskId,
      type: type || 'REPORT_GENERATION',
      receivedAt: timestamp || new Date(startTime).toISOString(),
      processedAt,
      durationMs: endTime - startTime,
      status: 'PROCESSED',
    };

    this.recentJobs.unshift(record);
    if (this.recentJobs.length > 10) {
      this.recentJobs.pop();
    }

    return {
      taskId,
      status: 'PROCESSED',
      processedAt,
    };
  }

  // Datos que consume el dashboard.
  getRecentJobs() {
    return {
      service: 'worker-service',
      status: 'ONLINE',
      isProcessing: this.isProcessing,
      currentTaskId: this.currentTaskId,
      currentJobStartedAt: this.currentJobStartedAt,
      totalProcessed: this.totalProcessed,
      recentJobs: [...this.recentJobs],
    };
  }
}
