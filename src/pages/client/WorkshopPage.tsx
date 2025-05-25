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
    const { id } = useParams();
    const location = useLocation();
    const [mechanic, setMechanic] = useState(location.state?.mechanic || null);
    const [services, setServices] = useState([]);
    const [opinions, setOpinions] = useState([]);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const accessToken = localStorage.getItem("accessToken");
    console.log("Access Token:", accessToken);
    const handleBookClick = (serviceName: string) => {
        setSelectedService(serviceName);
        setBookingOpen(true);
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                if (!mechanic && id) {
                    const mechRes = await axiosInstance.get(`/api/mechanic/list/`);
                    const found = mechRes.data.find((m: any) => m.id === parseInt(id));
                    setMechanic(found);
                }

                const mechanicId = mechanic?.id || id;

                const servicesRes = await axiosInstance.get(`/api/services/?mechanic_id=${mechanicId}`);
                setServices(servicesRes.data);

                const opinionsRes = await axiosInstance.get(`/api/reviews/mechanic/${mechanicId}/reviews/`);
                setOpinions(opinionsRes.data);

                const ratingRes = await axiosInstance.get(`/api/reviews/mechanic/${mechanicId}/rating/`);
                setAverageRating(ratingRes.data.average_rating);

            } catch (err) {
                console.error("Błąd przy pobieraniu danych:", err);
            }
        };

        fetchAllData();
    }, [id, mechanic]);


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
                        {services.map((service: any) => (
                            <ServiceTile
                                key={service.id}
                                title={service.name}
                                duration={service.duration || "Nie podano"}
                                price={`${service.price} zł`}
                                image="/placeholder.svg"
                                onBookClick={() => handleBookClick(service.name)}
                            />
                        ))}
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
            {averageRating !== null && (
                <RatingCard rating={averageRating} total={opinions.length} />
            )}
        </div>

        <div className="opinions-wrapper">
            {opinions.map((op: any) => (
                <OpinionCard
                    key={op.id}
                    rating={op.rating}
                    title={op.service_name}
                    description={op.description}
                    author={op.client_name}
                    date={op.date}
                    avatarUrl="/user.png"
                />
            ))}
        </div>
    </div>
</div>
)
    ;
};

export default WorkshopPage;
