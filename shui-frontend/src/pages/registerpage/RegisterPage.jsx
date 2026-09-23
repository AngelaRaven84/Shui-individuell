import './index.css';
import BackIcon from '../../components/backicon/BackIcon';
import RegisterForm from '../../components/registerform/RegisterForm';

const RegisterPage = () => {
    return (
        <section className="page register-page">
            <div className="wrapper register-page__wrapper">
                <BackIcon />
                <section className="page__form-container">
                    <h1 className="page__title">
                        Registrera dig
                    </h1>
                    <RegisterForm />
                </section>
            </div>
        </section>
    )
}

export default RegisterPage;