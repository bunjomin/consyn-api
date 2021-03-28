SELECT
	`id`,
	`active`,
	`created`,
	`value`,
	`secret_id`
FROM
	`hashes`
WHERE
	`id` = ?
LIMIT
	1;
