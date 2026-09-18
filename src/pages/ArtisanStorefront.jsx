import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/supabaseClient';
import { MapPin, ArrowLeft, Volume2, Award, Phone, Calendar, Sparkles } from 'lucide-react';

export default function ArtisanStorefront({ artisan, onBack, onSelectProduct, onSelectMarketMatch }) {
  const [products, setProducts] = useState([]);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    async function loadCrafts() {
      const all = await api.getProducts({ status: 'published' });
      if (artisan?.id) {
        setProducts(all.filter(p => p.artisan_id === artisan.id));
      } else {
        setProducts(all);
      }
    }
    loadCrafts();
  }, [artisan]);

  if (!artisan) return null;

  return (
    <div style={styles.container}>
      {/* Back button */}
      <button onClick={onBack} style={styles.backBtn}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      {/* Artisan Profile Hero Banner */}
      <div style={styles.artisanHero}>
        <img
          src={artisan.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
          alt={artisan.full_name}
          style={styles.avatar}
        />
        <div style={styles.artisanInfo}>
          <div style={styles.badgeRow}>
            <span className="badge badge-terracotta">{artisan.craft_type}</span>
            <span style={styles.regionBadge}>
              <MapPin size={14} color="#7C8A5A" />
              <span>{artisan.region}</span>
            </span>
          </div>

          <h1 style={styles.artisanName}>{artisan.full_name}</h1>
          <p style={styles.bioText}>{artisan.bio}</p>

          <div style={styles.statsRow}>
            <div style={styles.statPill}>
              <Award size={16} color="#D9A441" />
              <span>Verified Master Craftsman</span>
            </div>
            <div style={styles.statPill}>
              <Calendar size={16} color="#5C6B73" />
              <span>38+ Years Heritage Tradition</span>
            </div>
          </div>

          {/* Voice Intro Player */}
          <button
            onClick={() => {
              setIsPlayingVoice(true);
              setTimeout(() => setIsPlayingVoice(false), 3000);
            }}
            style={{
              ...styles.voiceBtn,
              backgroundColor: isPlayingVoice ? '#7C8A5A' : '#3B2A1E'
            }}
          >
            <Volume2 size={16} />
            <span>{isPlayingVoice ? '🔊 Playing Artisan Voice Story...' : '▶ Listen to Artisan Self-Introduction'}</span>
          </button>
        </div>
      </div>

      {/* Artisan's Listed Collection */}
      <section style={{ marginTop: '40px' }}>
        <h2 style={styles.sectionTitle}>
          Artisan Handcrafted Collection ({products.length})
        </h2>
        <div style={styles.productGrid}>
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              artisan={artisan}
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 24px 60px 24px'
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: '#3B2A1E',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginBottom: '24px'
  },
  artisanHero: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '24px',
    padding: '36px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '28px',
    alignItems: 'center',
    boxShadow: '0 8px 28px rgba(59, 42, 30, 0.06)'
  },
  avatar: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #FAF3E7',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
  },
  artisanInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  regionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#5C693E'
  },
  artisanName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.4rem',
    color: '#3B2A1E'
  },
  bioText: {
    fontSize: '1rem',
    color: '#6E5B4D',
    lineHeight: '1.5'
  },
  statsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    margin: '6px 0'
  },
  statPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FAF3E7',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  voiceBtn: {
    color: '#FAF3E7',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '0.9rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    marginTop: '6px'
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.8rem',
    color: '#3B2A1E',
    marginBottom: '20px'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  }
};
