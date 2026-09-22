## Context

Ver `proposal.md` y `AGENTS.md`. El `scheduler-service` necesita exponer una interfaz gráfica sencilla y visualmente impactante sin acoplar librerías pesadas ni alterar la lógica principal del cron.

## Goals / Non-Goals

**Goals:**
- Servir una aplicación web ligera (HTML5, Vanilla CSS, Vanilla JavaScript) en `http://localhost:3000/`.
- Proveer un endpoint REST `GET /api/scheduler/status` que retorne el estado del cron, tiempo para el próximo disparo, total de jobs enviados y la lista de los últimos 10 jobs.
- Crear una experiencia visual moderna: paleta oscura (`#090d16`, `#0f172a`), tipografía Inter/Outfit, efectos de cristal (glassmorphism) y acentos en tonos cian y azul eléctrico.
- Anillo circular SVG o barra de progreso animada que decrece de 10s a 0s.
- Notificaciones visuales o destellos de color cada vez que se dispara un nuevo job.

**Non-Goals:**
- Configuración de frameworks de frontend pesados (React, Next.js, Angular) que requieran compiladores complejos o aumenten el peso del contenedor.
- Persistencia de eventos en base de datos.

## Decisions

- **Estructura dentro de `scheduler-service`**:
  - `src/public/index.html`: Maquetación semántica moderna con tarjeta de control y tabla de jobs.
  - `src/public/style.css`: Estilos en Vanilla CSS con variables de diseño, sombras suaves y transiciones.
  - `src/public/app.js`: Lógica del cliente que realiza polling cada 1.5s a `/api/scheduler/status` e interpola el temporizador en tiempo real.
  - Controlador `StatusController` o middleware para servir la interfaz y responder a las peticiones del frontend.
- **Buffer en memoria de historial**: `TaskSchedulerService` mantendrá un arreglo en memoria con los últimos 10 jobs emitidos para servirlos a la vista.

## Risks / Trade-offs

- **[Riesgo: Sincronización entre la animación visual y el cron del backend]** → Mitigación: El backend envía en el endpoint de estado el `nextExecutionTime` y el cliente ajusta los milisegundos restantes localmente con `requestAnimationFrame` o `setInterval`.
