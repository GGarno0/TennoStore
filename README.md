# TennoStore

Proyecto Full Stack para la venta de videojuegos, especializado en seguimiento de precios y reservas inteligente de stock.

## Tecnologías Utilizadas

* **Frontend:** React + Vite
* **Backend:** Node.js + Express (API REST)
* **Base de datos:** PostgreSQL 15 (Con esquema inicializado automáticamente)
* **Despliegue y Orquestación:** Docker + Docker Compose

## Estructura del Proyecto

* **/Frontend**: Interfaz de usuario (React y Tailwind CSS).
* **/Backend**: API REST, conexión con base de datos y lógica de negocio.
* **/docker**: Configuración de los contenedores de Docker e inicialización de la base de datos (`init.sql`).

## Cómo Arrancar el Proyecto

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
* Hay dos scripts credos para facilitar el arranque y la detención del proyecto los cuales son: (`start.bat`), (`stop.bat`)

## Visualización y Puertos

Una vez que el proyecto esté corriendo, puedes acceder a los servicios en las siguientes direcciones:

* **Frontend (Aplicación Web):** [http://localhost](http://localhost)
* **Backend (API REST):** [http://localhost:3000](http://localhost:3000)
* **Base de datos (PostgreSQL):** `localhost:5433` <-- *(Fue cambiado a 5433 por porblemas que se generaban en mi equipo por una incompatibilidad)*.
