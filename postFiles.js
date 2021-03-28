import { app } from './routes/postFiles';
import * as awsLambdaFastify from 'aws-lambda-fastify';

const proxy = awsLambdaFastify(app);

exports.handler = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	proxy(event, context, callback);
}
