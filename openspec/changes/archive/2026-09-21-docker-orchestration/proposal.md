## Why

Para la exposición y evaluación del proyecto es fundamental que cualquier evaluador pueda levantar la solución completa con un único comando, garantizando reproducibilidad y eliminando problemas de entorno. La orquestación con Docker Compose unifica ambos servicios en una red compartida sin acoplar su código fuente.

## What Changes

- Creación de `worker-service/Dockerfile` para construir y empaquetar el Worker.
- Creación de `scheduler-service/Dockerfile` para construir y empaquetar el Scheduler.
- Creación de `docker-compose.yml` en la raíz del repositorio orquestando ambos servicios con resolución DNS interna (`http://worker-service:3001`).
- Archivo `.env` y `.env.example` para gestionar puertos mapeados y URLs de interconexión.
- Scripts de ayuda para Windows (`run.ps1`) y Unix/Linux (`run.sh`) que ejecuten `docker compose up --build`.
- `README.md` con instrucciones paso a paso para la demo.

## Capabilities

### New Capabilities
- `containerized-deployment`: Capacidad de empaquetar, configurar y orquestar ambos microservicios NestJS en contenedores Docker comunicados mediante una red privada de puente (bridge network).

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **Archivos en raíz**: `docker-compose.yml`, `.env`, `run.ps1`, `run.sh`, `README.md`.
- **Archivos en servicios**: `worker-service/Dockerfile`, `scheduler-service/Dockerfile`.
- **Ejecución**: Permite arrancar y detener el ecosistema completo con `docker compose up` / `docker compose down`.
