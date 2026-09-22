## 1. Inicialización y dependencias

- [x] 1.1 Inicializar la estructura del proyecto independiente `scheduler-service` con `package.json`, `tsconfig.json` y configuración base de NestJS
- [x] 1.2 Instalar dependencias requeridas (`@nestjs/common`, `@nestjs/core`, `@nestjs/schedule`, `@nestjs/axios`, `axios`, `reflect-metadata`)

## 2. Configuración y Módulos

- [x] 2.1 Configurar `ScheduleModule.forRoot()` y `HttpModule` dentro de `AppModule`
- [x] 2.2 Configurar lectura de variable de entorno `WORKER_SERVICE_URL` con valor por defecto `http://localhost:3001` y puerto local 3000

## 3. Implementación del Time Trigger

- [x] 3.1 Crear `TaskSchedulerService` con el decorador `@Cron('*/10 * * * * *')`
- [x] 3.2 Implementar generador de `taskId` (contador correlativo `JOB-xxx` o UUID) y `timestamp` en formato ISO 8601
- [x] 3.3 Implementar llamada HTTP POST hacia el Worker con payload `{ taskId, type, timestamp }`
- [x] 3.4 Implementar emisión de logs formateados (`[SCHEDULER] Ejecutando...`, `[SCHEDULER] Enviando...`, `[SCHEDULER] Worker confirmó...`) y manejo de errores ante desconexión

## 4. Verificación y Pruebas

- [x] 4.1 Levantar `worker-service` (en puerto 3001) y posteriormente `scheduler-service` (en puerto 3000)
- [x] 4.2 Confirmar visualmente que los jobs se disparan automáticamente cada 10s y que la secuencia de logs en ambas consolas coincide con lo documentado en `04-Exposicion/logs-esperados.md`
