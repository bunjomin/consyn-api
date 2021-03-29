import * as CID from 'cids';
import * as de from 'debug';

import * as Secret from '../lib/secret';
import * as Hash from '../lib/hash';
import * as File from '../lib/file';
import * as Mime from '../lib/mime';

import * as fastify from 'fastify';
import * as fastifyCors from 'fastify-cors';
import * as crypto from 'crypto';

const app = fastify();
app.register(fastifyCors);

const d = de('consyn:api:routes:files');

async function postFile(req, res) {
	const id = crypto.randomBytes(16).toString('hex');
	try {
		const debug = d.extend('postFiles');
	
		const { body } = req;
		debug('body %O', body);
	
		const keys = Object.keys(body);
		debug('keys %O', keys);
	
		const validationErrors = [];
	
		for (const key of ['cid', 'name', 'extension', 'size', 'mimeType', 'key']) {
			if (!keys.includes(key)) {
				validationErrors.push({
					id,
					content: `Missing required property ${key}.`
				});
			}
		}
	
		debug('validationErrors %O', validationErrors);
	
		if (validationErrors?.length) {
			return res.status(400).send({ errors: validationErrors });
		}
	
		const { cid, name, extension, size, mimeType, key } = body;
	
		const secret = await Secret.getByValue(key);
		debug('secret %O', secret);
	
		const mime = await Mime.getByType(mimeType);
		debug('mime %O', mime);
	
		const errors = [];
		if (!secret) {
			debug('provided key is not valid');
			errors.push({
				id,
				content: 'Provided key is not valid.'
			});
		}
		if (!mime) {
			debug('unsupported mime type');
			errors.push({
				id,
				content: 'Unsupported MIME type.'
			});
		}
	
		// Validate CID
		let isValid = false;
		try {
			const rawCID = new CID(cid);
			CID.validateCID(rawCID);
			isValid = true;
		} catch (err) {
			debug(`Invalid CID ${cid}`);
			errors.push({
				id,
				content: `Invalid CID ${cid}`
			});
		}
	
		// Abort if anything is invalid
		if (errors.length) {
			debug('errors %O', errors);
			return res.status(400).send({ errors });
		}
	
		const hash = await Hash.create({ active: true, value: cid, secretId: secret.id });
		debug('hash %O', hash);
	
		const filePayload = { active: true, name, extension, size, hashId: hash.id, mimeId: mime.id };
		debug('filePayload %O', filePayload);

		const file = await File.create(filePayload);
		debug('file %O', file);
	
		const returner = {
			file: file.value,
			meta: {
				url: `/files/${file.value}`
			}
		};
		debug('returner %O', returner);

		return res.status(201).send(returner);
	} catch (err) {
		console.err(`REQUEST ${id}`);
		console.error(err);
		return res.status(500).send({
			errors: [
				{
					id,
					content: 'Something went wrong while processing your file...'
				}
			]
		});
	}
}

const opts = {
	schema: {
		body: {
			type: 'object',
			properties: {
				cid: { type: 'string' },
				name: { type: 'string' },
				extension: { type: 'string' },
				mimeType: { type: 'string' },
				key: { type: 'string' }
			}
		}
	}
};
app.post('/files', opts, postFile);

export { app as app };
