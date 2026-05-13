@echo off
set BACKUP_DIR=.\backups
if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

for /f "tokens=2 delims==" %%a in ('wmic os get localdatetime /value') do set dt=%%a
set TIMESTAMP=%dt:~0,8%_%dt:~8,6%
set BACKUP_FILE=%BACKUP_DIR%\backup_%TIMESTAMP%.sql

echo Generando backup en %BACKUP_FILE%...

docker exec tenno_db pg_dump -U admin tennostore_db > %BACKUP_FILE%

if %ERRORLEVEL% equ 0 (
    echo OK: Backup guardado.
) else (
    echo ERROR: No se pudo hacer el backup.
)
pause
