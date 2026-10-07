import mockReviews from "../data/mockReviews";

const USE_MOCK_DATA = true; // Set to false to use live SerpApi data
const SERP_API_KEY = import.meta.env.VITE_SERPAPI_KEY;

// https://serpapi.com/dashboard
//https://serpapi.com/manage-api-key go to this website to get your own API key for free. 
// You can use it in the .env file as VITE_SERPAPI_KEY=your_api_key_here


export const searchReviews = async (location) => {
  if (!location || !location.trim()) {
    throw new Error("Please enter a location.");
  }

  const searchLocation = location.trim();

  // Mock Fallback
  if (USE_MOCK_DATA || !SERP_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      location: {
        name: searchLocation,
        address: `${searchLocation}, Karnataka, India`,
        rating: 4.5,
        thumbnail: "",
        photos: [],
      },
      reviews: mockReviews,
    };
  }

  try {
    // 1. Search place details
    const placeUrl = `/serpapi/search.json?engine=google_maps&q=${encodeURIComponent(
      searchLocation
    )}&api_key=${SERP_API_KEY}`;

    const placeRes = await fetch(placeUrl);
    if (!placeRes.ok) {
      throw new Error("Failed to find location details.");
    }

    const placeJson = await placeRes.json();
    const place = placeJson.place_results || placeJson.local_results?.[0];

    if (!place) {
      throw new Error(`No results found for "${searchLocation}".`);
    }

    // 2. Extract Details & Images (MUST be inside try block after `place` is defined)
    const locationName = place.title || searchLocation;
    const locationAddress = place.address || searchLocation;
    const locationRating = Number(place.rating || 0);

    const locationThumbnail = place.thumbnail || "";
    const placePhotos = (place.photos || place.images || []).map(
      (photo) => photo.thumbnail || photo.image || photo
    );
    const locationPhotos =
      placePhotos.length > 0
        ? placePhotos
        : locationThumbnail
        ? [locationThumbnail]
        : [];

    // 3. Fetch reviews using place data_id
    let fetchedReviews = [];

    if (place.data_id) {
      const reviewsUrl = `/serpapi/search.json?engine=google_maps_reviews&data_id=${place.data_id}&api_key=${SERP_API_KEY}`;
      const reviewsRes = await fetch(reviewsUrl);

      if (reviewsRes.ok) {
        const reviewsJson = await reviewsRes.json();
        const rawReviews = reviewsJson.reviews || [];

        fetchedReviews = rawReviews.map((r, idx) => ({
          id: r.review_id || `review-${idx}`,
          author: r.user?.name || "Anonymous",
          rating: Number(r.rating || 0),
          text: r.snippet || "",
          date: r.iso_date || new Date().toISOString(),
          profilePhoto: r.user?.thumbnail || "",
        }));
      }
    }

    // Fallback if no separate reviews returned
    if (fetchedReviews.length === 0 && place.user_reviews?.most_relevant) {
      fetchedReviews = place.user_reviews.most_relevant.map((r, idx) => ({
        id: `rev-${idx}`,
        author: r.username || "Anonymous",
        rating: Number(r.rating || 0),
        text: r.description || "",
        date: new Date().toISOString(),
        profilePhoto: "",
      }));
    }

    return {
      location: {
        name: locationName,
        address: locationAddress,
        rating: locationRating,
        thumbnail: locationThumbnail,
        photos: locationPhotos,
        gpsCoordinates: place.gps_coordinates || null,
      },
      reviews: fetchedReviews,
    };
  } catch (err) {
    console.error("SerpApi Fetch Error:", err);
    throw new Error(err.message || "Unable to fetch reviews from Google.");
  }
};