@echo off
echo ===========================================
echo Arrancando el proyecto TennoStore...
echo ===========================================
docker compose --env-file docker/.env -f docker/docker-compose.yml up -d --build
echo ===========================================
echo ¡Proyecto arrancado con éxito!
echo Accede al Frontend en: http://localhost
echo Accede al Backend en: http://localhost:3000
echo Accede a la Base de datos en el puerto 5433
echo ===========================================
pause
