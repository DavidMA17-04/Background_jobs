## Why

El `worker-service` recibe y procesa los Background Jobs, pero actualmente solo es visible mediante logs de texto en la consola. Para que la demostración sea clara y atractiva, se necesita una interfaz gráfica web servida en `http://localhost:3001/` que muestre visualmente cuándo entra un trabajo, la animación mientras se procesa (1 segundo) y la confirmación final del reporte generado.

## What Changes

- Implementación del endpoint `GET /api/jobs/recent` para exponer en memoria la lista de los últimos trabajos recibidos y el estado actual del Worker.
- Incorporación de una interfaz web moderna en la raíz `GET /` del Worker con tema oscuro, acentos verde esmeralda y animaciones de procesamiento en tiempo real.
- Indicador visual de estado interactivo: insignia animada con pulso ("IDLE" cuando espera y "PROCESANDO REPORTE..." cuando simula la carga).
- Tabla interactiva de reportes generados con marcas de tiempo formateadas, duración del job y estado de confirmación.

## Capabilities

### New Capabilities
- `worker-dashboard`: Interfaz web interactiva servida en el puerto 3001 del Worker para visualizar en tiempo real la recepción, animación de procesamiento y confirmación de los Background Jobs.

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **worker-service**: Se añade un endpoint `GET /api/jobs/recent` y servicio de assets estáticos web (`index.html`, `styles.css`, `app.js`).
- **Ruta de acceso**: Los usuarios y evaluadores podrán acceder directamente a `http://localhost:3001/`.
