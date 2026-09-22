# Investigación II: Background Jobs con Time Triggers (NestJS & Docker)

Demostración pedagógica de comunicación entre microservicios NestJS coordinados mediante un Time Trigger (Cron Job) y comunicación HTTP síncrona.

## Integrantes y Reparto de Exposición (Grupo 6)

| Integrante | Tema a exponer | Minutos aprox. |
|---|---|:---:|
| **Sebastian Solis** | **1. Introducción y contexto:** El problema de los Background Jobs y objetivo pedagógico. | Min. 0 - 3 |
| **David Mendez** | **2. Arquitectura:** Desacoplamiento entre microservicios y contrato de API HTTP. | Min. 3 - 6 |
| **Geyson Chavarría** | **3. `scheduler-service`:** Time Trigger, decorador `@Cron` y despacho HTTP. | Min. 6 - 9 |
| **Aaron Solano Cordero** | **4. `worker-service`:** Endpoint REST, validación DTOs y procesamiento asíncrono. | Min. 9 - 12 |
| **Carlos Ruiz Galagarza** | **5. Orquestación y Demo:** Despliegue con Docker Compose, Dashboards Web y logs en vivo. | Min. 12 - 16 |

---

## Guion Detallado de Exposición (Qué debe decir cada uno)

### 1. Sebastian Solis — Introducción y Contexto Real (Min. 0 - 3)
* **Apoyo visual:** Diapositiva de portada y contexto del problema.
* **Qué decir:**
  > *"Buenos días profesor y compañeros. Nuestro grupo está conformado por Carlos Ruiz, David Mendez, Geyson Chavarría, Aaron Solano y mi persona, Sebastian Solis. Hoy les venimos a exponer nuestra investigación práctica sobre **Background Jobs y Time Triggers** con **NestJS y Docker**.*
  > 
  > *En sistemas reales, muchas tareas requieren mucho cómputo (generar un reporte contable de 100,000 transacciones, procesar imágenes, enviar miles de correos). Si procesáramos eso de forma síncrona dentro de una petición HTTP convencional, el servidor bloquearía recursos y el usuario recibiría un timeout 504.*
  > 
  > *Los **Background Jobs** resuelven esto desacoplando las tareas pesadas para ejecutarlas en segundo plano. Y cuando esas tareas deben dispararse periódicamente sin intervención humana (por ejemplo, todos los días a medianoche o cada 10 segundos en nuestra demo), usamos un **Time Trigger** (Cron Job). Le cedo la palabra a David Mendez para ver la arquitectura."*

### 2. David Mendez — Arquitectura del Sistema y Contrato de API (Min. 3 - 6)
* **Apoyo visual:** Diagrama de arquitectura y contrato de API JSON.
* **Qué decir:**
  > *"Gracias, Sebastian. Siguiendo las directrices de la cátedra, implementamos dos proyectos NestJS independientes en lugar de un monolito, para reflejar un desacoplamiento real:*
  > 1. *`scheduler-service`: emisor cuya única tarea es disparar la orden periódicamente.*
  > 2. *`worker-service`: receptor especializado en procesar el trabajo.*
  > 
  > *El flujo es simple y robusto: el Time Trigger activa el Scheduler cada 10s, este genera un `taskId` correlativo y hace un `POST` HTTP al Worker. El Worker procesa y responde `200 OK`.*
  > 
  > *Para coordinarse, ambos servicios respetan un **Contrato de API** estricto: la petición envía `{ taskId, type, timestamp }` y la respuesta confirma con `{ taskId, status: "PROCESSED", processedAt }`. Elegimos HTTP síncrono para mantener el enfoque en los paradigmas y la sincronización limpia, sin la sobrecarga de colas complejas. Ahora Geyson explicará el Scheduler."*

### 3. Geyson Chavarría — `scheduler-service`: Time Triggers y Cron (Min. 6 - 9)
* **Apoyo visual:** Código de `task-scheduler.service.ts` y decorador `@Cron`.
* **Qué decir:**
  > *"Gracias, David. En NestJS, la gestión temporal se logra con el módulo `@nestjs/schedule`.*
  > 
  > *En nuestro `TaskSchedulerService`, usamos el decorador `@Cron('*/10 * * * * *')`, cuya expresión de 6 campos ejecuta el método automáticamente cada 10 segundos exactos.*
  > 
  > *En cada ciclo:*
  > 1. *Genera un identificador único correlativo (`JOB-001`, `JOB-002`...) con marca de tiempo ISO 8601.*
  > 2. *Imprime logs formales con el prefijo `[SCHEDULER]`.*
  > 3. *Despacha la petición mediante `HttpService` (Axios) usando `firstValueFrom()` para manejar la llamada como una promesa asíncrona limpia.*
  > 
  > *Además, añadimos **tolerancia a fallos**: la llamada está protegida por un bloque `try/catch`. Si el Worker no estuviese disponible, el Scheduler registra una advertencia legible pero no se cae, quedando listo para el siguiente disparo. Ahora Aaron explicará el Worker."*

### 4. Aaron Solano Cordero — `worker-service`: Endpoint REST y Procesamiento (Min. 9 - 12)
* **Apoyo visual:** Código de `jobs.controller.ts`, DTOs con validación y `jobs.service.ts`.
* **Qué decir:**
  > *"Gracias, Geyson. El `worker-service` es el microservicio receptor expuesto en el endpoint REST `POST /api/jobs/process`.*
  > 
  > *Su implementación destaca por tres aspectos:*
  > 1. * **Validación estricta de entrada:** Definimos `CreateJobDto` con decoradores de `class-validator` (`@IsString`, `@IsNotEmpty`, `@IsISO8601`) y activamos `ValidationPipe({ whitelist: true })`. Si alguien envía datos incompletos o inválidos, el Worker responde de inmediato `400 Bad Request` sin procesar basura.*
  > 2. * **Simulación de cómputo asíncrono:** Para simular la carga de trabajo de un reporte real, `JobsService` utiliza una demora no bloqueante de 1 segundo mediante `setTimeout` envuelto en una Promesa, lo que mantiene libre el Event Loop de Node.*
  > 3. * **Trazabilidad y confirmación:** Emite los logs con prefijo `[WORKER]` (`JOB-xxx recibido`, `Generando reporte...`, `JOB-xxx procesado correctamente`) y responde con estado `PROCESSED` y la fecha de procesado.*
  > 
  > *Ahora Carlos Ruiz nos mostrará la orquestación con Docker Compose y la demo en vivo."*

### 5. Carlos Ruiz Galagarza — Docker Compose, Dashboards Web y Demo en Vivo (Min. 12 - 16)
* **Apoyo visual:** Terminal con ejecución de Docker Compose + Navegador web con los dos Dashboards.
* **Qué decir:**
  > *"Gracias, Aaron. Para que cualquier persona pueda ejecutar este proyecto con un solo comando sin lidiar con dependencias locales, empaquetamos todo con **Docker Compose**.*
  > 
  > *Creamos Dockerfiles basados en `node:20-alpine` y una red puente (`background-net`) que permite la resolución de nombres DNS interna (`http://worker-service:3001`).*
  > 
  > *(INICIAR DEMO: Ejecutar `.\run.ps1` en la terminal)*
  > *Al levantar los contenedores, podemos ver en la terminal cómo ambos servicios dialogan en tiempo real cada 10 segundos siguiendo exactamente la secuencia de logs esperada.*
  > 
  > *(MOSTRAR NAVEGADOR: Abrir `http://localhost:3000` y `http://localhost:3001` lado a lado)*
  > *Además de la consola, implementamos dos **Dashboards Web interactivos**:*
  > - *En el puerto `3000` (Scheduler): un anillo SVG animado con cuenta regresiva en vivo de 10s y el feed de jobs emitidos.*
  > - *En el puerto `3001` (Worker): un badge reactivo que pasa a 'PROCESANDO REPORTE' durante el retardo de 1 segundo y agrega el reporte completado a la tabla histórica.*
  > 
  > *(DEMOSTRACIÓN DE APAGADO)*
  > *Finalmente, detenemos todo de forma limpia ejecutando `docker compose down`.*
  > 
  > *Con esto demostramos el desacoplamiento, la automatización temporal y la resiliencia entre microservicios. Quedamos abiertos a sus preguntas."*

---

## Posibles Preguntas del Profesor y Respuestas Preparadas

1. **¿Por qué HTTP directo y no una cola de mensajes (RabbitMQ / BullMQ)?**  
   *Respuesta:* El objetivo pedagógico de la cátedra se centró en la coordinación síncrona y temporizada entre dos servicios independientes sin añadir la sobrecarga de un broker. En producción empresarial, una cola con persistencia (RabbitMQ o BullMQ sobre Redis) es la opción ideal para gestionar acumulación de tareas.

2. **¿Qué ocurre si el Worker tarda más de 10 segundos en procesar?**  
   *Respuesta:* El Scheduler seguiría disparando a los 10s, acumulando peticiones concurrentes en el Worker. En entornos productivos se emplean Job Locks (candados distribuidos) o colas con límite de concurrencia.

3. **¿Cómo se resuelven los contenedores en Docker?**  
   *Respuesta:* Mediante la red puente `background-net`, Docker provee un servidor DNS interno donde el nombre del servicio `worker-service` resuelve a la IP interna del contenedor.

---

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
