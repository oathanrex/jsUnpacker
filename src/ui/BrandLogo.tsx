import { useState } from 'react';
import roundFaviconPng from '../assets/oathanrex-round-favicon.png';
import logoPng from '../assets/oathanrex-logo.png';
import avatarJpg from '../assets/oathanrex-avatar.jpg';

interface BrandLogoProps {
  size?: number;
  shape?: 'circle' | 'squircle';
  className?: string;
  alt?: string;
  showFallbackOnFail?: boolean;
}

const REMOTE_ROUND_FAVICON =
  'https://raw.githubusercontent.com/oathanrex/oathanrex-legacy-portfolio/main/favicon.png';
const REMOTE_LOGO_FALLBACK =
  'https://raw.githubusercontent.com/oathanrex/images/main/oathanrex-logo.png';
const YOUTUBE_AVATAR_FALLBACK =
  'https://yt3.googleusercontent.com/7M__4FsQrFMO8uXV3GVtmZMYG1ofOs8PzfGZYTMXcKclneJqpSNdAwBTTMak0DA1qNXAJ_WWjw=s160-c-k-c0x00ffffff-no-rj';

export function BrandLogo({
  size = 32,
  shape = 'circle',
  className = '',
  alt = 'OathanRex Logo',
}: BrandLogoProps) {
  const [src, setSrc] = useState(roundFaviconPng);

  const isCircle = shape === 'circle';
  const radiusStyle = isCircle ? '50%' : `${Math.max(6, Math.round(size * 0.28))}px`;

  const handleImageError = () => {
    if (src === roundFaviconPng) {
      setSrc(logoPng);
    } else if (src === logoPng) {
      setSrc(avatarJpg);
    } else if (src === avatarJpg) {
      setSrc(REMOTE_ROUND_FAVICON);
    } else if (src === REMOTE_ROUND_FAVICON) {
      setSrc(REMOTE_LOGO_FALLBACK);
    } else if (src === REMOTE_LOGO_FALLBACK) {
      setSrc(YOUTUBE_AVATAR_FALLBACK);
    }
  };

  return (
    <span
      className={`logo-icon relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none bg-[var(--brand-card-bg)] shadow-xs transition-all duration-200 border border-[var(--brand-border)] ${
        isCircle ? 'rounded-full' : ''
      } ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: radiusStyle,
      }}
      aria-hidden="true"
    >
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        onError={handleImageError}
        className={`h-full w-full object-cover transition-transform duration-200 ${
          isCircle ? 'rounded-full' : ''
        }`}
        style={{
          borderRadius: radiusStyle,
        }}
      />
    </span>
  );
}
