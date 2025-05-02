import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { InputField } from "../../components/forms/InputField";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";

const days = [
    "poniedziałek",
    "wtorek",
    "środa",
    "czwartek",
    "piątek",
    "sobota",
    "niedziela",
];

export const MechanicProfilePage = () => {
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
            .then((res) => {
                const data = res.data;
                setFormData((prev) => ({ ...prev, ...data }));
                setMechanicInfo({
                    full_name: data.full_name || "",
                    email: data.email || "",
                });
            });

        axiosInstance.get("/api/mechanic/working-hours/")
            .then((res) => {
                const updatedHours = { ...formData.opening_hours };

                const reverseDayMap: Record<string, string> = {
                    "monday": "poniedziałek",
                    "tuesday": "wtorek",
                    "wednesday": "środa",
                    "thursday": "czwartek",
                    "friday": "piątek",
                    "saturday": "sobota",
                    "sunday": "niedziela",
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

                setFormData((prev) => ({
                    ...prev,
                    opening_hours: updatedHours,
                }));
            })
            .catch(() => setError("Nie udało się załadować godzin otwarcia."));
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleHourChange = (day: string, field: "open" | "close", value: string) => {
        setFormData((prev) => ({
            ...prev,
            opening_hours: {
                ...prev.opening_hours,
                [day]: {
                    ...prev.opening_hours[day],
                    [field]: value,
                },
            },
        }));
    };

    const dayMap: Record<string, string> = {
        "poniedziałek": "monday",
        "wtorek": "tuesday",
        "środa": "wednesday",
        "czwartek": "thursday",
        "piątek": "friday",
        "sobota": "saturday",
        "niedziela": "sunday",
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

            const promises = days.map(async (day) => {
                const hour = formData.opening_hours[day];
                if (!hour.open || !hour.close) return;

                const payload = {
                    day_of_the_week: dayMap[day],
                    open_time: hour.open + ":00",
                    close_time: hour.close + ":00",
                };

                if (hour.id) {
                    return axiosInstance.patch(`/api/mechanic/working-hours/${hour.id}/`, payload);
                } else {
                    return axiosInstance.post("/api/mechanic/working-hours/", payload);
                }
            });

            await Promise.all(promises);
            setSuccess("Dane zostały zapisane!");
        } catch (error) {
            setError("Wystąpił błąd przy zapisie danych.");
        }
    };


    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#EEF6FA]">
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold text-[#1D3557] mb-6">Witaj, {mechanicInfo.full_name || "Mechaniku"}!</h1>
                <h2 className="text-xl font-semibold mb-4">Dodaj lub uzupełnij informacje o swojej firmie</h2>

                {success && <div className="text-green-600 mb-4">{success}</div>}
                {error && <div className="text-red-600 mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nazwa zakładu</label>
                        <InputField name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Numer kontaktowy</label>
                        <InputField name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ulica i numer</label>
                        <InputField name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium mb-1">Kod pocztowy</label>*/}
                    {/*    <InputField name="zip_code" value={formData.zip_code} onChange={handleChange} required />*/}
                    {/*</div>*/}
                    <div>
                        <label className="block text-sm font-medium mb-1">Miasto</label>
                        <InputField name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Opis</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md resize-none h-24"
                        ></textarea>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-md font-semibold mb-2 mt-6">Godziny otwarcia</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {days.map((day) => (
                                <div key={day} className="flex items-center gap-2">
                                    <span className="w-24 capitalize">{day}</span>
                                    <input
                                        type="time"
                                        value={formData.opening_hours?.[day]?.open || ""}
                                        onChange={(e) => handleHourChange(day, "open", e.target.value)}
                                        className="border rounded px-2 py-1 text-sm"
                                    />
                                    <span>–</span>
                                    <input
                                        type="time"
                                        value={formData.opening_hours?.[day]?.close || ""}
                                        onChange={(e) => handleHourChange(day, "close", e.target.value)}
                                        className="border rounded px-2 py-1 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-center">
                        <SecondaryButton type="submit">Zapisz zmiany</SecondaryButton>
                    </div>
                </form>
            </div>

            <aside className="bg-white border-l p-6 w-full lg:max-w-xs flex flex-col items-center shadow-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-600">
                        <span className="material-icons">person</span>
                    </div>
                    <p className="font-semibold mt-2">{mechanicInfo.full_name}</p>
                    <p className="text-sm text-gray-500">{mechanicInfo.email}</p>
                </div>

                <nav className="w-full flex flex-col gap-2 text-sm">
                    <a href="#" className="px-4 py-2 hover:bg-gray-100 rounded text-left">Ustawienia konta</a>
                    <a href="#" className="px-4 py-2 hover:bg-gray-100 rounded text-left">Moje opinie</a>
                    <a href="#" className="px-4 py-2 hover:bg-gray-100 rounded text-left text-red-600">Wyloguj się</a>
                </nav>
            </aside>
        </div>
    );
};
