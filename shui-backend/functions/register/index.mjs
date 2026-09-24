import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../lib/db.js';
import { sendResponse } from '../../responses/index.mjs';
import { errorHandler } from '../../middlewares/errorHandler/index.mjs';

const register = async (event) => {
	const { username, email, password } = event.body ?? {};

	if (
		typeof username !== 'string' ||
		typeof email !== 'string' ||
		typeof password !== 'string'
	) {
		throw createError(
			400,
			'Användarnamn, e-post och lösenord måste anges som text.',
		);
	}

	const normalizedUsername = username.trim().toLowerCase();
	const normalizedEmail = email.trim().toLowerCase();

	if (!/^[a-z0-9_-]{3,30}$/.test(normalizedUsername)) {
		throw createError(
			400,
			'Användarnamnet ska vara 3-30 tecken: a-z. siffror, bindestreck eller understreck.',
		);
	}

	if (
		normalizedEmail.length > 254 ||
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
	) {
		throw createError(400, 'Ange en giltig e-postadress.');
	}

	if (password.length < 8 || bcrypt.truncates(password)) {
		throw createError(
			400,
			'Lösenordet måste vara minst 8 tecken och högst 72 byte.',
		);
	}

	const userId = randomUUID().slice(0, 8);
	const createdAt = new Date().toISOString();
	const passwordHash = await bcrypt.hash(password, 12);

	const user = {
		PK: `USER#${userId}`,
		SK: 'PROFILE',
		id: userId,
		username: normalizedUsername,
		email: normalizedEmail,
		passwordHash,
		createdAt,
	};

	try {
		await db.send(
			new TransactWriteCommand({
				TransactItems: [
					{
						Put: {
							TableName: process.env.TABLE_NAME,
							Item: user,
							ConditionExpression: 'attribute_not_exists(PK)',
						},
					},
					{
						Put: {
							TableName: process.env.TABLE_NAME,
							Item: {
								PK: `EMAIL#${normalizedEmail}`,
								SK: 'LOOKUP',
								userId,
							},
							ConditionExpression: 'attribute_not_exists(PK)',
						},
					},
					{
						Put: {
							TableName: process.env.TABLE_NAME,
							Item: {
								PK: `USERNAME#${normalizedUsername}`,
								SK: 'LOOKUP',
								userId,
							},
							ConditionExpression: 'attribute_not_exists(PK)',
						},
					},
				],
			}),
		);
	} catch (error) {
		if (error.name === 'TransactionCanceledException') {
			const reasons = error.CancellationReasons ?? [];

			const userIdExists = reasons[0]?.Code === 'ConditionalCheckFailed';

			const emailExists = reasons[1]?.Code === 'ConditionalCheckFailed';

			const usernameExists = reasons[2]?.Code === 'ConditionalCheckFailed';

			if (emailExists || usernameExists) {
				throw createError(
					409,
					'Användarnamnet eller e-postadressen är upptagen',
				);
			}

			if (userIdExists) {
				throw createError(
					409,
					'Kunde inte skapa ett unikt användar-id. Försök igen.',
				);
			}
		}

		throw error;
	}

	return sendResponse(201, {
		message: 'Användare skapades.',
		user: {
			id: userId,
			username: normalizedUsername,
			email: normalizedEmail,
			createdAt,
		},
	});
};

export const handler = middy(register)
	.use(httpJsonBodyParser())
	.use(errorHandler());
