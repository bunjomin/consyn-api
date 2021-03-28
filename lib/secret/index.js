import * as crypto from 'crypto';
import * as db from '../db';
import { walkSQLFiles } from '../utility';

const SQL = walkSQLFiles(`${__dirname}/sql/secret`);

export async function create() {
	const randomKey = crypto.randomBytes(32).toString('hex');
	const secretId = await db.insert(SQL.create, [randomKey]);
	console.log('secretId', secretId);
	return getByID(secretId);
}

export async function getByID(id) {
	return db.row(SQL.get.by.id, [id]);
}

export async function getByValue(value) {
	return db.row(SQL.get.by.value, [value]);
}
