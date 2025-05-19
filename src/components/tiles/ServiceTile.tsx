import React from 'react';
import './ServiceTile.css';
import {SecondaryButton} from "../buttons/SecondaryButton";

interface ServiceTileProps {
    title: string;
    duration: string;
    price: string;
    image?: string;
    onBookClick?: () => void;
}

const ServiceTile: React.FC<ServiceTileProps> = ({ title, duration, price, image,  onBookClick }) => {
    return (
        <div className="service-tile">
            <div className="tile-left">
                <img src="/wrench.png" alt="ikona usługi" className="service-image" />
                <div className="service-info">
                    <h3>{title}</h3>
                    <p className="duration">Czas trwania: {duration}</p>
                </div>
            </div>
            <div className="tile-right">
                <span className="price">{price}</span>
                <SecondaryButton onClick={onBookClick}>Umów</SecondaryButton>
            </div>
        </div>
    );
};

export default ServiceTile;
