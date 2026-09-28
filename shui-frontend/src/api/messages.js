const API_URL = import.meta.env.VITE_API_URL;

export const getMessages = async () => {
	const response = await fetch(`${API_URL}/messages`);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message ?? 'Kundet inte hämta meddelanden.');
	}

	return data;
};
