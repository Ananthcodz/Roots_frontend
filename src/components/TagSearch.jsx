import React, { useState, useEffect, useRef } from 'react';
import './TagSearch.css';

const TagSearch = ({ 
  onSearch, 
  results = [], 
  onSelect, 
  selectedTags = [], 
  placeholder = 'Search family members...' 
}) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (query.trim()) {
      const timer = setTimeout(() => {
        onSearch(query);
        setShowDropdown(true);
      }, 300);
      setDebounceTimer(timer);
    } else {
      setShowDropdown(false);
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (result) => {
    onSelect(result.id);
    setQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemove = (tagId) => {
    // Find the tag to remove
    const tagToRemove = selectedTags.find(tag => tag.id === tagId);
    if (tagToRemove) {
      onSelect(tagId); // Toggle off
    }
  };

  // Filter out already selected tags from results
  const filteredResults = results.filter(
    result => !selectedTags.some(tag => tag.id === result.id)
  );

  return (
    <div className="tag-search-wrapper">
      <div className="tag-search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="tag-search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim() && filteredResults.length > 0) {
              setShowDropdown(true);
            }
          }}
          aria-label="Search for family members to tag"
          aria-autocomplete="list"
          aria-controls="tag-search-dropdown"
          aria-expanded={showDropdown}
          role="combobox"
        />
        {showDropdown && query.trim() && (
          <div ref={dropdownRef} id="tag-search-dropdown" className="tag-search-dropdown" role="listbox">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="tag-search-result"
                  onClick={() => handleSelect(result)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(result);
                    }
                  }}
                  role="option"
                  tabIndex={0}
                  aria-label={`Tag ${result.firstName} ${result.lastName}`}
                >
                  <div className="tag-search-result-name">
                    {result.firstName} {result.lastName}
                  </div>
                </div>
              ))
            ) : (
              <div className="tag-search-no-results" role="status">
                No family members found
              </div>
            )}
          </div>
        )}
      </div>
      {selectedTags.length > 0 && (
        <div className="tag-search-tags" role="list" aria-label="Tagged family members">
          {selectedTags.map((tag) => (
            <div key={tag.id} className="tag-search-tag" role="listitem">
              <span>{tag.firstName} {tag.lastName}</span>
              <button
                type="button"
                className="tag-search-tag-remove"
                onClick={() => handleRemove(tag.id)}
                aria-label={`Remove ${tag.firstName} ${tag.lastName}`}
              >
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path 
                    d="M9 3L3 9M3 3L9 9" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSearch;
