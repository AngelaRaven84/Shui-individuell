import { GetCommand } from '@aws.sdk/lib-dynamodb';
import { db } from '../../lib/db.js';

export const handler = async (event) => {
	const { userId, id } = event.patParameters ?? {};

	if (!userId || !id) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: 'Användar-id och meddelande-id krävs.',
			}),
		};
	}

	try {
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
			return {
				statusCode: 404,
				body: JSON.stringify({
					message: 'Meddelandet hittades inte.',
				}),
			};
		}

		return {
			statusCode: 200,
			body: JSON.stringify(result.Item),
		};
	} catch (error) {
		console.error('Kunde inte hämta meddelandet:', error);

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: 'Kunde inte hämta meddelandet.',
			}),
		};
	}
};
