import * as db from '../db';
import { walkSQLFiles } from '../utility';

const SQL = walkSQLFiles(`${__dirname}/sql/mime`);

export async function getByType(type) {
	return db.row(SQL.get.by.type, [type]);
}

export async function getByID(id) {
	return db.row(SQL.get.by.id, [id]);
}
