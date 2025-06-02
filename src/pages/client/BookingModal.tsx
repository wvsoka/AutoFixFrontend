import React, {useEffect, useState} from "react";
import "./BookingModal.css";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import axiosInstance from "../../api/axiosInstance";


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

const BookingModal: React.FC<{ onClose: () => void; serviceName: string; serviceId: number }> = ({ onClose, serviceName, serviceId }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [selected, setSelected] = useState<{ date: string; time: string } | null>(null);
    const [bookingStatus, setBookingStatus] = useState<string | null>(null);
    const [availability, setAvailability] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!serviceId) return;
            const newAvailability: Record<string, string[]> = {};

            for (const date of visibleDates) {
                const formatted = formatDate(date);
                try {
                    const res = await axiosInstance.get(`/api/client/available-timeslots/${serviceId}/${formatted}/`);
                    newAvailability[formatted] = res.data.available_slots;
                } catch (e) {
                    newAvailability[formatted] = [];
                }
            }

            setAvailability(newAvailability);
        };

        fetchAvailability();
    }, [startDate, serviceId]);

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

    const handleConfirm = async () => {
        if (selected && serviceId) {
            try {
                await axiosInstance.post("/api/client/appointments/", {
                    service: serviceId,
                    date: selected.time  // pełny datetime: "2025-05-30T06:30:00"
                });

                setBookingStatus(`Udało Ci się zarezerwować usługę "${serviceName}" dnia ${selected.date} o godzinie ${selected.time}.`);
                setTimeout(() => onClose(), 3000);
            } catch (e: any) {
                console.error("Błąd rezerwacji:", e.response?.data || e.message);
                setBookingStatus("Nie udało się dokonać rezerwacji. Proszę spróbować ponownie.");
            }
        }
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
                        const times = availability[iso] || [];
                        return (
                            <div key={iso} className="day-column">
                                <div className="day-header">
                                    <strong>{getDayLabel(date)}</strong>
                                    <div className="day-date">{date.toLocaleDateString()}</div>
                                </div>
                                {times.length > 0 ? times.map((time) => {
                                    const formattedTime = time.length >= 5 ? time.slice(11, 16) : time; // np. "2025-05-28T06:30:00" -> "06:30"
                                    return (
                                        <button
                                            key={time}
                                            className={`time-button ${selected?.date === iso && selected?.time === time ? "selected" : ""}`}
                                            onClick={() => setSelected({ date: iso, time })}
                                        >
                                            {formattedTime}
                                        </button>
                                    );
                                }) : (
                                    <div className="no-slots">–</div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {selected && (
                    <div className="confirmation">
                        Wybrano: <strong>{selected.date}</strong> o <strong>{selected.time}</strong>
                        <SecondaryButton className="confirm-button-calendar" onClick={handleConfirm}>
                            Potwierdź
                        </SecondaryButton>
                    </div>
                )}

                {bookingStatus && <div className="booking-status">{bookingStatus}</div>} {/* Wyświetlanie komunikatu */}
            </div>
        </div>
    );
};

export default BookingModal;
