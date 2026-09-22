## Context

Ver `proposal.md` y `AGENTS.md`. Ambos servicios deben ejecutarse en contenedores separados sobre la misma máquina anfitriona o en un entorno de demostración sin necesidad de instalar Node.js ni dependencias locales.

## Goals / Non-Goals

**Goals:**
- Crear Dockerfiles ligeros y rápidos para `worker-service` y `scheduler-service` usando `node:20-alpine`.
- Configurar `docker-compose.yml` con:
  - Servicios: `worker-service` y `scheduler-service`.
  - Mapeo de puertos hacia el anfitrión: `3001:3001` y `3000:3000`.
  - Red privada de tipo bridge (`background-net`).
  - Cláusula `depends_on: worker-service` en el scheduler para asegurar el orden de inicialización.
  - Inyección de `WORKER_SERVICE_URL=http://worker-service:3001` mediante `.env`.
- Proveer scripts sencillos `run.ps1` y `run.sh`.
- Documentar el procedimiento de ejecución en `README.md`.

**Non-Goals:**
- Configuración de clústeres Kubernetes, Swarm o pipelines CI/CD de nube.
- Bases de datos ni servicios auxiliares (Redis, etc.).
- Certificados SSL/TLS para el entorno de demostración.

## Decisions

- **Imágenes Alpine**: `node:20-alpine` reduce drásticamente el tamaño de las imágenes finales y agiliza el tiempo de compilación.
- **Resolución de nombres interna**: Dentro de Docker Compose, el nombre del servicio actúa como hostname en la red interna, por lo que `http://worker-service:3001` comunica los dos contenedores sin depender de la IP del anfitrión.
- **Variables con fallback**: Usar archivo `.env` en la raíz con valores por defecto documentados para facilitar su personalización sin modificar el `docker-compose.yml`.

## Risks / Trade-offs

- **[Riesgo: Scheduler arranca antes de que el worker esté listo para recibir peticiones]** → Mitigación: Usar `depends_on` y el manejo con `try/catch` implementado en el Scheduler para tolerar los primeros segundos de arranque sin crash.
