import { Outlet } from "react-router-dom";
import { PublicNavbar } from "../components/navbars/PublicNavbar";

export const PublicLayout = () => {
    return (
        <>
            <PublicNavbar />
            <main className="px-6 py-4">
                <Outlet />
            </main>
        </>
    );
};
