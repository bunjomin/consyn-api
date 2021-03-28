SELECT
	`id`,
	`active`,
	`created`,
	`description`,
	`content`
FROM
	`mimes`
WHERE
	`description` = ?
LIMIT
	1;
