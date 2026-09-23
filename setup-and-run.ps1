# Clona el repo Background_jobs (si hace falta) y levanta Docker Compose.
# Uso: doble clic en setup-and-run.bat, o en PowerShell: .\setup-and-run.ps1

$ErrorActionPreference = "Stop"

$RepoUrl = "https://github.com/DavidMA17-04/Background_jobs.git"
$RepoName = "Background_jobs"

Write-Host ""
Write-Host "=== Background Jobs — clonado y despliegue ===" -ForegroundColor Cyan
Write-Host ""

# 1) Verificar Docker
try {
    docker version | Out-Null
} catch {
    Write-Host "ERROR: Docker no esta disponible. Abre Docker Desktop e intenta de nuevo." -ForegroundColor Red
    exit 1
}

# 2) Decidir carpeta del proyecto
$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }

if (Test-Path (Join-Path $scriptDir "docker-compose.yml")) {
    # Ya estas dentro del repo clonado
    $projectDir = $scriptDir
    Write-Host "Proyecto detectado en: $projectDir" -ForegroundColor Green
} else {
    # Clonar junto al script (o actualizar si ya existe)
    $projectDir = Join-Path $scriptDir $RepoName

    if (Test-Path (Join-Path $projectDir "docker-compose.yml")) {
        Write-Host "El repo ya existe en: $projectDir" -ForegroundColor Yellow
        Write-Host "Actualizando con git pull..." -ForegroundColor Yellow
        Push-Location $projectDir
        try {
            git pull --ff-only
        } catch {
            Write-Host "Aviso: no se pudo actualizar (se usara la copia local)." -ForegroundColor Yellow
        }
        Pop-Location
    } else {
        Write-Host "Clonando $RepoUrl ..." -ForegroundColor Green
        git clone $RepoUrl $projectDir
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: fallo el git clone." -ForegroundColor Red
            exit 1
        }
    }
}

# 3) Levantar Docker Compose
Set-Location $projectDir
Write-Host ""
Write-Host "Levantando servicios con Docker Compose..." -ForegroundColor Green
Write-Host "Dashboards:" -ForegroundColor Cyan
Write-Host "  Scheduler -> http://localhost:3000/"
Write-Host "  Worker    -> http://localhost:3001/"
Write-Host ""
Write-Host "Para detener: Ctrl+C y luego 'docker compose down'" -ForegroundColor DarkGray
Write-Host ""

docker compose up --build
