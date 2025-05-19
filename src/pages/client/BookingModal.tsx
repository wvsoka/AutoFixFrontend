import React, { useState } from "react";
import "./BookingModal.css";
import {SecondaryButton} from "../../components/buttons/SecondaryButton";

const mockAvailability: Record<string, string[]> = {
    "2025-05-20": ["06:20", "06:40"],
    "2025-05-21": ["06:20", "06:40", "07:00", "07:20", "08:20", "09:00", "09:40"],
    "2025-05-22": ["06:00", "06:20", "06:40", "07:00", "07:20", "08:00", "09:20"],
    "2025-05-23": ["06:00", "06:20", "06:40", "07:20", "08:00", "08:40", "09:20"],
    "2025-05-24": ["07:00", "07:30"],
    "2025-05-25": ["08:00"],
    "2025-05-26": ["06:00", "07:00"],
};

const getDayLabel = (date: Date): string => {
    const labels: Record<number, string> = {
        0: "Nd.",
        1: "Pon.",
        2: "Wt.",
        3: "Śr.",
        4: "Czw.",
        5: "Pt.",
        6: "Sob.",
    };
    return labels[date.getDay()];
};

const BookingModal: React.FC<{ onClose: () => void; serviceName: string }> = ({ onClose, serviceName }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [selected, setSelected] = useState<{ date: string; time: string } | null>(null);

    const visibleDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return date;
    });

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const nextDays = () => {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + 7);
        setStartDate(newDate);
    };

    const prevDays = () => {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() - 7);
        setStartDate(newDate);
    };

    return (
        <div className="booking-modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Umów usługę: {serviceName}</h2>

                <div className="navigation">
                    <button onClick={prevDays}>← Poprzedni tydzień</button>
                    <span>Wybierz termin</span>
                    <button onClick={nextDays}>Następny tydzień →</button>
                </div>

                <div className="time-grid">
                    {visibleDates.map((date) => {
                        const iso = formatDate(date);
                        const times = mockAvailability[iso] || [];
                        return (
                            <div key={iso} className="day-column">
                                <div className="day-header">
                                    <strong>{getDayLabel(date)}</strong>
                                    <div className="day-date">{date.toLocaleDateString()}</div>
                                </div>
                                {times.length > 0 ? times.map((time) => (
                                    <button
                                        key={time}
                                        className={`time-button ${selected?.date === iso && selected?.time === time ? "selected" : ""}`}
                                        onClick={() => setSelected({ date: iso, time })}
                                    >
                                        {time}
                                    </button>
                                )) : (
                                    <div className="no-slots">–</div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {selected && (
                    <div className="confirmation">
                        Wybrano: <strong>{selected.date}</strong> o <strong>{selected.time}</strong>
                        <SecondaryButton className="confirm-button-calendar">Potwierdź</SecondaryButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
