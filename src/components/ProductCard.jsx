import React from 'react';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { analyzeMarketMatches } from '../lib/marketMatchingEngine';
import { translations, getLocalizedProduct, getLocalizedCategory } from '../lib/translations';

export default function ProductCard({
  product,
  artisan,
  onClick,
  onSelectMarketMatch,
  currentLang = 'en'
}) {
  const t = translations[currentLang] || translations.en;
  const localizedProd = getLocalizedProduct(product, currentLang);
  const topMatch = analyzeMarketMatches(localizedProd)[0];

  return (
    <div className="craft-card" style={styles.card} onClick={onClick}>
      {/* Category Badge & Craft Region */}
      <div style={styles.cardHeader}>
        <span className="badge badge-terracotta">
          {getLocalizedCategory(localizedProd.category, currentLang)}
        </span>
        {artisan?.region && (
          <span style={styles.regionBadge}>
            <MapPin size={12} color="#7C8A5A" />
            <span>{artisan.region}</span>
          </span>
        )}
      </div>

      {/* Image Container with Smooth Zoom */}
      <div style={styles.imageWrapper}>
        <img
          src={localizedProd.image_urls?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
          alt={localizedProd.title}
          style={styles.image}
          loading="lazy"
        />
        {/* Price Tag Overlay */}
        <div style={styles.priceBadge}>
          ₹{Number(localizedProd.final_price || localizedProd.suggested_price_min || 1500).toLocaleString('en-IN')}
        </div>
      </div>

      {/* Title & Artisan Info */}
      <div style={styles.content}>
        <h3 style={styles.title}>{localizedProd.title}</h3>
        <p style={styles.artisanName}>
          {t.craftedBy} <strong>{artisan?.full_name || 'Traditional Artisan'}</strong>
        </p>

        {/* AI Market Linkage Badge */}
        {topMatch && (
          <div
            style={styles.matchPill}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMarketMatch?.(localizedProd, topMatch);
            }}
            title="Click to view AI Market Linkage Analysis"
          >
            <Sparkles size={13} color="#D9A441" />
            <span>{topMatch.matchPercentage}% {t.match}: {topMatch.name.split('&')[0]}</span>
          </div>
        )}

        {/* Tags */}
        <div style={styles.tagsRow}>
          {localizedProd.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} style={styles.tag}>#{tag}</span>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div style={styles.footerRow}>
          <span style={styles.viewDetailsText}>{t.exploreStory}</span>
          <div style={styles.arrowIcon}>
            <ArrowRight size={14} color="#C1602C" />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '16px',
    borderRadius: '20px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    boxShadow: '0 4px 16px rgba(59, 42, 30, 0.05)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  regionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.78rem',
    color: '#5C693E',
    fontWeight: '700'
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '220px',
    borderRadius: '14px',
    overflow: 'hidden',
    backgroundColor: '#F8F3EA'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease'
  },
  priceBadge: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: '#3B2A1E',
    color: '#FAF3E7',
    fontWeight: '800',
    fontSize: '0.98rem',
    padding: '5px 12px',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.18)'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginTop: '14px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.18rem',
    color: '#3B2A1E',
    lineHeight: '1.35',
    marginBottom: '6px'
  },
  artisanName: {
    fontSize: '0.85rem',
    color: '#6E5B4D',
    marginBottom: '10px'
  },
  matchPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FAF2DF',
    border: '1px solid #E5B24E',
    color: '#3B2A1E',
    padding: '4px 10px',
    borderRadius: '14px',
    fontSize: '0.78rem',
    fontWeight: '700',
    marginBottom: '12px',
    alignSelf: 'flex-start',
    cursor: 'pointer'
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '14px'
  },
  tag: {
    fontSize: '0.72rem',
    color: '#5C6B73',
    backgroundColor: '#EBF0F3',
    padding: '2px 8px',
    borderRadius: '6px',
    fontWeight: '600'
  },
  footerRow: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '10px',
    borderTop: '1px dashed #E8D9C5'
  },
  viewDetailsText: {
    fontSize: '0.86rem',
    color: '#C1602C',
    fontWeight: '700'
  },
  arrowIcon: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#F8ECE4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
