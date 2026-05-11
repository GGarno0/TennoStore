# Documentación Operativa - TennoStore
## Estado del Proyecto: Hito 2 (Fase de Seguridad e Integración)

Esta documentación refleja las funcionalidades **actualmente implementadas y verificables** en el repositorio.

---

### 1. Seguridad y Autenticación (Implementada)
Se ha implementado un sistema de seguridad basado en estándares industriales para proteger la integridad de los datos.

*   **Encriptación de Contraseñas:** Ninguna contraseña se almacena en texto plano. Se utiliza `bcrypt` con 10 rondas de salting tanto en el registro de usuarios como en la semilla de la base de datos.
*   **Autenticación JWT:** El acceso a funciones privadas (carrito, historial de pedidos) requiere un token JSON Web Token válido.
*   **Autorización por Rol (RBAC):** Los endpoints de administración (`POST`, `PUT`, `DELETE` en `/api/games`) están protegidos por un middleware que verifica el flag `is_admin` del usuario en el token.
*   **Gestión de Secretos:** Todas las credenciales sensibles (DB_USER, DB_PASS, JWT_SECRET) han sido extraídas a archivos `.env` y eliminadas de los archivos de configuración y del `docker-compose.yml`.

**Prueba de Auditoría:**
1. Intente realizar un `POST` a `http://localhost:3000/api/games` sin token: Recibirá un `401 Unauthorized`.
2. Intente realizar el mismo `POST` con un token de usuario normal: Recibirá un `403 Forbidden`.

---

### 2. Funcionalidades de Usuario (Implementadas)
*   **Login y Registro:** Funcional con validación de esquemas (Joi).
*   **Catálogo Dinámico:** Búsqueda en tiempo real, filtrado por categorías y visualización de stock.
*   **Carrito de Compra:** Gestión de cantidades con persistencia en el estado de la sesión y sincronización con el stock del backend.
*   **Reserva de Stock:** Al añadir un producto al carrito, se realiza una reserva temporal en la base de datos (Transacción ACID) para evitar overselling.
*   **Historial de Precios:** Gráficas dinámicas generadas a partir de la tabla `price_history`.

---

### 3. Panel de Administración (Implementado)
Acceso exclusivo para usuarios con `is_admin: true`.
*   **CRUD de Catálogo:** Creación, edición y eliminación de videojuegos.
*   **Gestión de Imágenes:** Integración con Cloudinary mediante almacenamiento de URLs dinámicas.
*   **Control de Inventario:** Alerta visual de stock bajo y actualización en tiempo real.

---

### 4. Guía de Inicio Rápido para Evaluadores
Para verificar el proyecto en un entorno limpio:

1.  **Variables de Entorno:** Cree un archivo `.env` en la carpeta `docker/` basándose en el ejemplo proporcionado.
2.  **Despliegue:** Ejecute `docker-compose up --build`.
3.  **Acceso Admin:** 
    *   **Usuario:** `admin`
    *   **Password:** `admin123` (Pre-cargado en `init.sql` con hash bcrypt).
4.  **Acceso Usuario:**
    *   **Usuario:** `user`
    *   **Password:** `user123`

---

### 5. Estructura Técnica
El proyecto sigue una arquitectura de capas para asegurar la escalabilidad:
*   **Routes:** Definición de endpoints y aplicación de middlewares de seguridad.
*   **Controllers:** Validación de entrada y gestión de respuestas HTTP.
*   **Services:** Lógica de negocio y consultas a la base de datos mediante `pg` (Pool de conexiones).
*   **Middlewares:** Verificación de identidad y roles.
