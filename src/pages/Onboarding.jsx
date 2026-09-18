import React, { useState } from 'react';
import VoiceRecorder from '../components/VoiceRecorder';
import LanguageSelector from '../components/LanguageSelector';
import { translations } from '../lib/translations';
import { User, Phone, MapPin, Award, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const CRAFT_OPTIONS = [
  { id: 'Weaving', label: 'Handloom Weaving & Sarees', icon: '🧵' },
  { id: 'Pottery', label: 'Terracotta & Clay Pottery', icon: '🏺' },
  { id: 'Woodwork', label: 'Wood Carving & Toys', icon: '🪵' },
  { id: 'Metalwork', label: 'Dhokra & Brass Metalwork', icon: '🪔' },
  { id: 'Embroidery', label: 'Chikan & Zari Needlework', icon: '🪡' },
  { id: 'Leather', label: 'Jutti & Handcrafted Leather', icon: '👞' }
];

export default function Onboarding({ onComplete, currentLang, onSelectLang }) {
  const [step, setStep] = useState(1); // 1: Phone OTP, 2: Craft & Profile
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [fullName, setFullName] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('Weaving');
  const [region, setRegion] = useState('Chendamangalam, Kerala');
  const [bio, setBio] = useState('');
  const t = translations[currentLang] || translations.en;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone) return;
    setIsOtpSent(true);
    setOtp('123456'); // Pre-fill mock OTP for quick testing
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch(err) {}

    const artisanData = {
      id: "artisan_" + Date.now(),
      full_name: fullName || "Master Artisan",
      phone: phone || "+91 98470 12345",
      preferred_language: currentLang,
      craft_type: selectedCraft,
      region: region,
      bio: bio || "Traditional artisan preserving historic Indian handloom heritage."
    };
    onComplete?.(artisanData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Top Header */}
        <div style={styles.header}>
          <div style={styles.logoBadge}>🧵</div>
          <div>
            <h2 style={styles.title}>{t.onboardingTitle}</h2>
            <p style={styles.subtitle}>{t.onboardingSubtitle}</p>
          </div>
          <div style={styles.langWrapper}>
            <LanguageSelector currentLang={currentLang} onSelectLang={onSelectLang} />
          </div>
        </div>

        {/* STEP 1: Phone & OTP Authentication */}
        {step === 1 && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>{t.step1Title}</h3>
            <p style={styles.stepDesc}>{t.step1Desc}</p>

            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} style={styles.form}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>{t.phoneLabel}</label>
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
                <button type="submit" className="btn btn-primary btn-large-touch" style={{ width: '100%', marginTop: '10px' }}>
                  {t.sendOtpBtn} ➔
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={styles.form}>
                <div style={styles.otpNotice}>
                  <span>{t.otpNoticeStart} <strong>{phone}</strong> {t.otpNoticeEnd}</span>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>{t.otpLabel}</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ ...styles.input, textAlign: 'center', letterSpacing: '0.4em', fontSize: '1.4rem' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-large-touch" style={{ width: '100%', marginTop: '10px' }}>
                  {t.verifyOtpBtn} ➔
                </button>
              </form>
            )}
          </div>
        )}

        {/* STEP 2: Guided Large Button Artisan Profile */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} style={styles.stepBox}>
            <h3 style={styles.stepTitle}>{t.step2Title}</h3>

            {/* Name Input */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>{t.fullNameLabel}</label>
              <div style={styles.inputWithIcon}>
                <User size={18} color="#C1602C" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Devaki Amma"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Large-Button Craft Selection Grid */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>{t.craftTypeLabel}</label>
              <div style={styles.craftGrid}>
                {CRAFT_OPTIONS.map((c) => {
                  const isSel = selectedCraft === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCraft(c.id)}
                      style={{
                        ...styles.craftBtn,
                        borderColor: isSel ? '#C1602C' : '#E8D9C5',
                        backgroundColor: isSel ? '#FAF2DF' : '#FFFFFF',
                        color: isSel ? '#C1602C' : '#3B2A1E'
                      }}
                    >
                      <span style={{ fontSize: '1.6rem' }}>{c.icon}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: '700' }}>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Region Input */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>{t.regionLabel}</label>
              <div style={styles.inputWithIcon}>
                <MapPin size={18} color="#7C8A5A" />
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Chendamangalam, Kerala"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Voice Bio Option */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>{t.bioLabel}</label>
              <VoiceRecorder
                lang={currentLang}
                onTranscribed={(txt) => setBio(txt)}
              />
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Or type your artisan story here..."
                style={{ ...styles.input, marginTop: '8px', resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-large-touch" style={{ width: '100%', marginTop: '16px' }}>
              {t.completeOnboardingBtn} ➔
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '680px',
    margin: '40px auto',
    padding: '0 20px'
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 12px 36px rgba(59, 42, 30, 0.08)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '28px',
    paddingBottom: '20px',
    borderBottom: '1px solid #E8D9C5'
  },
  logoBadge: {
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
    fontSize: '1.6rem',
    color: '#3B2A1E'
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#6E5B4D'
  },
  langWrapper: {
    marginLeft: 'auto'
  },
  stepBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  stepTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.3rem',
    color: '#3B2A1E'
  },
  stepDesc: {
    fontSize: '0.9rem',
    color: '#6E5B4D'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
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
  craftGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px'
  },
  craftBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px',
    borderRadius: '14px',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};
