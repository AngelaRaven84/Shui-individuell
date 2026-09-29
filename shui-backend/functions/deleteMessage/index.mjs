import middy from '@middy/core';
import createError from 'http-errors';
import { requireAuth } from '../../middlewares/auth/index.mjs';
import { errorHandler } from '../../middlewares/errorHandler/index.mjs';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../lib/db.js';
import { sendResponse } from '../../responses/index.mjs';

const deleteMessage = async (event) => {
	const { userId, id } = event.pathParameters ?? {};

	if (!userId || !id) {
		throw createError(400, 'Användar-id och meddelande-id krävs.');
	}

	if (userId !== event.auth.userId) {
		throw createError(403, 'Du får bara radera dina egna meddelanden.');
	}

	try {
		await db.send(
			new DeleteCommand({
				TableName: process.env.TABLE_NAME,
				Key: {
					PK: `USER#${userId}`,
					SK: `MESSAGE#${id}`,
				},
				ConditionExpression: 'attribute_exists(PK)',
			}),
		);
	} catch (error) {
		if (error.name === 'ConditionalCheckFailedException') {
			throw createError(404, 'Meddelandet hittades inte.');
		}

		throw error;
	}

	return sendResponse(200, {
		message: 'Meddelandet raderades.',
	});
};

export const handler = middy(deleteMessage)
	.use(requireAuth())
	.use(errorHandler());
