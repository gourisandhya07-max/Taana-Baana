import React from 'react';
import { Globe, Sparkles, CheckCircle2 } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', region: 'All India & Global', icon: '🌐' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', region: 'Kerala Handloom & Craft', icon: '🌴' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', region: 'North & Central India Craft', icon: '🪷' }
];

export default function InitialLanguageModal({ onSelectLanguage }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Brand Ribbon Badge */}
        <div style={styles.topBadge}>
          <Sparkles size={16} color="#D9A441" />
          <span>WELCOME TO TAANA BAANA</span>
        </div>

        <h1 style={styles.title}>Choose Your Preferred Language</h1>
        <p style={styles.subtitle}>
          നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക • अपनी भाषा चुनें • Select how you want to experience the platform.
        </p>

        {/* Large Tappable Language Cards Grid */}
        <div style={styles.grid}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelectLanguage(lang.code)}
              style={styles.langCard}
              type="button"
            >
              <div style={styles.cardIcon}>{lang.icon}</div>
              <div style={styles.cardContent}>
                <h3 style={styles.nativeTitle}>{lang.native}</h3>
                <span style={styles.nameText}>{lang.name}</span>
                <span style={styles.regionText}>{lang.region}</span>
              </div>
              <CheckCircle2 size={20} color="#C1602C" style={styles.checkIcon} />
            </button>
          ))}
        </div>

        <p style={styles.footerNotice}>
          You can change your language anytime from the top navigation bar.
        </p>
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
    zIndex: 999999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundImage: 'radial-gradient(rgba(193, 96, 44, 0.05) 1px, transparent 1px)',
    backgroundSize: '32px 32px'
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '24px',
    maxWidth: '640px',
    width: '100%',
    padding: '40px 32px',
    boxShadow: '0 20px 50px rgba(59, 42, 30, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  topBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FAF2DF',
    border: '1px solid #E5B24E',
    color: '#3B2A1E',
    fontSize: '0.78rem',
    fontWeight: '800',
    padding: '6px 16px',
    borderRadius: '20px',
    marginBottom: '16px',
    letterSpacing: '0.08em'
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2.2rem',
    color: '#3B2A1E',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '0.92rem',
    color: '#6E5B4D',
    maxWidth: '480px',
    lineHeight: '1.5',
    marginBottom: '32px'
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    width: '100%',
    marginBottom: '24px'
  },
  langCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    backgroundColor: '#FAF3E7',
    border: '2px solid #E8D9C5',
    borderRadius: '18px',
    padding: '18px 24px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative'
  },
  cardIcon: {
    fontSize: '2rem'
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  nativeTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.4rem',
    color: '#3B2A1E',
    fontWeight: '800',
    lineHeight: '1.2'
  },
  nameText: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#C1602C'
  },
  regionText: {
    fontSize: '0.78rem',
    color: '#6E5B4D'
  },
  checkIcon: {
    opacity: 0.7
  },
  footerNotice: {
    fontSize: '0.82rem',
    color: '#9B8879'
  }
};
