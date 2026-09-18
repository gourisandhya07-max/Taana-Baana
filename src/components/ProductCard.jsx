import React from 'react';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { analyzeMarketMatches } from '../lib/marketMatchingEngine';

export default function ProductCard({ product, artisan, onClick, onSelectMarketMatch }) {
  const topMatch = analyzeMarketMatches(product)[0];

  return (
    <div className="craft-card craft-card-float" style={styles.card} onClick={onClick}>
      {/* Category Badge & Craft Region */}
      <div style={styles.cardHeader}>
        <span className="badge badge-terracotta">{product.category}</span>
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
          src={product.image_urls?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          style={styles.image}
          loading="lazy"
        />
        {/* Price Tag Overlay */}
        <div style={styles.priceBadge}>
          ₹{Number(product.final_price || product.suggested_price_min || 1500).toLocaleString('en-IN')}
        </div>
      </div>

      {/* Title & Artisan Info */}
      <div style={styles.content}>
        <h3 style={styles.title}>{product.title}</h3>
        <p style={styles.artisanName}>
          Crafted by <strong>{artisan?.full_name || 'Traditional Artisan'}</strong>
        </p>

        {/* AI Market Linkage Badge */}
        {topMatch && (
          <div
            style={styles.matchPill}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMarketMatch?.(product, topMatch);
            }}
            title="Click to view AI Market Linkage Analysis"
          >
            <Sparkles size={13} color="#D9A441" />
            <span>{topMatch.matchPercentage}% Match: {topMatch.name.split('&')[0]}</span>
          </div>
        )}

        {/* Tags */}
        <div style={styles.tagsRow}>
          {product.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} style={styles.tag}>#{tag}</span>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div style={styles.footerRow}>
          <span style={styles.viewDetailsText}>Explore Story</span>
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
    borderRadius: '18px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5'
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
    fontWeight: '600'
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '220px',
    borderRadius: '12px',
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
    fontSize: '1rem',
    padding: '4px 12px',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginTop: '14px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.15rem',
    color: '#3B2A1E',
    lineHeight: '1.3',
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
    borderRadius: '6px'
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
    fontSize: '0.85rem',
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
