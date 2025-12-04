import React from 'react';
import './Button.css';

const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false, 
  children,
  type = 'button',
  className = '',
  'aria-label': ariaLabel
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''} ${className}`.trim();
  
  return (
    <button 
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;
