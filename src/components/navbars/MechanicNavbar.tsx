import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

export const MechanicNavbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-[#3D7CA9] text-white px-6 py-4 shadow-md">
            <div className="flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">
                    <span className="text-white">AUTO</span>
                    <span className="text-gray-300">FIX</span>
                </Link>

                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <Link to="/mechanic/calendar" className="hover:underline">
                        Mój kalendarz
                    </Link>
                    <Link to="/mechanic/myservices" className="hover:underline">
                        Moje usługi
                    </Link>
                    <Link
                        to="/mechanic/profile"
                        className="bg-white text-[#3D7CA9] px-4 py-1 rounded-md font-semibold hover:bg-gray-100"
                    >
                        Profil
                    </Link>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="flex flex-col mt-4 gap-2 md:hidden">
                    <Link
                        to="/mechanic/calendar"
                        className="px-4 py-2 hover:bg-[#2f6691] rounded"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Mój kalendarz
                    </Link>
                    <Link
                        to="/mechanic/services"
                        className="px-4 py-2 hover:bg-[#2f6691] rounded"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Moje usługi
                    </Link>
                    <Link
                        to="/mechanic/profile"
                        className="px-4 py-2 bg-white text-[#3D7CA9] rounded-md font-semibold text-center"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Profil
                    </Link>
                </div>
            )}
        </nav>
    );
};
