# containerized-deployment Specification

## Purpose
Proveer la infraestructura de contenedores y orquestación con Docker Compose para el despliegue y ejecución unificada de los servicios.
## Requirements
### Requirement: Empaquetado en imágenes Docker independientes
Cada microservicio (`scheduler-service` y `worker-service`) DEBE contar con su propio `Dockerfile` autónomo basado en una imagen de Node.js ligera (ej. `node:20-alpine`), capaz de compilar el código TypeScript y ejecutar la aplicación en modo producción.

#### Scenario: Construcción exitosa de imágenes
- **WHEN** se ejecuta el comando de construcción `docker compose build`
- **THEN** las imágenes de `scheduler-service` y `worker-service` se compilan sin errores

### Requirement: Orquestación mediante Docker Compose
El archivo `docker-compose.yml` DEBE definir los dos servicios en una red compartida y configurar las variables de entorno para que el `scheduler-service` se comunique con el `worker-service` usando su nombre de servicio como host (`http://worker-service:3001`).

#### Scenario: Arranque coordinado y red compartida
- **WHEN** el usuario ejecuta `docker compose up`
- **THEN** ambos contenedores inician, el scheduler resuelve la dirección del worker y el flujo de background jobs se ejecuta automáticamente cada 10 segundos

### Requirement: Scripts de ejecución multiplataforma y documentación
El repositorio DEBE proporcionar scripts de ejecución rápida (`run.ps1` para Windows y `run.sh` para Linux/macOS) que levanten la composición con un solo comando, acompañados de un `README.md` explicativo.

#### Scenario: Ejecución mediante script
- **WHEN** un evaluador ejecuta `./run.ps1` o `./run.sh`
- **THEN** el script levanta los contenedores y muestra la salida combinada de logs en la terminal

