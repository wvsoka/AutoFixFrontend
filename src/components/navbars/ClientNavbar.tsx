import { useState } from "react";
import { Link } from "react-router-dom";
import {PrimaryButton} from "../buttons/PrimaryButton";

const ClientNavbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="bg-[#3D7CA9] text-white px-6 py-4 flex justify-between items-center shadow-md">
            <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/services" className="hover:underline">
                    Wyszukaj usługi
                </Link>


                <div className="relative">
                    <PrimaryButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                        Profil
                    </PrimaryButton>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md z-10 w-44">
                            <Link
                                to="/client/settings"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Ustawienia
                            </Link>
                            <Link
                                to="/client/my-appointments"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Moje wizyty
                            </Link>
                            <Link
                                to="/client/my-opinions"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Wystawione opinie
                            </Link>
                            <Link
                                to="/"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Wyloguj się
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default ClientNavbar;
