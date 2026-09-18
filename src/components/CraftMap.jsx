import React from 'react';
import { MapPin, Sparkles } from 'lucide-react';

export default function CraftMap({ selectedRegion, onSelectRegion }) {
  const regions = [
    {
      id: 'kerala',
      name: 'Kerala (Chendamangalam)',
      craft: 'Kasavu Handloom Weaving',
      color: '#C1602C',
      coords: { x: '35%', y: '82%' }
    },
    {
      id: 'rajasthan',
      name: 'Rajasthan (Molela)',
      craft: 'Terracotta & Clay Votive Art',
      color: '#D9A441',
      coords: { x: '25%', y: '35%' }
    },
    {
      id: 'up',
      name: 'Uttar Pradesh (Lucknow)',
      craft: 'Chikankari & Shadow Embroidery',
      color: '#7C8A5A',
      coords: { x: '45%', y: '32%' }
    },
    {
      id: 'chhattisgarh',
      name: 'Chhattisgarh (Bastar)',
      craft: 'Dhokra Lost-Wax Metalwork',
      color: '#5C6B73',
      coords: { x: '52%', y: '52%' }
    },
    {
      id: 'kashmir',
      name: 'Kashmir (Srinagar)',
      craft: 'Pashmina & Sozni Needlework',
      color: '#3B2A1E',
      coords: { x: '32%', y: '15%' }
    }
  ];

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <MapPin size={22} color="#C1602C" />
          <h3 style={styles.title}>Interactive Craft Geography of India</h3>
        </div>
        <p style={styles.subtitle}>Explore regional handloom clusters & traditional artisan hubs</p>
      </div>

      <div style={styles.mapGrid}>
        {regions.map((reg) => {
          const isSelected = selectedRegion?.toLowerCase().includes(reg.name.split(' ')[0].toLowerCase());
          return (
            <div
              key={reg.id}
              onClick={() => onSelectRegion(isSelected ? 'All Regions' : reg.name.split(' ')[0])}
              style={{
                ...styles.regionCard,
                borderColor: isSelected ? reg.color : '#E8D9C5',
                backgroundColor: isSelected ? '#FAF2DF' : '#FFFFFF',
                boxShadow: isSelected ? '0 4px 16px rgba(193, 96, 44, 0.15)' : 'none'
              }}
            >
              <div style={styles.pinHeader}>
                <div style={{ ...styles.colorDot, backgroundColor: reg.color }} />
                <span style={styles.regionName}>{reg.name}</span>
              </div>
              <p style={styles.craftDesc}>{reg.craft}</p>
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
    borderRadius: '18px',
    padding: '24px',
    boxShadow: '0 4px 16px rgba(59, 42, 30, 0.05)',
    marginBottom: '28px'
  },
  header: {
    marginBottom: '16px'
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.25rem',
    color: '#3B2A1E'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#6E5B4D',
    marginTop: '2px'
  },
  mapGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '12px'
  },
  regionCard: {
    border: '1px solid',
    borderRadius: '12px',
    padding: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  pinHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  },
  colorDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  regionName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  craftDesc: {
    fontSize: '0.8rem',
    color: '#6E5B4D'
  }
};
