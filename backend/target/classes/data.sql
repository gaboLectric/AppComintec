-- Crear roles
INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

-- Crear un usuario administrador (contraseña: admin123)
INSERT INTO users (username, password, full_name, email, active) 
VALUES ('admin', '$2a$10$XptfskLsT1l/bRTLRiiCgejHqOpgXFreUnNUa95gWyuhr0xFiDMqy', 'Administrador', 'admin@comintec.com', true);

-- Asignar rol de administrador al usuario
INSERT INTO user_roles (user_id, role_id) VALUES (1, 2);

-- Crear un usuario normal (contraseña: user123)
INSERT INTO users (username, password, full_name, email, active) 
VALUES ('usuario', '$2a$10$XptfskLsT1l/bRTLRiiCgejHqOpgXFreUnNUa95gWyuhr0xFiDMqy', 'Usuario Normal', 'usuario@comintec.com', true);

-- Asignar rol de usuario normal
INSERT INTO user_roles (user_id, role_id) VALUES (2, 1);
