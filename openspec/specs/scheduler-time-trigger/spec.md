# scheduler-time-trigger Specification

## Purpose

Gestionar la temporización periódica mediante cron triggers para iniciar Background Jobs y enviarlos al Worker a través de HTTP.

## Requirements

### Requirement: Disparo periódico automatizado
El scheduler-service DEBE ejecutar automáticamente un Time Trigger cada 10 segundos utilizando el decorador `@Cron` o expresión programada sin intervención manual.

#### Scenario: Disparo continuo del cron
- **WHEN** el servicio scheduler-service se encuentra en ejecución
- **THEN** cada intervalo de 10 segundos se activa el método disparador del job

### Requirement: Generación de identificador y marca de tiempo
Al dispararse el Time Trigger, el scheduler-service DEBE generar un `taskId` único y obtener el `timestamp` actual en formato ISO 8601 antes de enviar la petición.

#### Scenario: Creación de metadatos de tarea
- **WHEN** se activa el cron job
- **THEN** el sistema genera un `taskId` único no repetido y un `timestamp` válido en formato ISO 8601

### Requirement: Envío HTTP de la orden de procesamiento
El scheduler-service DEBE enviar una petición HTTP POST a `${WORKER_SERVICE_URL}/api/jobs/process` conteniendo en el cuerpo el `taskId`, el `type` (ej. `"GENERATE_REPORT"`) y el `timestamp`.

#### Scenario: Despacho exitoso del job al worker
- **WHEN** se generan los metadatos de la tarea
- **THEN** el cliente HTTP efectúa una llamada POST al worker y espera la confirmación de procesamiento

### Requirement: Registro en consola de la secuencia del scheduler
El scheduler-service DEBE registrar en consola los mensajes de seguimiento con el prefijo obligatorio `[SCHEDULER]`.

#### Scenario: Secuencia esperada de logs
- **WHEN** se ejecuta el ciclo de disparo y se recibe respuesta exitosa del worker
- **THEN** la consola del scheduler muestra primero `[SCHEDULER] Ejecutando Background Job <taskId>`, luego `[SCHEDULER] Enviando <taskId> al Worker...` y finalmente `[SCHEDULER] Worker confirmó <taskId>`
