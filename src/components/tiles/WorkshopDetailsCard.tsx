import React from "react";
import "./WorkshopDetailsCard.css";

interface OpeningHour {
    day: string;
    hours: string;
    isClosed?: boolean;
}

interface WorkshopDetailsCardProps {
    name: string;
    description: string;
    openingHours: OpeningHour[];
}

const WorkshopDetailsCard: React.FC<WorkshopDetailsCardProps> = ({ name, description, openingHours }) => {
    return (
        <div className="workshop-details-card">
            <h3>{name}</h3>
            <p className="description">{description}</p>

            <h4>Godziny otwarcia</h4>
            <ul className="opening-hours">
                {openingHours.map((entry, index) => (
                    <li key={index}>
                        <span className={`day ${entry.isClosed ? 'red' : 'green'}`}>{entry.day}</span>
                        <span>{entry.hours}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WorkshopDetailsCard;
