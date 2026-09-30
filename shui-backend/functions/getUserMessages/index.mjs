import middy from '@middy/core';
import createError from 'http-errors';
import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../lib/db.js';
import { sendResponse } from '../../responses/index.mjs';
import { errorHandler } from '../../middlewares/errorHandler/index.mjs';

const getUserMessages = async (event) => {
	const username = event.pathParameters?.username?.trim().toLowerCase();

	if (!username) {
		throw createError(400, 'Användarnamn krävs');
	}

	const userLookup = await db.send(
		new GetCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				PK: `USERNAME#${username}`,
				SK: `LOOKUP`,
			},
		}),
	);

	if (!userLookup.Item) {
		return sendResponse(200, []);
	}

	const messages = [];
	let lastEvaluatedKey;

	do {
		const result = await db.send(
			new QueryCommand({
				TableName: process.env.TABLE_NAME,
				KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
				ExpressionAttributeValues: {
					':pk': `USER#${userLookup.Item.userId}`,
					':prefix': 'MESSAGE#',
				},
				ExclusiveStartKey: lastEvaluatedKey,
			}),
		);

		messages.push(...(result.Items ?? []));
		lastEvaluatedKey = result.LastEvaluatedKey;
	} while (lastEvaluatedKey);

	return sendResponse(200, messages);
};

export const handler = middy(getUserMessages).use(errorHandler());
