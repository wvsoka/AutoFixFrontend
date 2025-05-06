import React from "react";
import "./OpinionCard.css";

type OpinionCardProps = {
    rating: number;
    title: string;
    description: string;
    author: string;
    date: string;
    avatarUrl?: string;
};

const OpinionCard: React.FC<OpinionCardProps> = ({
                                                     rating,
                                                     title,
                                                     description,
                                                     author,
                                                     date,
                                                     avatarUrl,
                                                 }) => {
    const filledStars = Math.floor(rating);
    const stars = [...Array(5)].map((_, i) => (
        <span key={i} className={`star ${i < filledStars ? "filled" : ""}`}>
      ★
    </span>
    ));

    return (
        <div className="opinion-card">
            <div className="stars">{stars}</div>
            <h3 className="opinion-title">{title}</h3>
            <p className="opinion-description">{description}</p>
            <div className="opinion-footer">
                {avatarUrl && <img src={avatarUrl} alt={author} className="avatar" />}
                <div>
                    <p className="author-name">{author}</p>
                    <p className="date">{date}</p>
                </div>
            </div>
        </div>
    );
};

export default OpinionCard;
