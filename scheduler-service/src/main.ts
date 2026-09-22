import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const distPublic = join(__dirname, 'public');
  const srcPublic = join(__dirname, '..', 'src', 'public');
  const publicPath = existsSync(distPublic) ? distPublic : srcPublic;

  app.useStaticAssets(publicPath);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`[SCHEDULER] Scheduler-service iniciado en puerto ${port}`);
  console.log(`[SCHEDULER] Dashboard disponible en http://localhost:${port}/`);
}

bootstrap();
