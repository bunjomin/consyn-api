import * as db from '../db';
import { walkSQLFiles, createHash } from '../utility';

const SQL = walkSQLFiles(`${__dirname}/sql/file`);

export async function create({ active, name, extension, hashId, mimeId }) {
	const a = active instanceof Boolean ? Number(active) : 1;
	const fileHash = createHash();
	const fileId = await db.insert(SQL.create, [a, fileHash, name, extension, hashId, mimeId]);
	return getByID(fileId);
}

export async function getByID(id) {
	return db.row(SQL.get.by.id, [id]);
}

export async function getByValue(value) {
	return db.row(SQL.get.by.value, [value]);
}

export function screen(row) {
	return row;
}
