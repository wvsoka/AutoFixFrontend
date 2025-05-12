import React, { useState } from "react";
import ClientNavbar from "../../components/navbars/ClientNavbar";
import OpinionCard from "../../components/tiles/OpinionCard";
import "./MyOpinionsPage.css";
import { useNavigate } from "react-router-dom";

type Opinion = {
    rating: number;
    title: string;
    description: string;
    author: string;
    date: string;
    avatarUrl?: string;
    shopName: string;
};

const mockOpinions: Opinion[] = [
    {
        rating: 5,
        title: "Świetna usługa!",
        description: "Szybko, sprawnie i profesjonalnie.",
        author: "Jan Kowalski",
        date: "2024-05-01",
        shopName: "AutoFix - Mechanik Nowak",
    },
    {
        rating: 3,
        title: "OK",
        description: "W porządku, ale mogło być szybciej.",
        author: "Jan Kowalski",
        date: "2024-04-20",
        shopName: "MotoMax Serwis",
    },
    {
        rating: 1,
        title: "Słaba jakość",
        description: "Auto wróciło w gorszym stanie.",
        author: "Jan Kowalski",
        date: "2024-03-15",
        shopName: "SpeedGarage",
    },
    {
        rating: 1,
        title: "Słaba jakość",
        description: "Auto wróciło w gorszym stanie.",
        author: "Jan Kowalski",
        date: "2024-01-15",
        shopName: "QuickFix Auto",
    },
];

const pendingReviews = [
    { id: 1, name: "Lux Auto", address: "Mickiewicza 12, Szczecin" },
    { id: 2, name: "AutoFix", address: "Piłsudskiego 45, Warszawa" },
    { id: 1, name: "Lux Auto", address: "Mickiewicza 12, Szczecin" },
    { id: 2, name: "AutoFix", address: "Piłsudskiego 45, Warszawa" },
    { id: 1, name: "Lux Auto", address: "Mickiewicza 12, Szczecin" },
    { id: 2, name: "AutoFix", address: "Piłsudskiego 45, Warszawa" },

];

const MyOpinionsPage = () => {
    const [sortOption, setSortOption] = useState("newest");
    const navigate = useNavigate();

    const sortedOpinions = [...mockOpinions].sort((a, b) => {
        switch (sortOption) {
            case "newest":
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case "oldest":
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case "highest":
                return b.rating - a.rating;
            case "lowest":
                return a.rating - b.rating;
            default:
                return 0;
        }
    });

    return (
        <div>
            <ClientNavbar/>
            <section className="pending-reviews">
                <h1 className="pending-title">Oczekujące opinie</h1>
                {pendingReviews.length > 0 ? (
                    <div className="pending-cards">
                        {pendingReviews.map((workshop) => (
                            <div className="pending-card" key={workshop.id}>
                                <div className="pending-info">
                                    <p className="workshop-name">{workshop.name}</p>
                                    <p className="workshop-address">{workshop.address}</p>
                                </div>
                                <button
                                    className="review-button"
                                    onClick={() => navigate(`/review/${workshop.id}`)}
                                >
                                    Wystaw opinię
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-pending">Na razie cicho... Brak oczekujących opinii.</p>
                )}
            </section>
            <div className="my-opinions-container">
                <h1 className="my-opinions-title">Moje opinie</h1>

                <div className="sort-controls">
                    <label className="font-medium">Sortuj:</label>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="newest">Od najnowszej</option>
                        <option value="oldest">Od najstarszej</option>
                        <option value="highest">Od najwyższej oceny</option>
                        <option value="lowest">Od najniższej oceny</option>
                    </select>
                </div>

                <div className="opinions-list">
                    {sortedOpinions.length > 0 ? (
                        sortedOpinions.map((opinion, idx) => (
                            <div key={idx}>
                                <h3 className="shop-name-label">{opinion.shopName}</h3>
                                <OpinionCard {...opinion} />
                            </div>
                        ))
                    ) : (
                        <p className="no-opinions-message">
                            Nie dodałeś jeszcze żadnych opinii.
                        </p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default MyOpinionsPage;
