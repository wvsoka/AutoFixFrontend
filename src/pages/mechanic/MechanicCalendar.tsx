import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Event as CalendarEvent, Views, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axiosInstance from "../../api/axiosInstance";
import { pl } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";

interface CalendarExtendedEvent extends CalendarEvent {
	id: string;
	type: "working" | "appointment";
	originalId?: number;
	status?: string;
	title: string;
}


const locales = { pl };
const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
	getDay,
	locales,
});

interface Appointment {
	id: number;
	client_user: string | { name: string; surname: string; phone: string; };
	service: {
		id: number;
		mechanic: number;
		name: string;
		price: string;
		duration: string;
	};
	date: string;
	status: string;
}

interface WorkingHour {
	id: number,
	day_of_the_week: string;
	open_time: string;
	close_time: string;
}

export const MechanicCalendar = () => {
	const [events, setEvents] = useState<CalendarExtendedEvent[]>([]);
	const [view, setView] = useState<View>(Views.WEEK);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [backgroundEvents, setBackgroundEvents] = useState<CalendarExtendedEvent[]>([]);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [appointmentsRes, workingHoursRes] = await Promise.all([
					axiosInstance.get("/api/mechanic/appointments/"),
					axiosInstance.get("/api/mechanic/working-hours/"),
				]);

				// Mapowanie wizyt (Appointment)
				const appointmentEvents = appointmentsRes.data.map((a: Appointment) => {
					const service = a.service;
					if (!service) return null;

					const [hours, minutes, seconds] = service.duration.split(":").map(Number);

					const start = new Date(a.date);
					const end = new Date(start.getTime() + (hours * 3600 + minutes * 60 + seconds) * 1000);

					return {
						id: `appointment-${a.id}`,
						title: `${service.name}`,
						start,
						end,
						type: "appointment",
						originalId: a.id,
						status: a.status,
					} as CalendarExtendedEvent;
				}).filter(Boolean);

				// Mapowanie godzin pracy
				const today = new Date();
				const weekStart = startOfWeek(today, { weekStartsOn: 1 });
				const daysMap: Record<string, number> = {
					monday: 0,
					tuesday: 1,
					wednesday: 2,
					thursday: 3,
					friday: 4,
					saturday: 5,
					sunday: 6,
				};

				const workingEvents = workingHoursRes.data.map((wh: WorkingHour) => {
					const dayOffset = daysMap[wh.day_of_the_week.toLowerCase()];
					const baseDate = new Date(weekStart);
					baseDate.setDate(baseDate.getDate() + dayOffset);

					const [sh, sm] = wh.open_time.split(":").map(Number);
					const [eh, em] = wh.close_time.split(":").map(Number);

					const start = new Date(baseDate);
					start.setHours(sh, sm, 0);

					const end = new Date(baseDate);
					end.setHours(eh, em, 0);

					const recurringEvents = [];
					for (let i = 0; i < 8; i++) {
						const recurringStart = new Date(start);
						const recurringEnd = new Date(end);
						recurringStart.setDate(recurringStart.getDate() + i * 7);
						recurringEnd.setDate(recurringEnd.getDate() + i * 7);

						recurringEvents.push({
							id: `working-${wh.day_of_the_week}-week-${i}`,
							title: "Dostępność",
							start: recurringStart,
							end: recurringEnd,
							allDay: false,
							type: "working",
						} as CalendarExtendedEvent);
					}
					return recurringEvents;
				}).flat();

				setEvents([...appointmentEvents]);
				setBackgroundEvents([...workingEvents]);

			} catch (err) {
				console.error("Błąd ładowania kalendarza:", err);
			}
		};
		fetchData();
	}, []);

	const handleSelectEvent = async (event: CalendarExtendedEvent) => {
		if (event.type === "appointment" && event.status === "pending") {
			const confirm = window.confirm(`${event.title} - ${event.start?.toLocaleString()}\nPotwierdzić wizytę?`);
			if (confirm) {
				try {
					await axiosInstance.patch(`/api/mechanic/appointments/${event.originalId}/update-status/`, {
						status: "confirmed",
					});
					setEvents((prev) =>
						prev.map((e) =>
							e.id === event.id
								? { ...e, status: "confirmed" }
								: e
						)
					);
				} catch (err) {
					alert("Błąd podczas aktualizacji statusu.");
				}
			}
		} else if (event.type === "appointment") {
			alert(`Szczegóły wizyty:\n${event.title} (${event.status})\nTermin: ${event.start?.toLocaleString()}`);
		}
	};


	const getEventColor = (event: CalendarExtendedEvent) => {
		if (event.type === "working") {
			return { style: { backgroundColor: "#e5e7eb", color: "#000" } }; // jasny szary
		}
		switch (event.status) {
			case "pending":
				return { style: { backgroundColor: "#3B82F6", color: "#fff" } };   // niebieski
			case "confirmed":
				return { style: { backgroundColor: "#22C55E", color: "#fff" } };   // zielony
			case "cancelled":
				return { style: { backgroundColor: "#EF4444", color: "#fff" } };   // czerwony
			case "completed":
				return { style: { backgroundColor: "#6B7280", color: "#fff" } };   // szary
			default:
				return { style: { backgroundColor: "#e5e7eb", color: "#000" } };   // domyślny jasny szary
		}
	};

	return (
		<div className="p-2 md:p-4 w-full overflow-x-auto">
			<div className="flex flex-col items-center md:flex-row md:justify-between md:items-center mb-4 gap-2">
				<h2 className="text-2xl font-semibold text-center md:text-left">Kalendarz mechanika</h2>
				<SecondaryButton
					className="w-auto self-center md:self-auto"
					onClick={() => navigate("/mechanic/appointments")}
				>
					Zarządzaj wizytami
				</SecondaryButton>
			</div>

			<div className="w-full overflow-x-auto">
				<div className="min-w-[700px] md:min-w-0">
					<Calendar
						localizer={localizer}
						events={events}
						backgroundEvents={backgroundEvents}
						startAccessor="start"
						endAccessor="end"
						step={30}
						timeslots={2}
						style={{ height: 1000 }}
						min={new Date(1970, 1, 1, 6, 0)}
						max={new Date(1970, 1, 1, 21, 0)}
						onSelectEvent={handleSelectEvent}
						eventPropGetter={(event: CalendarExtendedEvent) => getEventColor(event)}
						views={['month', 'week', 'day']}
						view={view}
						onView={(newView) => setView(newView)}
						date={currentDate}
						onNavigate={(newDate) => setCurrentDate(newDate)}
					/>
				</div>
			</div>
		</div>
	);

};
