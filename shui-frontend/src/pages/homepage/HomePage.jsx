import './index.css';
import Header from '../../components/header/Header';
import Button from '../../components/button/Button';
import MessageFlow from '../../components/messageflow/MessageFlow';
import { messages } from '../../data/messages';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <section className="page homepage">
            <Header />
            <div className="wrapper">
                <section className="homepage__top">
                    <h2 className="homepage__title">
                        Alla meddelanden
                    </h2>
                    <Button 
                        text="Nytt meddelande"
                        type="default"
                        onClick={ () => navigate('/message/create') }
                    />
                </section>
                <MessageFlow messages={ messages } />
            </div>
        </section>
    )
}

export default HomePage;