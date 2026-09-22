## Purpose

Proveer una interfaz de usuario visual en el servicio Worker para monitorear el procesamiento de trabajos en segundo plano y el historial de reportes.

## ADDED Requirements

### Requirement: Presentación del Dashboard Web del Worker
El worker-service DEBE servir una página web en la ruta raíz `GET /` que presente un panel de control con diseño oscuro pulido, mostrando el identificador del servicio, el estado actual de procesamiento (esperando o procesando) y el total de trabajos completados.

#### Scenario: Acceso al dashboard web del worker
- **WHEN** el usuario navega a `http://localhost:3001/` con un navegador web
- **THEN** el sistema carga la interfaz gráfica del Worker sin errores y con estilos modernos aplicados

### Requirement: Animación reactiva de procesamiento
La interfaz DEBE reflejar visualmente cuando una tarea entra en fase de procesamiento mediante una transición de estado (insignia animada con pulso/glow y texto "Procesando reporte..."), regresando a "En espera" una vez finalizado el retardo simulado.

#### Scenario: Transición visual de estado
- **WHEN** el worker recibe un job y ejecuta el retardo simulado
- **THEN** el dashboard cambia inmediatamente su estado visual a "PROCESANDO", y al concluir el retardo actualiza el estado a "COMPLETADO" y vuelve a "EN ESPERA"

### Requirement: Historial visual de reportes procesados
La interfaz DEBE presentar una tabla o listado de tarjetas en tiempo real con los trabajos procesados, detallando `taskId`, `tipo`, `fecha y hora de recepción` y `estado PROCESSED`.

#### Scenario: Actualización de la lista de reportes
- **WHEN** un job termina de procesarse
- **THEN** la tabla de reportes se actualiza automáticamente mostrando el nuevo registro en la parte superior sin necesidad de recargar manualmente el navegador
