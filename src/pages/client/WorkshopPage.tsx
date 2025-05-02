import React from 'react';
import './WorkshopPage.css';
import ClientNavbar from "../../components/navbars/ClientNavbar";
import ServiceTile from "../../components/tiles/ServiceTile";
import WorkshopDetailsCard from "../../components/tiles/WorkshopDetailsCard";
import RatingCard from "../../components/tiles/RatingCard";
import OpinionCard from "../../components/tiles/OpinionCard";

const WorkshopPage: React.FC = () => {

    return (
        <div className="workshop-page">
            <ClientNavbar/>

            <div className="header-section">
                <img
                    src="/mechanic-hands.jpg"
                    alt="Mechanik"
                    className="workshop-image"
                />
                <div className="workshop-info">
                    <h1>Lux Auto Centrum</h1>
                    <p>Mickiewicza 174, 54-196 Szczecin</p>
                </div>
            </div>

            <div className="main-content">
                <div className="services-section">
                    <ServiceTile
                        title="Serwis klimatyzacji"
                        duration="2 godziny"
                        description="Opis opis opis opis opis opis opis opis…"
                        price="200-350 zł"
                        image="/placeholder.svg"
                    />
                    <ServiceTile
                        title="Wymiana opon"
                        duration="1 godzina"
                        description="Sezonowa wymiana opon letnich i zimowych."
                        price="50-100 zł"
                        image="/placeholder.svg"
                    />
                    <ServiceTile
                        title="Diagnostyka"
                        duration="30 minut"
                        description="Szybka diagnostyka komputerowa pojazdu."
                        price="100 zł"
                        image="/placeholder.svg"
                    />
                </div>

                <WorkshopDetailsCard
                    name="Lux Auto"
                    description="Lux Auto Centrum to nowoczesny zakład mechaniczny oferujący kompleksowe usługi..."
                    openingHours={[
                        {day: "Pon", hours: "8–16"},
                        {day: "Wt", hours: "8–16"},
                        {day: "Śr", hours: "8–16"},
                        {day: "Czw", hours: "8–16"},
                        {day: "Pt", hours: "8–14"},
                        {day: "Sob", hours: "10–20", isClosed: true},
                        {day: "Niedz", hours: "Nieczynne", isClosed: true}
                    ]}
                />
            </div>

            <div className="reviews-section">
                <h3>Opinie innych klientów</h3>

                <div className="centered-rating">
                    <RatingCard rating={4.6} total={147}/>
                </div>

                <OpinionCard
                    rating={4}
                    title="Wymiana opon"
                    description="Wspaniałe doświadczenie! Wspaniałe doświadczenie! Wspaniałe doświadczenie!"
                    author="Danuta"
                    date="24.03.2025 12.00–12.30"
                    avatarUrl="/user.png"
                />
                <OpinionCard
                    rating={5}
                    title="Wymiana opon"
                    description="Bardzo sprawnie i profesjonalnie."
                    author="Marek"
                    date="05.03.2025 14.00–14.30"
                    avatarUrl="/user.png"
                />
            </div>
        </div>
    );
};

export default WorkshopPage;
