// src/components/ui/StarRating.jsx
// Description: Interactive or read-only star rating component.

import React from 'react';

const StarRating = ({ value, onChange, readonly, size = 20 }) => {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(star => (
        <svg
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          width={size} height={size} viewBox="0 0 24 24"
          fill={star <= value ? "#F58220" : "#D1D5DB"}
          className={readonly ? "" : "cursor-pointer"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
