import React from 'react';

// Rounds to the nearest whole star — half-star glyphs read as noise at this size.
const Stars = ({ value = 0, className = '' }) => {
  const filled = Math.round(Number(value) || 0);
  return (
    <span className={`text-sm leading-none text-gold-500 ${className}`} aria-label={`${value} out of 5`}>
      {'★'.repeat(filled)}
      <span className="text-primary-200">{'★'.repeat(Math.max(5 - filled, 0))}</span>
    </span>
  );
};

export default Stars;
