import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import OpinionCard from "../../components/tiles/OpinionCard";
import { MechanicSidebar } from "../../components/sidebars/MechanicSidebar";

interface RawReviewAPI {
    id: number;
    note: number;
    content: string;
    created_at: string;
    user_email: string;      // nowe pole z backendu
    service_name: string;    // nowe pole z backendu
}

interface Opinion {
    rating: number;
    title: string;
    description: string;
    author: string;
    date: string;
    createdAt: string;
    shopName: string;
}

export const MechanicReviewsPage = () => {
    const [mechanicInfo, setMechanicInfo] = useState({ full_name: "", email: "" });
    const [opinions, setOpinions] = useState<Opinion[]>([]);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [sortOption, setSortOption] = useState("newest");

    useEffect(() => {
        axiosInstance.get("/api/mechanic/me/")
            .then((res) => {
                const { id, name } = res.data;
                const email = res.data.user.email;
                setMechanicInfo({
                    full_name: name,
                    email: email,
                });
                return axiosInstance.get(`/api/reviews/mechanic/${id}/reviews/`);
            })
            .then((res) => {
                const reviews: RawReviewAPI[] = res.data;

                if (reviews.length === 0) {
                    setOpinions([]);
                    setAverageRating(null);
                    return;
                }

                const processed: Opinion[] = reviews.map((r) => ({
                    rating: Math.round(r.note),
                    title: r.service_name, // zamiast ID usługi
                    description: r.content,
                    author: r.user_email, // zamiast ID użytkownika
                    date: new Date(r.created_at).toLocaleDateString("pl-PL"),
                    createdAt: r.created_at,
                    shopName: "",
                }));

                setOpinions(processed);

                const avgNote = reviews.reduce((sum, r) => sum + r.note, 0) / reviews.length;
                setAverageRating(avgNote);
            })
            .catch((error) => {
                console.error("Błąd przy pobieraniu danych:", error);
            });
    }, []);

    const sortedOpinions = [...opinions].sort((a, b) => {
        switch (sortOption) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "highest":
                return b.rating - a.rating;
            case "lowest":
                return a.rating - b.rating;
            default:
                return 0;
        }
    });

    return (
        <div className="flex flex-col-reverse lg:flex-row-reverse min-h-screen bg-white">
            <MechanicSidebar />
            <main className="flex-1 px-6 py-10">
                <h2 className="text-3xl font-bold text-zinc-800 mb-6">Opinie o Twoim warsztacie</h2>

                {averageRating !== null && (
                    <div className="bg-zinc-50 rounded-xl p-6 mb-10 text-center">
                        <p className="text-xl font-semibold text-zinc-700 mb-1">
                            Średnia ocena: {averageRating.toFixed(1)} / 5
                        </p>
                        <div className="flex justify-center text-yellow-400 text-2xl mb-2" aria-hidden="true">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < Math.round(averageRating) ? "" : "text-gray-300"}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">Na podstawie {opinions.length} opinii</p>
                    </div>
                )}

                <div className="max-w-3xl mx-auto mb-6 px-4 flex justify-end">
                    <label className="text-sm font-medium text-gray-600 mr-2 self-center">Sortuj:</label>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                        <option value="newest">Od najnowszej</option>
                        <option value="oldest">Od najstarszej</option>
                        <option value="highest">Od najwyższej oceny</option>
                        <option value="lowest">Od najniższej oceny</option>
                    </select>
                </div>

                <div className="max-w-3xl mx-auto space-y-6 px-4">
                    {sortedOpinions.length > 0 ? (
                        sortedOpinions.map((opinion, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-4 sm:p-6">
                                <OpinionCard {...opinion} />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">Brak opinii do wyświetlenia.</p>
                    )}
                </div>
            </main>
        </div>
    );
};
