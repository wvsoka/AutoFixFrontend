import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";

export const MechanicNavbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Zamknij dropdown po kliknięciu poza nim
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <nav className="bg-[#3D7CA9] text-white px-6 py-4 shadow-md">
            <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
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

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-1 bg-white text-[#3D7CA9] px-4 py-1 rounded-md font-semibold hover:bg-gray-100"
                        >
                            Profil <FiChevronDown />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-md text-[#1D3557] z-50">
                                <Link
                                    to="/mechanic/profile"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Dane firmy
                                </Link>
                                <Link
                                    to="/mechanic/settings"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Ustawienia konta
                                </Link>
                                <Link
                                    to="/mechanic/reviews"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Moje opinie
                                </Link>
                            </div>
                        )}
                    </div>
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
                        to="/mechanic/myservices"
                        className="px-4 py-2 hover:bg-[#2f6691] rounded"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Moje usługi
                    </Link>
                    <Link
                        to="/mechanic/profile"
                        className="px-4 py-2 hover:bg-[#2f6691] rounded"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Dane firmy
                    </Link>
                    <Link
                        to="/mechanic/settings"
                        className="px-4 py-2 hover:bg-[#2f6691] rounded"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Ustawienia konta
                    </Link>
                    <Link
                        to="/mechanic/reviews"
                        className="px-4 py-2 hover:bg-[#2f6691] rounded"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Moje opinie
                    </Link>
                </div>
            )}
        </nav>
    );
};
