import './index.css';
import BackIcon from '../../components/backicon/BackIcon';
import MessageForm from '../../components/messageform/MessageForm';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { getMessage, updateMessage } from '../../api/messages';

const EditMessagePage = () => {
	const { id } = useParams();
	const { userId, token } = useContext(AuthContext);
	const navigate = useNavigate();

	const [message, setMessage] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const loadMessage = async () => {
			try {
				const data = await getMessage(userId, id);
				setMessage(data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		loadMessage();
	}, [userId, id]);

	const handleUpdate = async (text) => {
		await updateMessage(userId, id, text, token);
		navigate('/');
	};

	return (
		<section className='page new-message-page'>
			<div className='wrapper new-message-page__wrapper'>
				<BackIcon />
				<section className='page__form-container'>
					<h1 className='page__title'>Redigera meddelandet</h1>
					{loading && <p>Hämtar meddelandet...</p>}
					{error && <p role='alert'>{error}</p>}
					{message && <MessageForm message={message} onSave={handleUpdate} />}
				</section>
			</div>
		</section>
	);
};

export default EditMessagePage;
