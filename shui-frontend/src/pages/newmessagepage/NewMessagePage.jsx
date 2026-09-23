import './index.css';
import BackIcon from '../../components/backicon/BackIcon';
import MessageForm from '../../components/messageform/MessageForm';

const NewMessagePage = () => {
    return (
        <section className="page new-message-page">
            <div className="wrapper new-message-page__wrapper">
                <BackIcon />
                <section className="page__form-container">
                    <h1 className="page__title">
                        Skapa nytt meddelande
                    </h1>
                    <MessageForm />
                </section>
            </div>
        </section>
    )
}

export default NewMessagePage;