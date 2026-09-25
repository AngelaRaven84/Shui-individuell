import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import createError from 'http-errors';
import { requireAuth } from '../../middlewares/auth/index.mjs';
import { errorHandler } from '../../middlewares/errorHandler/index.mjs';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../lib/db.js';
import { sendResponse } from '../../responses/index.mjs';

const updateMessage = async (event) => {
	const { userId, id } = event.pathParameters ?? {};

	if (!userId || !id) {
		throw createError(400, 'Användar-id och meddelande-id krävs');
	}

	if (userId !== event.auth.userId) {
		throw createError(403, 'Du får bara ändra dina egna meddelanden');
	}

	const { text } = event.body ?? {};

	if (typeof text !== 'string') {
		throw createError(400, 'Meddelandet måste anges som text.');
	}

	const normalizedText = text.trim();

	if (!normalizedText) {
		throw createError(400, 'Meddelandet får inte vara tomt.');
	}

	let updatedMessage;

	try {
		const result = await db.send(
			new UpdateCommand({
				TableName: process.env.TABLE_NAME,
				Key: {
					PK: `USER#${userId}`,
					SK: `MESSAGE#${id}`,
				},
				UpdateExpression: 'SET #text = :text',
				ExpressionAttributeNames: {
					'#text': 'text',
				},
				ExpressionAttributeValues: {
					':text': normalizedText,
				},
				ConditionExpression: 'attribute_exists(PK)',
				ReturnValues: 'ALL_NEW',
			}),
		);

		updatedMessage = result.Attributes;
	} catch (error) {
		if (error.name === 'ConditionalCheckFailedException') {
			throw createError(404, 'Meddelandet hittades inte.');
		}

		throw error;
	}

	return sendResponse(200, {
		id: updatedMessage.id,
		userId: updatedMessage.userId,
		username: updatedMessage.username,
		text: updatedMessage.text,
		createdAt: updatedMessage.createdAt,
	});
};

export const handler = middy(updateMessage)
	.use(requireAuth())
	.use(httpJsonBodyParser())
	.use(errorHandler());
