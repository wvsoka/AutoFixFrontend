import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import ClientNavbar from "../../components/navbars/ClientNavbar";
import dayjs from "dayjs";
import "dayjs/locale/pl";
dayjs.locale("pl");

interface Appointment {
    id: number;
    mechanic: string;
    service: {
        id: number;
    }
    service_name: string;
    date: string;
    status: string;
}

const demoAppointments: Appointment[] = [
	{
		id: 1001,
        mechanic: "Love Cars Company",
        service: {
            id: 0,
        },
        service_name: "Wymiana opon",
		date: "2025-05-16T10:00:00",
        status: "completed",
	},
	{
		id: 2002,
		mechanic: "MarianFix",
        service: {
            id: 0,
        },
        service_name: "Diagnostyka komputerowa",
		date: "2025-05-21T09:30:00",
        status: "pending",
	},
    {
		id: 3003,
		mechanic: "Warsztat Samochodowy Antoni Piekarz",
        service: {
            id: 0,
        },
        service_name: "Wymiana oleju",
		date: "2025-05-28T12:00:00",
        status: "confirmed",
	},
];

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const parsedDate = dayjs(appointment.date);
    const formattedDate = parsedDate.format("D MMMM YYYY");
    const time = parsedDate.format("HH:mm");
    const day = parsedDate.format("dddd");

    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        try {
            await axiosInstance.post(`/api/reviews/service/${appointment.service.id}/reviews/`, {
                service_id: appointment.service.id,
                data: {
                    note: rating,
                    content: comment,
                },
            });

            alert('Dziękujemy za opinię!');
            setShowModal(false);
            setRating(5);
            setComment('');
        } catch (err) {
            alert('Błąd podczas dodawania opinii');
            console.error(err);
        }
    };

    return (
        <div className="border rounded-2xl shadow-sm p-4 mb-4 bg-white">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full" />
                <div>
                    <h3 className="text-lg font-semibold">{appointment.mechanic}</h3>
                    <p className="text-sm text-gray-500">{appointment.service_name}</p>
                </div>
            </div>
            <div className="mt-3 flex justify-between items-center text-sm">
                <p>
                    {formattedDate} <br />
                    {time}, {day}
                </p>
                {appointment.status === "confirmed" && (
                    <div className="space-x-2">
                        <button className="text-blue-600 hover:underline">Przełóż</button>
                        <button className="text-red-600 hover:underline"
                            onClick={async () => {
                                if (!window.confirm("Czy na pewno odwołać wizytę?")) return;
                                try {
                                  await axiosInstance.patch(`/api/client/appointments/cancel/${appointment.id}/`, {
                                    status: 'cancelled'
                                  });
                                  alert("Wizyta została odwołana");
                                } catch (e) {
                                  alert("Nie udało się odwołać wizyty");
                                }
                              }}
                        >Odwołaj
                        </button>
                    </div>
                )}
                {appointment.status === "completed" && (
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setShowModal(true)}
                    >Dodaj opinię
                    </button>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Dodaj opinię</h2>
                
                        <label className="block mb-2">
                            Ocena:
                            <select
                                className="w-full mt-1 border rounded p-2"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                            >
                            {[5, 4, 3, 2, 1].map((val) => (
                                <option key={val} value={val}>
                                    {val} ★
                                </option>
                            ))}
                            </select>
                        </label>
                            
                        <label className="block mb-4">
                            Opinia:
                            <textarea
                                className="w-full mt-1 border rounded p-2"
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </label>

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowModal(false)}
                            >
                            Anuluj
                            </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    onClick={handleSubmit}
                                >
                                Wyślij
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance
        .get<Appointment[]>("/api/client/appointments/list/")
        .then((res) => {
            const merged = [...res.data, ...demoAppointments];  // add mocked data for now
            setAppointments(merged)
        })
        .catch((err) => console.error("Błąd podczas pobierania danych:", err))
        .finally(() => setLoading(false));
    }, []);

    const filterByStatus = (status: Appointment["status"]) =>
        appointments.filter((a) => a.status === status);

    if (loading)
        return <div className="p-6">Ładowanie wizyt...</div>;

    return (
        <div>
            <ClientNavbar/>
        <div className="p-6 max-w-2xl mx-auto">
        <section>
            <h2 className="text-xl font-bold mb-2">Potwierdzone wizyty</h2>
            {filterByStatus("confirmed").map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
            ))}
        </section>

        <section className="mt-6">
            <h2 className="text-xl font-bold mb-2">Oczekujące wizyty</h2>
            {filterByStatus("pending").map((a) => (
                <AppointmentCard key={a.id} appointment={a} />
            ))}
        </section>

        <section className="mt-6">
            <h2 className="text-xl font-bold mb-2">Zakończone wizyty</h2>
            {filterByStatus("completed").map((a) => (
                <AppointmentCard key={a.id} appointment={a} />
            ))}
        </section>
        </div>
    </div>
  );
};

export default AppointmentsPage;
