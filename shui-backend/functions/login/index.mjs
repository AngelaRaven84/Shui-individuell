import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import createError from 'http-errors';
import { errorHandler } from '../../middlewares/errorHandler/index.mjs';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../../responses/index.mjs';

const login = async (event) => {
	const { email, password } = event.body ?? {};

	if (typeof email !== 'string' || typeof password !== 'string') {
		throw createError(400, 'E-post och lösenord måste anges som text.');
	}

	const normalizedEmail = email.trim().toLowerCase();

	const { Item: emailLookup } = await db.send(
		new GetCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				PK: `EMAIL#${normalizedEmail}`,
				SK: 'LOOKUP',
			},
		}),
	);

	if (!emailLookup) {
		throw createError(401, 'Fel e-post eller lösenord.');
	}

	const { Item: user } = await db.send(
		new GetCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				PK: `USER#${emailLookup.userId}`,
				SK: 'PROFILE',
			},
		}),
	);

	if (!user) {
		throw createError(401, 'Fel e-post eller lösenord.');
	}

	const passwordMatches = await bcrypt.compare(password, user.passwordHash);

	if (!passwordMatches) {
		throw createError(401, 'Fel e-post eller lösenord.');
	}

	const token = jwt.sign({}, process.env.JWT_SECRET, {
		algorithm: 'HS256',
		subject: user.id,
		expiresIn: '15m',
	});

	return sendResponse(200, { token });
};

export const handler = middy(login)
	.use(httpJsonBodyParser())
	.use(errorHandler());
