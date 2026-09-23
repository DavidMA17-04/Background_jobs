import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppModule } from './app.module';

// Punto de entrada del worker: arranca Nest, valida el body y sirve el dashboard.
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Todas las rutas de API quedan bajo /api
  app.setGlobalPrefix('api');

  // Rechaza campos de más y exige que el body cumpla el DTO.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // En Docker usa /dist/public; en local usa /src/public.
  const publicPath = existsSync(join(__dirname, 'public'))
    ? join(__dirname, 'public')
    : join(__dirname, '..', 'src', 'public');

  app.useStaticAssets(publicPath);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`[WORKER] Worker-service iniciado en puerto ${port}`);
}

bootstrap();
