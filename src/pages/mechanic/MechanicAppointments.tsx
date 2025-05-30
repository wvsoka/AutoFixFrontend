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

const AppointmentCard = ({
							 appointment,
							 onStatusClick,
						 }: {
	appointment: Appointment;
	onStatusClick: (appointment: Appointment, status: Appointment["status"]) => void;
}) => {
	const parsedDate = dayjs(appointment.date);
	const formattedDate = parsedDate.format("D MMMM YYYY, HH:mm");

	return (
		<div className="border rounded-lg shadow p-4 mb-4 bg-white">
			<div className="flex justify-between items-center">
				<div>
					<h3 className="font-semibold text-lg">
						{appointment.service.name}
						<br />
						{formattedDate}
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
							onClick={() => onStatusClick(appointment, "confirmed")}
						>
							Potwierdź
						</button>
						<button
							className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
							onClick={() => onStatusClick(appointment, "cancelled")}
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
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		appointment: Appointment | null;
		status: Appointment["status"] | null;
	}>({ open: false, appointment: null, status: null });

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				const res = await axiosInstance.get("/api/mechanic/appointments/");
				console.log("API appointments:", res.data);
				setAppointments(res.data);
			} catch (err) {
				console.error("Błąd ładowania wizyt:", err);
				setAppointments([]);
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

	// Wywołaj dialog
	const handleStatusClick = (appointment: Appointment, status: Appointment["status"]) => {
		setConfirmDialog({
			open: true,
			appointment,
			status,
		});
	};

	// Potwierdź lub anuluj w oknie dialogowym
	const handleConfirm = async () => {
		if (confirmDialog.appointment && confirmDialog.status) {
			await handleStatusChange(confirmDialog.appointment.id, confirmDialog.status);
		}
		setConfirmDialog({ open: false, appointment: null, status: null });
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
									onStatusClick={handleStatusClick}
								/>
							))
						) : (
							<p className="text-gray-500">Brak wizyt.</p>
						)}
					</section>
				)
			)}

			{/* MODAL Z POTWIERDZENIEM */}
			{confirmDialog.open && confirmDialog.appointment && (
				<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
					<div className="bg-white rounded shadow-lg p-6 max-w-md w-full">
						<h2 className="text-xl font-bold mb-4">Potwierdzenie akcji</h2>
						<p className="mb-4">
							Czy na pewno chcesz&nbsp;
							{confirmDialog.status === "confirmed" && (
								<>potwierdzić wizytę "{confirmDialog.appointment.service.name}" dla {confirmDialog.appointment.client_user.name} {confirmDialog.appointment.client_user.surname} w dniu {dayjs(confirmDialog.appointment.date).format("D MMMM YYYY, HH:mm")}?</>
							)}
							{confirmDialog.status === "cancelled" && (
								<>odwołać wizytę "{confirmDialog.appointment.service.name}" dla {confirmDialog.appointment.client_user.name} {confirmDialog.appointment.client_user.surname} w dniu {dayjs(confirmDialog.appointment.date).format("D MMMM YYYY, HH:mm")}?</>
							)}
						</p>
						<div className="flex justify-end gap-2">
							<button
								className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
								onClick={() =>
									setConfirmDialog({ open: false, appointment: null, status: null })
								}
							>
								Anuluj
							</button>
							<button
								className={`px-4 py-2 rounded text-white ${confirmDialog.status === "confirmed"
									? "bg-green-600 hover:bg-green-700"
									: "bg-red-600 hover:bg-red-700"
								}`}
								onClick={handleConfirm}
							>
								Tak, {confirmDialog.status === "confirmed" ? "potwierdź" : "odwołaj"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MechanicAppointmentsPage;
