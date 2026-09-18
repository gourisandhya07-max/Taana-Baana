import React from 'react';

/**
 * Taana Baana Official Brand Logo Component
 * Uses the authentic brand identity mark uploaded by the user:
 * 'tb' woven monogram + 'taana-baana' wordmark + 'From Hands to Markets.' tagline
 */
export default function TaanaBaanaLogo({
  size = 'md',
  showTagline = true,
  onClick,
  variant = 'default' // 'default' | 'badge' | 'full'
}) {
  // Size presets
  const sizeMap = {
    sm: { height: 38, logoImgHeight: 34, fontSize: '1.15rem', taglineSize: '0.65rem', gap: '8px' },
    md: { height: 48, logoImgHeight: 42, fontSize: '1.45rem', taglineSize: '0.72rem', gap: '10px' },
    lg: { height: 72, logoImgHeight: 64, fontSize: '2.2rem', taglineSize: '0.85rem', gap: '14px' },
    xl: { height: 130, logoImgHeight: 120, fontSize: '3.2rem', taglineSize: '1.05rem', gap: '16px' }
  };

  const dim = sizeMap[size] || sizeMap.md;

  if (size === 'xl' || variant === 'full') {
    return (
      <div
        onClick={onClick}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: onClick ? 'pointer' : 'default',
          userSelect: 'none',
          transition: 'transform 0.25s ease'
        }}
      >
        <img
          src="/brand-logo.png"
          alt="Taana Baana — From Hands to Markets"
          style={{
            height: dim.logoImgHeight,
            maxHeight: '160px',
            width: 'auto',
            objectFit: 'contain',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(59, 42, 30, 0.12)',
            border: '2px solid #E8D9C5',
            backgroundColor: '#FDFBF7'
          }}
        />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dim.gap,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'transform 0.2s ease'
      }}
      className="brand-logo-hover"
    >
      {/* Authentic Brand Emblem Image */}
      <div
        style={{
          height: dim.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: size === 'sm' ? '10px' : '14px',
          border: '1.5px solid #E8D9C5',
          backgroundColor: '#FDFBF7',
          padding: '2px 4px',
          boxShadow: '0 2px 8px rgba(59, 42, 30, 0.08)'
        }}
      >
        <img
          src="/brand-logo.png"
          alt="Taana Baana"
          style={{
            height: dim.logoImgHeight,
            width: 'auto',
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>

      {/* Styled Wordmark & Tagline */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span
          style={{
            fontFamily: "'Playfair Display', 'Cinzel', serif",
            fontSize: dim.fontSize,
            fontWeight: '800',
            color: '#3B2A1E',
            lineHeight: '1.05',
            letterSpacing: '-0.02em',
            margin: 0
          }}
        >
          taana-baana
        </span>
        {showTagline && (
          <span
            style={{
              fontSize: dim.taglineSize,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: '700',
              color: '#C1602C',
              letterSpacing: '0.05em',
              marginTop: '2px'
            }}
          >
            — From Hands to Markets. —
          </span>
        )}
      </div>
    </div>
  );
}
