## Purpose

Proveer una interfaz de usuario visual en el servicio Scheduler para monitorear el temporizador del Time Trigger y las tareas emitidas.

## ADDED Requirements

### Requirement: Presentación del Dashboard Web del Scheduler
El scheduler-service DEBE servir una página web en la ruta raíz `GET /` que presente un panel de control con diseño oscuro pulido, mostrando el nombre del servicio, el estado actual de ejecución del cron y un contador de jobs totales emitidos.

#### Scenario: Acceso al dashboard web
- **WHEN** el usuario navega a `http://localhost:3000/` con un navegador web
- **THEN** el sistema carga la interfaz gráfica del Scheduler sin errores y con estilos modernos aplicados

### Requirement: Cuenta regresiva visual del Time Trigger
La interfaz DEBE incluir un indicador dinámico (anillo o barra de progreso con cronómetro numérico) que muestre en tiempo real los segundos restantes hasta la próxima ejecución automática del Time Trigger (ciclo de 10 segundos).

#### Scenario: Progreso visual de la cuenta regresiva
- **WHEN** transcurre el tiempo entre cada ciclo de 10 segundos
- **THEN** la interfaz actualiza segundo a segundo la animación del temporizador hasta llegar a cero, reiniciándose al ejecutarse el nuevo disparo

### Requirement: Historial visual de jobs emitidos
La interfaz DEBE actualizarse dinámicamente mostrando una lista o tabla con los últimos jobs despachados (`taskId`, `tipo`, `timestamp` y si fue confirmado exitosamente por el Worker).

#### Scenario: Visualización de un nuevo job emitido
- **WHEN** el Scheduler ejecuta un nuevo job (ej. `JOB-001`) y recibe la confirmación del Worker
- **THEN** la lista del dashboard agrega la tarjeta de la tarea indicando el estado `CONFIRMADO` con fecha y hora
