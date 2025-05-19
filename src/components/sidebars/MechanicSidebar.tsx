import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMechanicInfo } from "../../hooks/useMechanicInfo";
import { FiUser } from "react-icons/fi";

export const MechanicSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mechanicInfo } = useMechanicInfo();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/", { replace: true });
    };

    return (
        <aside className="bg-white border-l p-6 w-full lg:max-w-xs flex flex-col items-center shadow-md">
            <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-600">
                    <FiUser />
                </div>
                <p className="font-semibold mt-2">{mechanicInfo.full_name}</p>
                <p className="text-sm text-gray-500">{mechanicInfo.email}</p>
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
                    to="/mechanic/settings"
                    className={`px-4 py-2 rounded text-left hover:bg-gray-100 ${
                        location.pathname.includes("/settings") ? "bg-gray-100 font-semibold" : ""
                    }`}
                >
                    Ustawienia konta
                </Link>
                <Link
                    to="/mechanic/reviews"
                    className={`px-4 py-2 rounded text-left hover:bg-gray-100 ${
                        location.pathname.includes("/reviews") ? "bg-gray-100 font-semibold" : ""
                    }`}
                >
                    Moje opinie
                </Link>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded mt-2"
                >
                    Wyloguj się
                </button>
            </nav>
        </aside>
    );
};
