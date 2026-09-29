import './index.css';
import BackIcon from '../../components/backicon/BackIcon';
import MessageForm from '../../components/messageform/MessageForm';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { createMessage } from '../../api/messages';

const NewMessagePage = () => {
	const { token } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleCreate = async (text) => {
		await createMessage(text, token);
		navigate('/');
	};

	return (
		<section className='page new-message-page'>
			<div className='wrapper new-message-page__wrapper'>
				<BackIcon />
				<section className='page__form-container'>
					<h1 className='page__title'>Skapa nytt meddelande</h1>
					<MessageForm onSave={handleCreate} />
				</section>
			</div>
		</section>
	);
};

export default NewMessagePage;
