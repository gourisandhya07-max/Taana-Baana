import React from 'react';
import { TrendingUp, Eye, ShoppingCart, DollarSign, Award } from 'lucide-react';

export default function DashboardChart({ stats }) {
  const {
    totalProducts = 4,
    totalViews = 384,
    totalOrders = 12,
    totalRevenue = 47400
  } = stats || {};

  // Sample monthly inquiry trends data
  const monthlyData = [
    { month: 'Oct', views: 45, orders: 1 },
    { month: 'Nov', views: 82, orders: 3 },
    { month: 'Dec', views: 120, orders: 4 },
    { month: 'Jan', views: 95, orders: 2 },
    { month: 'Feb', views: 140, orders: 5 },
    { month: 'Mar', views: 180, orders: 7 }
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
            <span style={styles.statLabel}>Total Crafts</span>
            <h3 style={styles.statValue}>{totalProducts}</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#F0F3E8' }}>
            <Eye size={22} color="#7C8A5A" />
          </div>
          <div>
            <span style={styles.statLabel}>Total Product Views</span>
            <h3 style={styles.statValue}>{totalViews.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#EBF0F3' }}>
            <ShoppingCart size={22} color="#5C6B73" />
          </div>
          <div>
            <span style={styles.statLabel}>Active Inquiries</span>
            <h3 style={styles.statValue}>{totalOrders}</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#FAF2DF' }}>
            <DollarSign size={22} color="#D9A441" />
          </div>
          <div>
            <span style={styles.statLabel}>Est. Sales Revenue</span>
            <h3 style={styles.statValue}>₹{totalRevenue.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>

      {/* Visual Chart Card */}
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <div>
            <h4 style={styles.chartTitle}>Monthly Buyer Interest & Inquiry Growth</h4>
            <p style={styles.chartSubtitle}>Track how your products perform across market segments</p>
          </div>
          <div style={styles.growthBadge}>
            <TrendingUp size={16} color="#7C8A5A" />
            <span>+38% vs last month</span>
          </div>
        </div>

        {/* SVG/CSS Bar Graph */}
        <div style={styles.barsContainer}>
          {monthlyData.map((d, i) => {
            const barHeightPct = (d.views / maxViews) * 100;
            return (
              <div key={i} style={styles.barCol}>
                <div style={styles.barTooltip}>
                  <span>{d.views} views</span>
                  <strong>{d.orders} orders</strong>
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
    gap: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '16px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    boxShadow: '0 2px 8px rgba(59, 42, 30, 0.04)'
  },
  iconBox: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#6E5B4D',
    fontWeight: '600'
  },
  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.6rem',
    color: '#3B2A1E',
    fontWeight: '800',
    lineHeight: '1.1'
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '18px',
    padding: '24px',
    boxShadow: '0 4px 16px rgba(59, 42, 30, 0.05)'
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  chartTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.25rem',
    color: '#3B2A1E'
  },
  chartSubtitle: {
    fontSize: '0.85rem',
    color: '#6E5B4D'
  },
  growthBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#F0F3E8',
    color: '#5C693E',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: '700'
  },
  barsContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '180px',
    gap: '12px',
    paddingTop: '20px'
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
    top: '-24px',
    fontSize: '0.72rem',
    color: '#6E5B4D',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  barTrack: {
    width: '28px',
    height: '100%',
    backgroundColor: '#F8F3EA',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden'
  },
  barFill: {
    width: '100%',
    background: 'linear-gradient(180deg, #C1602C 0%, #D9A441 100%)',
    borderRadius: '14px',
    transition: 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  monthLabel: {
    marginTop: '8px',
    fontSize: '0.8rem',
    color: '#3B2A1E',
    fontWeight: '600'
  }
};
