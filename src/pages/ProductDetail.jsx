import React, { useState, useEffect } from 'react';
import MarketMatchPanel from '../components/MarketMatchPanel';
import OrderModal from '../components/OrderModal';
import { api } from '../lib/supabaseClient';
import { translations, getLocalizedProduct, getLocalizedCategory } from '../lib/translations';
import { MapPin, ArrowLeft, Volume2, ShieldCheck, ShoppingBag, UserCheck, Clock, Layers } from 'lucide-react';

export default function ProductDetail({
  product,
  onBack,
  onViewArtisanStorefront,
  currentLang = 'en'
}) {
  const [artisan, setArtisan] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const t = translations[currentLang] || translations.en;
  const localizedProd = getLocalizedProduct(product, currentLang);

  useEffect(() => {
    async function loadArtisan() {
      if (localizedProd?.artisan_id) {
        const art = await api.getArtisanById(localizedProd.artisan_id);
        setArtisan(art);
      }
      // Record view metric for dashboard analytics
      if (localizedProd?.id) {
        api.recordProductView(localizedProd.id);
      }
    }
    loadArtisan();
  }, [localizedProd]);

  if (!localizedProd) return null;

  const handlePlayVoiceStory = () => {
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 3500);
  };

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button onClick={onBack} style={styles.backBtn}>
        <ArrowLeft size={18} />
        <span>{t.backToMarketplace}</span>
      </button>

      <div style={styles.mainGrid}>
        {/* Left Column: Image Gallery & Voice Player */}
        <div style={styles.galleryCol}>
          <div style={styles.mainImageWrapper}>
            <img
              src={localizedProd.image_urls?.[activeImgIndex] || localizedProd.image_urls?.[0]}
              alt={localizedProd.title}
              style={styles.mainImg}
            />
          </div>

          {/* Thumbnails */}
          {localizedProd.image_urls?.length > 1 && (
            <div style={styles.thumbRow}>
              {localizedProd.image_urls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Thumbnail ${i}`}
                  onClick={() => setActiveImgIndex(i)}
                  style={{
                    ...styles.thumbImg,
                    borderColor: activeImgIndex === i ? '#C1602C' : '#E8D9C5'
                  }}
                />
              ))}
            </div>
          )}

          {/* Voice Craft Story Audio Card */}
          <div style={styles.voiceCard}>
            <div style={styles.voiceHeader}>
              <div style={styles.micBadge}>
                <Volume2 size={20} color="#C1602C" />
              </div>
              <div>
                <h4 style={styles.voiceTitle}>{t.listenArtisanStory}</h4>
                <p style={styles.voiceSub}>{t.narratedBy} {artisan?.full_name || 'Master Weaver'}</p>
              </div>
            </div>

            <button
              onClick={handlePlayVoiceStory}
              style={{
                ...styles.playAudioBtn,
                backgroundColor: isPlayingAudio ? '#7C8A5A' : '#C1602C'
              }}
            >
              <Volume2 size={16} />
              <span>{isPlayingAudio ? t.playingAudio : t.listenRegional}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Title, Specs & Order Action */}
        <div style={styles.detailsCol}>
          {/* Category & Region */}
          <div style={styles.metaBadgeRow}>
            <span className="badge badge-terracotta">
              {getLocalizedCategory(localizedProd.category, currentLang)}
            </span>
            <span style={styles.regionTag}>
              <MapPin size={14} color="#7C8A5A" />
              <span>{artisan?.region || 'Kerala, India'}</span>
            </span>
          </div>

          <h1 style={styles.productTitle}>{localizedProd.title}</h1>

          {/* Price & Fair Wage Floor Banner */}
          <div style={styles.priceBox}>
            <span style={styles.priceVal}>
              ₹{Number(localizedProd.final_price || 1500).toLocaleString('en-IN')}
            </span>
            <span style={styles.priceSub}>{t.directArtisanPrice}</span>
          </div>

          {/* Artisan Bio Card Link */}
          <div
            style={styles.artisanCard}
            onClick={() => onViewArtisanStorefront?.(artisan)}
          >
            <img
              src={artisan?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
              alt={artisan?.full_name}
              style={styles.artisanAvatar}
            />
            <div style={{ flex: 1 }}>
              <span style={styles.craftedByTag}>{t.masterArtisan}</span>
              <h4 style={styles.artisanName}>{artisan?.full_name || 'Devaki Amma'}</h4>
              <p style={styles.artisanBioSnippet}>{artisan?.bio || 'Preserving centuries-old handloom weaving traditions.'}</p>
            </div>
            <UserCheck size={20} color="#C1602C" />
          </div>

          {/* Specs List */}
          <div style={styles.specsBox}>
            <div style={styles.specItem}>
              <Clock size={16} color="#C1602C" />
              <span>{t.craftingTime} <strong>{localizedProd.production_hours || 12} {t.hours}</strong></span>
            </div>
            <div style={styles.specItem}>
              <Layers size={16} color="#7C8A5A" />
              <span>{t.dimensions} <strong>{localizedProd.size || t.customizable}</strong></span>
            </div>
            <div style={styles.specItem}>
              <ShieldCheck size={16} color="#D9A441" />
              <span>{t.availableUnits} <strong>{localizedProd.quantity_available || 5} {t.inStock}</strong></span>
            </div>
          </div>

          {/* Story Description */}
          <div style={styles.descriptionBox}>
            <h4 style={styles.descHeading}>{t.heritageStory}</h4>
            <p style={styles.descBody}>{localizedProd.description}</p>
          </div>

          {/* Order / Inquiry CTA Button */}
          <button
            onClick={() => setShowOrderModal(true)}
            className="btn btn-primary btn-large-touch"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <ShoppingBag size={20} />
            <span>{t.contactArtisanBtn}</span>
          </button>
        </div>
      </div>

      {/* Signature AI Market Linkage Panel Section */}
      <section style={{ marginTop: '54px' }}>
        <MarketMatchPanel product={localizedProd} lang={currentLang} />
      </section>

      {/* Order Modal Popup */}
      {showOrderModal && (
        <OrderModal
          product={localizedProd}
          artisan={artisan}
          currentLang={currentLang}
          onClose={() => setShowOrderModal(false)}
        />
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
    marginBottom: '28px',
    transition: 'transform 0.2s ease'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '44px'
  },
  galleryCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  mainImageWrapper: {
    width: '100%',
    height: '440px',
    borderRadius: '24px',
    overflow: 'hidden',
    backgroundColor: '#F8F3EA',
    border: '1px solid #E8D9C5',
    boxShadow: '0 8px 24px rgba(59, 42, 30, 0.06)'
  },
  mainImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  thumbRow: {
    display: 'flex',
    gap: '12px'
  },
  thumbImg: {
    width: '76px',
    height: '76px',
    borderRadius: '14px',
    objectFit: 'cover',
    border: '2px solid',
    cursor: 'pointer'
  },
  voiceCard: {
    backgroundColor: '#FAF3E7',
    border: '1px solid #E8D9C5',
    borderRadius: '20px',
    padding: '20px',
    marginTop: '8px',
    boxShadow: '0 4px 14px rgba(59, 42, 30, 0.04)'
  },
  voiceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '16px'
  },
  micBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    backgroundColor: '#F8ECE4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  voiceTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.1rem',
    color: '#3B2A1E'
  },
  voiceSub: {
    fontSize: '0.85rem',
    color: '#6E5B4D',
    marginTop: '2px'
  },
  playAudioBtn: {
    width: '100%',
    color: '#FFFFFF',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(193, 96, 44, 0.25)'
  },
  detailsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  metaBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  regionTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#5C693E'
  },
  productTitle: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '2.4rem',
    color: '#3B2A1E',
    lineHeight: '1.25'
  },
  priceBox: {
    backgroundColor: '#FAF2DF',
    border: '1px solid #E5B24E',
    borderRadius: '16px',
    padding: '16px 22px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 16px rgba(217, 164, 65, 0.12)'
  },
  priceVal: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#C1602C'
  },
  priceSub: {
    fontSize: '0.86rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  artisanCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '18px',
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px rgba(59, 42, 30, 0.04)'
  },
  artisanAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  craftedByTag: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#C1602C',
    letterSpacing: '0.12em'
  },
  artisanName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.15rem',
    color: '#3B2A1E'
  },
  artisanBioSnippet: {
    fontSize: '0.82rem',
    color: '#6E5B4D',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  specsBox: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '18px',
    backgroundColor: '#FAF3E7',
    padding: '16px 20px',
    borderRadius: '16px',
    border: '1px solid #E8D9C5'
  },
  specItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.88rem',
    color: '#3B2A1E'
  },
  descriptionBox: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '18px',
    padding: '22px',
    boxShadow: '0 4px 14px rgba(59, 42, 30, 0.03)'
  },
  descHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem',
    color: '#3B2A1E',
    marginBottom: '10px'
  },
  descBody: {
    fontSize: '0.94rem',
    color: '#6E5B4D',
    lineHeight: '1.65'
  }
};
