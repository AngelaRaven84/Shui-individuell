import './index.css';
import Navigation from '../navigation/Navigation';

const Header = () => {
    return (
        <header className="header">
            <div className="wrapper header__wrapper">
                <h1 className="header__title">
                    Shui
                </h1>
                <Navigation />
            </div>
        </header>
    )
}

export default Header;