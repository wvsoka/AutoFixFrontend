import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../api/axiosInstance";
import { MechanicNavbar } from "../components/navbars/MechanicNavbar";

interface DecodedToken {
    role: string;
    exp: number;
}

export const MechanicPrivateLayout = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        setIsAuthorized(true);
        /*
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const now = Date.now() / 1000;

            if (decoded.exp < now ) {
                setIsAuthorized(false);
            } else {
                setIsAuthorized(true);
            }
        } catch {
            setIsAuthorized(false);
        } */
    }, [navigate]);

    if (isAuthorized === null) return null;
    if (!isAuthorized) return <Navigate to="/login" replace />;

    return (
        <>
            <MechanicNavbar />
            <main className="px-4 py-6">
                <Outlet />
            </main>
        </>
    );
};
