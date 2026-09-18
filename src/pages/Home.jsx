import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CraftMap from '../components/CraftMap';
import ParallaxCraftShowcase from '../components/ParallaxCraftShowcase';
import { api } from '../lib/supabaseClient';
import { translations, getLocalizedProduct } from '../lib/translations';
import { Sparkles, ArrowRight, HeartHandshake, Zap, Award, ShoppingBag, PlusCircle } from 'lucide-react';

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
      <section style={styles.heroSection}>
        <div style={styles.heroBadge}>
          <Sparkles size={14} color="#D9A441" />
          <span>{t.heroBadge || t.brandSubtitle}</span>
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
          <div style={styles.motifItem}>{t.motifHandlooms}</div>
          <div style={styles.motifItem}>{t.motifPottery}</div>
          <div style={styles.motifItem}>{t.motifChikan}</div>
          <div style={styles.motifItem}>{t.motifDhokra}</div>
        </div>
      </section>

      {/* 3D Parallax Scrolling Showcase Section */}
      <section style={{ margin: '20px 0 60px 0' }}>
        <ParallaxCraftShowcase
          lang={currentLang}
          onNavigate={onNavigate}
        />
      </section>

      {/* Signature AI Market Linkage Feature Showcase */}
      <section style={styles.signatureSection}>
        <div style={styles.signatureHeader}>
          <div style={styles.signatureBadge}>{t.signatureInnovationBadge}</div>
          <h2 style={styles.signatureTitle}>{t.signatureFeatureTitle}</h2>
          <p style={styles.signatureDesc}>{t.signatureFeatureDesc}</p>
        </div>

        <div style={styles.featureGrid}>
          <div className="craft-card" style={styles.featureCard}>
            <div style={styles.featureIconBox}>
              <Zap size={24} color="#C1602C" />
            </div>
            <h3 style={styles.featureTitle}>{t.feat1Title}</h3>
            <p style={styles.featureBody}>{t.feat1Desc}</p>
          </div>

          <div className="craft-card" style={styles.featureCard}>
            <div style={styles.featureIconBox}>
              <Award size={24} color="#D9A441" />
            </div>
            <h3 style={styles.featureTitle}>{t.feat2Title}</h3>
            <p style={styles.featureBody}>{t.feat2Desc}</p>
          </div>

          <div className="craft-card" style={styles.featureCard}>
            <div style={styles.featureIconBox}>
              <HeartHandshake size={24} color="#7C8A5A" />
            </div>
            <h3 style={styles.featureTitle}>{t.feat3Title}</h3>
            <p style={styles.featureBody}>{t.feat3Desc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Geography Craft Map */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 60px auto', padding: '0 24px' }}>
        <CraftMap
          selectedRegion={selectedRegion}
          currentLang={currentLang}
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
            <h2 style={styles.sectionHeading}>{t.featuredHeading}</h2>
            <p style={styles.sectionSubheading}>{t.featuredSubheading}</p>
          </div>
          <button onClick={() => onNavigate('marketplace')} style={styles.seeAllBtn}>
            <span>{t.viewAllCrafts}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={styles.productGrid}>
          {featuredProducts.map((prod) => {
            const localizedProd = getLocalizedProduct(prod, currentLang);
            return (
              <ProductCard
                key={prod.id}
                product={localizedProd}
                artisan={artisansMap.get(prod.artisan_id)}
                currentLang={currentLang}
                onClick={() => onSelectProduct(localizedProd)}
                onSelectMarketMatch={onSelectMarketMatch}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '80px'
  },
  heroSection: {
    maxWidth: '1080px',
    margin: '0 auto',
    padding: '70px 24px 30px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FAF2DF',
    border: '1px solid #E5B24E',
    color: '#3B2A1E',
    fontSize: '0.85rem',
    fontWeight: '800',
    padding: '6px 18px',
    borderRadius: '24px',
    marginBottom: '22px',
    letterSpacing: '0.04em'
  },
  heroTitle: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '3.3rem',
    color: '#3B2A1E',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    marginBottom: '20px'
  },
  heroSubtitle: {
    fontSize: '1.18rem',
    color: '#6E5B4D',
    maxWidth: '780px',
    lineHeight: '1.7',
    marginBottom: '36px'
  },
  heroCtaGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '36px'
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
    borderRadius: '24px',
    padding: '8px 18px',
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#3B2A1E',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  signatureSection: {
    maxWidth: '1240px',
    margin: '0 auto 70px auto',
    padding: '50px 32px',
    backgroundColor: '#FAF3E7',
    borderRadius: '28px',
    border: '1px solid #E8D9C5',
    boxShadow: '0 8px 30px rgba(59, 42, 30, 0.04)'
  },
  signatureHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  signatureBadge: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#C1602C',
    letterSpacing: '0.14em',
    marginBottom: '8px'
  },
  signatureTitle: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '2.3rem',
    color: '#3B2A1E',
    lineHeight: '1.25'
  },
  signatureDesc: {
    fontSize: '1.05rem',
    color: '#6E5B4D',
    maxWidth: '680px',
    margin: '12px auto 0 auto',
    lineHeight: '1.65'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: '28px'
  },
  featureCard: {
    padding: '30px',
    backgroundColor: '#FFFFFF'
  },
  featureIconBox: {
    width: '54px',
    height: '54px',
    borderRadius: '16px',
    backgroundColor: '#FAF3E7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  featureTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.25rem',
    color: '#3B2A1E',
    marginBottom: '10px'
  },
  featureBody: {
    fontSize: '0.92rem',
    color: '#6E5B4D',
    lineHeight: '1.6'
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
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  sectionHeading: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '2.1rem',
    color: '#3B2A1E',
    marginBottom: '6px'
  },
  sectionSubheading: {
    fontSize: '0.96rem',
    color: '#6E5B4D'
  },
  seeAllBtn: {
    background: 'none',
    border: 'none',
    color: '#C1602C',
    fontWeight: '700',
    fontSize: '0.96rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
    gap: '28px'
  }
};
