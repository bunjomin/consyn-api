SELECT
	`id`,
	`active`,
	`created`,
	`value`
FROM
	`secrets`
WHERE
	`id` = ?
LIMIT
	1;
