import { useState } from "react";
import { Link } from "react-router-dom";

export const PublicNavbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="bg-[#3D7CA9] text-white px-6 py-4 flex justify-between items-center shadow-md">
            <Link to="/" className="text-2xl font-bold">
                <span className="text-white">AUTO</span><span className="text-gray-300">FIX</span>
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/services" className="hover:underline">
                    Usługi
                </Link>
                <Link to="/login" className="hover:underline">
                    Zaloguj się
                </Link>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="bg-white text-[#3D7CA9] font-semibold px-4 py-2 rounded-lg border shadow hover:bg-gray-100 transition"
                    >
                        Dołącz teraz
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md z-10 w-44">
                            <Link
                                to="/register-client"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Jestem klientem
                            </Link>
                            <Link
                                to="/register-mechanic"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Jestem mechanikiem
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
