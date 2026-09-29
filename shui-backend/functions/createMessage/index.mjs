import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { requireAuth } from '../../middlewares/auth/index.mjs';
import { errorHandler } from '../../middlewares/errorHandler/index.mjs';
import createError from 'http-errors';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../lib/db.js';
import { randomUUID } from 'node:crypto';
import { sendResponse } from '../../responses/index.mjs';

const createMessage = async (event) => {
	const userId = event.auth.userId;

	const { text } = event.body ?? {};

	if (typeof text !== 'string') {
		throw createError(400, 'Meddelandet måste anges som text.');
	}

	const normalizedText = text.trim();

	if (!normalizedText) {
		throw createError(400, 'Meddelandet får inte vara tomt.');
	}

	const { Item: user } = await db.send(
		new GetCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				PK: `USER#${userId}`,
				SK: 'PROFILE',
			},
		}),
	);

	if (!user) {
		throw createError(401, 'Användare finns inte längre.');
	}

	const id = randomUUID().slice(0, 8);
	const createdAt = new Date().toISOString();

	const message = {
		PK: `USER#${userId}`,
		SK: `MESSAGE#${id}`,
		GSI1PK: 'MESSAGES',
		GSI1SK: `${createdAt}#${id}`,
		id,
		userId,
		username: user.username,
		text: normalizedText,
		createdAt,
	};

	await db.send(
		new PutCommand({
			TableName: process.env.TABLE_NAME,
			Item: message,
			ConditionExpression: 'attribute_not_exists(PK)',
		}),
	);

	return sendResponse(201, {
		id: message.id,
		userId: message.userId,
		username: message.username,
		text: message.text,
		createdAt: message.createdAt,
	});
};

export const handler = middy(createMessage)
	.use(requireAuth())
	.use(httpJsonBodyParser())
	.use(errorHandler());
