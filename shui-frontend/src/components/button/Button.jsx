import './index.css';

const Button = ({ text, type, onClick, htmlType = 'button' }) => {
	return (
		<button
			className={`button button--${type}`}
			onClick={onClick}
			type={htmlType}>
			{text}
		</button>
	);
};

export default Button;
