# Documentación Operativa - TennoStore

Este manual detalla los procedimientos necesarios para la administración, mantenimiento y auditoría de la plataforma.

---

## 1. Gestión de Seguridad y Acceso

### Auditoría de Endpoints
El sistema implementa una defensa en profundidad. Puede verificar la seguridad mediante las siguientes pruebas:
*   **Acceso no autorizado:** Cualquier petición a `/api/admin` o `/api/orders` sin una cabecera de `Authorization: Bearer <token>` resultará en un error `401`.
*   **Escalada de privilegios:** Un token de usuario estándar intentando acceder a funciones de edición de catálogo recibirá un error `403`.

### Protección de Datos Sensibles
*   **Hashes:** El sistema nunca almacena ni transmite contraseñas en texto plano.
*   **Variables de entorno:** Todas las configuraciones críticas se inyectan en tiempo de ejecución a través del archivo `.env` en la carpeta `docker/`.

---

## 2. Integridad de Datos y Control de Stock

El sistema garantiza que no se pierdan unidades de inventario mediante dos mecanismos sincronizados:
1.  **Reserva Temporal:** Al añadir al carrito, el servidor resta 1 unidad del stock físico de forma transaccional.
2.  **Devolución Automática:** El frontend gestiona un temporizador de 10 minutos. Si la compra no se completa o el item se elimina, se envía una señal de liberación de stock (`cancel-reservation`).
3.  **Persistencia:** El carrito se guarda en `localStorage` vinculado al ID del usuario (`cart_${userId}`), evitando la pérdida de stock reservado al refrescar la página.

---

## 3. Procedimientos de Mantenimiento

### Copias de Seguridad (Backup)
Para realizar un respaldo completo de la base de datos (esquema y datos):
*   **Windows:** Ejecute `scripts\backup_db.bat`.
*   **Linux/WSL:** Ejecute `./scripts/backup_db.sh`.
Los archivos se generarán en la carpeta `backups/` con un sello de tiempo.

### Restauración de Sistema (Restore)
En caso de fallo crítico o necesidad de migración:
*   **Windows:** Ejecute `scripts\restore_db.bat backups\nombre_archivo.sql`.
*   **Linux/WSL:** Ejecute `./scripts/restore_db.sh backups/nombre_archivo.sql`.
Este proceso recreará la base de datos desde cero utilizando el punto de restauración seleccionado.

---

## 4. Guía de Administración del Catálogo

1.  **Acceso:** Inicie sesión con la cuenta de administrador.
2.  **Inventario:** Desde el Panel Admin, utilice el buscador para localizar productos rápidamente.
3.  **Historial:** Pulse el icono de gráfica en cualquier juego para analizar la evolución de su precio en los últimos 30 días.
4.  **Informes:** Los informes de actividad de usuario pueden exportarse a PDF desde el perfil de cada cliente para auditorías de compras.

---

## 5. Resolución de Incidencias Comunes

*   **Problema:** Los cambios en `init.sql` no se reflejan.
    *   **Solución:** Ejecute `docker compose down -v` para eliminar los volúmenes de datos antiguos y reinicie con `start.bat`.
*   **Problema:** Error de conexión a la base de datos en local.
    *   **Solución:** Verifique que los puertos 5432 y 3000 no estén siendo usados por otros servicios locales fuera de Docker.
