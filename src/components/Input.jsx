import React from 'react';
import './Input.css';

const Input = ({ 
  type = 'text', 
  label, 
  placeholder = '', 
  value, 
  onChange, 
  error = null, 
  required = false,
  name,
  id,
  className = ''
}) => {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        className={`input-field ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <span id={`${inputId}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
