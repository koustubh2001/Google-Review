import React, { useState, useRef } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch, loading }) => {
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!search.trim() || loading) {
      return;
    }

    onSearch(search.trim());
  };

  const handleClear = () => {
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <form className="search-wrapper" onSubmit={handleSubmit} role="search">
      <div className="search-bar-pill">
        <div className="search-icon-container" aria-hidden="true">
          <svg
            className="search-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search a business, address, or location..."
          disabled={loading}
          className="search-input"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Action Buttons: Clear & Submit */}
        <div className="search-actions">
          {search && !loading && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              aria-label="Clear search query"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <button
            className={`search-submit-btn ${loading ? "is-loading" : ""}`}
            type="submit"
            disabled={loading || !search.trim()}
            aria-label="Submit search"
          >
            {loading ? (
              <span className="search-spinner" />
            ) : (
              <span className="search-btn-content">
                <span>Search</span>
                <svg
                  className="arrow-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
