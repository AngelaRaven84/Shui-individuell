import { sendResponse } from '../../responses/index.mjs';

export const errorHandler = () => ({
	onError: async (request) => {
		const error = request.error;
		const statusCode = error.statusCode ?? error.status ?? 500;

		if (statusCode >= 500) {
			console.error('Serverfel:', error);
		}

		const message =
			statusCode >= 500 ? 'Ett internt serverfel uppstod.' : error.message;

		request.response = sendResponse(statusCode, { message });

		return request.response;
	},
});
