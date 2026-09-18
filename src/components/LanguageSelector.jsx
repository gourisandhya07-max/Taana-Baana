import React from 'react';

export default function LanguageSelector({ currentLang, onSelectLang }) {
  const languages = [
    { code: 'en', label: 'English', native: 'English', icon: '🌐' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം', icon: '🌴' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी', icon: '🪷' }
  ];

  return (
    <div style={styles.container}>
      {languages.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => onSelectLang(lang.code)}
            style={{
              ...styles.langBtn,
              backgroundColor: isActive ? '#C1602C' : 'transparent',
              color: isActive ? '#FFFFFF' : '#3B2A1E',
              borderColor: isActive ? '#C1602C' : '#E8D9C5'
            }}
            title={`Switch language to ${lang.label}`}
          >
            <span style={{ fontSize: '0.9rem' }}>{lang.icon}</span>
            <span>{lang.native}</span>
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FAF3E7',
    padding: '4px',
    borderRadius: '24px',
    border: '1px solid #E8D9C5'
  },
  langBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    borderRadius: '18px',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};
