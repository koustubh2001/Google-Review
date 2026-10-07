import React, { useState, useMemo } from "react";
import ReviewCard from "../ReviewCard/ReviewCard";
import "./ReviewsList.css";

const ReviewsList = ({ reviews = [] }) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredReviews = useMemo(() => {
    if (activeFilter === "positive") {
      return reviews.filter((r) => Number(r.rating) >= 4);
    }
    if (activeFilter === "critical") {
      return reviews.filter((r) => Number(r.rating) < 4);
    }
    return reviews;
  }, [reviews, activeFilter]);

  return (
    <section className="reviews-section">
      <div className="reviews-section-glow" aria-hidden="true" />
      <div className="section-heading">
        <div className="heading-left">
          <span className="reviews-pill-tag">
            <span className="live-dot" /> Verified Feedback
          </span>
          <h2>Customer Reviews</h2>
          <p>
            Showing <strong>{filteredReviews.length}</strong> of{" "}
            {reviews.length} analyzed reviews
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="reviews-filter-pills" role="tablist">
            <button
              type="button"
              className={`filter-pill ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All ({reviews.length})
            </button>
            <button
              type="button"
              className={`filter-pill ${activeFilter === "positive" ? "active" : ""}`}
              onClick={() => setActiveFilter("positive")}
            >
              ★ 4+
            </button>
            <button
              type="button"
              className={`filter-pill ${activeFilter === "critical" ? "active" : ""}`}
              onClick={() => setActiveFilter("critical")}
            >
              Critical
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 ? (
        <div className="no-reviews-container">
          <div className="no-reviews-icon">💬</div>
          <h3>No matching reviews</h3>
          <p>We couldn't find any reviews matching this criterion.</p>
          {activeFilter !== "all" && (
            <button
              type="button"
              className="reset-filter-btn"
              onClick={() => setActiveFilter("all")}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        /* Staggered Animated Grid */
        <div className="reviews-grid">
          {filteredReviews.map((review, index) => (
            <ReviewCard
              key={review.id || index}
              review={review}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewsList;
