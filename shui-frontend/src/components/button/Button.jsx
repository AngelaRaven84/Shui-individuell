import './index.css';

const Button = ({ text, type, onClick }) => {
    return (
        <button 
            className={`button button--${type}`}
            onClick={ onClick }
        >
            { text }
        </button>
    )
}

export default Button;