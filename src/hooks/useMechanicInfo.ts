import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const useMechanicInfo = () => {
    const [mechanicInfo, setMechanicInfo] = useState({ full_name: "", email: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get("/api/mechanic/me/")
            .then(res => {
                const name = res.data.name || res.data.full_name || "";
                const email = res.data.user?.email || res.data.email || "";
                setMechanicInfo({ full_name: name, email });
            })
            .catch(err => {
                console.error("Błąd przy pobieraniu danych mechanika:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    return { mechanicInfo, loading };
};
