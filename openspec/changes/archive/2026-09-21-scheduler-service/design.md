## Context

Ver `proposal.md` y `AGENTS.md`. El servicio debe operar de forma completamente aislada en su propia carpeta `scheduler-service/`, con su propio `package.json` y dependencias, emitiendo peticiones hacia el Worker.

## Goals / Non-Goals

**Goals:**
- Configurar `@nestjs/schedule` a nivel global con `ScheduleModule.forRoot()`.
- Implementar `TaskSchedulerService` con el decorador `@Cron('*/10 * * * * *')` (cada 10 segundos).
- Generar secuencialmente o vía UUID el identificador `taskId` (e.g. `JOB-001`, `JOB-002`...).
- Utilizar `HttpService` (`@nestjs/axios`) para enviar el payload JSON con `firstValueFrom` hacia el worker.
- Emitir los logs esperados con el prefijo estricto `[SCHEDULER]`.
- Manejar excepciones en caso de que el Worker no responda o devuelva error, evitando que el proceso termine abruptamente.

**Non-Goals:**
- Almacenamiento o persistencia en base de datos.
- Mecanismo de colas complejas o reintentos exponenciales fuera del alcance pedagógico.
- Interfaz gráfica o endpoints HTTP entrantes (el scheduler solo realiza llamadas salientes).

## Decisions

- **Estructura del cron**: `@Cron('*/10 * * * * *')` garantiza la periodicidad exacta de 10 segundos durante la sesión de demostración.
- **Cliente HTTP**: `HttpModule` de NestJS envuelve Axios. Se utiliza `firstValueFrom(this.httpService.post(...))` para manejar la llamada de forma asíncrona limpia (`async/await`).
- **Configuración de URL destino**: Variable de entorno `WORKER_SERVICE_URL` (por defecto `http://localhost:3001` para ejecución local, o `http://worker-service:3001` dentro de Docker).
- **Control de errores amigable**: Bloque `try/catch` alrededor de la llamada HTTP para que, si el worker está caído o reiniciándose, se imprima un log de advertencia `[SCHEDULER] Error comunicando con Worker: ...` sin interrumpir los siguientes disparos del cron.

## Risks / Trade-offs

- **[Riesgo: Worker apagado o demorado]** → Mitigación: Encapsular la petición en un `try/catch` con timeout razonable (5s) para que no bloquee ciclos posteriores.
- **[Riesgo: Superposición de ejecuciones]** → Mitigación: El intervalo de 10s es significativamente mayor al tiempo de procesamiento del worker (1-2s).
