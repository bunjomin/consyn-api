SELECT
	`id`,
	`active`,
	`created`,
	`value`
FROM
	`secrets`
WHERE
	`value` = ?
LIMIT
	1;
