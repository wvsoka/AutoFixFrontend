import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FiPlus } from "react-icons/fi";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";

interface Service {
    id: number;
    name: string;
    price: number;
    duration: number;
}

export const MechanicMyServicesPage = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const durations = Array.from({ length: 10 }, (_, i) => (i + 1) * 30);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration: "",
    });
    const [formErrors, setFormErrors] = useState({
        name: "",
        price: "",
        duration: "",
    });
    const modalRef = useRef<HTMLFormElement>(null);

    const fetchServices = async () => {
        try {
            const res = await axiosInstance.get("/api/mechanic/services/");
            setServices(res.data);
        } catch {
            setError("Nie udało się załadować usług.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setIsEditing(false);
            }
        };
        if (isEditing) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEditing]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tę usługę?")) return;
        try {
            await axiosInstance.delete(`/api/mechanic/services/${id}/`);
            setServices((prev) => prev.filter((s) => s.id !== id));
        } catch {
            alert("Wystąpił błąd przy usuwaniu usługi.");
        }
    };

    const handleEdit = (service: Service) => {
        setSelectedService(service);
        setFormData({
            name: service.name,
            price: service.price.toString(),
            duration: service.duration.toString(),
        });
        setFormErrors({ name: "", price: "", duration: "" });
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setSelectedService(null);
        setFormData({ name: "", price: "", duration: "" });
        setFormErrors({ name: "", price: "", duration: "" });
        setIsEditing(true);
    };

    const validateForm = () => {
        let valid = true;
        const errors = { name: "", price: "", duration: "" };

        if (!formData.name.trim()) {
            errors.name = "Nazwa jest wymagana.";
            valid = false;
        }
        if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            errors.price = "Cena musi być liczbą większą od zera.";
            valid = false;
        }
        const duration = Number(formData.duration);
        if (!duration || isNaN(duration) || duration <= 0 || duration % 30 !== 0) {
            errors.duration = "Czas trwania musi być wielokrotnością 30 minut.";
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            duration: `00:${formData.duration.padStart(2, '0')}:00`,
        };

        try {
            if (selectedService) {
                const res = await axiosInstance.put(`/api/mechanic/services/${selectedService.id}/`, payload);
                setServices((prev) => prev.map((s) => (s.id === selectedService.id ? res.data : s)));
            } else {
                const res = await axiosInstance.post(`/api/mechanic/services/`, payload);
                setServices((prev) => [...prev, res.data]);
            }
            setIsEditing(false);
        } catch {
            alert("Wystąpił błąd przy zapisie usługi.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-white px-6 py-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[#1D3557]">Moje usługi</h1>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 bg-[#1D3557] text-white px-4 py-2 rounded-lg shadow hover:bg-[#2B4E73] transition"
                    >
                        <FiPlus /> Dodaj nową usługę
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-600">Ładowanie...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div className="space-y-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="border border-gray-200 p-5 rounded-md shadow-sm flex justify-between items-center bg-[#F9FAFB]"
                            >
                                <div>
                                    <h3 className="font-semibold text-lg text-[#1D3557]">{service.name}</h3>
                                    <p className="text-sm text-gray-700">Cena: {service.price} zł</p>
                                    <p className="text-sm text-gray-700">Czas: {service.duration} min</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="px-4 py-2 bg-[#1D3557] text-white rounded-md hover:bg-[#2B4E73] transition shadow"
                                    >
                                        Edytuj
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow"
                                    >
                                        Usuń usługę
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <form
                        ref={modalRef}
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded shadow-md w-full max-w-md"
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedService ? "Edytuj usługę" : "Dodaj nową usługę"}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nazwa usługi</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cena (zł)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {formErrors.price && <p className="text-red-600 text-sm mt-1">{formErrors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Czas trwania (min)</label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                >
                                    <option value="">Wybierz czas</option>
                                    {durations.map(min => (
                                        <option key={min} value={min}>
                                            {min < 60
                                                ? `${min} minut`
                                                : `${Math.floor(min / 60)} godz.${min % 60 ? ` ${min % 60} min` : ""}`}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.duration && <p className="text-red-600 text-sm mt-1">{formErrors.duration}</p>}

                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Anuluj
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#1D3557] text-white rounded-md hover:bg-[#2B4E73] transition shadow"
                            >
                                Zapisz
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};