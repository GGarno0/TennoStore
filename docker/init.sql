-- init.sql
CREATE TABLE IF NOT EXISTS videojuegos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL UNIQUE,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(100),
    plataforma VARCHAR(50),
    imagen_url TEXT
);

INSERT INTO videojuegos (titulo, precio, stock, categoria, plataforma, imagen_url) VALUES
('The Legend of Zelda: Tears of the Kingdom', 69.99, 15, 'Aventura', 'NINTENDO', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778292730/2x1_NSwitch_TloZTearsOfTheKingdom_Gamepage_image1600w_m25mvo.jpg'),
('Elden Ring', 59.99, 8, 'RPG', 'PC, PLAYSTATION, XBOX', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778293573/8BDt7H1bBfOhd2G4X20G6RQv_mohnhp.jpg'),
('Cyberpunk 2077', 29.99, 25, 'Acción', 'PC, XBOX, PLAYSTATION', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778292842/cyberpunk-2077-8_xtyoo1.jpg'),
('Spider-Man 2', 79.99, 12, 'Acción', 'PLAYSTATION', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778621345/2028edeaf4c0b60142550a3d6e024b6009853ceb9f51591e_rke4oa.jpg'),
('Starfield', 69.99, 20, 'RPG', 'PC, XBOX', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778621424/ION_Journey_Through_Space_16x9_Center_a6vb0g.jpg'),
('Mario Kart 8 Deluxe', 49.99, 30, 'Carreras', 'NINTENDO', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778621457/H2x1_NSwitch_MarioKart8Deluxe_image1600w_wtwi9a.jpg'),
('God of War Ragnarök', 79.99, 10, 'Acción', 'PLAYSTATION', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778700712/1200_630_gphvll.jpg'),
('Minecraft', 19.99, 50, 'Aventura', 'PC, NINTENDO, XBOX, PLAYSTATION', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778293590/minecraft-2755256_via8sn.jpg'),
('Final Fantasy VII Rebirth', 79.99, 15, 'RPG', 'PLAYSTATION', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778701018/Final-Fantasy-7-Rebirth_fkkejt.jpg'),
('Forza Horizon 5', 59.99, 20, 'Carreras', 'PC, XBOX', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778701326/Forza-Horizon-5-PS5-Date_02-27-25_ibofao.jpg'),
('Hades', 24.99, 40, 'Acción', 'PC, NINTENDO, XBOX, PLAYSTATION', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778701367/2560x1440-2560x1440-5e710b93049cbd2125cf0261dcfbf943_hmn7tx.jpg'),
('The Witcher 3: Wild Hunt', 39.99, 25, 'RPG', 'PC, XBOX, PLAYSTATION, NINTENDO', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778701435/EGS_TheWitcher3WildHuntCompleteEdition_CDPROJEKTRED_S1_2560x1440-82eb5cf8f725e329d3194920c0c0b64f_ygfvaj.jpg'),
('Animal Crossing: New Horizons', 59.99, 30, 'Aventura', 'NINTENDO', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778701467/H2x1_NSwitch_AnimalCrossingNewHorizons_image1600w_acyzkn.jpg'),
('Call of Duty: Black Ops 7', 79.99, 20, 'Acción', 'PC, XBOX, PLAYSTATION', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778700949/callduty_4678943b_z6coro.jpg'),
('Resident Evil 4 Remake', 59.99, 15, 'Acción', 'PC, XBOX, PLAYSTATION', 'https://res.cloudinary.com/dudsuvnu0/image/upload/v1778701520/resident-evil-4-remake_xysfku.jpg');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Insertar usuarios iniciales
INSERT INTO users (username, email, password, is_admin) VALUES
('admin', 'admin@tennostore.com', '$2b$10$/dCthRhOby7UZUtNEQjRI.tpPxMd.4OJXPdqPyhPx9jX.4lfQQaSe', TRUE),
('user', 'user@example.com', '$2b$10$Ou2.1XZTFX2ZhgHhYSlzIO23h4LrGbfqa9YKjKDSqsgVj.mOm4qeK', FALSE)
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
(3, 29.99, CURRENT_DATE),
(4, 79.99, CURRENT_DATE - INTERVAL '30 days'),
(5, 69.99, CURRENT_DATE - INTERVAL '30 days'),
(6, 49.99, CURRENT_DATE - INTERVAL '30 days'),
(7, 89.99, CURRENT_DATE - INTERVAL '30 days'),
(7, 79.99, CURRENT_DATE),
(8, 29.99, CURRENT_DATE - INTERVAL '30 days'),
(8, 19.99, CURRENT_DATE),
(9, 89.99, CURRENT_DATE - INTERVAL '30 days'),
(9, 79.99, CURRENT_DATE),
(10, 69.99, CURRENT_DATE - INTERVAL '30 days'),
(10, 59.99, CURRENT_DATE),
(11, 29.99, CURRENT_DATE - INTERVAL '30 days'),
(11, 24.99, CURRENT_DATE),
(12, 49.99, CURRENT_DATE - INTERVAL '30 days'),
(12, 39.99, CURRENT_DATE),
(13, 59.99, CURRENT_DATE - INTERVAL '30 days'),
(14, 89.99, CURRENT_DATE - INTERVAL '30 days'),
(14, 79.99, CURRENT_DATE),
(15, 69.99, CURRENT_DATE - INTERVAL '30 days'),
(15, 59.99, CURRENT_DATE);

-- Tabla de pedidos (RF05)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Detalle de los productos en cada pedido
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    game_id INT REFERENCES videojuegos(id),
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- Tabla de reservas temporales (Gestión de stock en concurrencia)
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    game_id INT REFERENCES videojuegos(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    quantity INT NOT NULL DEFAULT 1,
    expires_at TIMESTAMP NOT NULL
);
