import React from 'react';
import { TrendingUp, Eye, ShoppingCart, DollarSign, Award } from 'lucide-react';
import { translations } from '../lib/translations';

export default function DashboardChart({ stats, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const {
    totalProducts = 4,
    totalViews = 384,
    totalOrders = 12,
    totalRevenue = 47400
  } = stats || {};

  // Localized months
  const monthNames = {
    en: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    ml: ['ഒക്ടോ', 'നവം', 'ഡിസം', 'ജനു', 'ഫെബ്രു', 'മാർച്ച്'],
    hi: ['अक्टू', 'नव', 'दिस', 'जन', 'फ़र', 'मार्च']
  };

  const months = monthNames[lang] || monthNames.en;

  const monthlyData = [
    { month: months[0], views: 45, orders: 1 },
    { month: months[1], views: 82, orders: 3 },
    { month: months[2], views: 120, orders: 4 },
    { month: months[3], views: 95, orders: 2 },
    { month: months[4], views: 140, orders: 5 },
    { month: months[5], views: 180, orders: 7 }
  ];

  const maxViews = Math.max(...monthlyData.map(d => d.views));

  return (
    <div style={styles.container}>
      {/* Stat Cards Row */}
      <div style={styles.grid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#F8ECE4' }}>
            <Award size={22} color="#C1602C" />
          </div>
          <div>
            <span style={styles.statLabel}>{t.totalCrafts}</span>
            <h3 style={styles.statValue}>{totalProducts}</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#F0F3E8' }}>
            <Eye size={22} color="#7C8A5A" />
          </div>
          <div>
            <span style={styles.statLabel}>{t.totalViews}</span>
            <h3 style={styles.statValue}>{totalViews.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#EBF0F3' }}>
            <ShoppingCart size={22} color="#5C6B73" />
          </div>
          <div>
            <span style={styles.statLabel}>{t.activeInquiries}</span>
            <h3 style={styles.statValue}>{totalOrders}</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#FAF2DF' }}>
            <DollarSign size={22} color="#D9A441" />
          </div>
          <div>
            <span style={styles.statLabel}>{t.estRevenue}</span>
            <h3 style={styles.statValue}>₹{totalRevenue.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>

      {/* Visual Chart Card */}
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <div>
            <h4 style={styles.chartTitle}>{t.chartTitle}</h4>
            <p style={styles.chartSubtitle}>{t.chartSubtitle}</p>
          </div>
          <div style={styles.growthBadge}>
            <TrendingUp size={16} color="#7C8A5A" />
            <span>{t.chartGrowth}</span>
          </div>
        </div>

        {/* SVG/CSS Bar Graph */}
        <div style={styles.barsContainer}>
          {monthlyData.map((d, i) => {
            const barHeightPct = (d.views / maxViews) * 100;
            return (
              <div key={i} style={styles.barCol}>
                <div style={styles.barTooltip}>
                  <span>{d.views} {t.totalViews?.split(' ')[1] || 'views'}</span>
                  <strong>{d.orders} {t.activeInquiries?.split(' ')[0] || 'orders'}</strong>
                </div>

                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      height: `${barHeightPct}%`
                    }}
                  />
                </div>
                <span style={styles.monthLabel}>{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '18px',
    padding: '20px 22px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 16px rgba(59, 42, 30, 0.04)'
  },
  iconBox: {
    width: '50px',
    height: '50px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#6E5B4D',
    fontWeight: '700'
  },
  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.75rem',
    color: '#3B2A1E',
    fontWeight: '800',
    lineHeight: '1.15',
    marginTop: '2px'
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '24px',
    padding: '28px 32px',
    boxShadow: '0 6px 20px rgba(59, 42, 30, 0.05)'
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  chartTitle: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '1.35rem',
    color: '#3B2A1E'
  },
  chartSubtitle: {
    fontSize: '0.9rem',
    color: '#6E5B4D',
    marginTop: '2px'
  },
  growthBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#F0F3E8',
    color: '#5C693E',
    padding: '7px 14px',
    borderRadius: '20px',
    fontSize: '0.84rem',
    fontWeight: '700'
  },
  barsContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '200px',
    gap: '14px',
    paddingTop: '24px'
  },
  barCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    position: 'relative'
  },
  barTooltip: {
    position: 'absolute',
    top: '-26px',
    fontSize: '0.74rem',
    color: '#6E5B4D',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    whiteSpace: 'nowrap'
  },
  barTrack: {
    width: '32px',
    height: '100%',
    backgroundColor: '#F8F3EA',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden'
  },
  barFill: {
    width: '100%',
    background: 'linear-gradient(180deg, #C1602C 0%, #D9A441 100%)',
    borderRadius: '16px',
    transition: 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  monthLabel: {
    marginTop: '10px',
    fontSize: '0.82rem',
    color: '#3B2A1E',
    fontWeight: '700'
  }
};
