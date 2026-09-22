# Investigación II: Background Jobs con Time Triggers (NestJS & Docker)

Demostración pedagógica de comunicación entre microservicios NestJS coordinados mediante un Time Trigger (Cron Job) y comunicación HTTP síncrona.

## Integrantes y Reparto de Exposición (Grupo 6)

| Integrante | Tema a exponer |
|---|---|
| **Sebastian Solis** | **1. Introducción y contexto:** El problema de los Background Jobs y objetivo pedagógico. |
| **David Mendez** | **2. Arquitectura:** Desacoplamiento entre microservicios y contrato de API HTTP. |
| **Geyson Chavarría** | **3. `scheduler-service`:** Time Trigger, decorador `@Cron` y despacho HTTP. |
| **Aaron Solano Cordero** | **4. `worker-service`:** Endpoint REST, validación DTOs y procesamiento asíncrono. |
| **Carlos Ruiz Galagarza** | **5. Orquestación y Demo:** Despliegue con Docker Compose, Dashboards Web y logs en vivo. |

## Arquitectura del Proyecto

- **`scheduler-service`**: Microservicio emisor (Time Trigger). Dispara una tarea cada 10 segundos (`@nestjs/schedule`), genera un `taskId` correlativo y realiza una petición HTTP POST al worker.
- **`worker-service`**: Microservicio receptor (Worker). Expone `POST /api/jobs/process`, valida el payload (`class-validator`), simula un procesamiento asíncrono y responde confirmación `PROCESSED`.

## Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (con Docker Compose v2+)
- (Opcional) [Node.js v20+](https://nodejs.org/) si se desea ejecutar localmente sin Docker.

## Instrucciones de Ejecución

### Opción 1: Con Docker Compose (Recomendado)

En Windows (PowerShell):
```powershell
.\run.ps1
```

En Linux / macOS:
```bash
chmod +x run.sh
./run.sh
```

O directamente mediante Docker Compose:
```bash
docker compose up --build
```

Para detener los servicios:
```bash
docker compose down
```

### Opción 2: Ejecución Manual en Desarrollo Local

1. **Worker Service**:
   ```bash
   cd worker-service
   npm install
   npm run start:dev
   ```
   *Escuchando en http://localhost:3001*

2. **Scheduler Service**:
   ```bash
   cd scheduler-service
   npm install
   npm run start:dev
   ```
   *Escuchando en http://localhost:3000*

## Secuencia de Logs Esperada

Al iniciar ambos servicios, la consola mostrará la interacción automática cada 10 segundos:

```text
[SCHEDULER] Ejecutando Time Trigger (Cron Job cada 10s)...
[SCHEDULER] Enviando JOB-001 al worker-service (http://worker-service:3001/api/jobs/process)
[WORKER] JOB-001 recibido
[WORKER] Generando reporte...
[WORKER] JOB-001 procesado correctamente
[SCHEDULER] Worker confirmó procesamiento de JOB-001 con estado PROCESSED
```

## Pruebas de API Manuales (Worker)

Prueba de envío de trabajo válido:
```bash
curl -X POST http://localhost:3001/api/jobs/process \
  -H "Content-Type: application/json" \
  -d '{"taskId":"JOB-999","type":"GENERATE_REPORT","timestamp":"2026-09-21T18:00:00.000Z"}'
```

Prueba de validación (payload incompleto):
```bash
curl -X POST http://localhost:3001/api/jobs/process \
  -H "Content-Type: application/json" \
  -d '{"type":"GENERATE_REPORT"}'
```
*Respuesta esperada: `HTTP 400 Bad Request` con mensajes detallados de validación.*
