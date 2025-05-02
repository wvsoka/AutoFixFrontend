import React from 'react';
import './ListOfMechanics.css';
import ClientNavbar from "../../components/navbars/ClientNavbar";
import ArrowRightButton from "../../components/buttons/ArrowRightButton";
import SearchIcon from '@mui/icons-material/Search';

const ListOfMechanics: React.FC = () => {
    return (
        <div className="client-mech-list">
            <ClientNavbar />

            <section
                className="search-section"
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/mechanic-hands.jpg)`
                }}
            >
                <h1>Czego dzisiaj potrzebujesz?</h1>
                <div className="search-bar">
                    <input type="text" placeholder="Wyszukaj usługę, której szukasz..."/>
                    <button className="search-icon">
                        <SearchIcon className="search-icon-svg"/>
                    </button>
                </div>
            </section>

            <section className="mechanic-list">
                {[1, 2, 3, 4].map((item) => (
                    <div className="mechanic-card" key={item}>
                        <div className="mechanic-info">
                            <div className="mechanic-avatar"/>
                            <div className="mechanic-details">
                                <div className="mechanic-name">Nazwa mechanika</div>
                                <div className="mechanic-address">adres</div>
                                <div className="mechanic-support">
                                    Supporting line text lorem ipsum dolor sit amet, consectetur.
                                </div>
                            </div>
                        </div>
                        <div className="mechanic-rating">
                            {'★★★★★'}
                            {/* Dodanie przycisku ArrowRightButton */}
                            <ArrowRightButton />
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default ListOfMechanics;
