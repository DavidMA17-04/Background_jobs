## Context

Ver `proposal.md` y `AGENTS.md`. El servicio debe operar de forma completamente aislada en su propia carpeta `worker-service/`, con su propio `package.json` y dependencias, respetando el contrato de API definido en la documentación.

## Goals / Non-Goals

**Goals:**
- Implementar un controlador NestJS (`JobsController`) con la ruta `POST /api/jobs/process`.
- Validar rigurosamente los tipos y presencia de campos de entrada mediante `ValidationPipe` y DTOs decorados con `class-validator`.
- Simular un procesamiento asíncrono no bloqueante (e.g. `setTimeout` encapsulado en una promesa de 1-2 segundos).
- Emitir logs claros en consola con el prefijo estricto `[WORKER]` en cada etapa (recepción, procesamiento y confirmación).
- Configurar el puerto de escucha en 3001 (configurable mediante variable de entorno `PORT`).

**Non-Goals:**
- Persistencia en base de datos (se descarta almacenamiento real de trabajos o reportes).
- Autenticación o autorización (tokens, API keys o mTLS).
- Colas de mensajes (RabbitMQ, BullMQ, Redis o Kafka).
- Dependencias compartidas o esquemas de monorepo con `scheduler-service`.

## Decisions

- **Uso de ValidationPipe global**: Se habilitará `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))` en `main.ts` para garantizar que payloads malformados sean rechazados antes de llegar al servicio.
- **DTOs explícitos**:
  - `CreateJobDto`: `taskId` (string, IsNotEmpty), `type` (string, IsNotEmpty), `timestamp` (string, IsISO8601).
  - `JobResponseDto`: `taskId` (string), `status` (string "PROCESSED"), `processedAt` (string ISO).
- **Separación Controller / Service**:
  - `JobsController`: Maneja la ruta HTTP y los códigos de respuesta.
  - `JobsService`: Contiene la lógica del retardo simulado y la emisión de los logs requeridos en `04-Exposicion/logs-esperados.md`.
- **Estructura modular estándar NestJS**:
  - `src/jobs/dto/create-job.dto.ts`
  - `src/jobs/dto/job-response.dto.ts`
  - `src/jobs/jobs.controller.ts`
  - `src/jobs/jobs.service.ts`
  - `src/jobs/jobs.module.ts`
  - `src/app.module.ts`
  - `src/main.ts`

## Risks / Trade-offs

- **[Riesgo: Bloqueo del Event Loop durante la simulación]** → Mitigación: Usar un delay asíncrono con `setTimeout` envuelto en `Promise` para no congelar el servidor mientras "procesa".
- **[Riesgo: Desincronización de nombres de campos]** → Mitigación: Tipado estricto siguiendo literalmente el contrato `taskId`, `type` y `timestamp`.
