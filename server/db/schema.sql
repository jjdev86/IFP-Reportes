DROP DATABASE IF EXISTS `gda`;
CREATE DATABASE `gda`;
USE `gda`;

CREATE TABLE `User` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`email` varchar(45) NOT NULL UNIQUE,
	`password` BINARY(60) NOT NULL,
	`role` varchar(15) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`phone_number` varchar(10) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Grupo` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`group_name` varchar(30) NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Member` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`isChild` BOOLEAN NOT NULL DEFAULT false,
	`group_name_id` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Guests` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`phone_number` varchar(10) NULL,
	`isChild` BOOLEAN NOT NULL DEFAULT false,
	`group_name_id` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Reports` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`_date` DATE NOT NULL,
	`event_time` TIME NOT NULL,
	`topic` varchar(255) NOT NULL,
	`length_of_meeting` TIME NOT NULL,
	`member_attended` TEXT NOT NULL,
	`guest_attended` TEXT NULL,
	`group_name_id` INT NOT NULL,
	PRIMARY KEY (`id`)
);

ALTER TABLE `Member` ADD CONSTRAINT `Member_fk0` FOREIGN KEY (`group_name_id`) REFERENCES `Grupo`(`id`);

ALTER TABLE `Guests` ADD CONSTRAINT `Guests_fk0` FOREIGN KEY (`group_name_id`) REFERENCES `Grupo`(`id`);

ALTER TABLE `Reports` ADD CONSTRAINT `Reports_fk0` FOREIGN KEY (`group_name_id`) REFERENCES `Grupo`(`id`);


