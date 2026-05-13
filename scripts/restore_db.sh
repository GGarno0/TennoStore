#!/bin/bash
# Script de restauracion para base de datos PostgreSQL en Docker

if [ -f "./docker/.env" ]; then
    export $(grep -v '^#' ./docker/.env | xargs)
fi

if [ -z "$1" ]; then
    echo "ERROR: Debe proporcionar la ruta al archivo SQL de backup."
    echo "Uso: ./scripts/restore_db.sh <ruta_al_archivo_sql>"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: El archivo $BACKUP_FILE no existe."
    exit 1
fi

echo "=========================================="
echo "Iniciando restauracion de base de datos..."
echo "Archivo: $BACKUP_FILE"
echo "=========================================="

# 1. Eliminar base de datos actual para asegurar limpieza total
echo "[1/3] Limpiando base de datos actual..."
docker exec -i tenno_db psql -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
docker exec -i tenno_db psql -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"

# 2. Importar el backup
echo "[2/3] Importando datos desde $BACKUP_FILE..."
docker exec -i tenno_db psql -U $DB_USER $DB_NAME < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "[3/3] Restauracion completada con exito."
    echo "=========================================="
else
    echo "ERROR: Fallo durante la restauracion."
    exit 1
fi
