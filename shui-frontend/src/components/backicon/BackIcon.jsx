import './index.css';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const BackIcon = ({ onClick }) => {
    const navigate = useNavigate();
    return (
        <p 
            onClick={ () => navigate(-1) }
            className="back-icon"
        >
            <ArrowLeftIcon size={ 24 } />
            Tillbaka
        </p>
    )
}

export default BackIcon;