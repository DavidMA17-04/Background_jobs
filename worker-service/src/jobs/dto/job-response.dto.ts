// Lo que responde el worker cuando termina un job.
export class JobResponseDto {
  taskId: string;
  status: string;
  processedAt: string;
}
