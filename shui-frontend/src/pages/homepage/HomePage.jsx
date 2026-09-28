import './index.css';
import Header from '../../components/header/Header';
import Button from '../../components/button/Button';
import MessageFlow from '../../components/messageflow/MessageFlow';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { getMessages, deleteMessage } from '../../api/messages';

const HomePage = () => {
	const navigate = useNavigate();
	const { token } = useContext(AuthContext);

	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let active = true;

		const loadMessages = async () => {
			try {
				const data = await getMessages();

				if (active) {
					setMessages(data);
				}
			} catch (error) {
				if (active) {
					setError(error.message);
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		};

		loadMessages();

		return () => {
			active = false;
		};
	}, []);

	const handleDelete = async (userId, id) => {
		await deleteMessage(userId, id, token);

		setMessages((currentMessages) =>
			currentMessages.filter(
				(message) => !(message.userId === userId && message.id === id),
			),
		);
	};

	return (
		<section className='page homepage'>
			<Header />
			<div className='wrapper'>
				<section className='homepage__top'>
					<h2 className='homepage__title'>Alla meddelanden</h2>
					{token && (
						<Button
							text='Nytt meddelande'
							type='default'
							onClick={() => navigate('/message/create')}
						/>
					)}
				</section>
				{loading && <p role='status'>Hämtar meddelanden...</p>}
				{error && <p role='alert'>{error}</p>}
				{!loading && !error && (
					<MessageFlow messages={messages} onDelete={handleDelete} />
				)}
			</div>
		</section>
	);
};

export default HomePage;
