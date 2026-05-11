# TennoStore - E-Commerce de Videojuegos
## Proyecto Full Stack con Seguridad y Arquitectura de Capas

**TennoStore** es una plataforma profesional para la venta de videojuegos, diseñada con un enfoque en la seguridad, la gestión de inventario en tiempo real y la visualización de datos históricos.

---

## 🛠️ Arquitectura del Sistema
El proyecto ha sido estructurado siguiendo el patrón de **Arquitectura en Capas**, lo que permite una clara separación de responsabilidades:

*   **Frontend (React + Vite):** Interfaz SPA moderna, reactiva y segura.
*   **Backend (Node.js + Express):** API REST robusta organizada en:
    *   **Rutas:** Definición de puntos de entrada y aplicación de seguridad.
    *   **Controladores:** Gestión de peticiones/respuestas y validación de datos (Joi).
    *   **Servicios:** Lógica de negocio pura e interacción con la base de datos (PostgreSQL).
    *   **Middlewares:** Filtros de seguridad (JWT) y autorización por roles.
*   **Infraestructura (Docker):** Orquestación mediante Docker Compose para asegurar un entorno de desarrollo idéntico al de producción.

---

## 🔐 Seguridad y Protección de Datos
Se han implementado las siguientes medidas para cumplir con los estándares de seguridad:

1.  **Autenticación JWT:** Sesiones seguras mediante tokens firmados.
2.  **Encriptación Bcrypt:** Las contraseñas se almacenan únicamente como hashes salteados (10 rondas).
3.  **RBAC (Role-Based Access Control):** Diferenciación estricta entre usuarios y administradores.
4.  **Sanitización de Salida:** Los datos sensibles (hashes de contraseñas) se eliminan de las respuestas de la API.
5.  **Gestión de Secretos:** Eliminación total de credenciales hardcodeadas; uso exclusivo de variables de entorno `.env`.

---

## 🚀 Cómo Arrancar el Proyecto

1.  **Configuración:** 
    Copie el archivo `docker/.env.example` a `docker/.env` y ajuste el `JWT_SECRET`.
2.  **Despliegue:** 
    Desde la raíz del proyecto, ejecute:
    ```bash
    docker compose --env-file docker/.env -f docker/docker-compose.yml up -d --build
    ```
    *(O utilice los scripts facilitados `start.bat` / `stop.bat`)*.

3.  **Credenciales de Prueba:**
    *   **Administrador:** `admin` / `admin123`
    *   **Usuario:** `user` / `user123`

---

## 📄 Documentación Operativa
Para ver una guía detallada de las operaciones y pruebas de auditoría de seguridad, consulte el archivo [OPERACIONES.md](./OPERACIONES.md).
