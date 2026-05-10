@echo off
echo ===========================================
echo Deteniendo el proyecto TennoStore...
echo ===========================================
docker compose --env-file docker/.env -f docker/docker-compose.yml stop
echo ===========================================
echo ¡Proyecto detenido correctamente!
echo ===========================================
pause
