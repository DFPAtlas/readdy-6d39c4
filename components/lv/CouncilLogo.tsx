'use client';

import { useState } from 'react';
import { councilInitials, councilLogoSrc, type CouncilLogoType } from '../../lib/councils';

interface CouncilLogoProps {
  name: string;
  logoUrl?: string | null;
  logoType?: CouncilLogoType | string | null;
  size?: number;
  className?: string;
  /** Set when the council name is already part of the surrounding link or label. */
  decorative?: boolean;
}

/**
 * Council logo or coat of arms from Wikimedia Commons, with an initials badge when
 * no image is held or the image fails to load. The badge is hidden from assistive
 * technology because the council name is always shown beside it.
 */
export default function CouncilLogo({ name, logoUrl, logoType, size = 48, className = '', decorative = false }: CouncilLogoProps) {
  const [failed, setFailed] = useState(false);
  const src = councilLogoSrc(logoUrl, size * 2);
  const label = logoType === 'coat_of_arms' ? `${name} coat of arms` : `${name} logo`;

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
        className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-500 ${className}`}
      >
        {councilInitials(name)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export; Commons serves the sized image
    <img
      src={src}
      alt={decorative ? '' : label}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-xl bg-white object-contain p-1 ring-1 ring-slate-200 ${className}`}
    />
  );
}
