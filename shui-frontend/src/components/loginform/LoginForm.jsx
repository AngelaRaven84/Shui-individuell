import './index.css';
import Button from '../button/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { login } from '../../api/auth';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage('Loggar in...');

		try {
			await login(email, password);
			setMessage('Inloggningen lyckades!');
		} catch (error) {
			setMessage(error.message);
		}
	};

	return (
		<form className='login-form' onSubmit={handleSubmit}>
			<label className='login-form__label'>
				E-post
				<input
					type='text'
					className='login-form__input'
					placeholder='namn@exempel.se'
					value={email}
					onChange={(event) => setEmail(event.target.value)}
				/>
			</label>
			<label className='login-form__label'>
				Lösenord
				<input
					type='password'
					className='login-form__input'
					placeholder='********'
					value={password}
					onChange={(event) => setPassword(event.target.value)}
				/>
			</label>
			<Button text='Logga in' type='default' />
			<p role='status'>{message}</p>
			<p className='login-form__message'>
				Har du inget konto?{' '}
				<Link to='/register' className='login-form__message-link'>
					Registrera dig här!
				</Link>
			</p>
		</form>
	);
};

export default LoginForm;
