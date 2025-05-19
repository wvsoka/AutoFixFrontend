import React, {useState} from 'react';
import './WorkshopPage.css';
import ClientNavbar from "../../components/navbars/ClientNavbar";
import ServiceTile from "../../components/tiles/ServiceTile";
import WorkshopDetailsCard from "../../components/tiles/WorkshopDetailsCard";
import RatingCard from "../../components/tiles/RatingCard";
import OpinionCard from "../../components/tiles/OpinionCard";
import BookingModal from "./BookingModal";

const WorkshopPage: React.FC = () => {
    const [bookingOpen, setBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string>("");

    const handleBookClick = (serviceName: string) => {
        setSelectedService(serviceName);
        setBookingOpen(true);
    };
    return (
        <div className="workshop-page">
            <ClientNavbar/>

            <div className="header-section">
                <div className="left-side">
                    <img
                        src="/mechanic-hands.jpg"
                        alt="Mechanik"
                        className="workshop-image"
                    />
                    <div className="workshop-info">
                        <h1>Przykładowa nazwa mechanika</h1>
                        <p>Mickiewicza 174, 54-196 Szczecin</p>
                    </div>
                </div>
                <div className="right-side">
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
            </div>

            <div className="main-content">
                <div className="services-wrapper">
                    <div className="services-section">
                        <ServiceTile
                            title="Serwis klimatyzacji"
                            duration="2 godziny"
                            price="200-350 zł"
                            image="/placeholder.svg"
                            onBookClick={() => handleBookClick("Serwis klimatyzacji")}
                        />
                        <ServiceTile
                            title="Wymiana opon"
                            duration="1 godzina"
                            price="50-100 zł"
                            image="/placeholder.svg"
                            onBookClick={() => handleBookClick("Wymiana opon")}
                        />
                        <ServiceTile
                            title="Diagnostyka"
                            duration="30 minut"
                            price="100 zł"
                            image="/placeholder.svg"
                            onBookClick={() => handleBookClick("Diagnostyka")}
                        />
                    </div>

                    {bookingOpen && (
                        <BookingModal
                            onClose={() => setBookingOpen(false)}
                            serviceName={selectedService}
                        />
                    )}
            </div>
        </div>

    <div className="reviews-section">
        <div className="centered-rating">
            <RatingCard rating={4.6} total={147}/>
        </div>

        <div className="opinions-wrapper">
            <OpinionCard
                rating={4}
                title="Wymiana opon"
                description="Wspaniałe doświadczenie! ..."
                author="Danuta"
                date="24.03.2025 12.00–12.30"
                avatarUrl="/user.png"
            />
        </div>
        <div className="opinions-wrapper">
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
</div>
)
    ;
};

export default WorkshopPage;
