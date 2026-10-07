import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>

      <h3>Fetching reviews...</h3>

      <p>Analyzing review data and daily ratings</p>
    </div>
  );
};

export default Loading;
