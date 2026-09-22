# AGENTS.md — Contexto para agentes de IA

> Este archivo sigue la convención `AGENTS.md`, que herramientas como Claude Code leen automáticamente al abrir el repositorio. Colócalo en la raíz del repo de código (no solo en el vault de Obsidian) para que el agente tenga contexto sin que se lo tengas que pegar a mano.

## Qué es este proyecto

Investigación II de Paradigmas de Programación (Grupo 6): demo de Background Jobs / Time Triggers con dos servicios NestJS independientes que se coordinan por HTTP.

### Integrantes (Grupo 6)
- Carlos Ruiz Galagarza
- David Mendez
- Sebastian Solis
- Geyson Chavarría
- Aaron Solano Cordero

- **scheduler-service**: dispara un Cron Job cada 10s (demo) usando `@nestjs/schedule`, genera `taskId` + `timestamp`, y hace `POST` al worker.
- **worker-service**: expone `POST /api/jobs/process`, simula procesamiento, responde confirmación.

Detalle completo: ver `00-Requerimientos/`, `01-Diseño/` y `02-Backlog/` en el vault de Obsidian adjunto, o las notas equivalentes que copies a este repo.

## Restricciones importantes (no te salgas de esto)

- Son **dos proyectos NestJS separados**, cada uno con su propio `package.json` y Dockerfile — no fusionar en un monorepo con dependencias compartidas salvo que se pida explícitamente.
- Comunicación **HTTP síncrona simple** (axios/HttpModule). Nada de colas de mensajes, nada de gRPC — está fuera de alcance a propósito (ver `00-Requerimientos/alcance.md`).
- Sin base de datos ni persistencia real. El "procesamiento" del worker es simulado.
- Sin autenticación entre servicios.
- El contrato de datos entre scheduler y worker es el de `01-Diseño/contrato-api.md` — respeta los nombres de campo (`taskId`, `type`, `timestamp`).
- El objetivo es pedagógico y demostrable: prioriza logs claros y código legible sobre robustez de producción.

## Convenciones de código

- NestJS estándar: Controllers, Services, Modules, DTOs con `class-validator`.
- Logs con el prefijo `[SCHEDULER]` o `[WORKER]` tal como aparece en `04-Exposicion/logs-esperados.md`, para que la demo en vivo coincida con lo documentado.
- Cron expresado con la sintaxis de `@nestjs/schedule` (decorador `@Cron(...)` o `CronExpression`).

## Cómo verificar que algo funciona

1. Levantar `worker-service` solo y probar el endpoint con curl/Postman.
2. Levantar `scheduler-service` apuntando al worker.
3. Levantar todo junto con `docker-compose up` y confirmar que los logs siguen la secuencia de `04-Exposicion/logs-esperados.md`.

## Backlog activo

Ver `02-Backlog/backlog.md` para el detalle tarea por tarea de lo que falta implementar en cada servicio.
