import './index.css';
import Message from '../message/Message';

const MessageFlow = ({ messages, onDelete }) => {
	return (
		<section className='message-flow'>
			{messages &&
				messages.map((message) => {
					return (
						<Message message={message} key={message.id} onDelete={onDelete} />
					);
				})}
		</section>
	);
};

export default MessageFlow;
