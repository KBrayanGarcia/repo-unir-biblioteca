import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({
  value,
  onChange,
  suggestions = [],
  onSuggestionClick,
  placeholder = 'Buscar libros por título o autor...',
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (val) => {
    onChange(val);
    setShowSuggestions(val.trim().length > 0);
  };

  const handleSuggestionSelect = (suggestion) => {
    onSuggestionClick(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-bar__input-container">
        <input
          type="text"
          className="search-bar__input"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowSuggestions(value.trim().length > 0)}
          placeholder={placeholder}
        />
        <svg
          className="search-bar__icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="search-bar__suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="search-bar__suggestion-item"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
