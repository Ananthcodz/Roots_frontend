import React from 'react';
import './Toggle.css';

const Toggle = ({ 
  checked, 
  onChange, 
  label, 
  disabled = false,
  id,
  name
}) => {
  const toggleId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className="toggle-wrapper">
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`toggle-switch ${checked ? 'toggle-checked' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        <span className="toggle-slider" aria-hidden="true" />
      </button>
      {label && (
        <label 
          htmlFor={toggleId} 
          className="toggle-label"
          onClick={handleClick}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Toggle;
