import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { MechanicSidebar } from "../../components/sidebars/MechanicSidebar";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";

export const MechanicSettings = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [mechanicInfo, setMechanicInfo] = useState({
        full_name: "",
        email: "",
    });

    useEffect(() => {
        axiosInstance.get("/api/mechanic/me/")
            .then(res => {
                const full_name = res.data.name || "";
                const email = res.data.user?.email || "";
                setMechanicInfo({ full_name, email });
            })
            .catch(err => {
                console.error("Błąd przy pobieraniu danych mechanika:", err);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("Hasła nie są takie same.");
            return;
        }

        try {
            const response = await axiosInstance.post("/api/auth/password/change/", {
                old_password: formData.currentPassword,
                new_password: formData.newPassword,
            });

            if (response.status === 200) {
                setSuccessMessage("Hasło zostało zmienione.");
                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        } catch (error: any) {
            let detail =
                error.response?.data?.old_password ||
                error.response?.data?.new_password ||
                error.response?.data?.detail ||
                "Wystąpił błąd.";

            if (Array.isArray(detail)) {
                setErrorMessage(detail.join(" "));
            } else {
                setErrorMessage(detail);
            }
        }

    };

    const handleDeleteAccount = () => {
        setShowDeleteConfirm(false);
        alert("Konto zostało usunięte (mock)");
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row-reverse min-h-screen bg-white">
            <MechanicSidebar />
            <main className="flex-1 px-6 py-10">
                <h2 className="text-3xl font-bold text-zinc-800 mb-6">Ustawienia konta</h2>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4 max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-[#1D3557]">Zmień hasło</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Aktualne hasło</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Nowe hasło</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Powtórz nowe hasło</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
                    {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

                    <div className="flex justify-end">
                        <SecondaryButton type="submit">Zmień hasło</SecondaryButton>
                    </div>
                </form>

                <div className="mt-10 max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-[#1D3557] mb-2">Usuń konto</h3>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Usuń konto
                    </button>

                    {showDeleteConfirm && (
                        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
                            <p className="mb-4 text-sm">Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można cofnąć.</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDeleteAccount}
                                    className="bg-red-700 text-white px-4 py-2 rounded"
                                >
                                    Tak, usuń konto
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Anuluj
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
