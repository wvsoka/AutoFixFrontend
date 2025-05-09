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
  customer_name: string;
  date: string;
  duration_minutes: number;
  status: string;
}

interface WorkingHour {
  id: number;
  day: string; // e.g. 'MONDAY'
  start_time: string; // '08:00:00'
  end_time: string;   // '16:00:00'
}

export const MechanicCalendar = () => {
  const [events, setEvents] = useState<CalendarExtendedEvent[]>([]);
  const [view, setView] = useState<View>(Views.WEEK);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, workingHoursRes] = await Promise.all([
          axiosInstance.get("/api/mechanic/appointments/"),
          axiosInstance.get("/api/mechanic/working-hours/"),
        ]);

        console.log("Appointments:", appointmentsRes.data);
        console.log("Working Hours:", workingHoursRes.data);

        const appointmentEvents = appointmentsRes.data.map((a: Appointment) => {
          //const start = new Date(a.datetime);
          //const end = new Date(start.getTime() + a.duration_minutes * 60000);
		  console.log("Start:", a.date);

			const start = new Date(2025, 4, 10, 10, 0, 0);
			console.log("Manually created start date:", start);

			const end = new Date(2025, 4, 10, 11, 30, 0);
			console.log("Manually created end date:", end);

          return {
            id: `appointment-${a.id}`,
            title: `${a.customer_name} (${a.status})`,
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
            id: `working-${wh.id}`,
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
	  case "canceled":
		return { style: { backgroundColor: "#e11d48" } }; // Czerwony??idk czy to
	  default:
		return { style: { backgroundColor: "#cbd5e1" } }; // Szary (domyślnie)
	}
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Kalendarz mechanika</h2>

      {/* Kontrolki do przełączania widoków */}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setView(Views.WEEK)}
          className={`p-2 ${view === Views.WEEK ? 'bg-blue-500' : 'bg-gray-300'} text-white rounded-md`}
        >
          Tydzień
        </button>
        <button
          onClick={() => setView(Views.MONTH)}
          className={`p-2 ${view === Views.MONTH ? 'bg-blue-500' : 'bg-gray-300'} text-white rounded-md`}
        >
          Miesiąc
        </button>
        <button
          onClick={() => setView(Views.DAY)}
          className={`p-2 ${view === Views.DAY ? 'bg-blue-500' : 'bg-gray-300'} text-white rounded-md`}
        >
          Dzień
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={(event: CalendarExtendedEvent) => getEventColor(event)}  // Używamy funkcji getEventColor
        views={['month', 'week', 'day']}
        view={view}
        onView={(newView) => setView(newView)}
      />
    </div>
  );
};
