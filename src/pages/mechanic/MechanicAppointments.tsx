import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import dayjs from "dayjs";
import "dayjs/locale/pl";
dayjs.locale("pl");

interface Appointment {
	id: number;
	client_user: {
		id: number;
		name: string;
		surname: string;
	};
	service: {
		id: number;
		name: string;
	};
	date: string;
	status: "pending" | "confirmed" | "cancelled" | "completed";
}

const AppointmentCard = ({
	appointment,
	onStatusChange,
}: {
	appointment: Appointment;
	onStatusChange: (id: number, status: string) => void;
}) => {
	const parsedDate = dayjs(appointment.date);
	const formattedDate = parsedDate.format("D MMMM YYYY");
	const time = parsedDate.format("HH:mm");
	const day = parsedDate.format("dddd");

	const handleConfirm = async () => {
		try {
			await axiosInstance.patch(
				`/api/mechanic/appointments/${appointment.id}/update-status/`,
				{ status: "confirmed" }
			);
			onStatusChange(appointment.id, "confirmed");
		} catch (err) {
			alert("Błąd przy potwierdzaniu wizyty.");
		}
	};

	const handleCancel = async () => {
		if (!window.confirm("Czy na pewno odwołać wizytę?")) return;
		try {
			await axiosInstance.patch(
				`/api/mechanic/appointments/${appointment.id}/update-status/`,
				{ status: "cancelled" }
			);
			onStatusChange(appointment.id, "cancelled");
		} catch (err) {
			alert("Błąd przy odwoływaniu wizyty.");
		}
	};

	return (
		<div className="border rounded-2xl shadow-sm p-4 mb-4 bg-white">
			<div className="flex justify-between">
				<div>
					<h3 className="text-lg font-semibold">
						{appointment.client_user.name} {appointment.client_user.surname}
					</h3>
					<p className="text-sm text-gray-500">{appointment.service.name}</p>
					<p className="text-sm mt-1">
						{formattedDate}, {day} — {time}
					</p>
				</div>
				<div className="text-sm flex flex-col justify-between items-end">
					<span
						className="px-2 py-1 rounded-full text-white text-xs mb-2"
						style={{
							backgroundColor:
								appointment.status === "confirmed"
									? "#4ade80"
									: appointment.status === "pending"
									? "#facc15"
									: "#f87171",
						}}
					>
						{appointment.status}
					</span>

					{appointment.status === "pending" && (
						<div className="space-x-2">
							<button
								className="text-green-600 hover:underline"
								onClick={handleConfirm}
							>
								Potwierdź
							</button>
							<button
								className="text-red-600 hover:underline"
								onClick={handleCancel}
							>
								Odwołaj
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const MechanicAppointments = () => {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axiosInstance
			.get<Appointment[]>("/api/mechanic/appointments/")
			.then((res) => {
				setAppointments(res.data);
			})
			.catch((err) => {
				console.error("Błąd podczas pobierania wizyt:", err);
			})
			.finally(() => setLoading(false));
	}, []);

	const handleStatusChange = (id: number, newStatus: string) => {
		setAppointments((prev) =>
			prev.map((a) =>
				a.id === id ? { ...a, status: newStatus as Appointment["status"] } : a
			)
		);
	};

	const filterByStatus = (status: Appointment["status"]) =>
		appointments.filter((a) => a.status === status);

	if (loading) return <div className="p-6">Ładowanie wizyt...</div>;

	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Wizyty klientów</h1>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3">Potwierdzone</h2>
				{filterByStatus("confirmed").map((a) => (
					<AppointmentCard
						key={a.id}
						appointment={a}
						onStatusChange={handleStatusChange}
					/>
				))}
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3">Oczekujące</h2>
				{filterByStatus("pending").map((a) => (
					<AppointmentCard
						key={a.id}
						appointment={a}
						onStatusChange={handleStatusChange}
					/>
				))}
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3">Odwołane</h2>
				{filterByStatus("cancelled").map((a) => (
					<AppointmentCard
						key={a.id}
						appointment={a}
						onStatusChange={handleStatusChange}
					/>
				))}
			</section>
		</div>
	);
};

export default MechanicAppointments;