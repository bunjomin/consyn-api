import * as db from '../db';
import { walkSQLFiles } from '../utility';

const SQL = walkSQLFiles(`${__dirname}/sql/hash`);

export async function create({ active, value, secretId } = {}) {
	const a = active instanceof Boolean ? Number(active) : 1;
	const hashId = await db.insert(SQL.create, [a, value, secretId]);
	return getByID(hashId);
}

export async function getByID(id) {
	return db.row(SQL.get.by.id, [id]);
}

export async function getBySecretID(id) {
	return db.row(SQL.get.by.secret.id, [id]);
}
