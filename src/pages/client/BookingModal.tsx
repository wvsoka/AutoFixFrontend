import React, { useState } from "react";
import "./BookingModal.css";

const mockAvailability: Record<string, string[]> = {
    "2025-05-20": ["06:20", "06:40"],
    "2025-05-21": ["06:20", "06:40", "07:00", "07:20", "08:20", "09:00", "09:40"],
    "2025-05-22": ["06:00", "06:20", "06:40", "07:00", "07:20", "08:00", "09:20"],
    "2025-05-23": ["06:00", "06:20", "06:40", "07:20", "08:00", "08:40", "09:20"],
};

const days = [
    { label: "Jutro", date: "2025-05-20" },
    { label: "Śr.", date: "2025-05-21" },
    { label: "Czw.", date: "2025-05-22" },
    { label: "Pt.", date: "2025-05-23" },
];

const BookingModal: React.FC<{ onClose: () => void; serviceName: string }> = ({ onClose, serviceName }) => {
    const [selected, setSelected] = useState<{ date: string; time: string } | null>(null);

    return (
        <div className="booking-modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Umów usługę: {serviceName}</h2>

                <div className="time-grid">
                    {days.map((day) => (
                        <div key={day.date} className="day-column">
                            <div className="day-header">
                                <strong>{day.label}</strong>
                                <div className="day-date">{new Date(day.date).toLocaleDateString()}</div>
                            </div>
                            {mockAvailability[day.date]?.map((time) => (
                                <button
                                    key={time}
                                    className={`time-button ${selected?.date === day.date && selected?.time === time ? "selected" : ""}`}
                                    onClick={() => setSelected({ date: day.date, time })}
                                >
                                    {time}
                                </button>
                            )) || <div className="no-slots">–</div>}
                        </div>
                    ))}
                </div>

                {selected && (
                    <div className="confirmation">
                        Wybrano: <strong>{selected.date}</strong> o <strong>{selected.time}</strong>
                        <button className="confirm-button">Potwierdź</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
