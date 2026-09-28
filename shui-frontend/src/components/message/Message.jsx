import './index.css';
import { NotePencilIcon, TrashIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';

const Message = ({ message, onDelete }) => {
	const { userId } = useContext(AuthContext);
	const isOwner = userId !== null && userId === message.userId;
	const username = message.username ?? message.user?.username ?? '';
	const createdAt = message.createdAt ?? message.date;
	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState('');

	const handleDelete = async () => {
		if (deleting) return;

		setDeleting(true);
		setDeleteError('');

		try {
			await onDelete(message.userId, message.id);
		} catch (error) {
			setDeleteError(error.message);
			setDeleting(false);
		}
	};

	return (
		<article className='message'>
			<h3 className='message__initials'>
				{username.slice(0, 2).toUpperCase()}
			</h3>
			<div className='message__content'>
				<div className='message__content-top'>
					<h4 className='message__user'>{username}</h4>
					<p className='message__date'>{formatDate(createdAt)}</p>
				</div>
				<p className='message__text'>{message.text}</p>
			</div>
			{isOwner && (
				<div className='message__icon-group'>
					<Link
						to={`/message/edit/${message.id}`}
						className='message__icon-button'
						aria-label='Redigera meddelandet'>
						<NotePencilIcon
							className='icon icon--pencil'
							size={20}
							weight='bold'
							onClick={() => navigate(`/message/edit/${message.id}`)}
						/>
					</Link>
					<button
						className='message__icon-button'
						type='button'
						onClick={handleDelete}
						disabled={deleting}
						aria-label='Radera meddelandet'>
						<TrashIcon
							className='icon icon--trash'
							size={20}
							weight='bold'
							color='red'
						/>
					</button>
				</div>
			)}
			{deleteError && <p role='alert'>{deleteError}</p>}
		</article>
	);
};

export default Message;
