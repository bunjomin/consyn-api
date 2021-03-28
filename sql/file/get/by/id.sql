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
	`id` = ?
LIMIT
	1;
