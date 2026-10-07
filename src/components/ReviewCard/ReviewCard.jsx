import React, { useState } from "react";
import "./ReviewCard.css";

const ReviewCard = ({ review, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const date = review?.date ? new Date(review.date) : null;
  const isValidDate = date && !Number.isNaN(date.getTime());

  const formattedDate = isValidDate
    ? date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown date";

  const weekday = isValidDate
    ? date.toLocaleDateString("en-US", { weekday: "long" })
    : "";

  const rating = Math.min(Math.max(Number(review?.rating) || 0, 0), 5);
  const text = review?.text || "";
  const isLongText = text.length > 180;

  return (
    <article className="review-card" style={{ "--card-index": index }}>
      <div className="review-quote-watermark" aria-hidden="true">
        “
      </div>

      <div className="review-header">
        <div className="review-user">
          <div className="review-avatar-wrapper">
            {review?.profilePhoto ? (
              <img
                src={review.profilePhoto}
                alt={review.author || "Reviewer"}
                className="review-avatar"
                loading="lazy"
              />
            ) : (
              <div className="review-avatar placeholder">
                {review?.author?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}
            <span className="review-verified-dot" title="Verified Review" />
          </div>

          <div className="review-user-info">
            <h3 title={review?.author}>{review?.author || "Anonymous"}</h3>
            <span className="review-date">{formattedDate}</span>
          </div>
        </div>

        {/* Dynamic Star Rating with cascade effect */}
        <div
          className="review-stars-badge"
          aria-label={`${rating} out of 5 stars`}
        >
          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <span
                key={starIndex}
                className={`star ${starIndex <= rating ? "filled" : "empty"}`}
                style={{ "--star-delay": `${starIndex * 60}ms` }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="review-body">
        <p
          className={`review-text ${!isExpanded && isLongText ? "clamped" : ""}`}
        >
          {text}
        </p>
        {isLongText && (
          <button
            type="button"
            className="review-read-more"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Show less" : "Read full review"}
          </button>
        )}
      </div>

      <div className="review-footer">
        <div className="review-weekday">
          {weekday && (
            <>
              <span className="dot-indicator" />
              <span>{weekday}</span>
            </>
          )}
        </div>

        <span className="review-score-pill">
          <strong>{rating.toFixed(1)}</strong>
          <span>/ 5</span>
        </span>
      </div>
    </article>
  );
};

export default ReviewCard;
