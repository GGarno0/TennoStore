@echo off
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

:loop
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Cargando Docker...
    timeout /t 5 /nobreak >nul
    goto loop
)

cd docker
docker compose up -d --build
cd ..

echo.
echo URL: http://localhost
pause
