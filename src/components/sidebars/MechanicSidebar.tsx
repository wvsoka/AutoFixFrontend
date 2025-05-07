import { Link, useLocation } from "react-router-dom";

interface MechanicSidebarProps {
    fullName: string;
    email: string;
}

export const MechanicSidebar = ({ fullName, email }: MechanicSidebarProps) => {
    const location = useLocation();

    return (
        <aside className="bg-white border-l p-6 w-full lg:max-w-xs flex flex-col items-center shadow-md">
            <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-600">
                    <span className="material-icons">person</span>
                </div>
                <p className="font-semibold mt-2">{fullName}</p>
                <p className="text-sm text-gray-500">{email}</p>
            </div>

            <nav className="w-full flex flex-col gap-2 text-sm">
                <Link
                    to="/mechanic/profile"
                    className={`px-4 py-2 rounded text-left hover:bg-gray-100 ${
                        location.pathname.includes("/profile") ? "bg-gray-100 font-semibold" : ""
                    }`}
                >
                    Dane firmy
                </Link>
                <Link
                    to="/mechanic/profile"
                    className={`px-4 py-2 rounded text-left hover:bg-gray-100 ${location.pathname.includes("/settings") ? "bg-gray-100 font-semibold" : ""}`}
                >
                    Ustawienia konta
                </Link>
                <Link
                    to="/mechanic/reviews"
                    className={`px-4 py-2 rounded text-left hover:bg-gray-100 ${location.pathname.includes("/reviews") ? "bg-gray-100 font-semibold" : ""}`}
                >
                    Moje opinie
                </Link>
                <button className="px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded mt-2">
                    Wyloguj się
                </button>
            </nav>
        </aside>
    );
};