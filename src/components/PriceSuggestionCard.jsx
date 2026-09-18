import React, { useState, useEffect } from 'react';
import { Calculator, Sparkles, AlertCircle, TrendingUp, Check } from 'lucide-react';
import { translations } from '../lib/translations';

export default function PriceSuggestionCard({
  materialCost = 800,
  productionHours = 12,
  onApplyPrice,
  lang = 'en'
}) {
  const [matCost, setMatCost] = useState(materialCost);
  const [hours, setHours] = useState(productionHours);
  const [hourlyWage, setHourlyWage] = useState(150); // ₹150/hr base fair wage floor
  const [suggestedMin, setSuggestedMin] = useState(0);
  const [suggestedMax, setSuggestedMax] = useState(0);
  const [customPrice, setCustomPrice] = useState('');
  const t = translations[lang] || translations.en;

  useEffect(() => {
    // Pricing calculation algorithm:
    // Base Labor Cost = productionHours * hourlyWage
    // Prime Craft Cost = materialCost + Base Labor Cost
    // Fair Overhead & Retail Margin Multiplier = 1.45x to 1.95x
    const primeCost = Number(matCost || 0) + Number(hours || 0) * Number(hourlyWage || 150);
    const minPrice = Math.round(primeCost * 1.45 / 50) * 50;
    const maxPrice = Math.round(primeCost * 1.95 / 50) * 50;

    setSuggestedMin(minPrice);
    setSuggestedMax(maxPrice);
    setCustomPrice(Math.round((minPrice + maxPrice) / 2));
  }, [matCost, hours, hourlyWage]);

  const handleSetPrice = (priceVal) => {
    setCustomPrice(priceVal);
    onApplyPrice?.(priceVal, suggestedMin, suggestedMax);
  };

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <div style={styles.badgeIcon}>
          <Calculator size={22} color="#C1602C" />
        </div>
        <div>
          <h3 style={styles.title}>AI Pricing Assistant</h3>
          <p style={styles.subtitle}>Fair wage calculation & market benchmark intelligence</p>
        </div>
      </div>

      {/* Input Sliders / Form */}
      <div style={styles.formGrid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>{t.materialCostLabel}</label>
          <input
            type="number"
            value={matCost}
            onChange={(e) => setMatCost(Number(e.target.value))}
            style={styles.input}
            min="0"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>{t.laborHoursLabel}</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            style={styles.input}
            min="1"
          />
        </div>
      </div>

      {/* Cost Breakdown Visual Bar */}
      <div style={styles.costBreakdownBox}>
        <div style={styles.breakdownHeader}>
          <span style={styles.breakdownTitle}>Calculated Cost Floor:</span>
          <span style={styles.costTotal}>
            ₹{(Number(matCost || 0) + Number(hours || 0) * hourlyWage).toLocaleString('en-IN')}
          </span>
        </div>
        <div style={styles.barVisual}>
          <div
            style={{
              ...styles.barSegment,
              width: `${(matCost / (matCost + hours * hourlyWage)) * 100}%`,
              backgroundColor: '#C1602C'
            }}
            title="Material Cost"
          />
          <div
            style={{
              ...styles.barSegment,
              flex: 1,
              backgroundColor: '#7C8A5A'
            }}
            title="Artisan Labor Wage (₹150/hr)"
          />
        </div>
        <div style={styles.barLegend}>
          <span style={{ color: '#C1602C' }}>● Materials: ₹{matCost}</span>
          <span style={{ color: '#5C693E' }}>● Fair Wage: ₹{hours * hourlyWage}</span>
        </div>
      </div>

      {/* Suggested Price Range Banner */}
      <div style={styles.suggestionBanner}>
        <div style={styles.suggestionTitleRow}>
          <Sparkles size={18} color="#D9A441" />
          <span style={styles.suggestionLabel}>{t.suggestedPriceRange}</span>
        </div>
        <div style={styles.priceRangeDisplay}>
          ₹{suggestedMin.toLocaleString('en-IN')} – ₹{suggestedMax.toLocaleString('en-IN')}
        </div>
        <p style={styles.rationaleText}>
          <strong>{t.priceRationaleTitle}</strong> Based on {hours} hours of skilled craftwork, ₹{matCost} yarn/raw inputs, and comparable fair-trade market sales data.
        </p>

        {/* Quick Apply Buttons */}
        <div style={styles.quickButtons}>
          <button
            type="button"
            onClick={() => handleSetPrice(suggestedMin)}
            style={{
              ...styles.quickBtn,
              backgroundColor: customPrice === suggestedMin ? '#C1602C' : '#FFFFFF',
              color: customPrice === suggestedMin ? '#FFFFFF' : '#3B2A1E'
            }}
          >
            Competitive: ₹{suggestedMin}
          </button>

          <button
            type="button"
            onClick={() => handleSetPrice(Math.round((suggestedMin + suggestedMax) / 2))}
            style={{
              ...styles.quickBtn,
              backgroundColor: customPrice === Math.round((suggestedMin + suggestedMax) / 2) ? '#C1602C' : '#FFFFFF',
              color: customPrice === Math.round((suggestedMin + suggestedMax) / 2) ? '#FFFFFF' : '#3B2A1E'
            }}
          >
            Recommended: ₹{Math.round((suggestedMin + suggestedMax) / 2)}
          </button>

          <button
            type="button"
            onClick={() => handleSetPrice(suggestedMax)}
            style={{
              ...styles.quickBtn,
              backgroundColor: customPrice === suggestedMax ? '#C1602C' : '#FFFFFF',
              color: customPrice === suggestedMax ? '#FFFFFF' : '#3B2A1E'
            }}
          >
            Premium: ₹{suggestedMax}
          </button>
        </div>
      </div>

      {/* Final Price Input */}
      <div style={styles.finalInputBox}>
        <label style={styles.finalLabel}>Set Final Listing Price (₹):</label>
        <div style={styles.finalInputRow}>
          <input
            type="number"
            value={customPrice}
            onChange={(e) => {
              setCustomPrice(Number(e.target.value));
              onApplyPrice?.(Number(e.target.value), suggestedMin, suggestedMax);
            }}
            style={styles.finalInput}
          />
          <button
            type="button"
            onClick={() => onApplyPrice?.(customPrice, suggestedMin, suggestedMax)}
            style={styles.confirmBtn}
          >
            <Check size={16} /> Confirm Price
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 18px rgba(59, 42, 30, 0.06)'
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  badgeIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: '#F8ECE4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.25rem',
    color: '#3B2A1E'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#6E5B4D'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  input: {
    padding: '10px 14px',
    fontSize: '1rem',
    borderRadius: '10px',
    border: '1px solid #E8D9C5',
    backgroundColor: '#FAF3E7',
    color: '#3B2A1E',
    fontWeight: '600'
  },
  costBreakdownBox: {
    backgroundColor: '#F8F3EA',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '20px'
  },
  breakdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.88rem',
    fontWeight: '700',
    marginBottom: '8px'
  },
  breakdownTitle: {
    color: '#6E5B4D'
  },
  costTotal: {
    color: '#3B2A1E',
    fontSize: '1.05rem'
  },
  barVisual: {
    height: '10px',
    borderRadius: '6px',
    overflow: 'hidden',
    display: 'flex',
    marginBottom: '8px'
  },
  barSegment: {
    height: '100%'
  },
  barLegend: {
    display: 'flex',
    gap: '16px',
    fontSize: '0.78rem',
    fontWeight: '600'
  },
  suggestionBanner: {
    backgroundColor: '#FAF2DF',
    border: '1px solid #E5B24E',
    borderRadius: '14px',
    padding: '18px',
    marginBottom: '20px'
  },
  suggestionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  suggestionLabel: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  priceRangeDisplay: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    fontWeight: '800',
    color: '#C1602C',
    margin: '6px 0'
  },
  rationaleText: {
    fontSize: '0.85rem',
    color: '#5A4333',
    lineHeight: '1.45',
    marginBottom: '14px'
  },
  quickButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  quickBtn: {
    padding: '6px 12px',
    fontSize: '0.82rem',
    fontWeight: '700',
    borderRadius: '18px',
    border: '1px solid #E5B24E',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  finalInputBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  finalLabel: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  finalInputRow: {
    display: 'flex',
    gap: '12px'
  },
  finalInput: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '1.1rem',
    fontWeight: '800',
    borderRadius: '10px',
    border: '2px solid #C1602C',
    color: '#3B2A1E',
    backgroundColor: '#FFFFFF'
  },
  confirmBtn: {
    backgroundColor: '#C1602C',
    color: '#FFFFFF',
    border: 'none',
    padding: '0 20px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.92rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  }
};
