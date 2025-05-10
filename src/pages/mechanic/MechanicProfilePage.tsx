import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { InputField } from "../../components/forms/InputField";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { MechanicSidebar } from "../../components/sidebars/MechanicSidebar";

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
        <div className="flex flex-col-reverse lg:flex-row-reverse min-h-screen bg-[#EEF6FA]">
            <MechanicSidebar fullName={mechanicInfo.full_name} email={mechanicInfo.email} />
            <main className="flex-1 p-4 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1D3557] mb-4">Witaj, {mechanicInfo.full_name || "Mechaniku"}!</h1>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Dane firmy</h2>
                {success && <div className="text-green-600 mb-4">{success}</div>}
                {error && <div className="text-red-600 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm sm:text-base font-medium mb-1">Nazwa zakładu</label>
                        <InputField name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm sm:text-base font-medium mb-1">Numer kontaktowy</label>
                        <InputField name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm sm:text-base font-medium mb-1">Ulica i numer</label>
                        <InputField name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm sm:text-base font-medium mb-1">Miasto</label>
                        <InputField name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm sm:text-base font-medium mb-1">Opis</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md resize-none h-24" />
                    </div>
                    <div className="sm:col-span-2">
                        <h3 className="text-md sm:text-lg font-semibold mb-2">Godziny otwarcia</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {days.map(day => (
                                <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="w-full sm:w-24 capitalize font-medium">{day}</span>
                                    <input type="time" value={formData.opening_hours[day]?.open || "08:00"} onChange={e => handleHourChange(day, "open", e.target.value)} className="border rounded px-2 py-1 text-sm w-full sm:w-auto" />
                                    <span className="hidden sm:inline">–</span>
                                    <input type="time" value={formData.opening_hours[day]?.close || "16:00"} onChange={e => handleHourChange(day, "close", e.target.value)} className="border rounded px-2 py-1 text-sm w-full sm:w-auto" />
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
