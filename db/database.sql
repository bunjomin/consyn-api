DROP DATABASE `consyn`;
CREATE DATABASE IF NOT EXISTS `consyn`;

USE `consyn`;

DROP TABLE IF EXISTS `secrets`;

CREATE TABLE `secrets` (
	`id` SMALLINT UNSIGNED NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
	`active` BOOLEAN NOT NULL DEFAULT TRUE,
	`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`value` VARCHAR(128) NOT NULL
);

INSERT INTO
	`secrets` (`active`, `value`)
VALUES
	(0, 'default');

DROP TABLE IF EXISTS `hashes`;

CREATE TABLE `hashes` (
	`id` SMALLINT UNSIGNED NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
	`active` BOOLEAN NOT NULL DEFAULT TRUE,
	`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`value` VARCHAR(128) NOT NULL,
	`secret_id` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
	FOREIGN KEY (`secret_id`) REFERENCES `secrets` (`id`)
);

INSERT INTO
	`hashes` (`active`, `value`)
VALUES
	(
		0,
		'QmSgvgwxZGaBLqkGyWemEDqikCqU52XxsYLKtdy3vGZ8uq'
	);

DROP TABLE IF EXISTS `mimes`;

CREATE TABLE `mimes` (
	`id` SMALLINT UNSIGNED NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
	`active` BOOLEAN NOT NULL DEFAULT TRUE,
	`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`description` VARCHAR(128) NOT NULL,
	`content` VARCHAR(128) NOT NULL
);

INSERT INTO
	`mimes` (`description`, `content`)
VALUES
	('text/plain', 'Plain text'),
	('image/jpeg', 'JPEG image'),
	('image/gif', 'GIF image'),
	('image/png', 'PNG image'),
	('image/svg+xml', 'SVG image'),
	('image/webp', 'WEBP image'),
	('audio/mp4', 'MP4 audio'),
	('audio/mpeg', 'MPEG audio'),
	('audio/mpeg4-generic', 'MPEG4 Generic audio'),
	('audio/ogg', 'OGG audio'),
	('audio/aiff', 'AIFF audio'),
	('audio/basic', 'AU audio'),
	('audio/L24', 'L24 audio'),
	('audio/mid', 'MID audio'),
	('audio/x-mpegurl', 'M3U audio'),
	('audio/vorbis', 'Vorbis audio'),
	('audio/vnd.wav', 'WAV audio'),
	('audio/wav.wav', 'WAV audio'),
	('audio/webm', 'WEBM audio'),
	('video/mpeg', 'MPEG video'),
	('video/quicktime', 'Quicktime video'),
	('video/mp4', 'MP4 video'),
	('video/ogg', 'OGG video'),
	('video/raw', 'Raw video'),
	('video/H261', 'H261 video'),
	('video/H263', 'H263 video'),
	('video/H263-1998', 'H263-1998 video'),
	('video/H263-2000', 'H263-2000 video'),
	('video/H264', 'H264 video'),
	('video/H264-RCDO', 'H264-RCDO video'),
	('video/H264-SVC', 'H264-SVC video'),
	('video/H265', 'H265 video'),
	('video/webm', 'WEBM Video'),
	('video/x-msvideo', 'AVI video'),
	('text/html', 'HTML text'),
	('text/rtf', 'Rich text'),
	('text/csv', 'CSV text'),
	('text/css', 'CSS text'),
	('text/calendar', 'Calendar text'),
	('font/collection', 'Collection font'),
	('font/otf', 'OTF font'),
	('font/sfnt', 'SFNT font'),
	('font/ttf', 'TTF font'),
	('font/woff', 'WOFF font'),
	('font/woff2', 'WOFF2 font'),
	('application/calendar+json', 'Calendar JSON'),
	('application/calendar+xml', 'Calendar XML'),
	('application/javascript', 'Javascript'),
	('application/ecmascript', 'Javascript'),
	('application/gzip', 'GZIP'),
	('application/zip', 'ZIP'),
	('application/json', 'JSON'),
	('application/msword', 'MS Word'),
	('application/octet-stream', 'Octet Stream'),
	('application/pdf', 'PDF'),
	('application/x-7z-compressed', '7ZIP'),
	('application/xml', 'XML'),
	('application/vnd.rar', 'RAR'),
	(
		'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		'Powerpoint OpenXML'
	),
	(
		'application/vnd.ms-powerpoint',
		'Powerpoint'
	),
	('application/java-archive', 'JAR');

DROP TABLE IF EXISTS `files`;

CREATE TABLE `files` (
	`id` SMALLINT UNSIGNED NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
	`active` BOOLEAN NOT NULL DEFAULT TRUE,
	`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`value` VARCHAR(256) NOT NULL,
	`name` VARCHAR(128) NOT NULL,
	`extension` VARCHAR(16) NOT NULL,
	`hash_id` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
	`mime_id` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
	FOREIGN KEY (`hash_id`) REFERENCES `hashes` (`id`),
	FOREIGN KEY (`mime_id`) REFERENCES `mimes` (`id`)
);

INSERT INTO
	`files` (`active`, `value`, `name`, `extension`)
VALUES
	(
		0,
		'24cacf5004bf68ae9daad19a5bba391d85ad1cb0b31366e89aec86fad0ab16cb',
		'default',
		'txt'
	);
