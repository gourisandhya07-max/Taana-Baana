import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSelector({ currentLang = 'en', onSelectLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', native: 'English', icon: '🌐' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം', icon: '🌴' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी', icon: '🪷' }
  ];

  const activeLangObj = languages.find(l => l.code === currentLang) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Compact Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.triggerBtn}
        type="button"
        title="Change platform language"
      >
        <Globe size={16} color="#C1602C" />
        <span style={styles.langLabel}>{activeLangObj.native}</span>
        <ChevronDown size={14} color="#3B2A1E" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {/* Floating Glassmorphic Dropdown Menu */}
      {isOpen && (
        <div style={styles.dropdownMenu}>
          {languages.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLang(lang.code);
                  setIsOpen(false);
                }}
                style={{
                  ...styles.menuItem,
                  backgroundColor: isSelected ? '#FAF2DF' : 'transparent',
                  fontWeight: isSelected ? '700' : '500'
                }}
                type="button"
              >
                <span style={{ fontSize: '1rem' }}>{lang.icon}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={styles.itemNative}>{lang.native}</div>
                  <div style={styles.itemSub}>{lang.label}</div>
                </div>
                {isSelected && <Check size={14} color="#C1602C" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  triggerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    padding: '7px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#3B2A1E',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(59, 42, 30, 0.04)',
    transition: 'all 0.2s ease',
    height: '38px'
  },
  langLabel: {
    fontSize: '0.85rem',
    fontWeight: '700'
  },
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: '190px',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(12px)',
    border: '1px solid #E8D9C5',
    borderRadius: '16px',
    padding: '6px',
    boxShadow: '0 10px 30px rgba(59, 42, 30, 0.12)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#3B2A1E',
    transition: 'background-color 0.15s ease'
  },
  itemNative: {
    fontSize: '0.88rem',
    fontFamily: "'Playfair Display', serif"
  },
  itemSub: {
    fontSize: '0.72rem',
    color: '#6E5B4D'
  }
};
