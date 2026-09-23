#!/bin/bash
# Clona el repo Background_jobs (si hace falta) y levanta Docker Compose.
# Uso: chmod +x setup-and-run.sh && ./setup-and-run.sh

set -e

REPO_URL="https://github.com/DavidMA17-04/Background_jobs.git"
REPO_NAME="Background_jobs"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "=== Background Jobs — clonado y despliegue ==="
echo ""

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: Docker no está disponible. Instálalo o ábrelo e intenta de nuevo."
  exit 1
fi

if [ -f "$SCRIPT_DIR/docker-compose.yml" ]; then
  PROJECT_DIR="$SCRIPT_DIR"
  echo "Proyecto detectado en: $PROJECT_DIR"
else
  PROJECT_DIR="$SCRIPT_DIR/$REPO_NAME"
  if [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
    echo "El repo ya existe en: $PROJECT_DIR"
    echo "Actualizando con git pull..."
    (cd "$PROJECT_DIR" && git pull --ff-only) || echo "Aviso: no se pudo actualizar (se usará la copia local)."
  else
    echo "Clonando $REPO_URL ..."
    git clone "$REPO_URL" "$PROJECT_DIR"
  fi
fi

cd "$PROJECT_DIR"
echo ""
echo "Levantando servicios con Docker Compose..."
echo "Dashboards:"
echo "  Scheduler -> http://localhost:3000/"
echo "  Worker    -> http://localhost:3001/"
echo ""
echo "Para detener: Ctrl+C y luego 'docker compose down'"
echo ""

docker compose up --build
