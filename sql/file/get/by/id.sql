SELECT
	`id`,
	`active`,
	`created`,
	`value`,
	`name`,
	`extension`,
	`size`,
	`hash_id`,
	`mime_id`
FROM
	`files`
WHERE
	`id` = ?
LIMIT
	1;
