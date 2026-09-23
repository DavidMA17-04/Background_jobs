import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';

// Módulo raíz: solo carga la parte de jobs.
@Module({
  imports: [JobsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
