import React, { useState, useEffect } from 'react';
import DashboardChart from '../components/DashboardChart';
import MarketMatchPanel from '../components/MarketMatchPanel';
import { api } from '../lib/supabaseClient';
import { translations, getLocalizedProduct, getLocalizedCategory } from '../lib/translations';
import { PlusCircle, ShoppingBag, Sparkles } from 'lucide-react';

export default function ArtisanDashboard({
  artisan,
  onNavigate,
  onSelectProduct,
  onSelectMarketMatch,
  currentLang = 'en'
}) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProductForMatches, setSelectedProductForMatches] = useState(null);

  const t = translations[currentLang] || translations.en;

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
          <span style={styles.welcomeTag}>{t.artisanControlPanel}</span>
          <h1 style={styles.title}>{t.welcomeBack} {artisan?.full_name || 'Devaki Amma'} 👋</h1>
          <p style={styles.subtitle}>{artisan?.region || 'Chendamangalam, Kerala'} • {artisan?.craft_type || 'Handloom Weaving'}</p>
        </div>

        <button
          onClick={() => onNavigate('add-product')}
          className="btn btn-primary btn-large-touch"
        >
          <PlusCircle size={20} />
          <span>{t.catalogNewCraft}</span>
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
        lang={currentLang}
      />

      {/* Inventory & Marketplace Status Manager */}
      <section style={{ marginTop: '48px' }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t.listedCrafts} ({products.length})</h2>
          <span style={styles.liveTag}>{t.liveStorageSync}</span>
        </div>

        <div style={styles.productsList}>
          {products.map((prod) => {
            const localizedProd = getLocalizedProduct(prod, currentLang);
            return (
              <div key={prod.id} style={styles.prodItemCard}>
                <img
                  src={prod.image_urls?.[0]}
                  alt={localizedProd.title}
                  style={styles.prodThumb}
                />
                <div style={styles.prodInfo}>
                  <span className="badge badge-terracotta">
                    {getLocalizedCategory(localizedProd.category, currentLang)}
                  </span>
                  <h3 style={styles.prodTitle}>{localizedProd.title}</h3>
                  <p style={styles.priceRow}>
                    {t.listingPrice} <strong>₹{Number(prod.final_price).toLocaleString('en-IN')}</strong>
                  </p>
                </div>

                <div style={styles.prodActions}>
                  <button
                    onClick={() => setSelectedProductForMatches(localizedProd)}
                    style={{
                      ...styles.actionBtn,
                      backgroundColor: selectedProductForMatches?.id === prod.id ? '#FAF2DF' : '#FFFFFF',
                      borderColor: selectedProductForMatches?.id === prod.id ? '#D9A441' : '#E8D9C5'
                    }}
                  >
                    <Sparkles size={16} color="#D9A441" />
                    <span>{t.marketMatchesBtn}</span>
                  </button>

                  <button
                    onClick={() => onSelectProduct(localizedProd)}
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                  >
                    {t.viewDetail}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Buyer Inquiries Table */}
      <section style={{ marginTop: '48px' }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t.customerOrdersTitle} ({orders.length})</h2>
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
                <p style={styles.orderContact}>
                  {t.phoneLabel} {ord.customer_contact} • {t.emailLabel} {ord.customer_email || 'N/A'}
                </p>
                {ord.notes && <p style={styles.orderNotes}>"{ord.notes}"</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Product Market Linkage Inspector */}
      {selectedProductForMatches && (
        <section style={{ marginTop: '48px' }}>
          <MarketMatchPanel product={selectedProductForMatches} lang={currentLang} />
        </section>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '40px 24px 80px 24px'
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '36px'
  },
  welcomeTag: {
    fontSize: '0.76rem',
    fontWeight: '800',
    color: '#C1602C',
    letterSpacing: '0.12em'
  },
  title: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '2.4rem',
    color: '#3B2A1E',
    marginTop: '4px'
  },
  subtitle: {
    fontSize: '0.98rem',
    color: '#6E5B4D',
    marginTop: '2px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '1.7rem',
    color: '#3B2A1E'
  },
  liveTag: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#7C8A5A'
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  prodItemCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '18px',
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    flexWrap: 'wrap',
    boxShadow: '0 4px 14px rgba(59, 42, 30, 0.04)'
  },
  prodThumb: {
    width: '74px',
    height: '74px',
    borderRadius: '14px',
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
    fontSize: '1.18rem',
    color: '#3B2A1E'
  },
  priceRow: {
    fontSize: '0.9rem',
    color: '#6E5B4D'
  },
  prodActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 16px',
    borderRadius: '12px',
    border: '1px solid',
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#3B2A1E',
    cursor: 'pointer'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '16px',
    padding: '18px 20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    boxShadow: '0 4px 14px rgba(59, 42, 30, 0.04)'
  },
  orderIconBox: {
    width: '42px',
    height: '42px',
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
    marginBottom: '6px'
  },
  customerName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.15rem',
    color: '#3B2A1E'
  },
  orderContact: {
    fontSize: '0.88rem',
    color: '#6E5B4D'
  },
  orderNotes: {
    fontSize: '0.88rem',
    color: '#3B2A1E',
    fontStyle: 'italic',
    marginTop: '6px',
    backgroundColor: '#FAF3E7',
    padding: '8px 12px',
    borderRadius: '10px'
  }
};
