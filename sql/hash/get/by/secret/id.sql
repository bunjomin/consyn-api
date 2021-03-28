SELECT
	`id`,
	`active`,
	`created`,
	`value`,
	`secret_id`
FROM
	`hashes`
WHERE
	`secret_id` = ?
LIMIT
	1;
