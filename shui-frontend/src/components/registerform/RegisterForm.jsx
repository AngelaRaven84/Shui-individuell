import './index.css';
import Button from '../button/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { register } from '../../api/auth';

const RegisterForm = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage('');

		if (password !== confirmPassword) {
			setMessage('Lösenorden matchar inte.');
			return;
		}

		setMessage('Skapar konto...');

		try {
			await register(username, email, password);
			setMessage('Kontot skapades! Du kan nu logga in.');
			setPassword('');
			setConfirmPassword('');
		} catch (error) {
			setMessage(error.message);
		}
	};

	return (
		<form className='register-form' onSubmit={handleSubmit}>
			<label className='register-form__label'>
				Användarnamn
				<input
					type='text'
					className='register-form__input'
					placeholder='Välj ett användarnamn'
					value={username}
					onChange={(event) => setUsername(event.target.value)}
				/>
			</label>
			<label className='register-form__label'>
				E-post
				<input
					type='text'
					className='register-form__input'
					placeholder='namn@exempel.se'
					value={email}
					onChange={(event) => setEmail(event.target.value)}
				/>
			</label>
			<label className='register-form__label'>
				Lösenord
				<input
					type='password'
					className='register-form__input'
					placeholder='Minst 8 tecken'
					value={password}
					onChange={(event) => setPassword(event.target.value)}
				/>
			</label>
			<label className='register-form__label'>
				Bekräfta lösenord
				<input
					type='password'
					className='register-form__input'
					placeholder='Upprepa ditt lösenord'
					value={confirmPassword}
					onChange={(event) => setConfirmPassword(event.target.value)}
				/>
			</label>
			<Button text='Registrera' type='default' />
			<p role='status'>{message}</p>
			<p className='register-form__message'>
				Har du redan ett konto?{' '}
				<Link to='/login' className='register-form__message-link'>
					Logga in här!
				</Link>
			</p>
		</form>
	);
};

export default RegisterForm;
