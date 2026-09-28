import { useState } from 'react';
import { AuthContext } from './authContext';

const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(null);

	const logout = () => {
		setToken(null);
	};

	return (
		<AuthContext.Provider value={{ token, setToken, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
