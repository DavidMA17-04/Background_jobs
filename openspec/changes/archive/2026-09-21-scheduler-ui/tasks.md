## 1. Backend y Endpoint de Estado

- [x] 1.1 Registrar en memoria dentro de `TaskSchedulerService` el historial de los últimos 10 jobs emitidos y el cálculo de la próxima ejecución
- [x] 1.2 Crear `SchedulerStatusController` exponiendo `GET /api/scheduler/status` con métricas del servicio y lista de tareas

## 2. Desarrollo de la Interfaz Web (HTML / CSS / JS)

- [x] 2.1 Diseñar `src/public/index.html` con layout estructurado: encabezado, tarjeta de estado del Time Trigger, anillo de cuenta regresiva y feed de eventos
- [x] 2.2 Diseñar `src/public/style.css` aplicando tema oscuro, glassmorphism, tipografía moderna y micro-animaciones en transiciones
- [x] 2.3 Desarrollar `src/public/app.js` con contador visual en tiempo real de 10s y polling asíncrono para refrescar la lista de jobs

## 3. Integración en NestJS

- [x] 3.1 Configurar el servicio de archivos estáticos en `scheduler-service` para responder en la ruta raíz `GET /`
- [x] 3.2 Asegurar que el Dockerfile y `nest-cli.json` empaqueten los assets estáticos en la compilación

## 4. Verificación Visual

- [x] 4.1 Levantar el servicio y navegar a `http://localhost:3000/` comprobando que la cuenta regresiva fluya suavemente
- [x] 4.2 Verificar que cada 10s aparezca una nueva tarjeta con la confirmación de la tarea sin recargar la página
