import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { InputField } from "../../components/forms/InputField";
import * as FiIcons from "react-icons/fi";

export const RegisterMechanicPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        address: "",
        city: "",
        zip_code: "",
        nip: "",
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            setError("Hasło musi mieć co najmniej 6 znaków.");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            setError("Podaj poprawny adres email.");
            return;
        }

        if (!/^\d{5}$/.test(formData.zip_code.replace("-", ""))) {
            setError("Podaj poprawny kod pocztowy (XX-XXX).");
            return;
        }

        if (!/^\d{10}$/.test(formData.nip)) {
            setError("NIP musi składać się z 10 cyfr.");
            return;
        }

        if (!formData.name.trim() || !formData.address.trim() || !formData.city.trim()) {
            setError("Wszystkie pola warsztatu muszą być wypełnione.");
            return;
        }
    };

    return (
        <div className="min-h-screen bg-[#EEF6FA] flex items-center justify-center px-4">
            <div className="flex flex-col md:flex-row w-full max-w-6xl">
                <div className="bg-white shadow-lg p-8 w-full md:w-1/2 flex flex-col justify-center">
                    {successMessage && (
                        <div className="bg-green-100 text-green-700 p-2 rounded text-center mb-4">
                            {successMessage}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 text-red-700 p-2 rounded text-center mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                        <h2 className="text-2xl font-bold text-center mb-4 text-[#1D3557]">Dołącz jako mechanik</h2>

                        <InputField type="email" name="email" placeholder="Adres email" onChange={handleChange} required icon={<FiIcons.FiMail />} />
                        <InputField type="password" name="password" placeholder="Hasło" onChange={handleChange} required icon={<FiIcons.FiLock />} />
                        <InputField type="password" name="confirmPassword" placeholder="Powtórz hasło" onChange={handleChange} required icon={<FiIcons.FiLock />} />
                        <InputField type="text" name="name" placeholder="Nazwa warsztatu" onChange={handleChange} required icon={<FiIcons.FiHome />} />
                        <InputField type="text" name="address" placeholder="Adres warsztatu" onChange={handleChange} required icon={<FiIcons.FiMapPin />} />
                        <InputField type="text" name="city" placeholder="Miasto" onChange={handleChange} required icon={<FiIcons.FiMapPin />} />
                        <InputField type="text" name="zip_code" placeholder="Kod pocztowy" onChange={handleChange} required icon={<FiIcons.FiHash />} />
                        <InputField type="text" name="nip" placeholder="NIP" onChange={handleChange} required icon={<FiIcons.FiHash />} />

                        <div className="flex justify-center mt-6">
                            <SecondaryButton type="submit" className="w-full max-w-sm">
                                Zarejestruj się
                            </SecondaryButton>
                        </div>
                    </form>
                </div>

                <div className="hidden md:flex w-full md:w-1/2 justify-center items-center mt-8 md:mt-0 md:ml-8">
                    <img
                        src="/mechanic.png"
                        alt="Mechanic"
                        className="w-full max-w-sm h-auto object-contain"
                    />
                </div>
            </div>
        </div>
    );
};
