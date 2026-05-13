@echo off
set BACKUP_FILE=%1

if "%BACKUP_FILE%"=="" (
    echo ERROR: Falta el archivo sql.
    echo Uso: scripts\restore_db.bat backups\archivo.sql
    exit /b 1
)

echo Restaurando base de datos desde %BACKUP_FILE%...

:: Limpieza previa (Forzamos desconexion de otros usuarios)
docker exec -i tenno_db psql -U admin -d template1 -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'tennostore_db' AND pid <> pg_backend_pid();"
docker exec -i tenno_db psql -U admin -d template1 -c "DROP DATABASE IF EXISTS tennostore_db;"
docker exec -i tenno_db psql -U admin -d template1 -c "CREATE DATABASE tennostore_db;"

:: Importacion
type %BACKUP_FILE% | docker exec -i tenno_db psql -U admin tennostore_db

if %ERRORLEVEL% equ 0 (
    echo OK: Restauracion terminada.
) else (
    echo ERROR: Fallo al restaurar los datos.
    exit /b 1
)
pause
