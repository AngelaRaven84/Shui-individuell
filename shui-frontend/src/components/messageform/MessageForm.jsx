import { useState } from 'react';
import './index.css';
import Button from '../button/Button';

const MessageForm = ({ message = null, onSave }) => {
	const [text, setText] = useState(message?.text ?? '');
	const [feedback, setFeedback] = useState('');
	const [saving, setSaving] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (saving) return;

		if (!text.trim()) {
			setFeedback('Meddelandet får inte vara tomt.');
			return;
		}

		if (!onSave) {
			setFeedback('Sparfunktionen är inte inkopplad ännu.');
			return;
		}

		setSaving(true);
		setFeedback('Sparar...');

		try {
			await onSave(text);
			setFeedback('');
		} catch (error) {
			setFeedback(error.message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<form className='message-form' onSubmit={handleSubmit}>
			<p>Meddelandet publiceras med ditt inloggade konto.</p>

			<label className='message-form__label'>
				Meddelande
				<div className='message-form__textarea-wrapper'>
					<textarea
						className='message-form__textarea'
						placeholder='Vad vill du säga?'
						maxLength={200}
						value={text}
						onChange={(event) => setText(event.target.value)}
					/>

					<span className='message-form__counter'>{text.length}/200</span>
				</div>
			</label>
			<Button
				text={!message ? 'Publicera' : 'Spara ändringar'}
				type='default'
				htmlType='submit'
			/>
			<Button text='Rensa' type='outline' onClick={() => setText('')} />
			<p role='status'>{feedback}</p>
		</form>
	);
};

export default MessageForm;
