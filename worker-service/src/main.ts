import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar servicio de archivos estáticos para la UI del Worker
  const publicPath = existsSync(join(__dirname, 'public'))
    ? join(__dirname, 'public')
    : join(__dirname, '..', 'src', 'public');

  app.useStaticAssets(publicPath);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`[WORKER] Worker-service iniciado en puerto ${port}`);
}

bootstrap();

