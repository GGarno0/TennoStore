@echo off
setlocal
title TennoStore Stopper

echo ===========================================
echo   TENNOSTORE - DETENIENDO PROYECTO
echo ===========================================

:: Verificar si Docker esta corriendo
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker no esta corriendo. Nada que detener.
    pause
    exit /b
)

echo [DOCKER] Deteniendo contenedores...
docker compose -f docker/docker-compose.yml down

echo ===========================================
echo   PROYECTO DETENIDO CORRECTAMENTE
echo ===========================================
pause
