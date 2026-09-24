import middy from '@middy/core';
import createError from 'http-errors';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../lib/db.js';
import { sendResponse } from '../../responses/index.mjs';
import { errorHandler } from '../../middlewares/errorHandler/index.mjs';

export const getMessage = async (event) => {
	const { userId, id } = event.pathParameters ?? {};

	if (!userId || !id) {
		throw createError(400, 'Användar-id och meddelande-id krävs');
	}

	const result = await db.send(
		new GetCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				PK: `USER#${userId}`,
				SK: `MESSAGE#${id}`,
			},
		}),
	);

	if (!result.Item) {
		throw createError(404, 'Meddelandet hittades inte.');
	}

	return sendResponse(200, result.Item);
};

export const handler = middy(getMessage).use(errorHandler());
