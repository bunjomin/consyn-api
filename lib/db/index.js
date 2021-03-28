import * as mariadb from 'mariadb';
import { propertiesToCamelCase } from '../utility';
import * as d from 'debug';

const debug = d('consyn:api:lib:db');

const MYSQL_CONFIG = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	port: process.env.MYSQL_PORT,
	connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 10,
	idleTimeout: process.env.MYSQL_IDLE_TIMEOUT || 3000,
	acquireTimeout: process.env.MYSQL_ACQUIRE_TIMEOUT || 10000
};

const pool = mariadb.createPool(MYSQL_CONFIG);

// async function executePoolQuery(q, params = []) {
// 	let conn;
// 	try {
// 		conn = await pool.getConnection();
// 		const rows = await conn.query(q, params);
// 		return rows;
// 	} catch (err) {
// 		throw err;
// 	} finally {
// 		if (conn) {
// 			debug('conn %O', conn);
// 			await conn.end();
// 		}
// 	}
// }

export async function endConnections() {
	return pool.end();
}

export async function insert(q, params = []) {
	try {
		const result = await pool.query(q, params);
		console.log(result);
		if (!result.insertId) {
			console.log('NO insertId');
			return null;
		}
		return result.insertId;
	} catch (err) {
		throw err;
	}
}

export async function query(q, params = []) {
	try {
		const rows = await pool.query(q, params);
		return rows.map((row) => propertiesToCamelCase(row));
	} catch (err) {
		throw err;
	}
}

export async function row(q, params = []) {
	try {
		const rows = await pool.query(q, params);
		if (!rows || rows.length === 0) {
			return null;
		}
		if (rows && rows.length > 1) {
			return null;
		}
		return propertiesToCamelCase(rows[0]);
	} catch (err) {
		throw err;
	}
}
