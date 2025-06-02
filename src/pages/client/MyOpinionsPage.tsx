import React, { useState, useEffect } from "react";
import ClientNavbar from "../../components/navbars/ClientNavbar";
import OpinionCard from "../../components/tiles/OpinionCard";
import "./MyOpinionsPage.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";


type Opinion = {
    mechanicName: string;
    id: number;
    note: number;
    content: string;
    created_at: string;
    shopName: string;

};

const MyOpinionsPage = () => {
    const [opinions, setOpinions] = useState<Opinion[]>([]);
    const [sortOption, setSortOption] = useState("newest");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
            .get("/api/reviews/me/", {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then(async (response) => {
                const reviews = response.data;
                const servicesMap: Record<number, { serviceName: string; mechanicName: string }> = {};

                for (const r of reviews) {
                    if (!servicesMap[r.service]) {
                        const serviceRes = await axiosInstance.get(`/api/services/${r.service}/`);
                        const serviceData = serviceRes.data;

                        servicesMap[r.service] = {
                            serviceName: serviceData.name || "Nieznana usługa",
                            mechanicName: serviceData.mechanic?.name || "Nieznany mechanik",
                        };
                    }
                }

                const formatted = reviews.map((r: any) => ({
                    id: r.id,
                    note: r.note,
                    content: r.content,
                    created_at: r.created_at,
                    shopName: servicesMap[r.service]?.serviceName || "Nieznana usługa",
                    mechanicName: servicesMap[r.service]?.mechanicName || "Nieznany mechanik",
                }));

                setOpinions(formatted);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const sortedOpinions = [...opinions].sort((a, b) => {
        switch (sortOption) {
            case "newest":
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case "oldest":
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            case "highest":
                return b.note - a.note;
            case "lowest":
                return a.note - b.note;
            default:
                return 0;
        }
    });

    return (
        <div>
            <ClientNavbar />
            <div className="my-opinions-container">
                <h1 className="my-opinions-title">Moje opinie</h1>
                {loading ? (
                    <p>Ładowanie opinii...</p>
                ) : (
                    <>
                        <div className="sort-controls">
                            <label className="font-medium">Sortuj:</label>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="newest">Od najnowszej</option>
                                <option value="oldest">Od najstarszej</option>
                                <option value="highest">Od najwyższej oceny</option>
                                <option value="lowest">Od najniższej oceny</option>
                            </select>
                        </div>
                        <div className="opinions-list">
                            {sortedOpinions.length > 0 ? (
                                sortedOpinions.map((opinion) => (
                                    <div key={opinion.id}>
                                        <h3 className="shop-name-label">
                                            {opinion.mechanicName}
                                        </h3>
                                        <OpinionCard
                                            rating={opinion.note}
                                            title={opinion.shopName}
                                            description={opinion.content}
                                            author="Ty"
                                            date={opinion.created_at}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="no-opinions-message">
                                    Nie dodałeś jeszcze żadnych opinii.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyOpinionsPage;
