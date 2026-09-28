import './index.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../button/Button';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

const Navigation = () => {
	const navigate = useNavigate();
	const { token, logout } = useContext(AuthContext);
	return (
		<nav className='nav'>
			<NavLink to='/' className='nav__link'>
				Hem
			</NavLink>
			<Button
				text={token ? 'Logga ut' : 'Logga in'}
				type='default'
				onClick={() => {
					if (token) {
						logout();
						navigate('/');
					} else {
						navigate('/login');
					}
				}}
			/>
		</nav>
	);
};

export default Navigation;
