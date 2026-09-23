@echo off
title Background Jobs - Clonar y desplegar
cd /d "%~dp0"

echo.
echo Ejecutando setup-and-run.ps1 ...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-and-run.ps1"

echo.
if errorlevel 1 (
  echo Algo fallo. Revisa el mensaje de arriba.
  pause
  exit /b 1
)

pause
