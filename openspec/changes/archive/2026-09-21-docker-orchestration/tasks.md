## 1. Dockerfiles y Dockerignore

- [x] 1.1 Crear `worker-service/Dockerfile` optimizado con `node:20-alpine`
- [x] 1.2 Crear `scheduler-service/Dockerfile` optimizado con `node:20-alpine`
- [x] 1.3 Crear archivos `.dockerignore` en ambos servicios excluyendo `node_modules`, `dist` y logs

## 2. Docker Compose y Configuración de Entorno

- [x] 2.1 Crear `docker-compose.yml` orquestando `worker-service` y `scheduler-service` en red privada compartida
- [x] 2.2 Crear archivo `.env` y plantilla `.env.example` definiendo puertos y URL interna (`http://worker-service:3001`)

## 3. Scripts de Lanzamiento y Documentación

- [x] 3.1 Crear script PowerShell `run.ps1` para levantar la solución en Windows con un solo clic o comando
- [x] 3.2 Crear script Bash `run.sh` para entornos Linux/macOS
- [x] 3.3 Redactar `README.md` en la raíz con instrucciones de instalación, ejecución y guía de la demostración

## 4. Verificación de la Demo Completa

- [x] 4.1 Ejecutar `docker compose up --build` y verificar la compilación y arranque de ambos contenedores
- [x] 4.2 Validar la salida de logs unificada en la terminal de Docker para confirmar que se cumple la secuencia exacta de `04-Exposicion/logs-esperados.md`
- [x] 4.3 Probar el apagado limpio con `docker compose down`
