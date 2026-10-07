import React from "react";
import "./ErrorMessage.css";

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container">
      <div className="error-icon">
        !
      </div>

      <div>
        <h3>
          Something went wrong
        </h3>

        <p>
          {message}
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;