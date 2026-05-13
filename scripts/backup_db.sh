#!/bin/bash
# Script de backup para base de datos PostgreSQL en Docker

# Cargar variables de entorno desde el directorio docker
if [ -f "./docker/.env" ]; then
    export $(grep -v '^#' ./docker/.env | xargs)
elif [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/tennostore_backup_$TIMESTAMP.sql"

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

echo "=========================================="
echo "Iniciando backup de la base de datos..."
echo "Contenedor: tenno_db"
echo "Destino: $BACKUP_FILE"
echo "=========================================="

docker exec tenno_db pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "SUCCESS: Backup completado exitosamente."
else
    echo "ERROR: Fallo al realizar el backup."
    exit 1
fi
