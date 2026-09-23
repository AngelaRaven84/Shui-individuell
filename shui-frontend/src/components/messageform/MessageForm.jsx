import { useState } from 'react';
import './index.css';
import Button from '../button/Button';

const MessageForm = ({ message = null }) => {
    const [text, setText] = useState(message?.text ?? '');

    return (
        <form className="message-form">
            <label className="message-form__label">
                Användarnamn

                <input
                    type="text"
                    className="message-form__input"
                    placeholder="Skriv ditt namn här"
                    value={ !message ? '' : message.user.username }
                    disabled={ !message ? false : true }
                />
            </label>

            <label className="message-form__label">
                Meddelande

                <div className="message-form__textarea-wrapper">
                    <textarea
                        className="message-form__textarea"
                        placeholder="Vad vill du säga?"
                        maxLength={200}
                        value={ text }
                        onChange={(event) => setText(event.target.value)}
                    />

                    <span className="message-form__counter">
                        {text.length}/200
                    </span>
                </div>
            </label>
            <Button 
                text={ !message ? 'Publicera' : 'Spara ändringar' }
                type="default"
                onClick={ console.log('Spara meddelande') }
            />
            <Button 
                text="Rensa"
                type="outline"
                onClick={ console.log('Rensa') }
            />
        </form>
    );
};

export default MessageForm;