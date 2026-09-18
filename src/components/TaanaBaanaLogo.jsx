import React from 'react';

export default function TaanaBaanaLogo({ size = 'md', showTagline = true, onClick }) {
  // Size presets
  const sizeMap = {
    sm: { iconWidth: 32, iconHeight: 32, fontSize: '1.25rem', taglineSize: '0.68rem', gap: '8px' },
    md: { iconWidth: 44, iconHeight: 44, fontSize: '1.65rem', taglineSize: '0.75rem', gap: '10px' },
    lg: { iconWidth: 64, iconHeight: 64, fontSize: '2.5rem', taglineSize: '0.9rem', gap: '14px' },
    xl: { iconWidth: 90, iconHeight: 90, fontSize: '3.6rem', taglineSize: '1.1rem', gap: '18px' }
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dim.gap,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      {/* Monogram Badge: 't' + Woven Infinity Ribbon + 'b' */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #E8D9C5',
        borderRadius: size === 'sm' ? '10px' : '16px',
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        boxShadow: '0 4px 14px rgba(59, 42, 30, 0.08)'
      }}>
        {/* Monogram 't' */}
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: '800',
          fontSize: dim.fontSize,
          color: '#C1602C',
          lineHeight: 1
        }}>
          t
        </span>

        {/* Woven Ribbon SVG Icon (Infinity Loop Crossing Threads) */}
        <svg
          width={dim.iconWidth}
          height={dim.iconHeight}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ margin: '0 2px' }}
        >
          <defs>
            {/* Thread Linear Gradients */}
            <linearGradient id="tbTerracotta" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D96E34" />
              <stop offset="100%" stopColor="#C1602C" />
            </linearGradient>

            <linearGradient id="tbOlive" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8DA066" />
              <stop offset="100%" stopColor="#7C8A5A" />
            </linearGradient>

            <linearGradient id="tbIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#788892" />
              <stop offset="100%" stopColor="#5C6B73" />
            </linearGradient>

            <filter id="ribbonShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3B2A1E" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Infinity Loop Woven Threads Path 1: Terracotta */}
          <path
            d="M 25 50 C 25 30, 45 30, 50 50 C 55 70, 75 70, 75 50 C 75 30, 55 30, 50 50 C 45 70, 25 70, 25 50 Z"
            stroke="url(#tbTerracotta)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ribbonShadow)"
          />

          {/* Infinity Loop Woven Threads Path 2: Olive (Cross Weave) */}
          <path
            d="M 25 50 C 25 70, 45 70, 50 50 C 55 30, 75 30, 75 50 C 75 70, 55 70, 50 50 C 45 30, 25 30, 25 50 Z"
            stroke="url(#tbOlive)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="14 4"
          />

          {/* Center Interlocking Thread Knot: Blue-Grey */}
          <path
            d="M 40 50 Q 50 40, 60 50 Q 50 60, 40 50 Z"
            fill="url(#tbIndigo)"
            stroke="#FFFFFF"
            strokeWidth="2"
          />

          {/* Gold Sparkle Accents */}
          <circle cx="50" cy="50" r="3.5" fill="#D9A441" />
          <circle cx="28" cy="40" r="2.5" fill="#D9A441" />
          <circle cx="72" cy="60" r="2.5" fill="#D9A441" />
        </svg>

        {/* Monogram 'b' */}
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: '800',
          fontSize: dim.fontSize,
          color: '#7C8A5A',
          lineHeight: 1
        }}>
          b
        </span>
      </div>

      {/* Wordmark & Tagline */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: dim.fontSize,
          fontWeight: '800',
          color: '#3B2A1E',
          lineHeight: '1.05',
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          taana-baana
        </h1>
        {showTagline && (
          <span style={{
            fontSize: dim.taglineSize,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: '700',
            color: '#C1602C',
            letterSpacing: '0.04em',
            marginTop: '2px'
          }}>
            From Hands to Markets.
          </span>
        )}
      </div>
    </div>
  );
}
