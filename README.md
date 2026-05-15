# TennoStore - E-Commerce de Videojuegos
## Proyecto Full Stack con Seguridad y Arquitectura de Capas

TennoStore es una plataforma profesional para la venta de videojuegos, diseñada con un enfoque en la seguridad, la gestión de inventario en tiempo real y la recuperación ante fallos.

---

## Funcionalidades Principales

### Gestión de Usuarios y Seguridad
*   **Autenticación Robusta:** Implementación de JWT (JSON Web Tokens) para la gestión de sesiones.
*   **Seguridad de Datos:** Encriptación de contraseñas con Bcrypt y protección contra inyecciones SQL mediante consultas parametrizadas.
*   **Perfiles de Usuario:** Gestión de datos personales, eliminación de cuenta (cumplimiento RGPD) y exportación de actividad en PDF.

### Catálogo e Inventario
*   **Búsqueda Inteligente:** Algoritmo de relevancia que prioriza coincidencias exactas y orden alfabético.
*   **Control de Stock:** Sistema de reserva temporal de stock (10 minutos) mediante transacciones ACID para evitar sobreventa.
*   **Historial de Precios:** Registro automático de variaciones de precio y visualización gráfica de tendencias.

### Proceso de Compra
*   **Carrito Persistente:** Almacenamiento local aislado por ID de usuario para evitar conflictos entre sesiones.
*   **Detalle de Pedidos:** Registro exhaustivo de compras incluyendo títulos, cantidades y precios históricos en el momento del pago.

### Administración
*   **Panel de Control:** Gestión integral de catálogo (CRUD) y usuarios.
*   **Mantenimiento:** Scripts automatizados de copia de seguridad (Backup) y restauración (Restore) para entornos Windows y Linux.

---

## Arquitectura del Sistema
El proyecto utiliza una arquitectura de capas bien definida:
*   **Frontend (React + Vite):** SPA modular con Tailwind CSS para una interfaz reactiva.
*   **Backend (Node.js + Express):** API REST organizada en Rutas, Controladores, Servicios y Middlewares.
*   **Base de Datos (PostgreSQL):** Esquema relacional con integridad referencial y disparadores automáticos.
*   **Contenedores (Docker):** Orquestación completa mediante Docker Compose para facilitar el despliegue.

---

## Instrucciones de Inicio Rápido

1.  **Configuración de Entorno:**
    Copie el archivo `docker/.env.example` a `docker/.env` y configure las credenciales deseadas.

2.  **Despliegue:**
    Ejecute el script `start.bat` o utilice el comando:
    ```bash
    docker compose --env-file docker/.env -f docker/docker-compose.yml up -d --build
    ```

3.  **Credenciales por Defecto:**
    *   **Admin:** admin / admin123
    *   **Usuario:** user / user123

---

