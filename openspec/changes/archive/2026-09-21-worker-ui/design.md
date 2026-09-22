## Context

Ver `proposal.md` y `AGENTS.md`. El `worker-service` necesita exponer una interfaz gráfica visual y reactiva para complementar el dashboard del Scheduler, permitiendo contrastar cómo un servicio emite y el otro procesa.

## Goals / Non-Goals

**Goals:**
- Servir una aplicación web estática ligera en `http://localhost:3001/`.
- Exponer el endpoint `GET /api/jobs/recent` retornando el estado de ocupación (`isProcessing`, `currentTaskId`), total acumulado y lista de los últimos 10 reportes procesados.
- Diseño visual diferenciado: tema oscuro (`#0b0f19`) con acentos en verde esmeralda (`#10b981`, `#059669`) para simbolizar la ejecución y éxito del Worker.
- Animación de tarjeta/insignia reactiva que pasa de estado inactivo a activo durante el segundo de simulación.
- Actualización automática vía polling liviano cada 1 segundo.

**Non-Goals:**
- Modificar el contrato del endpoint `POST /api/jobs/process` existente (permanece idéntico).
- Persistencia permanente en disco o bases de datos (se usa arreglo circular en memoria).

## Decisions

- **Estructura dentro de `worker-service`**:
  - `src/public/index.html`: Maquetación con tarjeta de estado del Worker y feed de reportes procesados.
  - `src/public/style.css`: Estilos visuales con variables CSS, tipografía moderna, badges de estado y efectos glow.
  - `src/public/app.js`: Script que consulta `GET /api/jobs/recent` y actualiza dinámicamente el DOM.
- **Manejo de estado en `JobsService`**:
  - Variable booleana `isProcessing` que se activa al entrar en `processJob` y se desactiva al completar el `setTimeout`.
  - Arreglo en memoria con los últimos reportes generados.

## Risks / Trade-offs

- **[Riesgo: Polling cada 1s sobrecargue el servicio]** → Mitigación: Es una consulta en memoria sumamente liviana (retorna un objeto JSON de pocos bytes) sin costo de base de datos ni operaciones pesadas.
