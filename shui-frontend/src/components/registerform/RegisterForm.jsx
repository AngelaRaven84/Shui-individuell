import './index.css';
import Button from '../button/Button';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
    return (
        <form className="register-form">
            <label className="register-form__label">
                Användarnamn
                <input
                    type="text"
                    className="register-form__input"
                    placeholder="Välj ett användarnamn"
                />
            </label>
            <label className="register-form__label">
                E-post
                <input
                    type="text"
                    className="register-form__input"
                    placeholder="namn@exempel.se"
                />
            </label>
            <label className="register-form__label">
                Lösenord
                <input
                    type="password"
                    className="register-form__input"
                    placeholder="Minst 8 tecken"
                />
            </label>
            <label className="register-form__label">
                Bekräfta lösenord
                <input
                    type="password"
                    className="register-form__input"
                    placeholder="Upprepa ditt lösenord"
                />
            </label>
            <Button 
                text="Registrera"
                type="default"
                onClick={ () => console.log('Registrera') }
            />
            <p className="register-form__message">
                Har du redan ett konto? <Link to="/login" className="register-form__message-link">Logga in här!</Link>
            </p>
        </form>
    )
}

export default RegisterForm;