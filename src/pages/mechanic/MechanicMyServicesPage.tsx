import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FiPlus } from "react-icons/fi";

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
        <div className=" min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#1D3557]">Moje usługi</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-[#1D3557] text-white px-4 py-2 rounded shadow hover:bg-[#16324c]"
                >
                    <FiPlus /> Dodaj nową usługę
                </button>
            </div>

            {loading ? (
                <p>Ładowanie...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <div className="space-y-4">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-[#E6F3F8] border border-gray-200 p-4 rounded-md shadow-sm flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                <p>Cena: {service.price} zł</p>
                                <p>Czas: {service.duration} min</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="bg-teal-100 text-teal-800 px-3 py-1 rounded hover:bg-teal-200"
                                >
                                    Edytuj
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                                >
                                    Usuń usługę
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
                                    <option value="30">30 minut</option>
                                    <option value="60">1 godzina</option>
                                    <option value="90">1,5 godziny</option>
                                    <option value="120">2 godziny</option>
                                </select>
                                {formErrors.duration && <p className="text-red-600 text-sm mt-1">{formErrors.duration}</p>}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="text-gray-600 hover:text-black"
                            >
                                Anuluj
                            </button>
                            <button
                                type="submit"
                                className="bg-[#1D3557] text-white px-4 py-2 rounded hover:bg-[#16324c]"
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
