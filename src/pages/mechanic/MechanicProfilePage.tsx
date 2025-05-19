import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { InputField } from "../../components/forms/InputField";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { MechanicSidebar } from "../../components/sidebars/MechanicSidebar";
import { FiMapPin, FiPhone, FiClock, FiHome, FiInfo } from "react-icons/fi";

const days = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"];

export const MechanicProfilePage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        zip_code: "",
        phone: "",
        description: "",
        opening_hours: days.reduce((acc, day) => {
            acc[day] = { open: "", close: "", id: null };
            return acc;
        }, {} as Record<string, { open: string; close: string; id: number | null }>),
    });
    const [mechanicInfo, setMechanicInfo] = useState({ full_name: "", email: "" });
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        axiosInstance.get("/api/mechanic/me/")
            .then(res => {
                const data = res.data;
                setFormData(prev => ({ ...prev, ...data }));
                setMechanicInfo({ full_name: data.full_name || "", email: data.email || "" });
            })
            .catch(() => setError("Nie udało się załadować danych mechanika."));

        axiosInstance.get("/api/mechanic/working-hours/")
            .then(res => {
                const updatedHours = { ...formData.opening_hours };
                const reverseDayMap: Record<string, string> = {
                    monday: "poniedziałek",
                    tuesday: "wtorek",
                    wednesday: "środa",
                    thursday: "czwartek",
                    friday: "piątek",
                    saturday: "sobota",
                    sunday: "niedziela",
                };
                res.data.forEach((entry: any) => {
                    const plDay = reverseDayMap[entry.day_of_the_week];
                    if (plDay) {
                        updatedHours[plDay] = {
                            open: entry.open_time.slice(0, 5),
                            close: entry.close_time.slice(0, 5),
                            id: entry.id,
                        };
                    }
                });
                setFormData(prev => ({ ...prev, opening_hours: updatedHours }));
            })
            .catch(() => setError("Nie udało się załadować godzin otwarcia."));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleHourChange = (day: string, field: "open" | "close", value: string) => {
        setFormData(prev => ({
            ...prev,
            opening_hours: {
                ...prev.opening_hours,
                [day]: { ...prev.opening_hours[day], [field]: value },
            },
        }));
    };

    const dayMap: Record<string, string> = {
        poniedziałek: "monday",
        wtorek: "tuesday",
        środa: "wednesday",
        czwartek: "thursday",
        piątek: "friday",
        sobota: "saturday",
        niedziela: "sunday",
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.patch("/api/mechanic/me/", {
                name: formData.name,
                address: formData.address,
                city: formData.city,
                zip_code: formData.zip_code,
                phone: formData.phone,
                description: formData.description,
            });
            const promises = days.map(day => {
                const hour = formData.opening_hours[day];
                if (!hour.open || !hour.close) return Promise.resolve();
                const payload = {
                    day_of_the_week: dayMap[day],
                    open_time: `${hour.open}:00`,
                    close_time: `${hour.close}:00`,
                };

                return hour.id
                    ? axiosInstance.patch(`/api/mechanic/working-hours/${hour.id}/`, payload)
                    : axiosInstance.post("/api/mechanic/working-hours/", payload);
            });
            await Promise.all(promises);
            setSuccess("Dane zostały zapisane!");
        } catch {
            setError("Wystąpił błąd przy zapisie danych.");
        }
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row-reverse min-h-screen bg-white">
            <MechanicSidebar  />
            <main className="flex-1 px-6 py-10">
                <h1 className="text-3xl font-bold text-zinc-800 mb-6">Witaj, {mechanicInfo.full_name || "Mechaniku"}!</h1>
                <h2 className="text-2xl font-semibold text-zinc-700 mb-4">Dane warsztatu</h2>
                {success && <div className="text-green-600 mb-4 font-medium">{success}</div>}
                {error && <div className="text-red-600 mb-4 font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><FiHome /> Nazwa zakładu</label>
                        <InputField name="name" value={formData.name} onChange={handleChange} required placeholder="AutoFix Serwis" />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><FiPhone /> Numer kontaktowy</label>
                        <InputField name="phone" value={formData.phone} onChange={handleChange} required placeholder="+48 123 456 789" />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><FiMapPin /> Ulica i numer</label>
                        <InputField name="address" value={formData.address} onChange={handleChange} required placeholder="ul. Mechaników 12A" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">Miasto</label>
                        <InputField name="city" value={formData.city} onChange={handleChange} required placeholder="Warszawa" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><FiInfo /> Opis</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Opisz czym się zajmuje Twój warsztat..."
                            className="w-full p-3 border border-gray-300 rounded-md resize-none h-28 text-sm"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <h3 className="text-lg font-semibold text-zinc-800 mb-2 flex items-center gap-2"><FiClock /> Godziny otwarcia</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {days.map(day => (
                                <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="w-full sm:w-28 capitalize font-medium text-sm text-gray-700">{day}</span>
                                    <input
                                        type="time"
                                        value={formData.opening_hours[day]?.open || "00:00"}
                                        onChange={e => handleHourChange(day, "open", e.target.value)}
                                        className="border rounded px-3 py-1 text-sm w-full sm:w-auto"
                                    />
                                    <span className="hidden sm:inline">–</span>
                                    <input
                                        type="time"
                                        value={formData.opening_hours[day]?.close || "00:00"}
                                        onChange={e => handleHourChange(day, "close", e.target.value)}
                                        className="border rounded px-3 py-1 text-sm w-full sm:w-auto"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="sm:col-span-2 flex justify-center">
                        <SecondaryButton type="submit" className="w-full sm:w-auto">Zapisz zmiany</SecondaryButton>
                    </div>
                </form>
            </main>
        </div>
    );
};
