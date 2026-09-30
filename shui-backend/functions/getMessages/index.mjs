import middy from '@middy/core';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../lib/db.js';
import { sendResponse } from '../../responses/index.mjs';
import { errorHandler } from '../../middlewares/errorHandler/index.mjs';

export const getMessages = async () => {
	const messages = [];
	let lastEvaluatedKey;

	do {
		const result = await db.send(
			new QueryCommand({
				TableName: process.env.TABLE_NAME,
				IndexName: 'GSI1',
				KeyConditionExpression: 'GSI1PK = :pk',
				ExpressionAttributeValues: {
					':pk': 'MESSAGES',
				},
				ScanIndexForward: false,
				ExclusiveStartKey: lastEvaluatedKey,
			}),
		);

		messages.push(...(result.Items ?? []));
		lastEvaluatedKey = result.LastEvaluatedKey;
	} while (lastEvaluatedKey);

	return sendResponse(200, messages);
};

export const handler = middy(getMessages).use(errorHandler());
