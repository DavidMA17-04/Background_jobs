## Why

El proyecto requiere un servicio receptor independiente que procese los Background Jobs disparados por el programador. Implementar `worker-service` primero permite disponer de un consumidor funcional, autónomo y comprobable mediante llamadas HTTP (curl/Postman) antes de acoplar el servicio de Time Trigger.

## What Changes

- Inicialización de un nuevo proyecto NestJS independiente (`worker-service`).
- Implementación del endpoint REST `POST /api/jobs/process`.
- Definición y validación de DTOs (`CreateJobDto`, `JobResponseDto`) conforme al contrato de API (`taskId`, `type`, `timestamp`).
- Simulación de procesamiento asíncrono/demorado de tareas de tipo reporte con logs formateados (`[WORKER]`).
- Configuración de variables de entorno (puerto HTTP por defecto 3001).

## Capabilities

### New Capabilities
- `worker-job-processing`: Capacidad del servicio Worker para recibir trabajos vía HTTP POST, validar el payload, simular el procesamiento en background y retornar confirmación con marcas de tiempo.

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **Código nuevo**: Proyecto completo en el directorio `worker-service/` con su propio `package.json`, `tsconfig.json` y dependencias (`@nestjs/common`, `@nestjs/core`, `class-validator`, `class-transformer`).
- **APIs expuestas**: `POST /api/jobs/process`.
- **Sistemas externos**: Servirá como destino para las llamadas HTTP de `scheduler-service`.
