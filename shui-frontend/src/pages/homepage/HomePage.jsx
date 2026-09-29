import './index.css';
import Header from '../../components/header/Header';
import Button from '../../components/button/Button';
import MessageFlow from '../../components/messageflow/MessageFlow';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import {
	getMessages,
	deleteMessage,
	getUserMessages,
} from '../../api/messages';

const HomePage = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const selectedUsername = searchParams.get('username') ?? '';
	const { token } = useContext(AuthContext);

	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let active = true;

		const loadMessages = async () => {
			try {
				setLoading(true);
				setError('');

				const data = selectedUsername
					? await getUserMessages(selectedUsername)
					: await getMessages();

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
	}, [selectedUsername]);

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
					<h2 className='homepage__title'>
						{selectedUsername
							? `Meddelanden från ${selectedUsername}`
							: 'Alla meddelanden'}
					</h2>
					{token && (
						<Button
							text='Nytt meddelande'
							type='default'
							onClick={() => navigate('/message/create')}
						/>
					)}
				</section>
				{selectedUsername && (
					<div className='homepage__filter'>
						<Button
							text='Visa alla meddelanden'
							type='default'
							onClick={() => navigate('/')}
						/>
					</div>
				)}
				{loading && <p role='status'>Hämtar meddelanden...</p>}
				{error && <p role='alert'>{error}</p>}
				{!loading &&
					!error &&
					(messages.length === 0 ? (
						<p role='status'>
							{selectedUsername
								? `Inga meddelanden från ${selectedUsername}.`
								: 'Det finns inga meddelanden ännu.'}
						</p>
					) : (
						<MessageFlow messages={messages} onDelete={handleDelete} />
					))}
			</div>
		</section>
	);
};

export default HomePage;
