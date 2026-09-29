import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export const requireAuth = () => ({
	before: async (request) => {
		const headers = request.event.headers ?? {};
		const authorization = headers.authorization ?? headers.Authorization;

		if (typeof authorization !== 'string') {
			throw createError(401, 'Du måste vara inloggad.');
		}

		const match = /^Bearer\s+(\S+)$/i.exec(authorization);

		if (!match) {
			throw createError(401, 'Ogiltig Authorization-header.');
		}

		const token = match[1];

		const secret = process.env.JWT_SECRET;

		if (!secret) {
			throw createError(500, 'JWT-konfigurationen saknas.');
		}

		let payload;

		try {
			payload = jwt.verify(token, secret, {
				algorithms: ['HS256'],
			});
		} catch {
			throw createError(401, 'Ogiltig eller utgången token.');
		}

		if (
			typeof payload !== 'object' ||
			payload === null ||
			typeof payload.sub !== 'string' ||
			!payload.sub.trim() ||
			!Number.isInteger(payload.exp)
		) {
			throw createError(401, 'Ogiltig token.');
		}

		request.event.auth = {
			userId: payload.sub,
		};
	},
});
