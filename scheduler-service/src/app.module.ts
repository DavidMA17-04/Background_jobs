import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';

// Módulo raíz: activa los cron jobs y carga la lógica del scheduler.
@Module({
  imports: [
    ScheduleModule.forRoot(),
    SchedulerModule,
  ],
})
export class AppModule {}
