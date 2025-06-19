-- =============================================
-- COMINTEC Users & Roles Configuration
-- =============================================

-- Disable triggers temporarily to avoid constraint issues
-- SET session_replication_role = 'replica';

-- =============================================
-- 1. Define system roles (already exist in data-postgresql.sql)
-- =============================================
-- Ensure valid roles exist
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_MANAGER') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_USER') ON CONFLICT (name) DO NOTHING;

-- ROLE_ADMIN - Full access to all features
-- ROLE_MANAGER - Area manager (full access to their area)
-- ROLE_USER - Basic access (limited to their area)

-- =============================================
-- 2. Create admin users (2 according to requirements)
-- =============================================
-- Admin 1 already exists in data-postgresql.sql

-- Create second admin user (password: password)
INSERT INTO users (username, password, active) 
VALUES ('admin2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign admin role to second admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'admin2' AND r.name = 'ROLE_ADMIN'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- =============================================
-- 3. Create area managers (15 according to requirements)
-- =============================================

-- Ventas manager
INSERT INTO users (username, password, active) 
VALUES ('ventas_manager', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign roles to ventas manager
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'ventas_manager' AND r.name = 'ROLE_MANAGER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Administración manager
INSERT INTO users (username, password, active) 
VALUES ('admin_manager', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign roles to admin manager
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'admin_manager' AND r.name = 'ROLE_MANAGER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Almacén manager
INSERT INTO users (username, password, active) 
VALUES ('almacen_manager', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign roles to almacen manager
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'almacen_manager' AND r.name = 'ROLE_MANAGER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Compras manager
INSERT INTO users (username, password, active) 
VALUES ('compras_manager', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign roles to compras manager
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'compras_manager' AND r.name = 'ROLE_MANAGER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Metrología manager
INSERT INTO users (username, password, active) 
VALUES ('metrologia_manager', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign roles to metrologia manager
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'metrologia_manager' AND r.name = 'ROLE_MANAGER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Informes manager
INSERT INTO users (username, password, active) 
VALUES ('informes_manager', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign roles to informes manager
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'informes_manager' AND r.name = 'ROLE_MANAGER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Logística manager
INSERT INTO users (username, password, active) 
VALUES ('logistica_manager', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign roles to logistica manager
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'logistica_manager' AND r.name = 'ROLE_MANAGER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- RRHH manager
INSERT INTO users (username, password, active) 
VALUES ('rrhh_manager', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign roles to rrhh manager
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'rrhh_manager' AND r.name = 'ROLE_MANAGER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Calidad manager
INSERT INTO users (username, password, active) 
VALUES ('calidad_manager', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign roles to calidad manager
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'calidad_manager' AND r.name = 'ROLE_MANAGER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Marketing manager
INSERT INTO users (username, password, active) 
VALUES ('marketing_manager', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign roles to marketing manager
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'marketing_manager' AND r.name = 'ROLE_MANAGER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- =============================================
-- 4. Create regular users for each area (30 in total according to requirements)
-- =============================================

-- Ventas users (3)
INSERT INTO users (username, password, active) 
VALUES 
('ventas1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('ventas2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('ventas3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Administración users (3)
INSERT INTO users (username, password, active) 
VALUES 
('admin1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('admin2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('admin3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Almacén users (3)
INSERT INTO users (username, password, active) 
VALUES 
('almacen1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('almacen2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('almacen3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Compras users (3)
INSERT INTO users (username, password, active) 
VALUES 
('compras1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('compras2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('compras3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Metrología users (3)
INSERT INTO users (username, password, active) 
VALUES 
('metrologia1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('metrologia2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('metrologia3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Informes users (3)
INSERT INTO users (username, password, active) 
VALUES 
('informes1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('informes2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('informes3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Logística users (3)
INSERT INTO users (username, password, active) 
VALUES 
('logistica1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('logistica2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('logistica3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- RRHH users (3)
INSERT INTO users (username, password, active) 
VALUES 
('rrhh1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('rrhh2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('rrhh3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Calidad users (3)
INSERT INTO users (username, password, active) 
VALUES 
('calidad1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('calidad2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('calidad3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- Marketing users (3)
INSERT INTO users (username, password, active) 
VALUES 
('marketing1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('marketing2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true),
('marketing3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', true)
ON CONFLICT (username) DO NOTHING;

-- =============================================
-- 5. Assign roles to regular users
-- =============================================

-- 6. Add department table to track user area assignments
-- =============================================

CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_departments table to track user assignments
CREATE TABLE IF NOT EXISTS user_departments (
    user_id BIGINT NOT NULL,
    department_id BIGINT NOT NULL,
    is_manager BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, department_id),
    CONSTRAINT fk_user_departments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_departments_department FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE
);

-- Create departments
INSERT INTO departments (name, description)
VALUES
('Ventas', 'Departamento de ventas y comercialización'),
('Administración', 'Departamento administrativo y financiero'),
('Almacén', 'Gestión de inventario y almacén'),
('Compras', 'Departamento de adquisiciones'),
('Metrología', 'Departamento de mediciones y calibraciones'),
('Informes', 'Generación y gestión de informes'),
('Logística', 'Coordinación de servicios y entregas'),
('RRHH', 'Recursos Humanos'),
('Calidad', 'Gestión de calidad y procedimientos'),
('Marketing', 'Departamento de marketing y comunicación')
ON CONFLICT (name) DO NOTHING;

-- Assign departments to users
-- Ventas
DO $$
DECLARE
    dept_id BIGINT;
BEGIN
    SELECT id INTO dept_id FROM departments WHERE name = 'Ventas';
    
    -- Assign manager
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, true
    FROM users u
    WHERE u.username = 'ventas_manager'
    ON CONFLICT (user_id, department_id) DO NOTHING;
    
    -- Assign regular users
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, false
    FROM users u
    WHERE u.username IN ('ventas1', 'ventas2', 'ventas3')
    ON CONFLICT (user_id, department_id) DO NOTHING;
END $$;

-- Administración
DO $$
DECLARE
    dept_id BIGINT;
BEGIN
    SELECT id INTO dept_id FROM departments WHERE name = 'Administración';
    
    -- Assign manager
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, true
    FROM users u
    WHERE u.username = 'admin_manager'
    ON CONFLICT (user_id, department_id) DO NOTHING;
    
    -- Assign regular users
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, false
    FROM users u
    WHERE u.username IN ('admin1', 'admin2', 'admin3')
    ON CONFLICT (user_id, department_id) DO NOTHING;
END $$;

-- Almacen
DO $$
DECLARE
    dept_id BIGINT;
BEGIN
    SELECT id INTO dept_id FROM departments WHERE name = 'Almacén';
    
    -- Assign manager
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, true
    FROM users u
    WHERE u.username = 'almacen_manager'
    ON CONFLICT (user_id, department_id) DO NOTHING;
    
    -- Assign regular users
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, false
    FROM users u
    WHERE u.username IN ('almacen1', 'almacen2', 'almacen3')
    ON CONFLICT (user_id, department_id) DO NOTHING;
END $$;

-- Compras
DO $$
DECLARE
    dept_id BIGINT;
BEGIN
    SELECT id INTO dept_id FROM departments WHERE name = 'Compras';
    
    -- Assign manager
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, true
    FROM users u
    WHERE u.username = 'compras_manager'
    ON CONFLICT (user_id, department_id) DO NOTHING;
    
    -- Assign regular users
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, false
    FROM users u
    WHERE u.username IN ('compras1', 'compras2', 'compras3')
    ON CONFLICT (user_id, department_id) DO NOTHING;
END $$;

-- Metrología
DO $$
DECLARE
    dept_id BIGINT;
BEGIN
    SELECT id INTO dept_id FROM departments WHERE name = 'Metrología';
    
    -- Assign manager
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, true
    FROM users u
    WHERE u.username = 'metrologia_manager'
    ON CONFLICT (user_id, department_id) DO NOTHING;
    
    -- Assign regular users
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, false
    FROM users u
    WHERE u.username IN ('metrologia1', 'metrologia2', 'metrologia3')
    ON CONFLICT (user_id, department_id) DO NOTHING;
END $$;

-- Informes
DO $$
DECLARE
    dept_id BIGINT;
BEGIN
    SELECT id INTO dept_id FROM departments WHERE name = 'Informes';
    
    -- Assign manager
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, true
    FROM users u
    WHERE u.username = 'informes_manager'
    ON CONFLICT (user_id, department_id) DO NOTHING;
    
    -- Assign regular users
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, false
    FROM users u
    WHERE u.username IN ('informes1', 'informes2', 'informes3')
    ON CONFLICT (user_id, department_id) DO NOTHING;
END $$;

-- Logística
DO $$
DECLARE
    dept_id BIGINT;
BEGIN
    SELECT id INTO dept_id FROM departments WHERE name = 'Logística';
    
    -- Assign manager
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, true
    FROM users u
    WHERE u.username = 'logistica_manager'
    ON CONFLICT (user_id, department_id) DO NOTHING;
    
    -- Assign regular users
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, false
    FROM users u
    WHERE u.username IN ('logistica1', 'logistica2', 'logistica3')
    ON CONFLICT (user_id, department_id) DO NOTHING;
END $$;

-- RRHH
DO $$
DECLARE
    dept_id BIGINT;
BEGIN
    SELECT id INTO dept_id FROM departments WHERE name = 'RRHH';
    
    -- Assign manager
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, true
    FROM users u
    WHERE u.username = 'rrhh_manager'
    ON CONFLICT (user_id, department_id) DO NOTHING;
    
    -- Assign regular users
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, false
    FROM users u
    WHERE u.username IN ('rrhh1', 'rrhh2', 'rrhh3')
    ON CONFLICT (user_id, department_id) DO NOTHING;
END $$;

-- Calidad
DO $$
DECLARE
    dept_id BIGINT;
BEGIN
    SELECT id INTO dept_id FROM departments WHERE name = 'Calidad';
    
    -- Assign manager
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, true
    FROM users u
    WHERE u.username = 'calidad_manager'
    ON CONFLICT (user_id, department_id) DO NOTHING;
    
    -- Assign regular users
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, false
    FROM users u
    WHERE u.username IN ('calidad1', 'calidad2', 'calidad3')
    ON CONFLICT (user_id, department_id) DO NOTHING;
END $$;

-- Marketing
DO $$
DECLARE
    dept_id BIGINT;
BEGIN
    SELECT id INTO dept_id FROM departments WHERE name = 'Marketing';
    
    -- Assign manager
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, true
    FROM users u
    WHERE u.username = 'marketing_manager'
    ON CONFLICT (user_id, department_id) DO NOTHING;
    
    -- Assign regular users
    INSERT INTO user_departments (user_id, department_id, is_manager)
    SELECT u.id, dept_id, false
    FROM users u
    WHERE u.username IN ('marketing1', 'marketing2', 'marketing3')
    ON CONFLICT (user_id, department_id) DO NOTHING;
END $$;

-- =============================================
-- MIGRATION: Simplify roles and enforce department assignment
-- =============================================

-- 1. Remove area-specific roles from user_roles and roles
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM roles WHERE name LIKE 'ROLE\_%' AND name NOT IN ('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER') LOOP
        DELETE FROM user_roles WHERE role_id = r.id;
        DELETE FROM roles WHERE id = r.id;
    END LOOP;
END $$;

-- 2. Assign only the new roles to users
-- 2a. Admins: ensure only ROLE_ADMIN
DO $$
DECLARE
    admin_role_id BIGINT;
    u RECORD;
BEGIN
    SELECT id INTO admin_role_id FROM roles WHERE name = 'ROLE_ADMIN';
    FOR u IN SELECT id FROM users WHERE username LIKE 'admin%' LOOP
        DELETE FROM user_roles WHERE user_id = u.id AND role_id != admin_role_id;
        INSERT INTO user_roles (user_id, role_id)
        VALUES (u.id, admin_role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
END $$;

-- 2b. Area managers: assign ROLE_MANAGER
DO $$
DECLARE
    manager_role_id BIGINT;
    u RECORD;
BEGIN
    SELECT id INTO manager_role_id FROM roles WHERE name = 'ROLE_MANAGER';
    FOR u IN SELECT user_id FROM user_departments WHERE is_manager = true LOOP
        DELETE FROM user_roles WHERE user_id = u.user_id AND role_id != manager_role_id;
        INSERT INTO user_roles (user_id, role_id)
        VALUES (u.user_id, manager_role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
END $$;

-- 2c. Regular users: assign ROLE_USER
DO $$
DECLARE
    user_role_id BIGINT;
    u RECORD;
BEGIN
    SELECT id INTO user_role_id FROM roles WHERE name = 'ROLE_USER';
    FOR u IN SELECT user_id FROM user_departments WHERE is_manager = false LOOP
        DELETE FROM user_roles WHERE user_id = u.user_id AND role_id != user_role_id;
        INSERT INTO user_roles (user_id, role_id)
        VALUES (u.user_id, user_role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
END $$;

-- 3. (Optional) Remove any remaining unused roles
DELETE FROM roles WHERE name NOT IN ('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER');

-- 4. (Optional) Clean up user_roles for users who should not have any role (should not happen)
DELETE FROM user_roles WHERE user_id NOT IN (SELECT id FROM users);

-- 5. (Optional) Enforce that all non-admins are assigned to a department
-- (This is already handled by user_departments table and business logic)

-- END MIGRATION
