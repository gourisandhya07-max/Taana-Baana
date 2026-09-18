import React, { useState, useEffect } from 'react';
import DashboardChart from '../components/DashboardChart';
import MarketMatchPanel from '../components/MarketMatchPanel';
import { api } from '../lib/supabaseClient';
import { PlusCircle, Eye, ShoppingBag, Sparkles, CheckCircle2, Clock, Layers, ArrowUpRight } from 'lucide-react';

export default function ArtisanDashboard({
  artisan,
  onNavigate,
  onSelectProduct,
  onSelectMarketMatch
}) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProductForMatches, setSelectedProductForMatches] = useState(null);

  useEffect(() => {
    async function loadData() {
      const artId = artisan?.id || 'artisan_1';
      const [prods, ords] = await Promise.all([
        api.getProducts(),
        api.getOrders(artId)
      ]);
      const myProds = prods.filter(p => p.artisan_id === artId || !artisan);
      setProducts(myProds);
      setOrders(ords);
      if (myProds.length > 0) {
        setSelectedProductForMatches(myProds[0]);
      }
    }
    loadData();
  }, [artisan]);

  // Compute live stats
  const totalProducts = products.length;
  const totalViews = 384 + products.length * 42;
  const totalOrders = orders.length;
  const totalRevenue = products.reduce((acc, p) => acc + (Number(p.final_price) || 0), 0);

  return (
    <div style={styles.container}>
      {/* Dashboard Top Header */}
      <div style={styles.topHeader}>
        <div>
          <span style={styles.welcomeTag}>ARTISAN CONTROL PANEL</span>
          <h1 style={styles.title}>Welcome back, {artisan?.full_name || 'Devaki Amma'} 👋</h1>
          <p style={styles.subtitle}>{artisan?.region || 'Chendamangalam, Kerala'} • {artisan?.craft_type || 'Handloom Weaving'}</p>
        </div>

        <button
          onClick={() => onNavigate('add-product')}
          className="btn btn-primary btn-large-touch"
        >
          <PlusCircle size={20} />
          <span>Catalog New Craft</span>
        </button>
      </div>

      {/* Visual Analytics Charts & Cards */}
      <DashboardChart
        stats={{
          totalProducts,
          totalViews,
          totalOrders,
          totalRevenue
        }}
      />

      {/* Inventory & Marketplace Status Manager */}
      <section style={{ marginTop: '40px' }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Your Listed Crafts ({products.length})</h2>
          <span style={styles.liveTag}>● Live Supabase Storage Sync</span>
        </div>

        <div style={styles.productsList}>
          {products.map((prod) => (
            <div key={prod.id} style={styles.prodItemCard}>
              <img
                src={prod.image_urls?.[0]}
                alt={prod.title}
                style={styles.prodThumb}
              />
              <div style={styles.prodInfo}>
                <span className="badge badge-terracotta">{prod.category}</span>
                <h3 style={styles.prodTitle}>{prod.title}</h3>
                <p style={styles.priceRow}>
                  Listing Price: <strong>₹{Number(prod.final_price).toLocaleString('en-IN')}</strong>
                </p>
              </div>

              <div style={styles.prodActions}>
                <button
                  onClick={() => setSelectedProductForMatches(prod)}
                  style={{
                    ...styles.actionBtn,
                    backgroundColor: selectedProductForMatches?.id === prod.id ? '#FAF2DF' : '#FFFFFF',
                    borderColor: selectedProductForMatches?.id === prod.id ? '#D9A441' : '#E8D9C5'
                  }}
                >
                  <Sparkles size={16} color="#D9A441" />
                  <span>Market Matches</span>
                </button>

                <button
                  onClick={() => onSelectProduct(prod)}
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                >
                  View Detail ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Buyer Inquiries Table */}
      <section style={{ marginTop: '40px' }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Customer Orders & Inquiries ({orders.length})</h2>
        </div>

        <div style={styles.ordersList}>
          {orders.map((ord) => (
            <div key={ord.id} style={styles.orderCard}>
              <div style={styles.orderIconBox}>
                <ShoppingBag size={20} color="#C1602C" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={styles.orderTopRow}>
                  <h4 style={styles.customerName}>{ord.customer_name}</h4>
                  <span className={`badge ${ord.status === 'confirmed' ? 'badge-olive' : 'badge-gold'}`}>
                    {ord.status.toUpperCase()}
                  </span>
                </div>
                <p style={styles.orderContact}>Phone: {ord.customer_contact} • Email: {ord.customer_email || 'N/A'}</p>
                {ord.notes && <p style={styles.orderNotes}>"{ord.notes}"</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Product Market Linkage Inspector */}
      {selectedProductForMatches && (
        <section style={{ marginTop: '40px' }}>
          <MarketMatchPanel product={selectedProductForMatches} />
        </section>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '30px 24px 60px 24px'
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '32px'
  },
  welcomeTag: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#C1602C',
    letterSpacing: '0.12em'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.2rem',
    color: '#3B2A1E'
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#6E5B4D'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px'
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.6rem',
    color: '#3B2A1E'
  },
  liveTag: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#7C8A5A'
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  prodItemCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  prodThumb: {
    width: '70px',
    height: '70px',
    borderRadius: '12px',
    objectFit: 'cover'
  },
  prodInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  prodTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.1rem',
    color: '#3B2A1E'
  },
  priceRow: {
    fontSize: '0.88rem',
    color: '#6E5B4D'
  },
  prodActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '12px',
    border: '1px solid',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#3B2A1E',
    cursor: 'pointer'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start'
  },
  orderIconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: '#F8ECE4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  customerName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.1rem',
    color: '#3B2A1E'
  },
  orderContact: {
    fontSize: '0.85rem',
    color: '#6E5B4D'
  },
  orderNotes: {
    fontSize: '0.85rem',
    color: '#3B2A1E',
    fontStyle: 'italic',
    marginTop: '4px',
    backgroundColor: '#FAF3E7',
    padding: '6px 10px',
    borderRadius: '8px'
  }
};
