## 1. Inicialización y dependencias

- [x] 1.1 Inicializar la estructura del proyecto independiente `worker-service` con `package.json`, `tsconfig.json` y configuración base de NestJS
- [x] 1.2 Instalar dependencias requeridas (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `class-validator`, `class-transformer`, `reflect-metadata`)

## 2. DTOs y Configuración

- [x] 2.1 Crear `CreateJobDto` con validaciones para `taskId`, `type` y `timestamp` (ISO 8601)
- [x] 2.2 Crear `JobResponseDto` estructurando la confirmación con `taskId`, `status` y `processedAt`
- [x] 2.3 Configurar `main.ts` con `ValidationPipe` global y puerto HTTP por defecto (3001)

## 3. Lógica de Procesamiento y Endpoint

- [x] 3.1 Implementar `JobsService` con simulación de procesamiento asíncrono y logs formateados (`[WORKER] JOB-xxx recibido`, `[WORKER] Generando reporte...`, `[WORKER] JOB-xxx procesado correctamente`)
- [x] 3.2 Implementar `JobsController` exponiendo `POST /api/jobs/process` que invoque a `JobsService` y retorne `JobResponseDto`
- [x] 3.3 Crear `JobsModule` e importarlo en `AppModule`

## 4. Verificación y Pruebas

- [x] 4.1 Compilar y levantar `worker-service` en puerto 3001
- [x] 4.2 Ejecutar prueba manual con cURL de envío de trabajo válido y confirmar respuesta 200 y logs
- [x] 4.3 Ejecutar prueba con cURL de payload incompleto/inválido y verificar respuesta 400 Bad Request
