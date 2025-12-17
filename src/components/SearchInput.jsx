import { useState, useEffect, useRef } from 'react';
import './SearchInput.css';

function SearchInput({ value, onChange, placeholder = 'Search...', debounceMs = 300, resultsCount = null }) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced callback
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onChange('');
  };

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="search-input">
      <svg 
        className="search-icon" 
        width="20" 
        height="20" 
        viewBox="0 0 20 20" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path 
          d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input-field"
        aria-label="Search family tree"
        aria-describedby={resultsCount !== null ? "search-results-count" : undefined}
      />
      {localValue && (
        <button 
          className="search-clear-button" 
          onClick={handleClear}
          aria-label="Clear search"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path 
              d="M12 4L4 12M4 4l8 8" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      {resultsCount !== null && localValue && (
        <div 
          id="search-results-count" 
          className="sr-only" 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
        >
          {resultsCount === 0 
            ? 'No results found' 
            : `${resultsCount} result${resultsCount === 1 ? '' : 's'} found`}
        </div>
      )}
    </div>
  );
}

export default SearchInput;
