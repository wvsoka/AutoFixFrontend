import React, {useEffect, useState} from 'react';
import './WorkshopPage.css';
import ClientNavbar from "../../components/navbars/ClientNavbar";
import ServiceTile from "../../components/tiles/ServiceTile";
import WorkshopDetailsCard from "../../components/tiles/WorkshopDetailsCard";
import RatingCard from "../../components/tiles/RatingCard";
import OpinionCard from "../../components/tiles/OpinionCard";
import BookingModal from "./BookingModal";
import { useLocation, useParams } from "react-router-dom";
import axiosInstance from '../../api/axiosInstance';

const WorkshopPage: React.FC = () => {
    const [bookingOpen, setBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string>("");
    const location = useLocation();
    const { mechanic } = location.state || {};
    const [services, setServices] = useState([]);

    const handleBookClick = (serviceName: string) => {
        setSelectedService(serviceName);
        setBookingOpen(true);
    };

    useEffect(() => {
        const fetchServices = async () => {
            if (!mechanic?.id) return;
            try {
                const res = await axiosInstance.get(`/api/services/?mechanic_id=${mechanic.id}`);
                setServices(res.data);
            } catch (err) {
                console.error("Błąd przy pobieraniu usług:", err);
            }
        };

        fetchServices();
    }, [mechanic]);

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
                        {mechanic && (
                            <>
                                <h1>{mechanic.name}</h1>
                                <p>{mechanic.address}, {mechanic.city}</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="right-side">
                    {mechanic && (
                        <WorkshopDetailsCard
                            name={mechanic.name}
                            description={mechanic.description}
                            openingHours={[] /* tutaj możesz wstawić dane jeśli masz */}
                        />
                    )}
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
