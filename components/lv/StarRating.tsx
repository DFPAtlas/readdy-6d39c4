'use client';

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const handleClick = (star: number) => {
    if (interactive && onChange) {
      onChange(star);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex items-center gap-0.5 ${sizeClasses[size]}`}>
      {Array.from({ length: maxRating }, (_, i) => {
        const star = i + 1;
        const filled = star <= displayRating;
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`w-5 h-5 flex items-center justify-center cursor-pointer transition-colors ${
              interactive ? '' : 'pointer-events-none'
            }`}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <i
              className={`${filled ? 'ri-star-fill' : 'ri-star-line'} ${
                filled ? 'text-amber-500' : 'text-slate-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}