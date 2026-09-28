import './index.css';
import { NotePencilIcon, TrashIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils';

const Message = ({ message }) => {
	const navigate = useNavigate();
	const username = message.username ?? message.user?.username ?? '';
	const createdAt = message.createdAt ?? message.date;

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
			<div className='message__icon-group'>
				<NotePencilIcon
					className='icon icon--pencil'
					size={20}
					weight='bold'
					onClick={() => navigate(`/message/edit/${message.id}`)}
				/>
				<TrashIcon
					className='icon icon--trash'
					size={20}
					weight='bold'
					color='red'
				/>
			</div>
		</article>
	);
};

export default Message;
