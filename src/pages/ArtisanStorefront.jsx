import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/supabaseClient';
import { translations, getLocalizedProduct } from '../lib/translations';
import { MapPin, ArrowLeft, Volume2, Award, Calendar } from 'lucide-react';

export default function ArtisanStorefront({
  artisan,
  onBack,
  onSelectProduct,
  onSelectMarketMatch,
  currentLang = 'en'
}) {
  const [products, setProducts] = useState([]);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const t = translations[currentLang] || translations.en;

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
        <span>{t.back}</span>
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
              <span>{t.verifiedMaster}</span>
            </div>
            <div style={styles.statPill}>
              <Calendar size={16} color="#5C6B73" />
              <span>{t.yearsHeritage}</span>
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
            <span>{isPlayingVoice ? t.playingSelfIntro : t.listenSelfIntro}</span>
          </button>
        </div>
      </div>

      {/* Artisan's Listed Collection */}
      <section style={{ marginTop: '48px' }}>
        <h2 style={styles.sectionTitle}>
          {t.artisanCollection} ({products.length})
        </h2>
        <div style={styles.productGrid}>
          {products.map((prod) => {
            const localizedProd = getLocalizedProduct(prod, currentLang);
            return (
              <ProductCard
                key={prod.id}
                product={localizedProd}
                artisan={artisan}
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
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '40px 24px 80px 24px'
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    color: '#3B2A1E',
    fontWeight: '700',
    fontSize: '0.92rem',
    cursor: 'pointer',
    marginBottom: '28px'
  },
  artisanHero: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '28px',
    padding: '40px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '32px',
    alignItems: 'center',
    boxShadow: '0 8px 32px rgba(59, 42, 30, 0.06)'
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
    gap: '12px'
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
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '2.5rem',
    color: '#3B2A1E'
  },
  bioText: {
    fontSize: '1.02rem',
    color: '#6E5B4D',
    lineHeight: '1.6'
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
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  voiceBtn: {
    color: '#FAF3E7',
    border: 'none',
    padding: '12px 22px',
    borderRadius: '16px',
    fontWeight: '700',
    fontSize: '0.92rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    marginTop: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px rgba(59, 42, 30, 0.2)'
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '1.9rem',
    color: '#3B2A1E',
    marginBottom: '24px'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '28px'
  }
};
