## Purpose

Proveer el endpoint receptor de Background Jobs para procesar solicitudes asíncronas simuladas y confirmar su finalización al servicio emisor.

## ADDED Requirements

### Requirement: Recepción y validación de Background Jobs
El worker-service DEBE exponer un endpoint HTTP `POST /api/jobs/process` que acepte un objeto JSON con los campos `taskId` (cadena no vacía), `type` (cadena no vacía) y `timestamp` (cadena en formato ISO 8601). El sistema DEBE rechazar con código 400 cualquier solicitud que no cumpla con esta estructura.

#### Scenario: Recepción exitosa de un job válido
- **WHEN** un cliente envía una petición POST a `/api/jobs/process` con payload `{"taskId": "JOB-001", "type": "GENERATE_REPORT", "timestamp": "2026-09-20T18:30:00.000Z"}`
- **THEN** el sistema acepta la petición y retorna un código HTTP 200/201 con la confirmación de procesamiento

#### Scenario: Rechazo por campos faltantes o inválidos
- **WHEN** un cliente envía una petición POST a `/api/jobs/process` sin el campo `taskId` o con un formato inválido
- **THEN** el sistema responde con código HTTP 400 Bad Request detallando los errores de validación

### Requirement: Simulación de procesamiento de tareas
Al recibir un job válido, el worker-service DEBE simular una carga de trabajo en segundo plano (demora controlada) y registrar en consola los hitos de ejecución con el prefijo obligatorio `[WORKER]`.

#### Scenario: Secuencia de logs durante el procesamiento
- **WHEN** se inicia el procesamiento de un job con `taskId` igual a `JOB-001`
- **THEN** el worker imprime en consola `[WORKER] JOB-001 recibido`, posteriormente `[WORKER] Generando reporte...` y al finalizar `[WORKER] JOB-001 procesado correctamente`

### Requirement: Confirmación estructurada de finalización
El worker-service DEBE responder al cliente con un objeto JSON que contenga exactamente el identificador `taskId`, el estado `status: "PROCESSED"` y la marca de tiempo `processedAt` en formato ISO 8601.

#### Scenario: Respuesta de confirmación exitosa
- **WHEN** finaliza el procesamiento simulado de la tarea `JOB-001`
- **THEN** el cuerpo de la respuesta HTTP contiene `{"taskId": "JOB-001", "status": "PROCESSED", "processedAt": "<timestamp_iso>"}`
