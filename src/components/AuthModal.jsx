import React, { useState } from 'react';
import { X, UserCheck, ShoppingBag, Phone, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { translations } from '../lib/translations';

export default function AuthModal({ onClose, onLoginArtisan, onSelectBuyerMode, currentLang = 'en' }) {
  const [activeTab, setActiveTab] = useState('artisan'); // 'artisan' | 'buyer'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[currentLang] || translations.en;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone) return;
    setIsOtpSent(true);
    setOtp('123456'); // Pre-fill mock OTP code
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginArtisan?.({
        id: 'artisan_' + Date.now(),
        phone,
        full_name: 'Devaki Amma',
        region: 'Chendamangalam, Kerala',
        craft_type: 'Handloom Weaving & Sarees'
      });
      onClose();
    }, 600);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={20} color="#3B2A1E" />
        </button>

        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.badgeIcon}>🧵</div>
          <div>
            <h2 style={styles.title}>Welcome to Taana Baana</h2>
            <p style={styles.subtitle}>Connecting Indian Artisans Directly with Global Markets</p>
          </div>
        </div>

        {/* Dual Persona Choice Tabs */}
        <div style={styles.tabContainer}>
          <button
            type="button"
            onClick={() => setActiveTab('artisan')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'artisan' ? '#C1602C' : 'transparent',
              color: activeTab === 'artisan' ? '#FFFFFF' : '#3B2A1E'
            }}
          >
            <UserCheck size={18} />
            <span>I'm an Artisan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('buyer')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'buyer' ? '#7C8A5A' : 'transparent',
              color: activeTab === 'buyer' ? '#FFFFFF' : '#3B2A1E'
            }}
          >
            <ShoppingBag size={18} />
            <span>I'm here to Browse</span>
          </button>
        </div>

        {/* TAB 1: ARTISAN LOGIN (Phone + OTP) */}
        {activeTab === 'artisan' && (
          <div style={styles.contentBox}>
            <div style={styles.infoBanner}>
              <Sparkles size={16} color="#D9A441" />
              <span>Artisans log in to catalog products, view AI pricing & access market matches.</span>
            </div>

            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} style={styles.form}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Mobile Phone Number (for SMS OTP)</label>
                  <div style={styles.inputWithIcon}>
                    <Phone size={18} color="#C1602C" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={styles.input}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-large-touch" style={{ width: '100%', marginTop: '12px' }}>
                  Send OTP Code ➔
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={styles.form}>
                <div style={styles.otpNotice}>
                  <span>SMS Code sent to <strong>{phone}</strong> (Demo OTP: 123456)</span>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ ...styles.input, textAlign: 'center', letterSpacing: '0.4em', fontSize: '1.4rem' }}
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-large-touch" style={{ width: '100%', marginTop: '12px' }}>
                  {isSubmitting ? 'Verifying...' : 'Verify OTP & Log In ➔'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: BUYER / CUSTOMER MODE */}
        {activeTab === 'buyer' && (
          <div style={styles.contentBox}>
            <div style={styles.buyerBanner}>
              <ShoppingBag size={28} color="#7C8A5A" />
              <h3 style={styles.buyerTitle}>No Login Required to Browse!</h3>
              <p style={styles.buyerDesc}>
                Explore authentic handloom sarees, terracotta clayware, wood carvings, and brass statues direct from weaver pit-looms. You only need to provide contact details when sending an order inquiry.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectBuyerMode?.();
                onClose();
              }}
              className="btn btn-secondary btn-large-touch"
              style={{ width: '100%', marginTop: '16px' }}
            >
              <span>Start Browsing Marketplace</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}
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
    backgroundColor: 'rgba(59, 42, 30, 0.65)',
    backdropFilter: 'blur(6px)',
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    maxWidth: '520px',
    width: '100%',
    padding: '32px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: '#FAF3E7',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '24px'
  },
  badgeIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    backgroundColor: '#FAF3E7',
    border: '1px solid #E8D9C5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.45rem',
    color: '#3B2A1E'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#6E5B4D'
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: '#FAF3E7',
    padding: '4px',
    borderRadius: '16px',
    marginBottom: '20px',
    border: '1px solid #E8D9C5'
  },
  tabBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  contentBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  infoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FAF2DF',
    border: '1px solid #E5B24E',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '0.82rem',
    color: '#3B2A1E',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  inputWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#FAF3E7',
    border: '1px solid #E8D9C5',
    borderRadius: '12px',
    padding: '10px 14px'
  },
  input: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '1rem',
    color: '#3B2A1E',
    outline: 'none'
  },
  otpNotice: {
    backgroundColor: '#FAF2DF',
    border: '1px solid #E5B24E',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '0.85rem',
    color: '#3B2A1E'
  },
  buyerBanner: {
    textAlign: 'center',
    backgroundColor: '#F0F3E8',
    border: '1px solid #7C8A5A',
    borderRadius: '16px',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  buyerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.25rem',
    color: '#3B2A1E'
  },
  buyerDesc: {
    fontSize: '0.88rem',
    color: '#5C693E',
    lineHeight: '1.5'
  }
};
