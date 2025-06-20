-- Data for H2 in-memory database
-- Admin user: admin/password
INSERT INTO users (id, username, password, email, active, created_at, updated_at) VALUES 
(1, 'admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'admin@comintec.com', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_ADMIN'), (2, 'ROLE_USER');

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

-- Enable the admin user for login
UPDATE users SET active = true WHERE username = 'admin';
