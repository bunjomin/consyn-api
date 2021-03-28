import * as de from 'debug';

import * as Secret from '../lib/secret';

import * as fastify from 'fastify';
import * as fastifyCors from 'fastify-cors';
import * as crypto from 'crypto';

const app = fastify();

app.register(fastifyCors);

const d = de('consyn:api:routes:keys');

async function postKey(req, res) {
	const id = crypto.randomBytes(16).toString('hex');
	try {
		const debug = d.extend('postKey');
	
		const secret = await Secret.create();
		debug('secret %O', secret);
	
		if (!secret || !secret.value) {
			debug('ERROR - could not find secret value');
			return res.status(500).send({
				errors: [
					{
						id,
						content: 'Something went wrong trying to create a key.'
					}
				]
			});
		}
		debug('secret successfully created, sending response...');
		return res.status(201).send({ key: secret.value });
	} catch (err) {
		console.err(`REQUEST ${id}`);
		console.error(err);
		return res.status(500).send({
			errors: [
				{
					id,
					content: 'Something went wrong while generating your encryption key...'
				}
			]
		});
	}
}

app.post('/keys', postKey);

export { app as app };
