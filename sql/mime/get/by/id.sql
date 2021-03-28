SELECT
	`id`,
	`active`,
	`created`,
	`description`,
	`content`
FROM
	`mimes`
WHERE
	`id` = ?
LIMIT
	1;
