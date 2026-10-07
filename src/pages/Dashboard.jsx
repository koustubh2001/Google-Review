import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import LocationHeader from "../components/LocationHeader/LocationHeader";
import SummaryCards from "../components/SummaryCards/SummaryCards";
import DailyRatings from "../components/DailyRatings/DailyRatings";
import ReviewsList from "../components/ReviewsList/ReviewsList";
import Loading from "../components/Loading/Loading";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";

import { searchReviews } from "../services/reviewsApi";
import { calculateReviewAnalytics } from "../utils/reviewAnalytics";

import "./Dashboard.css";

const Dashboard = () => {
  const [location, setLocation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification]);

  // Search and analyze reviews
  const handleSearch = async (searchText) => {
    try {
      setLoading(true);
      setError("");

      setNotification({
        type: "loading",
        title: "Analyzing reviews",
        message: `Fetching review data for ${searchText}...`,
      });

      const result = await searchReviews(searchText);

      if (!result) {
        throw new Error("No data found.");
      }

      const reviewData = result.reviews || [];
      const calculatedAnalytics = calculateReviewAnalytics(reviewData);

      setLocation(result.location);
      setReviews(reviewData);
      setAnalytics(calculatedAnalytics);

      setNotification({
        type: "success",
        title: "Analysis completed",
        message: `${reviewData.length} reviews analyzed successfully.`,
      });
    } catch (err) {
      console.error(err);

      setError(err.message || "Something went wrong while fetching reviews.");

      setLocation(null);
      setReviews([]);
      setAnalytics(null);

      setNotification({
        type: "error",
        title: "Unable to load reviews",
        message: err.message || "Please try searching again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getReviewHealth = () => {
    if (!analytics) return null;

    const rating = Number(analytics.overallAverage || 0);

    if (rating >= 4.5) {
      return {
        label: "Excellent",
        description: "Customers are highly satisfied with this location.",
        className: "health-excellent",
        icon: "🌟",
      };
    }

    if (rating >= 4.0) {
      return {
        label: "Very Good",
        description:
          "The location is receiving consistently positive feedback.",
        className: "health-good",
        icon: "😊",
      };
    }

    if (rating >= 3.0) {
      return {
        label: "Average",
        description: "Customer feedback is mixed and may need attention.",
        className: "health-average",
        icon: "😐",
      };
    }

    return {
      label: "Needs Attention",
      description:
        "Customer feedback indicates areas that may need improvement.",
      className: "health-poor",
      icon: "⚠️",
    };
  };

  const reviewHealth = getReviewHealth();

  return (
    <div className="dashboard">
      {notification && (
        <div className={`dashboard-notification ${notification.type}`}>
          <div className="notification-icon">
            {notification.type === "success" && "✓"}
            {notification.type === "error" && "!"}
            {notification.type === "loading" && "↻"}
          </div>

          <div className="notification-content">
            <strong>{notification.title}</strong>
            <span>{notification.message}</span>
          </div>

          <button
            className="notification-close"
            onClick={() => setNotification(null)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-decoration hero-decoration-one" />
        <div className="hero-decoration hero-decoration-two" />
        <div className="hero-decoration hero-decoration-three" />

        <div className="dashboard-container">
          <div className="dashboard-hero-content">
            <div className="dashboard-badge">
              <span className="badge-dot" />
              Google Reviews Analytics
            </div>

            <h1>
              Understand Your <span>Customer Reviews</span>
            </h1>

            <p className="hero-description">
              Search any location and turn customer reviews into meaningful
              insights. Discover ratings, review trends, positive days, negative
              days, and customer sentiment.
            </p>

            <SearchBar onSearch={handleSearch} loading={loading} />

            <div className="hero-features">
              <div className="hero-feature">
                <span>✓</span>
                <p>Review Analytics</p>
              </div>
              <div className="hero-feature">
                <span>✓</span>
                <p>Daily Rating Trends</p>
              </div>
              <div className="hero-feature">
                <span>✓</span>
                <p>Best &amp; Worst Days</p>
              </div>
              <div className="hero-feature">
                <span>✓</span>
                <p>Customer Insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {loading && (
            <div className="dashboard-loading-wrapper">
              <Loading />
              <div className="loading-message">
                <span className="loading-pulse" />
                Processing review analytics...
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="dashboard-error-wrapper">
              <ErrorMessage message={error} />
              <button
                className="retry-button"
                onClick={() => {
                  setError("");
                  setNotification(null);
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && location && (
            <div className="dashboard-results">
              <LocationHeader location={location} />

              {analytics && <SummaryCards analytics={analytics} />}

              {analytics && reviewHealth && (
                <section className="review-health-section">
                  <div className="section-heading">
                    <div>
                      <span className="section-eyebrow">REVIEW HEALTH</span>
                      <h2>Overall Customer Sentiment</h2>
                      <p>
                        A quick overview of how customers perceive this
                        location.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`review-health-card ${reviewHealth.className}`}
                  >
                    <div className="health-icon">{reviewHealth.icon}</div>

                    <div className="health-content">
                      <span>Current Review Health</span>
                      <h3>{reviewHealth.label}</h3>
                      <p>{reviewHealth.description}</p>
                    </div>

                    <div className="health-rating">
                      <strong>
                        {Number(analytics.overallAverage || 0).toFixed(1)}
                      </strong>
                      <span>/ 5</span>
                      <div className="health-stars">★★★★★</div>
                    </div>
                  </div>
                </section>
              )}

              {/* Daily Breakdown */}
              {analytics && <DailyRatings analytics={analytics} />}
              {analytics && (
                <section className="insights-section">
                  <div className="section-heading">
                    <div>
                      <span className="section-eyebrow">SMART INSIGHTS</span>
                      <h2>What the Reviews Tell You</h2>
                      <p>
                        Important patterns discovered from your review data.
                      </p>
                    </div>
                  </div>

                  <div className="insights-grid">
                    <div className="insight-card positive">
                      <div className="insight-top">
                        <div className="insight-icon">↑</div>
                        <span>Positive Trend</span>
                      </div>
                      <h3>{analytics.mostPositiveDay?.day || "N/A"}</h3>
                      <p>This day has the highest average customer rating.</p>
                      <div className="insight-value">
                        <strong>
                          {Number(
                            analytics.mostPositiveDay?.averageRating || 0,
                          ).toFixed(1)}
                        </strong>
                        <span>average rating</span>
                      </div>
                    </div>

                    {/* Negative Day */}
                    <div className="insight-card negative">
                      <div className="insight-top">
                        <div className="insight-icon">↓</div>
                        <span>Attention Needed</span>
                      </div>
                      <h3>{analytics.mostNegativeDay?.day || "N/A"}</h3>
                      <p>This day has the lowest average customer rating.</p>
                      <div className="insight-value">
                        <strong>
                          {Number(
                            analytics.mostNegativeDay?.averageRating || 0,
                          ).toFixed(1)}
                        </strong>
                        <span>average rating</span>
                      </div>
                    </div>

                    {/* Review Volume */}
                    <div className="insight-card neutral">
                      <div className="insight-top">
                        <div className="insight-icon">#</div>
                        <span>Review Volume</span>
                      </div>
                      <h3>
                        {Number(analytics.totalReviews || 0).toLocaleString()}
                      </h3>
                      <p>Customer reviews included in this analysis.</p>
                      <div className="insight-value">
                        <strong>
                          {Number(analytics.overallAverage || 0).toFixed(1)}
                        </strong>
                        <span>overall rating</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Individual Reviews Listing */}
              <section className="reviews-section">
                <div className="section-heading">
                  <div>
                    <span className="section-eyebrow">CUSTOMER FEEDBACK</span>
                    <h2>Recent Reviews</h2>
                    <p>Explore the feedback behind the analytics.</p>
                  </div>
                  <div className="review-count-badge">
                    {reviews.length} Reviews
                  </div>
                </div>

                <ReviewsList reviews={reviews} location={location} />
              </section>
            </div>
          )}

          {/* Empty State / How It Works */}
          {!loading && !error && !location && (
            <section className="how-it-works">
              <div className="section-heading centered">
                <span className="section-eyebrow">SIMPLE &amp; POWERFUL</span>
                <h2>Turn Reviews Into Insights</h2>
                <p>Analyze customer feedback in three simple steps.</p>
              </div>

              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-number">01</div>
                  <div className="step-icon">🔎</div>
                  <h3>Search a Location</h3>
                  <p>
                    Enter a business, city, or location to start analyzing its
                    customer reviews.
                  </p>
                </div>

                <div className="step-card">
                  <div className="step-number">02</div>
                  <div className="step-icon">📊</div>
                  <h3>Analyze Reviews</h3>
                  <p>
                    Review ratings, daily trends, customer sentiment, and review
                    volume.
                  </p>
                </div>

                <div className="step-card">
                  <div className="step-number">03</div>
                  <div className="step-icon">💡</div>
                  <h3>Discover Insights</h3>
                  <p>
                    Find the most positive and negative days and understand
                    customer feedback patterns.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
