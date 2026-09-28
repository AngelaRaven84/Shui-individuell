import { useState } from 'react';
import { AuthContext } from './authContext';
import { jwtDecode } from 'jwt-decode';

const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(null);

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
