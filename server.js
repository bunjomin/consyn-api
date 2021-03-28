import * as CID from 'cids';
import * as de from 'debug';

import * as Secret from './lib/secret';
import * as Hash from './lib/hash';
import * as File from './lib/file';
import * as Mime from './lib/mime';

import * as fastify from 'fastify';
import * as fastifyCors from 'fastify-cors';

const app = fastify();

app.register(fastifyCors);

const d = de('consyn:api:server');

async function postKey(req, res) {
	const debug = d.extend('postKey');

	const secret = await Secret.create();
	debug('secret %O', secret);

	if (!secret || !secret.value) {
		debug('ERROR - could not find secret value');
		return res.status(500).send({
			errors: [
				'Something went wrong trying to create a key.'
			]
		});
	}

	debug('secret successfully created, sending response...');
	return res.status(201).send({ key: secret.value });
}

async function postFile(req, res) {
	const debug = d.extend('postFiles');

	const { body } = req;
	debug('body %O', body);

	const keys = Object.keys(body);
	debug('keys %O', keys);

	const validationErrors = [];

	for (const key of ['cid', 'name', 'extension', 'mimeType', 'key']) {
		if (!keys.includes(key)) {
			validationErrors.push(`Missing required property ${key}.`);
		}
	}

	debug('validationErrors %O', validationErrors);

	if (validationErrors?.length) {
		return res.status(400).send({ errors });
	}

	const { cid, name, extension, mimeType, key } = body;

	const secret = await Secret.getByValue(key);
	debug('secret %O', secret);

	const mime = await Mime.getByType(mimeType);
	debug('mime %O', mime);

	const errors = [];
	if (!secret) {
		errors.push('Provided key is not valid.');
	}
	if (!mime) {
		errors.push('Unsupported MIME type.');
	}

	// Validate CID
	const rawCID = new CID(cid);
	let isValid = false;
	try {
		CID.validateCID(rawCID)
		isValid = true;
	} catch (err) {
		errors.push(`Invalid CID ${cid}`);
	}

	// Abort if anything is invalid
	if (errors.length) {
		debug('errors %O', errors);
		return res.status(400).send({ errors });
	}

	const hash = await Hash.create({ active: true, value: cid, secretId: secret.id });
	debug('hash %O', hash);

	const file = await File.create({ active: true, name, extension, hashId: hash.id, mimeId: mime.id });
	debug('file %O', file);

	const returner = {
		file: file.value,
		meta: {
			url: `/files/${file.value}`
		}
	};
	debug('returner %O', returner);

	return res.status(201).send(returner);
}

async function getFile(req, res) {
	const debug = d.extend('GET-files');

	const { fileHash } = req.params;
	debug('fileHash', fileHash);

	const file = await File.getByValue(fileHash);
	debug('file %O', file);

	const hash = await Hash.getByID(file.hashId);
	debug('hash %O', hash);

	const mime = await Mime.getByID(file.mimeId);
	debug('mime %O', mime);

	const secret = await Secret.getByID(hash.secretId);
	debug('secret %O', secret);

	const returner = { key: secret.value, cid: hash.value, name: file.name, extension: file.extension, mimeType: mime.description };
	debug('returner %O', returner);

	return res.status(200).send(returner);
}

app.post('/keys', postKey);
app.post('/files', postFile);
app.get('/files/:fileHash', getFile);

export { app as app };
