import './index.css';
import Button from '../button/Button';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    return (
        <form className="login-form">
            <label className="login-form__label">
                E-post
                <input
                    type="text"
                    className="login-form__input"
                    placeholder="namn@exempel.se"
                />
            </label>
            <label className="login-form__label">
                Lösenord
                <input
                    type="password"
                    className="login-form__input"
                    placeholder="********"
                />
            </label>
            <Button 
                text="Logga in"
                type="default"
                onClick={ () => console.log('Logga in') }
            />
            <p className="login-form__message">
                Har du inget konto? <Link to="/register" className="login-form__message-link">Registrera dig här!</Link>
            </p>
        </form>
    )
}

export default LoginForm;