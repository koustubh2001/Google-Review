import React from "react";
import "./LocationHeader.css";

const LocationHeader = ({ location }) => {
  if (!location) return null;

  return (
    <div className="location-header-card">
      <div className="location-info">
        <span className="location-badge">📍 Verified Location</span>
        <h1>{location.name}</h1>
        <p className="location-address">{location.address}</p>

        <div className="location-rating-badge">
          ★ {location.rating ? location.rating.toFixed(1) : "N/A"}
        </div>
      </div>

      {/* Place Photos / Map Gallery */}
      {location.photos && location.photos.length > 0 && (
        <div className="location-photos-gallery">
          {location.photos.slice(0, 4).map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`${location.name} photo ${index + 1}`}
              className="location-photo"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationHeader;