import React from 'react';
import LanguageSelector from './LanguageSelector';
import { translations } from '../lib/translations';
import { ShoppingBag, LayoutDashboard, PlusCircle, Home, UserCheck, Sparkles } from 'lucide-react';

export default function Navbar({
  activeView,
  onViewChange,
  currentLang,
  onSelectLang,
  userMode,
  onToggleUserMode,
  cartCount = 0,
  onOpenCart
}) {
  const t = translations[currentLang] || translations.en;

  return (
    <header style={styles.header}>
      {/* Temple Border Ribbon at Top */}
      <div style={styles.topPatternBar} />

      <div style={styles.navContainer}>
        {/* Brand Logo & Tagline */}
        <div style={styles.logoWrapper} onClick={() => onViewChange('home')}>
          <div style={styles.logoBadge}>
            <span style={{ color: '#C1602C', fontWeight: '800' }}>t</span>
            <span style={styles.logoIcon}>🧵</span>
            <span style={{ color: '#7C8A5A', fontWeight: '800' }}>b</span>
          </div>
          <div>
            <span style={styles.brandTitle}>taana-baana</span>
            <span style={styles.brandTagline}>{t.tagline}</span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav style={styles.navLinks}>
          <button
            style={{
              ...styles.navBtn,
              color: activeView === 'home' ? '#C1602C' : '#3B2A1E',
              fontWeight: activeView === 'home' ? '700' : '500'
            }}
            onClick={() => onViewChange('home')}
          >
            <Home size={16} />
            <span>{t.navHome}</span>
          </button>

          <button
            style={{
              ...styles.navBtn,
              color: activeView === 'marketplace' ? '#C1602C' : '#3B2A1E',
              fontWeight: activeView === 'marketplace' ? '700' : '500'
            }}
            onClick={() => onViewChange('marketplace')}
          >
            <ShoppingBag size={16} />
            <span>{t.navMarketplace}</span>
          </button>

          {userMode === 'artisan' && (
            <>
              <button
                style={{
                  ...styles.navBtn,
                  color: activeView === 'dashboard' ? '#C1602C' : '#3B2A1E',
                  fontWeight: activeView === 'dashboard' ? '700' : '500'
                }}
                onClick={() => onViewChange('dashboard')}
              >
                <LayoutDashboard size={16} />
                <span>{t.navDashboard}</span>
              </button>

              <button
                style={{
                  ...styles.navBtnHighlight
                }}
                onClick={() => onViewChange('add-product')}
              >
                <PlusCircle size={16} />
                <span>{t.navAddProduct}</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Section: Mode Toggle + Language Selector + Cart */}
        <div style={styles.rightGroup}>
          {/* Artisan vs Buyer Mode Switcher */}
          <button
            onClick={onToggleUserMode}
            style={{
              ...styles.modeToggleBtn,
              backgroundColor: userMode === 'artisan' ? '#FAF2DF' : '#EBF0F3',
              borderColor: userMode === 'artisan' ? '#D9A441' : '#5C6B73'
            }}
            title="Toggle between Artisan Portal and Customer Marketplace view"
          >
            <Sparkles size={14} color={userMode === 'artisan' ? '#D9A441' : '#5C6B73'} />
            <span>{userMode === 'artisan' ? t.switchArtisan : t.switchBuyer}</span>
          </button>

          {/* Multilingual Selector */}
          <LanguageSelector currentLang={currentLang} onSelectLang={onSelectLang} />

          {/* Cart / Inquiry Counter */}
          <button style={styles.cartBtn} onClick={onOpenCart} title="View Inquiries">
            <ShoppingBag size={18} color="#3B2A1E" />
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(250, 243, 231, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #E8D9C5',
    boxShadow: '0 2px 12px rgba(59, 42, 30, 0.04)'
  },
  topPatternBar: {
    height: '4px',
    background: 'linear-gradient(90deg, #C1602C 0%, #7C8A5A 33%, #D9A441 66%, #5C6B73 100%)'
  },
  navContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px'
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(59, 42, 30, 0.06)'
  },
  logoIcon: {
    fontSize: '1.1rem',
    margin: '0 2px'
  },
  brandTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#3B2A1E',
    display: 'block',
    lineHeight: '1.1'
  },
  brandTagline: {
    fontSize: '0.72rem',
    color: '#C1602C',
    fontWeight: '600',
    letterSpacing: '0.04em',
    display: 'block'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  navBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.92rem',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  navBtnHighlight: {
    background: 'linear-gradient(135deg, #C1602C, #D96E34)',
    color: '#FFFFFF',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(193, 96, 44, 0.25)',
    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  modeToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  cartBtn: {
    position: 'relative',
    background: '#FFFFFF',
    border: '1px solid #E8D9C5',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
  },
  cartBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#C1602C',
    color: '#FFFFFF',
    fontSize: '0.72rem',
    fontWeight: '800',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
