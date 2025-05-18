-- Script final mejorado con ON DELETE CASCADE y ON UPDATE CASCADE donde es necesario

DROP DATABASE IF EXISTS veterinaria;
CREATE DATABASE veterinaria;
USE veterinaria;

-- Tabla de roles
CREATE TABLE `roles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Tabla usuarios
CREATE TABLE `usuarios` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL,
    `apellido` VARCHAR(255) NOT NULL,
    `correo` VARCHAR(255) NOT NULL UNIQUE,
    `numero` VARCHAR(255) NOT NULL,
    `contrasena_hash` VARCHAR(255) NOT NULL,
    `rol_id` BIGINT NOT NULL,
    FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- Tabla especies
CREATE TABLE `especies` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Tabla mascotas
CREATE TABLE `mascotas` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` BIGINT NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `especie_id` BIGINT,
    `sexo` ENUM('Macho','Hembra'),
    `fecha_nacimiento` DATE NOT NULL,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
    FOREIGN KEY (`especie_id`) REFERENCES `especies`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- Tabla categorias
CREATE TABLE `categorias` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Tabla servicios
CREATE TABLE `servicios` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL,
    `precio` DECIMAL(10,2) NOT NULL,
    `categoria_id` BIGINT,
    FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabla consultas
CREATE TABLE `consultas` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` BIGINT NOT NULL,
    `mascota_id` BIGINT,
    `nota` TEXT NOT NULL,
    `fecha_hora` DATETIME NOT NULL,
    `servicio_id` BIGINT NOT NULL,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
    FOREIGN KEY (`mascota_id`) REFERENCES `mascotas`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
    FOREIGN KEY (`servicio_id`) REFERENCES `servicios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabla citas
CREATE TABLE `citas` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` BIGINT NOT NULL,
    `mascota_id` BIGINT,
    `fecha_hora` DATETIME NOT NULL,
    `servicio_id` BIGINT,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
    FOREIGN KEY (`mascota_id`) REFERENCES `mascotas`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
    FOREIGN KEY (`servicio_id`) REFERENCES `servicios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Insertar datos iniciales

-- Roles
INSERT INTO roles (nombre) VALUES 
('Administrador'),
('Veterinario'),
('Recepcionista'),
('Cliente');

-- Especies
INSERT INTO especies (nombre) VALUES
('Perro'),
('Gato'),
('Conejo'),
('Ave');

-- Usuarios
INSERT INTO usuarios (nombre, apellido, correo, numero, contrasena_hash, rol_id) VALUES
('Ana', 'Pérez', 'ana.perez@example.com', '8112345678', '$2b$10$yhI5JavtTrn0Bh4ViNkJrueCO/l9UT0YwcFdFBg6YGOFJemvTS5E6', 4),
('Carlos', 'Ramírez', 'carlos.ramirez@example.com', '8212345678', '$2b$10$yhI5JavtTrn0Bh4ViNkJrueCO/l9UT0YwcFdFBg6YGOFJemvTS5E6', 4),
('Laura', 'González', 'laura.gonzalez@example.com', '8312345678', '$2b$10$yhI5JavtTrn0Bh4ViNkJrueCO/l9UT0YwcFdFBg6YGOFJemvTS5E6', 2),
('María', 'López', 'maria.lopez@example.com', '8412345678', '$2b$10$yhI5JavtTrn0Bh4ViNkJrueCO/l9UT0YwcFdFBg6YGOFJemvTS5E6', 3),
('Admin', 'General', 'admin@example.com', '8512345678', '$2b$10$yhI5JavtTrn0Bh4ViNkJrueCO/l9UT0YwcFdFBg6YGOFJemvTS5E6', 1);

-- Mascotas
INSERT INTO mascotas (usuario_id, nombre, especie_id, sexo, fecha_nacimiento) VALUES
(1, 'Firulais', 1, 'Macho', '2021-05-15'),
(1, 'Mishi', 2, 'Hembra', '2020-08-22'),
(2, 'Bunny', 3, 'Hembra', '2022-01-10'),
(2, 'Tweety', 4, 'Macho', '2023-03-05');

-- Categorias
INSERT INTO categorias (nombre) VALUES
('Consulta General'),
('Vacunación'),
('Estética'),
('Cirugía');

-- Servicios
INSERT INTO servicios (nombre, precio, categoria_id) VALUES
('Consulta Médica General', 300.00, 1),
('Vacunación Antirrábica', 250.00, 2),
('Baño y Corte', 400.00, 3),
('Esterilización', 1200.00, 4);

-- Citas
INSERT INTO citas (usuario_id, mascota_id, fecha_hora, servicio_id) VALUES
(1, 1, '2025-04-22 10:00:00', 1),
(1, 2, '2025-04-23 11:00:00', 2),
(2, 3, '2025-04-24 09:30:00', 3);

-- Consultas
INSERT INTO consultas (usuario_id, mascota_id, nota, fecha_hora, servicio_id) VALUES
(1, 1, 'Revisión general, sin anomalías detectadas.', '2025-04-22 10:30:00', 1),
(1, 2, 'Aplicación de vacuna antirrábica. Todo bien.', '2025-04-23 11:30:00', 2),
(2, 3, 'Recomendado baño medicado por sarna.', '2025-04-24 10:00:00', 3);