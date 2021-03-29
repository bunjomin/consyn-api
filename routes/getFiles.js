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

const d = de('consyn:api:routes:getFiles');

async function getFiles(req, res) {
	try {
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
	
		const returner = { key: secret.value, cid: hash.value, name: file.name, extension: file.extension, size: file.size, mimeType: mime.description };
		debug('returner %O', returner);

		return res.status(200).send(returner);
	} catch (err) {
		const id = crypto.randomBytes(16).toString('hex');
		console.err(`REQUEST ${id}`);
		console.error(err);
		return res.status(500).send({
			errors: [
				{
					id,
					content: 'Something went wrong trying to fetch the file...'
				}
			]
		});
	}
}

app.get('/files/:fileHash', getFiles);

export { app as app };
