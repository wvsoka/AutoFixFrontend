import React from "react";
import "./RatingCard.css";

type RatingCardProps = {
    rating: number;
    total: number;
};

const RatingCard: React.FC<RatingCardProps> = ({ rating, total }) => {
    const roundedRating = Math.round(rating);

    return (
        <div className="rating-card">
            <p className="rating-text">Rated {rating} / 5</p>
            <div className="stars">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < roundedRating ? "filled" : ""}`}>
            ★
          </span>
                ))}
            </div>
            <p className="review-count">Based on {total} reviews</p>
        </div>
    );
};

export default RatingCard;
