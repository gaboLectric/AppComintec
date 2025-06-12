-- Crear roles
INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

-- Crear un usuario administrador (contraseña: password)
-- La contraseña es 'password' codificada con BCrypt (fuerza 10)
INSERT INTO users (username, password, full_name, email, active) 
VALUES ('admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Administrador', 'admin@comintec.com', true);

-- Asignar rol de administrador al usuario
INSERT INTO user_roles (user_id, role_id) VALUES (1, 2);

-- Crear un usuario normal (contraseña: password)
-- La contraseña es 'password' codificada con BCrypt (fuerza 10)
INSERT INTO users (username, password, full_name, email, active) 
VALUES ('usuario', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Usuario Normal', 'usuario@comintec.com', true);

-- Asignar rol de usuario normal
INSERT INTO user_roles (user_id, role_id) VALUES (2, 1);
