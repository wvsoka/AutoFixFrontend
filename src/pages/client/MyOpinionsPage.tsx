import React, { useState } from "react";
import ClientNavbar from "../../components/navbars/ClientNavbar";
import OpinionCard from "../../components/tiles/OpinionCard";
import "./MyOpinionsPage.css";

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


const MyOpinionsPage = () => {
    const [sortOption, setSortOption] = useState("newest");

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
                    {sortedOpinions.map((opinion, idx) => (
                        <div key={idx}>
                            <h3 className="shop-name-label">{opinion.shopName}</h3>
                            <OpinionCard {...opinion} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default MyOpinionsPage;
