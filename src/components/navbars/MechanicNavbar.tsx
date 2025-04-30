import { Link } from "react-router-dom";

export const MechanicNavbar = () => {
    return (
        <nav className="bg-[#3D7CA9] text-white px-6 py-4 flex justify-between items-center shadow-md">
            <Link to="/" className="text-2xl font-bold">
                <span className="text-white">AUTO</span><span className="text-gray-300">FIX</span>
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/mechanic/profile" className="hover:underline">
                    Profil
                </Link>
                <Link to="/mechanic/settings" className="hover:underline">
                    Ustawienia konta
                </Link>
                <Link to="/mechanic/reviews" className="hover:underline">
                    Opinie
                </Link>
            </div>
        </nav>
    );
};
