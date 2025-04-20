DROP DATABASE IF EXISTS veterinaria;
CREATE DATABASE veterinaria;
USE veterinaria;

-- Tabla de roles (nueva)
CREATE TABLE `roles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Tabla usuarios modificada (con rol_id como FK)
CREATE TABLE `usuarios` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL,
    `apellido` VARCHAR(255) NOT NULL,
    `correo` VARCHAR(255) NOT NULL UNIQUE,
    `numero` VARCHAR(255) NOT NULL,
    `contrasena_hash` VARCHAR(255) NOT NULL,
    `rol_id` BIGINT NOT NULL,  -- Cambiado de 'rol' a 'rol_id'
    FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`)
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
    `especie_id` BIGINT NOT NULL,
    `sexo` ENUM('Macho','Hembra'),
    `fecha_nacimiento` DATE NOT NULL,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`),
    FOREIGN KEY (`especie_id`) REFERENCES `especies`(`id`)
) ENGINE=InnoDB;

-- Tabla categorías
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
    FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`)
) ENGINE=InnoDB;

-- Tabla consultas
CREATE TABLE `consultas` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` BIGINT NOT NULL,
    `mascota_id` BIGINT NOT NULL,
    `nota` TEXT NOT NULL,
    `fecha_hora` DATETIME NOT NULL,
    `servicio_id` BIGINT NOT NULL,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`),
    FOREIGN KEY (`mascota_id`) REFERENCES `mascotas`(`id`),
    FOREIGN KEY (`servicio_id`) REFERENCES `servicios`(`id`)
) ENGINE=InnoDB; 

-- Tabla citas
CREATE TABLE `citas` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` BIGINT NOT NULL,
	`mascota_id` BIGINT NOT NULL,
    `fecha_hora` DATETIME NOT NULL,
    `servicio_id` BIGINT,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`),
    FOREIGN KEY (`servicio_id`) REFERENCES `servicios`(`id`),
    FOREIGN KEY (`mascota_id`) REFERENCES `mascotas`(`id`)
) ENGINE=InnoDB;

-- Tabla cartillas
CREATE TABLE `cartillas` (
    `usuario_id` BIGINT NOT NULL,
    `mascota_id` BIGINT NOT NULL,
    PRIMARY KEY (`usuario_id`, `mascota_id`),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`),
    FOREIGN KEY (`mascota_id`) REFERENCES `mascotas`(`id`)
) ENGINE=InnoDB;

-- Registros default
INSERT INTO roles (nombre) VALUES 
('Administrador'),
('Veterinario'),
('Recepcionista'),
('Cliente');