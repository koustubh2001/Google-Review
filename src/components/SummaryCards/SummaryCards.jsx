import React from "react";
import "./SummaryCards.css";

const SummaryCards = ({ analytics }) => {
  const safeAnalytics = analytics || {};

  const totalReviews = Number(
    safeAnalytics.totalReviews ?? safeAnalytics.reviewCount ?? 0,
  );

  const overallAverage = Number(
    safeAnalytics.overallAverage ?? safeAnalytics.averageRating ?? 0,
  );

  const mostPositiveDay = safeAnalytics.mostPositiveDay || null;
  const mostNegativeDay = safeAnalytics.mostNegativeDay || null;

  const positiveDayName =
    typeof mostPositiveDay === "string"
      ? mostPositiveDay
      : mostPositiveDay?.day || "N/A";

  const positiveDayRating = Number(
    typeof mostPositiveDay === "object"
      ? (mostPositiveDay?.averageRating ?? mostPositiveDay?.average ?? 0)
      : (safeAnalytics.mostPositiveRating ?? 0),
  );

  const negativeDayName =
    typeof mostNegativeDay === "string"
      ? mostNegativeDay
      : mostNegativeDay?.day || "N/A";

  const negativeDayRating = Number(
    typeof mostNegativeDay === "object"
      ? (mostNegativeDay?.averageRating ?? mostNegativeDay?.average ?? 0)
      : (safeAnalytics.mostNegativeRating ?? 0),
  );

  const cards = [
    {
      type: "reviews",
      label: "TOTAL REVIEWS",
      value: totalReviews.toLocaleString(),
      subtext: "Customer reviews analyzed",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      type: "rating",
      label: "OVERALL RATING",
      value: overallAverage.toFixed(1),
      suffix: "/5",
      subtext: "Average customer rating",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      type: "positive",
      label: "MOST POSITIVE DAY",
      value: positiveDayName,
      subtext:
        positiveDayRating > 0
          ? `${positiveDayRating.toFixed(1)} avg rating`
          : "Highest customer rating",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
    {
      type: "negative",
      label: "MOST CRITICAL DAY",
      value: negativeDayName,
      subtext:
        negativeDayRating > 0
          ? `${negativeDayRating.toFixed(1)} avg rating`
          : "Lowest customer rating",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      ),
    },
  ];

  return (
    <section className="summary-cards">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className={`summary-card card-${card.type}`}
          style={{ "--card-index": index }}
        >
          <div className="summary-card-inner">
            <div className={`summary-icon-wrapper icon-${card.type}`}>
              {card.icon}
            </div>

            <div className="summary-card-content">
              <span className="summary-card-label">{card.label}</span>
              <h3 className="summary-card-value">
                {card.value}
                {card.suffix && (
                  <span className="rating-out-of">{card.suffix}</span>
                )}
              </h3>
              <p className="summary-card-subtext">{card.subtext}</p>
            </div>
          </div>
          <div className="card-ambient-glow" />
        </div>
      ))}
    </section>
  );
};

export default SummaryCards;
