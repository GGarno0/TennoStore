# 🎮 TennoStore

Proyecto Full Stack para la venta de videojuegos, especializado en seguimiento de precios y reservas inteligente de stock.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React + Vite (Modularizado en componentes limpios y reutilizables)
* **Backend:** Node.js + Express (API REST siguiendo arquitectura limpia MVC)
* **Base de datos:** PostgreSQL 15 (Con esquema inicializado automáticamente)
* **Despliegue y Orquestación:** Docker + Docker Compose

---

## 📂 Estructura del Proyecto

* **/Frontend**: Interfaz de usuario (React y Tailwind CSS).
* **/Backend**: API REST, conexión con base de datos y lógica de negocio.
* **/docker**: Configuración de los contenedores de Docker e inicialización de la base de datos (`init.sql`).

---

## 🚀 Cómo Arrancar el Proyecto

Tienes dos formas de ejecutar el proyecto:

### Opción A: Usar los scripts automatizados (Recomendado)
He creado scripts para facilitar el arranque y la detención:
* **`star.bat`**: Ejecuta los contenedores en segundo plano (`docker compose up -d --build`).
* **`stop.bat`**: Detiene los contenedores de forma segura (`docker compose stop`).

---

### Opción B: Ejecución manual
1. **Clona el repositorio**
   ```bash
   git clone https://github.com/GGarno0/TennoStore
   cd TennoStore
   ```

2. **Levanta los contenedores con Docker**
   ```bash
   cd docker
   docker compose up -d --build
   ```

---

## 🖥️ Visualización y Puertos

Una vez que el proyecto esté corriendo, puedes acceder a los servicios en las siguientes direcciones:

* **Frontend (Aplicación Web):** [http://localhost](http://localhost)
* **Backend (API REST):** [http://localhost:3000](http://localhost:3000)
* **Base de datos (PostgreSQL):** `localhost:5433` 👈 *(Cambiado a 5433 para evitar conflictos si tienes un PostgreSQL local en tu equipo)*.
