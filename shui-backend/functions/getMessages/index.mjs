import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../lib/db.js';

export const handler = async () => {
	try {
		const result = await db.send(
			new QueryCommand({
				TableName: process.env.TABLE_NAME,
				IndexName: 'GSI1',
				KeyConditionExpression: 'GSI1PK = :pk',
				ExpressionAttributeValues: {
					':pk': 'MESSAGES',
				},
				ScanIndexForward: false,
			}),
		);

		return {
			statusCode: 200,
			body: JSON.stringify(result.Items ?? []),
		};
	} catch (error) {
		console.error('Kunde inte hämta meddelanden:', error);

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: 'Kunde inte hämta meddelanden',
			}),
		};
	}
};
