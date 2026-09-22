## 1. Backend y Estado en Memoria

- [x] 1.1 Añadir en `JobsService` variables de estado en memoria (`isProcessing`, `totalProcessed`, historial de los últimos 10 reportes)
- [x] 1.2 Exponer el endpoint `GET /api/jobs/recent` en `JobsController` para consultar el estado y la lista de reportes

## 2. Desarrollo de la Interfaz Web (HTML / CSS / JS)

- [x] 2.1 Diseñar `src/public/index.html` con encabezado, tarjeta de estado reactiva (glow y badge de actividad), contador de reportes y tabla
- [x] 2.2 Diseñar `src/public/style.css` con tema oscuro, acentos verde esmeralda (`#10b981`), tipografía moderna y micro-animaciones
- [x] 2.3 Desarrollar `src/public/app.js` implementando polling cada segundo para alternar entre "ESPERANDO" y "PROCESANDO REPORTE" dinámicamente

## 3. Integración en NestJS

- [x] 3.1 Habilitar el servicio de archivos estáticos en `worker-service` para responder en la ruta raíz `GET /`
- [x] 3.2 Ajustar `nest-cli.json` o scripts de copia para incluir `src/public` en la distribución final

## 4. Verificación Visual

- [x] 4.1 Levantar el servicio y navegar a `http://localhost:3001/` en el navegador
- [x] 4.2 Enviar una petición (manualmente o mediante el Scheduler) y verificar que el dashboard cambie a "PROCESANDO", muestre el retardo y añada el nuevo reporte completado a la tabla
