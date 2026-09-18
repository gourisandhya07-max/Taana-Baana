import React from 'react';
import { MapPin } from 'lucide-react';
import { translations } from '../lib/translations';

export default function CraftMap({ selectedRegion, onSelectRegion, currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;

  const regionalCrafts = [
    {
      id: 'kerala',
      filterKey: 'Kerala',
      names: {
        en: 'Kerala (Chendamangalam)',
        ml: 'കേരളം (ചേന്ദമംഗലം)',
        hi: 'केरल (चेन्दमंगलम)'
      },
      crafts: {
        en: 'Kasavu Handloom Weaving',
        ml: 'കസവ് കൈത്തറി നെയ്ത്ത്',
        hi: 'कसावु हथकरघा बुनाई'
      },
      color: '#C1602C'
    },
    {
      id: 'rajasthan',
      filterKey: 'Rajasthan',
      names: {
        en: 'Rajasthan (Molela)',
        ml: 'രാജസ്ഥാൻ (മൊലേല)',
        hi: 'राजस्थान (मोलेला)'
      },
      crafts: {
        en: 'Terracotta & Clay Votive Art',
        ml: 'ടെറാക്കോട്ട & മൺപാത്ര കല',
        hi: 'टेराकोटा व मिट्टी की मूर्तियाँ'
      },
      color: '#D9A441'
    },
    {
      id: 'up',
      filterKey: 'Uttar Pradesh',
      names: {
        en: 'Uttar Pradesh (Lucknow)',
        ml: 'ഉത്തർപ്രദേശ് (ലഖ്‌നൗ)',
        hi: 'उत्तर प्रदेश (लखनऊ)'
      },
      crafts: {
        en: 'Chikankari & Shadow Embroidery',
        ml: 'ചിക്കൻകാരി & ഷാഡോ വർക്ക്',
        hi: 'चिकनकारी व छाया कढ़ाई'
      },
      color: '#7C8A5A'
    },
    {
      id: 'chhattisgarh',
      filterKey: 'Chhattisgarh',
      names: {
        en: 'Chhattisgarh (Bastar)',
        ml: 'ഛത്തീസ്ഗഢ് (ബസ്തർ)',
        hi: 'छत्तीसगढ़ (बस्तर)'
      },
      crafts: {
        en: 'Dhokra Lost-Wax Metalwork',
        ml: 'ധോക്ര ലോസ്റ്റ്-വാക്സ് ഓട്ടുപണി',
        hi: 'ढोकरा लुप्त-मोम कांस्य कला'
      },
      color: '#5C6B73'
    },
    {
      id: 'kashmir',
      filterKey: 'Kashmir',
      names: {
        en: 'Kashmir (Srinagar)',
        ml: 'കശ്മീർ (ശ്രീനഗർ)',
        hi: 'कश्मीर (श्रीनगर)'
      },
      crafts: {
        en: 'Pashmina & Sozni Needlework',
        ml: 'പശ്മിന & സോസ്നി തയ്യൽ',
        hi: 'पश्मीना व सोज़नी सुई-कढ़ाई'
      },
      color: '#3B2A1E'
    }
  ];

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <MapPin size={22} color="#C1602C" />
          <h3 style={styles.title}>{t.mapTitle}</h3>
        </div>
        <p style={styles.subtitle}>{t.mapSubtitle}</p>
      </div>

      <div style={styles.mapGrid}>
        {regionalCrafts.map((reg) => {
          const isSelected = selectedRegion?.toLowerCase().includes(reg.filterKey.toLowerCase());
          const regionName = reg.names[currentLang] || reg.names.en;
          const craftDesc = reg.crafts[currentLang] || reg.crafts.en;

          return (
            <div
              key={reg.id}
              onClick={() => onSelectRegion(isSelected ? 'All Regions' : reg.filterKey)}
              style={{
                ...styles.regionCard,
                borderColor: isSelected ? reg.color : '#E8D9C5',
                backgroundColor: isSelected ? '#FAF2DF' : '#FFFFFF',
                boxShadow: isSelected ? '0 6px 20px rgba(193, 96, 44, 0.16)' : '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <div style={styles.pinHeader}>
                <div style={{ ...styles.colorDot, backgroundColor: reg.color }} />
                <span style={styles.regionName}>{regionName}</span>
              </div>
              <p style={styles.craftDesc}>{craftDesc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(59, 42, 30, 0.05)',
    marginBottom: '32px'
  },
  header: {
    marginBottom: '20px'
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  title: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '1.4rem',
    color: '#3B2A1E'
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#6E5B4D',
    marginTop: '4px'
  },
  mapGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '14px'
  },
  regionCard: {
    border: '1.5px solid',
    borderRadius: '16px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  pinHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px'
  },
  colorDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  regionName: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  craftDesc: {
    fontSize: '0.82rem',
    color: '#6E5B4D',
    lineHeight: '1.4'
  }
};
