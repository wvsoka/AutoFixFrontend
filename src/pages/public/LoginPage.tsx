import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InputField } from "../../components/forms/InputField";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import axiosInstance from "../../api/axiosInstance";
import * as FiIcons from "react-icons/fi";
import { jwtDecode } from "jwt-decode";

export const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("/api/auth/login/", {
                email: formData.email,
                password: formData.password,
            });

            const { access, refresh } = response.data;
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);

            const decoded: { role: string } = jwtDecode(access);
            console.log("Decoded token:", decoded);

            if (decoded.role === "mechanic") {
                navigate("/mechanic/profile");
            } else {
                navigate("/services");
            }
        } catch (err: any) {
            setError("Nieprawidłowy email lub hasło.");
        }
    };


    return (
        <div className="min-h-screen bg-[#EEF6FA] flex items-center justify-center px-4">
            <div className="flex flex-col md:flex-row w-full max-w-6xl">

                <div className="bg-white rounded-2xl shadow-lg p-8 w-full md:w-1/2 flex flex-col justify-center">
                    <div className="flex justify-center mb-4">
                        <img src="/logo.png" alt="AutoFix Logo" className="h-12" />
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-2 rounded text-center mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-center text-[#1D3557]">Zaloguj się</h2>

                        <InputField
                            type="email"
                            name="email"
                            placeholder="Adres email"
                            onChange={handleChange}
                            required
                            icon={<FiIcons.FiMail />}
                        />
                        <InputField
                            type="password"
                            name="password"
                            placeholder="Hasło"
                            onChange={handleChange}
                            required
                            icon={<FiIcons.FiLock />}
                        />

                        <div className="flex justify-end text-sm text-blue-600 hover:underline">
                            <a href="#">Zapomniałeś hasła?</a>
                        </div>

                        <div className="flex justify-center mt-4">
                            <SecondaryButton type="submit" className="w-full max-w-sm">
                                Zaloguj się
                            </SecondaryButton>
                        </div>
                    </form>

                    <div className="flex items-center justify-center mt-6 text-sm text-gray-600">
                        <span>Nie masz konta?</span>
                        <a href="/register-client" className="ml-1 text-blue-600 hover:underline">Zarejestruj się</a>
                    </div>
                </div>

                <div className="hidden md:flex w-full md:w-1/2 justify-center items-center mt-8 md:mt-0 md:ml-8">
                    <img
                        src="/login.png"
                        alt="Login Illustration"
                        className="w-full max-w-sm h-auto object-contain"
                    />
                </div>
            </div>
        </div>
    );
};
