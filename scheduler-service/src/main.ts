import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppModule } from './app.module';

// Punto de entrada del scheduler: arranca Nest y sirve el dashboard.
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // En Docker usa /dist/public; en local usa /src/public.
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
