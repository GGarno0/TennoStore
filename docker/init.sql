-- init.sql
CREATE TABLE IF NOT EXISTS videojuegos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(100)
);

INSERT INTO videojuegos (titulo, precio, stock, categoria) VALUES
('The Legend of Zelda: Tears of the Kingdom', 69.99, 15, 'Aventura'),
('Elden Ring', 59.99, 8, 'RPG'),
('Cyberpunk 2077', 29.99, 25, 'Acción');
