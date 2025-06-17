import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './ListOfMechanics.css';
import ClientNavbar from "../../components/navbars/ClientNavbar";
import ArrowRightButton from "../../components/buttons/ArrowRightButton";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";

interface Mechanic {
    id: number;
    name: string;
    address: string;
    description: string;
    contact_phone: string;
    city: string;
    rating: number;
}

const ListOfMechanics: React.FC = () => {
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mechanicsRes] = await Promise.all([
                    axiosInstance.get('/api/mechanic/list/')
                ]);

                setMechanics(mechanicsRes.data);
            } catch (error) {
                console.error("Błąd przy pobieraniu danych:", error);
            }
        };

        fetchData();
    }, []);

    // Filtrowanie tylko, gdy wpisano 3+ znaki
    const filteredMechanics = searchTerm.length >= 3
        ? mechanics.filter((mech) => {
            const term = searchTerm.toLowerCase();
            return (
                mech.name.toLowerCase().includes(term) ||
                mech.description.toLowerCase().includes(term) ||
                mech.city.toLowerCase().includes(term)
            );
        })
        : mechanics;

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
                    <input
                        type="text"
                        placeholder="Wyszukaj usługę, której szukasz..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-icon">
                        <SearchIcon className="search-icon-svg" />
                    </button>
                </div>
            </section>

            <section className="mechanic-list">
                {filteredMechanics.length > 0 ? (
                    filteredMechanics.map((mech) => (
                        <div className="mechanic-card" key={mech.id}>
                            <div className="mechanic-info">
                                <div className="mechanic-avatar" />
                                <div className="mechanic-details">
                                    <div className="mechanic-name">{mech.name}</div>
                                    <div className="mechanic-address">{mech.address}, {mech.city}</div>
                                    <div className="mechanic-support">{mech.description}</div>
                                </div>
                            </div>
                            <div className="mechanic-rating">
                                {'★'.repeat(5)}
                                <ArrowRightButton onClick={() => navigate(`/workshop/${mech.id}`, { state: { mechanic: mech } })} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">Brak wyników spełniających kryteria.</div>
                )}
            </section>
        </div>
    );
};

export default ListOfMechanics;
