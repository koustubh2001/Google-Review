import React, { useMemo } from "react";
import "./DailyRatings.css";

const DailyRatings = ({ analytics }) => {
  const dailyRatings = Array.isArray(analytics?.dailyRatings)
    ? analytics.dailyRatings
    : [];
  const maxRating = useMemo(() => {
    if (!dailyRatings.length) return 0;
    return Math.max(...dailyRatings.map((i) => Number(i.averageRating) || 0));
  }, [dailyRatings]);

  return (
    <section className="daily-ratings-section">
      <div className="daily-ratings-header">
        <div>
          <span className="daily-ratings-label">WEEKLY ANALYSIS</span>
          <h2>Daily Ratings</h2>
          <p>Average customer rating for each day of the week.</p>
        </div>
      </div>

      <div className="daily-ratings-card">
        {dailyRatings.length === 0 ? (
          <div className="daily-ratings-empty">
            No daily rating data available.
          </div>
        ) : (
          dailyRatings.map((item, index) => {
            const rating = Number(item.averageRating) || 0;
            const reviewCount = Number(item.totalReviews) || 0;
            const percentage = Math.min(Math.max((rating / 5) * 100, 0), 100);
            const isTopRated = rating > 0 && rating === maxRating;

            return (
              <div
                className={`daily-rating-row ${isTopRated ? "is-top-rated" : ""}`}
                key={item.day}
                style={{ "--row-index": index }}
              >
                {/* Day */}
                <div className="daily-rating-day">
                  <span>{item.day}</span>
                  {isTopRated && <span className="top-badge">Top</span>}
                </div>

                {/* Rating Bar */}
                <div className="daily-rating-progress">
                  <div className="daily-rating-track">
                    <div
                      className="daily-rating-fill"
                      style={{
                        "--target-width": `${percentage}%`,
                        "--fill-delay": `${index * 80 + 120}ms`,
                      }}
                    >
                      <span className="daily-rating-shimmer" />
                    </div>
                  </div>
                </div>

                {/* Rating Score */}
                <div className="daily-rating-score">
                  <span className="daily-rating-star">★</span>
                  <strong>{rating > 0 ? rating.toFixed(1) : "0.0"}</strong>
                </div>

                {/* Review Count */}
                <div className="daily-rating-count">
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default DailyRatings;
