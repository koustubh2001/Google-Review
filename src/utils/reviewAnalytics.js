const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const calculateReviewAnalytics = (reviews = []) => {
  if (!reviews || reviews.length === 0) {
    return {
      totalReviews: 0,
      overallAverage: 0,
      dailyBreakdown: DAYS_OF_WEEK.map((day) => ({
        day,
        averageRating: 0,
        count: 0,
      })),
      mostPositiveDay: null,
      mostNegativeDay: null,
    };
  }

  const dayBuckets = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = { totalStars: 0, count: 0 };
    return acc;
  }, {});

  let totalRatingSum = 0;

  reviews.forEach((review) => {
    const rating = Number(review.rating || 0);
    totalRatingSum += rating;

    let reviewDate = new Date(review.date);
    if (isNaN(reviewDate.getTime())) {
      reviewDate = new Date();
    }

    const dayName = DAYS_OF_WEEK[reviewDate.getDay()];
    dayBuckets[dayName].totalStars += rating;
    dayBuckets[dayName].count += 1;
  });

  const dailyBreakdown = DAYS_OF_WEEK.map((day) => {
    const { totalStars, count } = dayBuckets[day];
    const averageRating =
      count > 0 ? Number((totalStars / count).toFixed(2)) : 0;
    return {
      day,
      averageRating,
      count,
    };
  });

  const activeDays = dailyBreakdown.filter((d) => d.count > 0);

  let mostPositiveDay = null;
  let mostNegativeDay = null;

  if (activeDays.length > 0) {
    mostPositiveDay = [...activeDays].sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      return b.count - a.count;
    })[0];

    mostNegativeDay = [...activeDays].sort((a, b) => {
      if (a.averageRating !== b.averageRating) {
        return a.averageRating - b.averageRating;
      }
      return b.count - a.count;
    })[0];
  }

  const overallAverage = Number((totalRatingSum / reviews.length).toFixed(1));

  return {
    totalReviews: reviews.length,
    overallAverage,
    dailyBreakdown,
    mostPositiveDay,
    mostNegativeDay,
  };
};
