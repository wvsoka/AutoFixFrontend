import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";

export const HomePage = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegisterClient = () => {
        navigate("/register-client");
    };

    const handleRegisterMechanic = () => {
        navigate("/register-mechanic");
    };

    return (
        <div className="flex flex-col items-center text-center font-sans bg-[#f5f9fc]">
            <section
                className="w-full h-[450px] bg-cover bg-center relative flex items-center justify-center"
                style={{ backgroundImage: "url('/hero-image.jpg')" }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white px-4">
                    <h1 className="text-5xl font-bold mb-4 drop-shadow-md">Zarezerwuj teraz</h1>
                    <p className="max-w-2xl text-lg drop-shadow-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rhoncus nunc nunc, vel tempus metus placerat in.
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4 relative">
                        <PrimaryButton onClick={handleLogin}>Zaloguj się</PrimaryButton>

                        <div className="relative">
                            <PrimaryButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                                Zarejestruj się
                            </PrimaryButton>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg z-10 w-48">
                                    <button
                                        onClick={handleRegisterClient}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Jako klient
                                    </button>
                                    <button
                                        onClick={handleRegisterMechanic}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Jako mechanik
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
