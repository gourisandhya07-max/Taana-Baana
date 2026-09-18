import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CraftMap from '../components/CraftMap';
import { api } from '../lib/supabaseClient';
import { translations } from '../lib/translations';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Zap, Award, ShoppingBag, PlusCircle } from 'lucide-react';

export default function Home({
  onNavigate,
  onSelectProduct,
  onSelectMarketMatch,
  currentLang = 'en'
}) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [artisansMap, setArtisansMap] = useState(new Map());
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const t = translations[currentLang] || translations.en;

  const heroTags = t.heroTags || [
    '🧵 Pit-loom Handlooms',
    '🏺 Terracotta Votives',
    '🪡 Lucknow Chikankari',
    '🪔 Bastar Dhokra Brass'
  ];

  const featureCards = [
    {
      title: t.featureCardOneTitle,
      body: t.featureCardOneBody,
      icon: <Zap size={24} color="#C1602C" />
    },
    {
      title: t.featureCardTwoTitle,
      body: t.featureCardTwoBody,
      icon: <Award size={24} color="#D9A441" />
    },
    {
      title: t.featureCardThreeTitle,
      body: t.featureCardThreeBody,
      icon: <HeartHandshake size={24} color="#7C8A5A" />
    }
  ];

  useEffect(() => {
    async function loadData() {
      const [prods, arts] = await Promise.all([
        api.getProducts({ status: 'published' }),
        api.getArtisans()
      ]);
      setFeaturedProducts(prods.slice(0, 4));
      setArtisansMap(new Map(arts.map(a => [a.id, a])));
    }
    loadData();
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section className="parallax-scene hero-scene" style={styles.heroSection}>
        <div className="parallax-layer hero-orb hero-orb-one" />
        <div className="parallax-layer hero-orb hero-orb-two" />
        <div className="parallax-layer hero-grid" />

        <div style={styles.heroBadge}>
          <Sparkles size={14} color="#D9A441" />
          <span>{t.brandSubtitle}</span>
        </div>

        <h1 style={styles.heroTitle}>
          {t.heroTitle}
        </h1>

        <p style={styles.heroSubtitle}>
          {t.heroSubtitle}
        </p>

        {/* Hero CTA Buttons */}
        <div style={styles.heroCtaGroup}>
          <button
            onClick={() => onNavigate('add-product')}
            className="btn btn-primary btn-large-touch"
          >
            <PlusCircle size={20} />
            <span>{t.catalogBtn}</span>
          </button>

          <button
            onClick={() => onNavigate('marketplace')}
            className="btn btn-outline btn-large-touch"
          >
            <ShoppingBag size={20} />
            <span>{t.exploreMarketBtn}</span>
          </button>
        </div>

        {/* Floating Motifs */}
        <div style={styles.floatingMotifBar}>
          {heroTags.map((tag, index) => (
            <div key={index} style={styles.motifItem}>{tag}</div>
          ))}
        </div>
      </section>

      {/* Signature AI Market Linkage Feature Showcase */}
      <section style={styles.signatureSection}>
        <div style={styles.signatureHeader}>
          <div style={styles.signatureBadge}>{t.signatureBadge}</div>
          <h2 style={styles.signatureTitle}>{t.signatureFeatureTitle}</h2>
          <p style={styles.signatureDesc}>{t.signatureFeatureDesc}</p>
        </div>

        <div style={styles.featureGrid}>
          {featureCards.map((card) => (
            <div key={card.title} className="craft-card" style={styles.featureCard}>
              <div style={styles.featureIconBox}>{card.icon}</div>
              <h3 style={styles.featureTitle}>{card.title}</h3>
              <p style={styles.featureBody}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Geography Craft Map */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 40px auto', padding: '0 24px' }}>
        <CraftMap
          selectedRegion={selectedRegion}
          onSelectRegion={(reg) => {
            setSelectedRegion(reg);
            onNavigate('marketplace');
          }}
        />
      </section>

      {/* Live Marketplace Featured Crafts Grid */}
      <section style={styles.craftsSection}>
        <div style={styles.craftsHeader}>
          <div>
            <h2 style={styles.sectionHeading}>{t.authenticCollections}</h2>
            <p style={styles.sectionSubheading}>{t.liveMarketplaceSubtitle}</p>
          </div>
          <button onClick={() => onNavigate('marketplace')} style={styles.seeAllBtn}>
            <span>{t.viewAllCrafts}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={styles.productGrid}>
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              artisan={artisansMap.get(prod.artisan_id)}
              onClick={() => onSelectProduct(prod)}
              onSelectMarketMatch={onSelectMarketMatch}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '60px'
  },
  heroSection: {
    position: 'relative',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '90px 24px 50px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden'
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FAF2DF',
    border: '1px solid #E5B24E',
    color: '#3B2A1E',
    fontSize: '0.85rem',
    fontWeight: '700',
    padding: '6px 16px',
    borderRadius: '20px',
    marginBottom: '20px'
  },
  heroTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
    color: '#3B2A1E',
    lineHeight: '0.95',
    letterSpacing: '-0.04em',
    marginBottom: '18px',
    textShadow: '0 12px 28px rgba(59, 42, 30, 0.08)'
  },
  heroSubtitle: {
    fontSize: '1.08rem',
    color: '#6E5B4D',
    maxWidth: '760px',
    lineHeight: '1.75',
    marginBottom: '32px'
  },
  heroCtaGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '40px'
  },
  floatingMotifBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center'
  },
  motifItem: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '20px',
    padding: '6px 16px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#3B2A1E',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
  },
  signatureSection: {
    maxWidth: '1240px',
    margin: '0 auto 60px auto',
    padding: '40px 24px',
    backgroundColor: '#FAF3E7',
    borderRadius: '24px',
    border: '1px solid #E8D9C5'
  },
  signatureHeader: {
    textAlign: 'center',
    marginBottom: '36px'
  },
  signatureBadge: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#C1602C',
    letterSpacing: '0.14em',
    marginBottom: '6px'
  },
  signatureTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.2rem',
    color: '#3B2A1E'
  },
  signatureDesc: {
    fontSize: '1rem',
    color: '#6E5B4D',
    maxWidth: '600px',
    margin: '8px auto 0 auto'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  featureCard: {
    padding: '28px',
    backgroundColor: '#FFFFFF'
  },
  featureIconBox: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    backgroundColor: '#FAF3E7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  featureTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem',
    color: '#3B2A1E',
    marginBottom: '8px'
  },
  featureBody: {
    fontSize: '0.9rem',
    color: '#6E5B4D',
    lineHeight: '1.5'
  },
  craftsSection: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '0 24px'
  },
  craftsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '28px'
  },
  sectionHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    color: '#3B2A1E'
  },
  sectionSubheading: {
    fontSize: '0.92rem',
    color: '#6E5B4D'
  },
  seeAllBtn: {
    background: 'none',
    border: 'none',
    color: '#C1602C',
    fontWeight: '700',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px'
  }
};
