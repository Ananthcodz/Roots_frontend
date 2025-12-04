import React from 'react';
import './StepIndicator.css';

const StepIndicator = ({ currentStep, totalSteps, className = '' }) => {
  return (
    <div className={`step-indicator ${className}`} role="status" aria-live="polite">
      <span className="step-indicator-text">
        STEP {currentStep} OF {totalSteps}
      </span>
    </div>
  );
};

export default StepIndicator;
