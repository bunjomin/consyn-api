import set from 'lodash.set';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export function normalizePath(inputPath) {
	return path.normalize(inputPath).replace(/\\/gm, '/');
}

export function snakeCaseToCamelCase(str) {
	const split = str.split('_');
	if (split.length < 2) {
		return split.join('');
	}
	for (let i = 1; i < split.length; i += 1) {
		const superSplit = split[i].split('');
		superSplit[0] = superSplit[0].toUpperCase();
		split[i] = superSplit.join('');
	}
	return split.join('');
}

export function propertiesToCamelCase(object) {
	const returner = {};
	for (const property in object) {
		returner[snakeCaseToCamelCase(property)] = object[property];
	}
	return returner;
}

export function propertiesToSnakeCase(object) {
	const returner = {};
	for (const property in object) {
		returner[camelCaseToSnakeCase(property)] = object[property];
	}
	return returner;
}

export function walkDir(dir) {
	const dirents = fs.readdirSync(dir, { withFileTypes: true });
	const files = dirents.map((dirent) => {
		const res = normalizePath(path.resolve(dir, dirent.name));
		return dirent.isDirectory() ? walkDir(res) : res;
	});
	return Array.prototype.concat(...files);
}

export function walkSQLFiles(dir) {
	const returner = {};
	const rawPaths = walkDir(dir);
	const currentPath = `${normalizePath(path.resolve(path.normalize(dir)))}/`;
	const paths = rawPaths.filter((f) => f.endsWith('.sql'));
	for (const p of paths) {
		const subtracted = p.replace(currentPath, '');
		const dotted = subtracted.replace(/\.sql/gmi, '').replace(/\//gm, '.');
		const sqlFile = fs.readFileSync(p).toString();
		set(returner, dotted, sqlFile);
	}
	return returner;
}

export function randomCapitalization(input) {
	return input.split('').map(c => Math.round(Math.random()) ? c.toUpperCase() : c.toLowerCase()).join('');
}

export function createHash() {
	return randomCapitalization(crypto.randomBytes(16).toString('hex'));
}
