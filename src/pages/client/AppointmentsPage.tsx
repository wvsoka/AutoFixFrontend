import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import ClientNavbar from "../../components/navbars/ClientNavbar";
import dayjs from "dayjs";
import "dayjs/locale/pl";
dayjs.locale("pl");

interface Appointment {
    id: number;
    mechanic: string;
    service_name: string;
    date: string;
    status: string;
}

const demoAppointments: Appointment[] = [
	{
		id: 1,
        mechanic: "Love Cars Company",
        service_name: "Wymiana opon",
		date: "2025-05-10T10:00:00",
        status: "completed",
	},
	{
		id: 2,
		mechanic: "MarianFix",
        service_name: "Diagnostyka komputerowa",
		date: "2025-05-21T09:30:00",
        status: "pending",
	},
    {
		id: 3,
		mechanic: "Warsztat Samochodowy Antoni",
        service_name: "Wymiana oleju",
		date: "2025-05-17T12:00:00",
        status: "confirmed",
	},
];

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const parsedDate = dayjs(appointment.date);
    const formattedDate = parsedDate.format("D MMMM YYYY");
    const time = parsedDate.format("HH:mm");
    const day = parsedDate.format("dddd");

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
                        <button className="text-red-600 hover:underline">Odwołaj</button>
                    </div>
                )}
                {appointment.status === "completed" && (
                    <button className="text-blue-600 hover:underline">Dodaj opinię</button>
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
