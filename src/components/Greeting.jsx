import { useMemo } from 'react';
import './Greeting.css';

/**
 * Get time-based greeting based on current hour
 * @param {Date} time - The time to check (defaults to current time)
 * @returns {string} - "Good Morning", "Good Afternoon", or "Good Evening"
 */
export const getTimeBasedGreeting = (time = new Date()) => {
  const hour = time.getHours();
  
  if (hour >= 0 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

/**
 * Format date as "Month DD, YYYY"
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date = new Date()) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const Greeting = ({ firstName, currentTime }) => {
  const greeting = useMemo(() => {
    return getTimeBasedGreeting(currentTime);
  }, [currentTime]);

  const formattedDate = useMemo(() => {
    return formatDate(currentTime);
  }, [currentTime]);

  return (
    <div className="greeting-container">
      <div className="greeting-content">
        <h1 className="greeting-title">
          {greeting}, {firstName}
        </h1>
        <p className="greeting-subtitle">
          Here's what's happening in your family network today.
        </p>
      </div>
      <div className="greeting-date">{formattedDate}</div>
    </div>
  );
};

export default Greeting;
