import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import dayjs from "dayjs";
import "dayjs/locale/pl";
dayjs.locale("pl");

interface Appointment {
	id: number;
	client_user: {
		id: number;
        email: string;
		name: string;
		surname: string;
        phone: string;
	};
	service: {
		id: number;
		name: string;
	};
	date: string;
	status: "pending" | "confirmed" | "cancelled" | "completed";
}

const demoAppointments: Appointment[] = [
	{
		id: 1,
		date: "2025-05-21T10:00:00",
		status: "pending",
		client_user: {
			id: 1,
			email: "jan.kowalski@example.com",
			name: "Jan",
			surname: "Kowalski",
			phone: "123456789",
		},
		service: {
			id: 101,
			name: "Wymiana oleju",
		},
	},
	{
		id: 2,
		date: "2025-05-22T14:00:00",
		status: "confirmed",
		client_user: {
			id: 2,
			email: "anna.nowak@example.com",
			name: "Anna",
			surname: "Nowak",
			phone: "987654321",
		},
		service: {
			id: 102,
			name: "Serwis klimatyzacji",
		},
	},
	{
		id: 3,
		date: "2025-05-19T09:00:00",
		status: "cancelled",
		client_user: {
			id: 3,
			email: "piotr.w@example.com",
			name: "Piotr",
			surname: "Wiśniewski",
			phone: "555666777",
		},
		service: {
			id: 103,
			name: "Diagnostyka komputerowa",
		},
	},
];

const AppointmentCard = ({
	appointment,
	onStatusChange,
}: {
	appointment: Appointment;
	onStatusChange: (id: number, status: Appointment["status"]) => void;
}) => {
	const parsedDate = dayjs(appointment.date);
	const formattedDate = parsedDate.format("D MMMM YYYY, HH:mm");

	return (
		<div className="border rounded-lg shadow p-4 mb-4 bg-white">
			<div className="flex justify-between items-center">
				<div>
					<h3 className="font-semibold text-lg">
						{appointment.service.name}
                        <br/ >{formattedDate}
					</h3>
					<p className="text-sm text-gray-600">
                        {appointment.client_user.name} {appointment.client_user.surname}
					</p>
					<p className="text-sm text-gray-500">
						Tel: {appointment.client_user.phone}
					</p>
				</div>

				{appointment.status === "pending" && (
					<div className="flex gap-2">
						<button
							className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
							onClick={() => onStatusChange(appointment.id, "confirmed")}
						>
							Potwierdź
						</button>
						<button
							className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
							onClick={() => onStatusChange(appointment.id, "cancelled")}
						>
							Odwołaj
						</button>
					</div>
				)}

				{appointment.status === "confirmed" && (
					<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
						Potwierdzona
					</span>
				)}

				{appointment.status === "cancelled" && (
					<span className="px-3 py-1 bg-gray-200 text-gray-600 rounded text-sm">
						Odwołana
					</span>
				)}

				{appointment.status === "completed" && (
					<span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
						Zakończona
					</span>
				)}
			</div>
		</div>
	);
};

const MechanicAppointmentsPage = () => {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				const res = await axiosInstance.get("/api/mechanic/appointments/");
				setAppointments([...res.data, ...demoAppointments]);
			} catch (err) {
				console.error("Błąd ładowania wizyt:", err);
				setAppointments(demoAppointments); // fallback
			} finally {
				setLoading(false);
			}
		};
		fetchAppointments();
	}, []);

	const handleStatusChange = async (id: number, newStatus: Appointment["status"]) => {
		try {
			await axiosInstance.patch(`/api/mechanic/appointments/${id}/update-status/`, {
				status: newStatus,
			});
			setAppointments((prev) =>
				prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
			);
		} catch (e) {
			alert("Nie udało się zmienić statusu.");
		}
	};

	const grouped = {
		confirmed: appointments.filter((a) => a.status === "confirmed"),
		pending: appointments.filter((a) => a.status === "pending"),
		cancelled: appointments.filter((a) => a.status === "cancelled"),
		completed: appointments.filter((a) => a.status === "completed"),
	};

	if (loading) return <div className="p-6">Ładowanie wizyt...</div>;

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Wizyty klientów</h1>

			{(["pending", "confirmed", "completed", "cancelled"] as Appointment["status"][]).map(
				(status) => (
					<section className="mb-6" key={status}>
						<h2 className="text-xl font-semibold mb-2 capitalize">
							{status === "pending" && "Oczekujące"}
							{status === "confirmed" && "Potwierdzone"}
							{status === "completed" && "Zakończone"}
							{status === "cancelled" && "Odwołane"}
						</h2>

						{grouped[status].length > 0 ? (
							grouped[status].map((a) => (
								<AppointmentCard
									key={a.id}
									appointment={a}
									onStatusChange={handleStatusChange}
								/>
							))
						) : (
							<p className="text-gray-500">Brak wizyt.</p>
						)}
					</section>
				)
			)}
		</div>
	);
};

export default MechanicAppointmentsPage;