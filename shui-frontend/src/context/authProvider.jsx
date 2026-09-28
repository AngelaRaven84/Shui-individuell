import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { jwtDecode } from 'jwt-decode';

const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(null);

	useEffect(() => {
		if (!token) return;

		let remainingTime = 0;

		try {
			const { exp } = jwtDecode(token);

			if (typeof exp === 'number' && Number.isFinite(exp)) {
				remainingTime = Math.max(0, exp * 1000 - Date.now());
			}
		} catch {
			remainingTime = 0;
		}

		const timeoutId = setTimeout(() => {
			setToken(null);
		}, remainingTime);

		return () => clearTimeout(timeoutId);
	}, [token]);

	let userId = null;

	if (token) {
		try {
			const payload = jwtDecode(token);
			userId = typeof payload.sub === 'string' ? payload.sub : null;
		} catch {
			userId = null;
		}
	}

	const logout = () => {
		setToken(null);
	};

	return (
		<AuthContext.Provider value={{ token, userId, setToken, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
