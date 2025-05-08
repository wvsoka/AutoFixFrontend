import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { FiMenu, FiX } from "react-icons/fi";

export const PublicNavbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
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
                    <Link to="/login" className="hover:underline">Zaloguj się</Link>

                    <div className="relative" ref={dropdownRef}>
                        <PrimaryButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                            Dołącz teraz
                        </PrimaryButton>
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
            </div>

            {mobileMenuOpen && (
                <div className="flex flex-col mt-4 gap-2 md:hidden">
                    <Link to="/services" className="px-4 py-2 hover:bg-[#2f6691] rounded">Usługi</Link>
                    <Link to="/login" className="px-4 py-2 hover:bg-[#2f6691] rounded">Zaloguj się</Link>
                    <div className="flex flex-col">
                        <span className="px-4 py-2 font-semibold">Dołącz teraz</span>
                        <Link
                            to="/register-client"
                            className="px-4 py-2 hover:bg-[#2f6691]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Jestem klientem
                        </Link>
                        <Link
                            to="/register-mechanic"
                            className="px-4 py-2 hover:bg-[#2f6691]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Jestem mechanikiem
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
