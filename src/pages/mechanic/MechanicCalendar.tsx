import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Event as CalendarEvent, Views, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axiosInstance from "../../api/axiosInstance";
import { pl } from "date-fns/locale";


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
	duration: string;  // w formacie "HH:MM:SS"
}

interface WorkingHour {
  	d: number;
  	day: string;
  	start_time: string;
  	end_time: string;
}

export const MechanicCalendar = () => {
  	const [events, setEvents] = useState<CalendarExtendedEvent[]>([]);
  	const [view, setView] = useState<View>(Views.WEEK);
	const [currentDate, setCurrentDate] = useState(new Date());

  	useEffect(() => {
    	const fetchData = async () => {
      	try {
        	const [appointmentsRes, workingHoursRes, servicesList] = await Promise.all([
          		axiosInstance.get("/api/mechanic/appointments/"),
          		axiosInstance.get("/api/mechanic/working-hours/"),
				axiosInstance.get("/api/mechanic/services/"),
        	]);

        	console.log("Appointments:", appointmentsRes.data);
        	console.log("Working Hours:", workingHoursRes.data);
			console.log("Services:", servicesList.data);

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
          		MONDAY: 0,
         		TUESDAY: 1,
          		WEDNESDAY: 2,
          		THURSDAY: 3,
          		FRIDAY: 4,
          		SATURDAY: 5,
          		SUNDAY: 6,
        	};

        	// Mapowanie wydarzeń związanych z godzinami pracy
        	const workingEvents = workingHoursRes.data.map((wh: WorkingHour) => {
          		const dayOffset = daysMap[wh.day];
          		const baseDate = new Date(weekStart);
          		baseDate.setDate(baseDate.getDate() + dayOffset);

          		const [sh, sm] = wh.start_time.split(":").map(Number);
          		const [eh, em] = wh.end_time.split(":").map(Number);

          		const start = new Date(baseDate);
          		start.setHours(sh, sm, 0);

          		const end = new Date(baseDate);
          		end.setHours(eh, em, 0);

          		return {
            		id: `working`,
            		title: "Dostępność",
            		start,
            		end,
            		allDay: false,
            		type: "working",
          		} as CalendarExtendedEvent;
        	});

        	setEvents([...workingEvents, ...appointmentEvents]);
      	} catch (err) {
        	console.error("Błąd ładowania kalendarza:", err);
      	}
    	};
    	fetchData();
  	}, []);

  	const handleSelectEvent = async (event: CalendarExtendedEvent) => {
    	if (event.type === "appointment" && event.status !== "CONFIRMED") {
    	  	const confirm = window.confirm(`Potwierdzić wizytę "${event.title}"?`);
    	  	if (confirm) {
    	    	try {
    	      		await axiosInstance.patch(`/api/mechanic/appointments/${event.originalId}/update-status/`, {
    	        	status: "CONFIRMED",
    	      	});
    	      	setEvents((prev) =>
    	        	prev.map((e) =>
    	          		e.id === event.id
    	            	? { ...e, title: e.title.replace(/\(.*?\)/, "(CONFIRMED)"), status: "CONFIRMED" }
    	            	: e
    	        	)
    	      	);
    	    	} catch (err) {
    	      		alert("Błąd podczas aktualizacji statusu.");
    	    	}
    	  	}
    	}
  	};

	const getEventColor = (event: CalendarExtendedEvent) => {
		switch (event.status) {
	  		case "confirmed":
				return { style: { backgroundColor: "#60a5fa" } }; // Niebieski
	  		case "pending":
				return { style: { backgroundColor: "#facc15" } }; // Żółty
	  		default:
				return { style: { backgroundColor: "#cbd5e1" } };
		}
  	};

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Kalendarz mechanika</h2>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
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
