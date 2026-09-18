import React, { useState, useEffect } from 'react';
import TaanaBaanaLogo from './TaanaBaanaLogo';
import { translations } from '../lib/translations';

export default function SplashIntro({ onComplete, lang = 'en' }) {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState(1); // 1: Threads weaving, 2: Motif reveal, 3: Logo settle
  const t = translations[lang] || translations.en;

  useEffect(() => {
    // Check if intro was already seen in this session
    const seen = sessionStorage.getItem('taana_intro_seen');
    if (seen === 'true') {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    const timer1 = setTimeout(() => setPhase(2), 1000);
    const timer2 = setTimeout(() => setPhase(3), 2200);
    const timer3 = setTimeout(() => handleFinish(), 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleFinish = () => {
    sessionStorage.setItem('taana_intro_seen', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  return (
    <div style={styles.overlay}>
      {/* Skip Button */}
      <button onClick={handleFinish} style={styles.skipBtn}>
        {t.skipIntro || 'Skip Intro'} ➔
      </button>

      {/* SVG Canvas for Thread Weaving & Motifs */}
      <div style={styles.canvasContainer}>
        <svg viewBox="0 0 800 600" style={styles.svgCanvas}>
          <defs>
            {/* Thread Gradients */}
            <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C1602C" />
              <stop offset="100%" stopColor="#D96E34" />
            </linearGradient>
            <linearGradient id="oliveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C8A5A" />
              <stop offset="100%" stopColor="#8DA066" />
            </linearGradient>
            <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5C6B73" />
              <stop offset="100%" stopColor="#788892" />
            </linearGradient>

            {/* Madhubani Temple Border Pattern */}
            <pattern id="templePattern" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0,20 L 20,0 L 40,20 Z" fill="none" stroke="#C1602C" strokeWidth="1.5" opacity="0.3" />
            </pattern>
          </defs>

          {/* Top & Bottom Border Pattern */}
          <rect x="0" y="20" width="800" height="20" fill="url(#templePattern)" />
          <rect x="0" y="560" width="800" height="20" fill="url(#templePattern)" />

          {/* Warli Art Background Line Drawings */}
          <g opacity={phase >= 2 ? "0.25" : "0"} style={{ transition: 'opacity 1s ease' }}>
            <circle cx="400" cy="300" r="160" fill="none" stroke="#3B2A1E" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="400" cy="300" r="25" fill="none" stroke="#D9A441" strokeWidth="2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1={400 + 25 * Math.cos((angle * Math.PI) / 180)}
                y1={300 + 25 * Math.sin((angle * Math.PI) / 180)}
                x2={400 + 40 * Math.cos((angle * Math.PI) / 180)}
                y2={300 + 40 * Math.sin((angle * Math.PI) / 180)}
                stroke="#D9A441"
                strokeWidth="2"
              />
            ))}
          </g>

          {/* Interlocking Weaving Thread Paths */}
          <g>
            <path
              d="M 50 300 Q 200 240, 400 300 T 750 300"
              fill="none"
              stroke="url(#terracottaGrad)"
              strokeWidth="4"
              strokeDasharray="800"
              strokeDashoffset={phase === 1 ? "400" : "0"}
              style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            <path
              d="M 50 320 Q 200 380, 400 300 T 750 280"
              fill="none"
              stroke="url(#oliveGrad)"
              strokeWidth="4"
              strokeDasharray="800"
              strokeDashoffset={phase === 1 ? "500" : "0"}
              style={{ transition: 'stroke-dashoffset 2.0s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            <path
              d="M 400 100 Q 340 200, 400 300 T 400 500"
              fill="none"
              stroke="url(#indigoGrad)"
              strokeWidth="3.5"
              strokeDasharray="600"
              strokeDashoffset={phase === 1 ? "400" : "0"}
              style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </g>
        </svg>

        {/* Center Logo Settle */}
        <div style={{
          ...styles.logoContainer,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase === 3 ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(16px)'
        }}>
          <TaanaBaanaLogo size="xl" showTagline={true} />
          <p style={styles.subtitleText}>{t.splashSubtitle}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FAF3E7',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  skipBtn: {
    position: 'absolute',
    top: '24px',
    right: '28px',
    background: 'rgba(59, 42, 30, 0.06)',
    border: '1px solid #E8D9C5',
    color: '#3B2A1E',
    padding: '8px 18px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.2s ease',
    zIndex: 10
  },
  canvasContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '750px',
    height: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  svgCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  },
  logoContainer: {
    position: 'relative',
    textAlign: 'center',
    zIndex: 2,
    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 20px'
  },
  subtitleText: {
    color: '#6E5B4D',
    fontSize: '1rem',
    marginTop: '16px',
    maxWidth: '420px',
    lineHeight: '1.5'
  }
};
