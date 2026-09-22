## Why

Actualmente el `scheduler-service` opera exclusivamente en consola. Para la exposición y evaluación visual es indispensable contar con una interfaz gráfica web sencilla, moderna y en tiempo real servida en `http://localhost:3000/` que permita observar la cuenta regresiva del Time Trigger (cada 10 segundos), el estado del programador y el registro de jobs despachados sin depender únicamente de la terminal.

## What Changes

- Implementación de un endpoint REST/SSE en `scheduler-service` (`GET /api/scheduler/status` o eventos) que expone el estado del cron, intervalo y últimos disparos.
- Incorporación de una interfaz web estática servida en la raíz `GET /` con diseño pulido (modo oscuro, tipografía moderna, micro-animaciones y glassmorphism).
- Visualización interactiva con barra o anillo de progreso con cuenta regresiva animada de 10 segundos hacia el próximo disparo.
- Tabla/tarjetas de los últimos trabajos emitidos (`taskId`, `timestamp`, estado de confirmación del worker).

## Capabilities

### New Capabilities
- `scheduler-dashboard`: Interfaz web interactiva servida en el puerto 3000 del Scheduler para visualizar en tiempo real la cuenta regresiva del cron, estado del servicio y el historial de jobs disparados.

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **scheduler-service**: Se agrega un controlador o servicio estático para servir los assets web (`index.html`, `styles.css`, `app.js`) y un endpoint de estado (`GET /api/scheduler/status`).
- **Ruta de acceso**: Los usuarios y evaluadores podrán abrir `http://localhost:3000/` en cualquier navegador.
