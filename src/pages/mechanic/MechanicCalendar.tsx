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
  datetime: string;
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
  const [view, setView] = useState<View>(Views.WEEK); // Ustawiamy View na odpowiedni typ

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
          const start = new Date(a.datetime);
          const end = new Date(start.getTime() + a.duration_minutes * 60000);
          return {
            id: `appointment-${a.id}`,  // Dodajemy 'id' typu string
            title: `${a.customer_name} (${a.status})`,
            start,
            end,
            type: "appointment", // Dodajemy 'type'
            originalId: a.id,
            status: a.status,
          } as CalendarExtendedEvent; // Rzutowanie na CalendarExtendedEvent
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
            id: `working-${wh.id}`,  // Dodajemy 'id' typu string
            title: "Dostępność",
            start,
            end,
            allDay: false,
            type: "working", // Dodajemy 'type'
          } as CalendarExtendedEvent; // Rzutowanie na CalendarExtendedEvent
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
              e.id === event.id // Teraz 'id' jest dostępne
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
        eventPropGetter={(event: CalendarExtendedEvent) => {
          const bg = event.type === "appointment"
            ? event.status === "CONFIRMED"
              ? "#60a5fa"
              : "#facc15"
            : "#cbd5e1";
          return { style: { backgroundColor: bg } };
        }}
        views={['month', 'week', 'day']} // Możesz dodać inne widoki, takie jak "agenda", jeśli chcesz
        view={view} // Ustawiamy widok na podstawie stanu
        onView={(newView) => setView(newView)} // Przełączanie widoków
      />
    </div>
  );
};
