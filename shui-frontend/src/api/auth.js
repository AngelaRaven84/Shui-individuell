const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
	const response = await fetch(`${API_URL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message ?? 'Inloggningen misslyckades.');
	}

	return data;
};

export const register = async (username, email, password) => {
	const response = await fetch(`${API_URL}/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ username, email, password }),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message ?? 'Registreringen misslyckades.');
	}

	return data;
};
