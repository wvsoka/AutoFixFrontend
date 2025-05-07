import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { MechanicSidebar } from "../../components/sidebars/MechanicSidebar";

interface ReviewAPI {
    review_id: string;
    note: number;       // 1–10
    content: string;
    created_at: string;
    user: { username: string };
    service: { name: string };
}

export const MechanicReviewsPage = () => {
    const [reviews, setReviews] = useState<ReviewAPI[]>([]);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [mechanicInfo, setMechanicInfo] = useState({
        full_name: "Jan Kowalski",
        email: "jan.kowalski@example.com",
    });

    useEffect(() => {
        // zmockowane opinie
        const mockReviews: ReviewAPI[] = [
            {
                review_id: "11111111-1111-1111-1111-111111111111",
                note: 8,
                content: "Świetna obsługa, super szybko i fachowo!",
                created_at: "2025-05-01T12:00:00Z",
                user: { username: "adam_nowak" },
                service: { name: "Wymiana oleju" },
            },
            {
                review_id: "22222222-2222-2222-2222-222222222222",
                note: 6,
                content: "Ok, ale trzeba było czekać dłużej niż ustaliliśmy.",
                created_at: "2025-05-02T15:30:00Z",
                user: { username: "ewa_s" },
                service: { name: "Wymiana klocków hamulcowych" },
            },
        ];

        setReviews(mockReviews);

        // policz średnią 1–10 → 1–5 (frontend dzieli przez 2)
        const avgNote =
            mockReviews.reduce((sum, r) => sum + r.note, 0) / mockReviews.length;
        setAverageRating(avgNote / 2);
    }, []);

    return (
        <div className="flex flex-row-reverse min-h-screen bg-[#EEF6FA]">
            <MechanicSidebar
                fullName={mechanicInfo.full_name}
                email={mechanicInfo.email}
            />

            <div className="flex-1 p-8">
                <h2 className="text-xl font-bold text-[#1D3557] mb-6">Moje opinie</h2>

                {averageRating !== null && (
                    <div className="text-center mb-8">
                        <p className="text-lg font-semibold">
                            Ocena: {averageRating.toFixed(1)} / 5
                        </p>
                        <div className="flex justify-center text-yellow-400 mt-1 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={i < Math.round(averageRating) ? "" : "text-gray-300"}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">
                            Na podstawie {reviews.length} opinii
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    {reviews.map((review) => {
                        const stars = Math.round(review.note / 2);
                        return (
                            <div
                                key={review.review_id}
                                className="bg-white p-4 rounded shadow-md"
                            >
                                <div className="flex items-center text-yellow-400 mb-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={i < stars ? "" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                                <h3 className="font-semibold text-md">
                                    {review.service.name}
                                </h3>
                                <p className="text-sm text-gray-700 mt-1">
                                    {review.content}
                                </p>
                                <div className="flex items-center mt-3 text-sm text-gray-500">
                                    <span className="font-medium">{review.user.username}</span>
                                    <span className="mx-2">•</span>
                                    <span>
                    {new Date(review.created_at).toLocaleString("pl-PL")}
                  </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
