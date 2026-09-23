import './index.css';
import Message from '../message/Message';

const MessageFlow = ({ messages }) => {
    return (
        <section className="message-flow">
            {
                messages && messages.map(message => {
                    return <Message message={ message } key={ message.id } />
                })
            }
        </section>
    )
}

export default MessageFlow;