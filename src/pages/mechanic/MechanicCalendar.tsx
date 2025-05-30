import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Event as CalendarEvent, Views, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axiosInstance from "../../api/axiosInstance";
import { pl } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {SecondaryButton} from "../../components/buttons/SecondaryButton";

interface CalendarExtendedEvent extends CalendarEvent {
  	id: string;
  	type: "working" | "appointment";
  	originalId?: number;
  	status?: string;
  	title: string;
}

/* Some demo events to show calendar's functionality. */
const demoEvents: CalendarExtendedEvent[] = [
	{
	  	id: "demo-1",
	  	type: "appointment",
	  	title: "Wymiana klocków hamulcowych",
		start: new Date("2025-05-21T10:00:00"),
		end: new Date("2025-05-21T11:30:00"),
	  	status: "confirmed",
	},
	{
	  	id: "demo-2",
		type: "appointment",
	  	title: "Serwis klimatyzacji",
		start: new Date("2025-05-20T13:30:00"),
		end: new Date("2025-05-20T14:30:00"),
	  	status: "pending",
	},
	{
		id: "demo-3",
	  	type: "appointment",
		title: "Wymiana oleju",
	  	start: new Date("2025-05-22T13:00:00"),
	  	end: new Date("2025-05-22T13:30:00"),
		status: "confirmed",
  },
];

const demoWorkingEvents: CalendarExtendedEvent[] = [
	{
		id: "demo-working-1",
		type: "working",
		title: "Dostępność",
		start: new Date("2025-05-14T09:00:00"),
		end: new Date("2025-05-14T16:00:00"),
	},
	{
		id: "demo-working-2",
		type: "working",
		title: "Dostępność",
		start: new Date("2025-05-13T08:00:00"),
		end: new Date("2025-05-13T16:00:00"),
	},
];


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
  	client_user: string;
	service: number;
  	date: string;
  	status: string;
}

interface Service {
	id: number;
	mechanic: number;
	name: string;
	price: string;
	duration: string;  //"HH:MM:SS"
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
        	const [appointmentsRes, workingHoursRes, servicesList] = await Promise.all([
          		axiosInstance.get("/api/mechanic/appointments/"),
          		axiosInstance.get("/api/mechanic/working-hours/"),
				axiosInstance.get("/api/mechanic/services/"),
        	]);

        	console.log("Appointments:", appointmentsRes.data);
			console.log("Services:", servicesList.data);

			//  Mapping appointments.
        	const appointmentEvents = appointmentsRes.data.map((a: Appointment) => {
				const service: Service = servicesList.data.find((s: Service) => s.id === a.service);
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
        	});

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

			// Mapping working hours.
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
				
				// Create a new event for this working day and make it repeat every week
				const recurringEvents = [];
				for (let i = 0; i < 8; i++) {
					const recurringStart = new Date(start);
					const recurringEnd = new Date(end);

					// Shift the start and end times by each week
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

        	setEvents([...appointmentEvents, ...demoEvents]);
			setBackgroundEvents([...workingEvents, ...demoWorkingEvents]);

      	} catch (err) {
        	console.error("Błąd ładowania kalendarza:", err);
      	}
    	};
    	fetchData();
  	}, []);

  	const handleSelectEvent = async (event: CalendarExtendedEvent) => {
    	if (event.type === "appointment" && event.status !== "confirmed") {
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
			return { style: { backgroundColor: "#d4dbe3" } };
		}

		switch (event.status) {
	  		case "confirmed":
				return { style: { backgroundColor: "#60a5fa" } };  // blue
	  		case "pending":
				return { style: { backgroundColor: "#facc15" } };  // yellow
	  		default:
				return { style: { backgroundColor: "#d4dbe3" } };
		}
  	};

  	return (
    	<div className="p-4">
      		<div className="flex justify-between items-center mb-4">
  				<h2 className="text-2xl font-semibold">Kalendarz mechanika</h2>
  				<SecondaryButton
    				onClick={() => navigate("/mechanic/appointments")}
  				>Zarządzaj wizytami
  				</SecondaryButton>
			</div>

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
  	);
};
