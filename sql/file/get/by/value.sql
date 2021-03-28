SELECT
	`id`,
	`active`,
	`created`,
	`value`,
	`name`,
	`extension`,
	`hash_id`,
	`mime_id`
FROM
	`files`
WHERE
	`value` = ?
LIMIT
	1;
