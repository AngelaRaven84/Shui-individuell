import './index.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../button/Button';

const Navigation = () => {
    const navigate = useNavigate();
    return (
        <nav className="nav">
            <NavLink to="/" className="nav__link">Hem</NavLink>
            <Button
                text="Logga in"
                type="default"
                onClick={ () => navigate('/login') }
            />
        </nav>
    )
}

export default Navigation;