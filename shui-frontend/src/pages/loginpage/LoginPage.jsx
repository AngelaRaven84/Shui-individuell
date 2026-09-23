import './index.css';
import BackIcon from '../../components/backicon/BackIcon';
import LoginForm from '../../components/loginform/LoginForm';

const LoginPage = () => {
    return (
        <section className="page login-page">
            <div className="wrapper login-page__wrapper">
                <BackIcon />
                <section className="page__form-container">
                    <h1 className="page__title">
                        Logga in
                    </h1>
                    <LoginForm />
                </section>
            </div>
        </section>
    )
}

export default LoginPage;