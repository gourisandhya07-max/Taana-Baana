import React from 'react';
import TaanaBaanaLogo from './TaanaBaanaLogo';
import LanguageSelector from './LanguageSelector';
import { translations } from '../lib/translations';
import { ShoppingBag, LayoutDashboard, PlusCircle, Home, User } from 'lucide-react';

export default function Navbar({
  activeView,
  onViewChange,
  currentLang = 'en',
  onSelectLang,
  userMode = 'buyer',
  currentArtisanProfile,
  onOpenAuth,
  cartCount = 0,
  onOpenCart
}) {
  const t = translations[currentLang] || translations.en;

  return (
    <header style={styles.header}>
      {/* Temple Border Pattern Bar */}
      <div style={styles.topPatternBar} />

      <div style={styles.navContainer}>
        {/* 1. Left: Brand Logo & Tagline */}
        <TaanaBaanaLogo
          size="md"
          showTagline={true}
          onClick={() => onViewChange('home')}
        />

        {/* 2. Center: Navigation Links */}
        <nav style={styles.navLinks}>
          <button
            style={{
              ...styles.navBtn,
              color: activeView === 'home' ? '#C1602C' : '#3B2A1E',
              fontWeight: activeView === 'home' ? '700' : '500',
              borderBottom: activeView === 'home' ? '2px solid #C1602C' : '2px solid transparent'
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
              fontWeight: activeView === 'marketplace' ? '700' : '500',
              borderBottom: activeView === 'marketplace' ? '2px solid #C1602C' : '2px solid transparent'
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
                  fontWeight: activeView === 'dashboard' ? '700' : '500',
                  borderBottom: activeView === 'dashboard' ? '2px solid #C1602C' : '2px solid transparent'
                }}
                onClick={() => onViewChange('dashboard')}
              >
                <LayoutDashboard size={16} />
                <span>{t.navDashboard}</span>
              </button>

              <button
                style={styles.navBtnHighlight}
                onClick={() => onViewChange('add-product')}
              >
                <PlusCircle size={16} />
                <span>{t.navAddProduct}</span>
              </button>
            </>
          )}
        </nav>

        {/* 3. Spacer */}
        <div style={{ flex: 1 }} />

        {/* 4. Right Controls: Language Selector + Cart + Login/Profile */}
        <div style={styles.rightGroup}>
          {/* Compact Language Selector Dropdown */}
          <LanguageSelector currentLang={currentLang} onSelectLang={onSelectLang} />

          {/* Cart / Inquiry Counter Button */}
          <button style={styles.cartBtn} onClick={onOpenCart} title="View Inquiries">
            <ShoppingBag size={18} color="#3B2A1E" />
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </button>

          {/* Login / Profile Button */}
          <button
            onClick={onOpenAuth}
            style={{
              ...styles.profileBtn,
              backgroundColor: userMode === 'artisan' ? '#C1602C' : '#FFFFFF',
              color: userMode === 'artisan' ? '#FFFFFF' : '#3B2A1E',
              borderColor: userMode === 'artisan' ? '#C1602C' : '#E8D9C5'
            }}
          >
            <User size={16} />
            <span>{userMode === 'artisan' ? currentArtisanProfile?.full_name?.split(' ')[0] || 'Artisan' : 'Log In'}</span>
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
    backgroundColor: 'rgba(250, 243, 231, 0.96)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #E8D9C5',
    boxShadow: '0 4px 20px rgba(59, 42, 30, 0.05)'
  },
  topPatternBar: {
    height: '4px',
    background: 'linear-gradient(90deg, #C1602C 0%, #7C8A5A 33%, #D9A441 66%, #5C6B73 100%)'
  },
  navContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '10px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
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
    padding: '8px 4px',
    transition: 'all 0.2s ease',
    height: '38px'
  },
  navBtnHighlight: {
    background: 'linear-gradient(135deg, #C1602C, #D96E34)',
    color: '#FFFFFF',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.88rem',
    fontWeight: '700',
    padding: '0 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(193, 96, 44, 0.25)',
    height: '38px'
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  cartBtn: {
    position: 'relative',
    background: '#FFFFFF',
    border: '1px solid #E8D9C5',
    width: '38px',
    height: '38px',
    borderRadius: '20px',
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
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0 16px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    height: '38px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease'
  }
};
