## Why

El proyecto requiere un servicio emisor independiente que orqueste la ejecución automática de Background Jobs basándose en el tiempo (Time Triggers). El `scheduler-service` implementará un cron job que disparará periódicamente solicitudes de procesamiento al `worker-service`, evidenciando la coordinación desacoplada entre servicios mediante HTTP.

## What Changes

- Inicialización de un nuevo proyecto NestJS independiente (`scheduler-service`).
- Configuración del módulo de temporización `@nestjs/schedule` (`ScheduleModule.forRoot()`).
- Implementación de un Cron Job que se ejecuta cada 10 segundos durante la demo.
- Generación dinámica de un `taskId` único (formato `JOB-xxx` o UUID) y un `timestamp` ISO 8601 en cada disparo.
- Cliente HTTP con `@nestjs/axios` y `axios` para despachar el job vía `POST /api/jobs/process`.
- Registro detallado en consola con prefijo estricto `[SCHEDULER]` (`[SCHEDULER] Ejecutando Background Job...`, `[SCHEDULER] Enviando...`, `[SCHEDULER] Worker confirmó...`).
- Configuración de variables de entorno para el puerto propio (3000) y la URL del worker (`WORKER_SERVICE_URL`).

## Capabilities

### New Capabilities
- `scheduler-time-trigger`: Capacidad del servicio Scheduler para ejecutar tareas programadas por tiempo (cron), generar metadatos del job y despachar la solicitud HTTP al Worker con trazabilidad de logs.

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **Código nuevo**: Proyecto completo en el directorio `scheduler-service/` con su propio `package.json`, `tsconfig.json` y dependencias (`@nestjs/common`, `@nestjs/core`, `@nestjs/schedule`, `@nestjs/axios`, `axios`).
- **Comportamiento en ejecución**: Iniciará peticiones salientes cada 10 segundos hacia el endpoint del worker.
- **Sistemas externos**: Requiere que `worker-service` esté accesible en la URL configurada.
