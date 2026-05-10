# Documentación Operativa - TennoStore 

Este documento detalla el funcionamiento técnico, la seguridad y los procedimientos de mantenimiento de la plataforma **TennoStore**.

---

## 1. Arquitectura y Despliegue
La plataforma utiliza una arquitectura de microservicios dockerizados para garantizar un entorno estable:
*   **Frontend:** React + Vite (Puerto 80).
*   **Backend:** Node.js + Express (Puerto 3000).
*   **Database:** PostgreSQL 15 (Puerto interno 5432 / Externo 5433).

### Procedimiento de Inicio Rápido
Para desplegar el sistema completo puedes usar el script de automatización en la raíz:
```bash
# Método recomendado (Windows)
start.bat

# Método manual (Docker)
docker compose --env-file docker/.env -f docker/docker-compose.yml up -d --build
```

---

## 2. Gestión de Usuarios y Seguridad (RBAC)
El sistema implementa un control de acceso basado en roles para proteger la integridad de los datos.
*   **Usuarios Estándar:** Pueden navegar, buscar, filtrar por género, gestionar su carrito y realizar compras simuladas.
*   **Administradores:** Tienen acceso al Panel de Gestión para realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre el catálogo de juegos.

### Seguridad en la API
Las rutas sensibles están protegidas por middlewares de autenticación:
1.  **verifyToken:** Valida el JSON Web Token (JWT) enviado en la cabecera de la petición.
2.  **verifyAdmin:** Comprueba que el usuario tiene privilegios de administrador antes de permitir cambios en el inventario.

---

## 3. Endpoints Principales de la API

### Pedidos y Pagos
*   **`POST /api/orders`**: Registra la compra tras la validación en la pasarela de pago. Genera un registro permanente asociado al usuario.

### Gestión de Catálogo (Solo Administradores)
*   **`POST /api/games`**: Añadir un nuevo título al sistema.
*   **`PUT /api/games/:id`**: Actualizar información (precio, stock, etc.).
*   **`DELETE /api/games/:id`**: Eliminar un juego del catálogo.

### Historial y Estado
*   **`GET /api/games/:id/history`**: Recupera los datos para la gráfica de evolución de precios.
*   **`GET /api/status`**: Comprueba la disponibilidad del servidor backend.

---

## 4. Lógica de Negocio y Automatización
*   **Reserva de Stock:** Al añadir productos al carrito, el sistema reserva las unidades en la base de datos para evitar "overselling".
*   **Expiración de Carrito:** Si el usuario no completa la compra en 10 minutos, el sistema libera automáticamente el stock reservado.
*   **Sincronización:** El stock se actualiza en tiempo real en la interfaz cuando el usuario añade o quita elementos.

---

## 5. Mantenimiento y Backups

### Crear Copia de Seguridad
Genera un archivo `.sql` con el estado actual de toda la base de datos:
```bash
docker exec -t tenno_db pg_dump -U admin -d tennostore_db -c > backup_tennostore.sql
```

### Restaurar Datos
```bash
docker exec -i tenno_db psql -U admin -d tennostore_db < backup_tennostore.sql
```

---

## 6. Configuración (Variables de Entorno)
Ubicadas en `docker/.env`. Es fundamental configurar estas variables para el correcto inicio del sistema:
*   `DB_USER / DB_PASS`: Credenciales de acceso a PostgreSQL.
*   `JWT_SECRET`: Clave maestra para la generación de tokens de sesión.
*   `VITE_API_URL`: Dirección del servidor backend para las llamadas desde el cliente.
