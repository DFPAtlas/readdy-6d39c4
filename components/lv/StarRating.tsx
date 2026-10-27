'use client';

import Icon from './Icon';

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
    <div role={interactive ? "radiogroup" : "img"} aria-label={interactive ? "Overall rating" : `${rating} out of ${maxRating} stars`} className={`flex items-center gap-0.5 ${sizeClasses[size]}`}>
      {Array.from({ length: maxRating }, (_, i) => {
        const star = i + 1;
        const filled = star <= displayRating;
        return (
          <button
            key={star}
            type="button"
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? star === rating : undefined}
            tabIndex={interactive && star === (rating || 1) ? 0 : -1}
            aria-hidden={!interactive || undefined}
            data-star={star}
            onKeyDown={(event) => {
              if (!interactive) return;
              const values: Record<string, number> = { ArrowRight: Math.min(maxRating, star + 1), ArrowUp: Math.min(maxRating, star + 1), ArrowLeft: Math.max(1, star - 1), ArrowDown: Math.max(1, star - 1), Home: 1, End: maxRating };
              const next = values[event.key];
              if (!next) return;
              event.preventDefault();
              onChange?.(next);
              event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-star="${next}"]`)?.focus();
            }}
            onClick={() => handleClick(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`w-5 h-5 flex items-center justify-center cursor-pointer transition-colors ${
              interactive ? '' : 'pointer-events-none'
            }`}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Icon
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
