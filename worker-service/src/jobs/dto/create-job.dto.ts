import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

// Lo que debe mandar el scheduler (o el botón manual).
// Si falta algo, Nest responde 400.
export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  timestamp: string;
}
