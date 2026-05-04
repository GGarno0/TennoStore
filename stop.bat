@echo off
echo ===========================================
echo Deteniendo el proyecto TennoStore...
echo ===========================================
cd docker
docker compose stop
echo ===========================================
echo ¡Proyecto detenido correctamente!
echo ===========================================
pause
