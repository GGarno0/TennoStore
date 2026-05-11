-- init.sql
CREATE TABLE IF NOT EXISTS videojuegos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(100),
    imagen_url TEXT
);

INSERT INTO videojuegos (titulo, precio, stock, categoria, imagen_url) VALUES
('The Legend of Zelda: Tears of the Kingdom', 69.99, 15, 'Aventura', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778292730/2x1_NSwitch_TloZTearsOfTheKingdom_Gamepage_image1600w_m25mvo.jpg'),
('Elden Ring', 59.99, 8, 'RPG', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778293573/8BDt7H1bBfOhd2G4X20G6RQv_mohnhp.jpg'),
('Cyberpunk 2077', 29.99, 25, 'Acción', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778292842/cyberpunk-2077-8_xtyoo1.jpg');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Insertar usuarios iniciales (Contraseñas verificadas con Bcrypt)
-- admin / admin123
-- user / user123
INSERT INTO users (username, password, is_admin) VALUES
('admin', '$2b$10$/dCthRhOby7UZUtNEQjRI.tpPxMd.4OJXPdqPyhPx9jX.4lfQQaSe', TRUE),
('user', '$2b$10$Ou2.1XZTFX2ZhgHhYSlzIO23h4LrGbfqa9YKjKDSqsgVj.mOm4qeK', FALSE)
ON CONFLICT (username) DO NOTHING;

-- Historial de precios (RF04)
CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    game_id INT REFERENCES videojuegos(id) ON DELETE CASCADE,
    precio DECIMAL(10, 2) NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE
);

-- Datos simulados de evolución de precios del último mes
INSERT INTO price_history (game_id, precio, fecha) VALUES
(1, 79.99, CURRENT_DATE - INTERVAL '30 days'),
(1, 75.00, CURRENT_DATE - INTERVAL '15 days'),
(1, 69.99, CURRENT_DATE),
(2, 69.99, CURRENT_DATE - INTERVAL '30 days'),
(2, 65.00, CURRENT_DATE - INTERVAL '20 days'),
(2, 59.99, CURRENT_DATE),
(3, 49.99, CURRENT_DATE - INTERVAL '30 days'),
(3, 39.99, CURRENT_DATE - INTERVAL '10 days'),
(3, 29.99, CURRENT_DATE);

-- Tabla de pedidos (RF05)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    total DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
