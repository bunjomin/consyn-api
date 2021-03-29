import * as db from '../db';
import { walkSQLFiles, createHash } from '../utility';
import * as d from 'debug';

const SQL = walkSQLFiles(`${__dirname}/sql/file`);

const debug = d('consyn:lib:file');

export async function create({ active, name, extension, size, hashId, mimeId }) {
	debug('active', active);
	debug('name', name);
	debug('extension', extension);
	debug('size', size);
	debug('hashId', hashId);
	debug('mimeId', mimeId);
	const a = active instanceof Boolean ? Number(active) : 1;
	debug('ACTIVE AFTER CASTING', a);
	const fileHash = createHash();
	debug('FILE HASH', fileHash);
	const fileId = await db.insert(SQL.create, [a, fileHash, name, extension, size, hashId, mimeId]);
	debug('fileId after creat', fileId);
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
