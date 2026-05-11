@echo off
setlocal
title TennoStore Launcher

echo ===========================================
echo   TENNOSTORE - INICIADOR DE PROYECTO
echo ===========================================

:: 1. Verificar si existe el archivo .env en la carpeta docker
if not exist "docker\.env" (
    echo [CONFIG] No se encontro docker\.env. Creandolo desde .env.example...
    copy "docker\.env.example" "docker\.env" >nul
    echo [OK] Archivo .env generado.
)

:: 2. Verificar si Docker esta corriendo
echo [DOCKER] Comprobando conexion con Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] No se pudo conectar con Docker. 
    echo Por favor, asegurese de que Docker Desktop este abierto y funcionando.
    echo.
    pause
    exit /b
)

:: 3. Levantar contenedores
echo [DOCKER] Levantando contenedores (esto puede tardar unos minutos)...
docker compose --env-file docker/.env -f docker/docker-compose.yml up -d --build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al levantar los contenedores.
    pause
    exit /b
)

:: 4. Finalizacion exitosa
echo ===========================================
echo   ¡PROYECTO ARRANCADO CON EXITO!
echo ===========================================
echo.
echo  - Frontend: http://localhost
echo  - Backend:  http://localhost:3000
echo  - DB Port:  5433 (PostgreSQL)
echo.
echo ===========================================
pause
