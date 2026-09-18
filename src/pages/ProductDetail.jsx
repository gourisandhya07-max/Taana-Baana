import React, { useState, useEffect } from 'react';
import MarketMatchPanel from '../components/MarketMatchPanel';
import OrderModal from '../components/OrderModal';
import { api } from '../lib/supabaseClient';
import { MapPin, ArrowLeft, Volume2, ShieldCheck, ShoppingBag, UserCheck, Sparkles, Clock, Layers } from 'lucide-react';

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

  useEffect(() => {
    async function loadArtisan() {
      if (product?.artisan_id) {
        const art = await api.getArtisanById(product.artisan_id);
        setArtisan(art);
      }
      // Record view metric for dashboard analytics
      if (product?.id) {
        api.recordProductView(product.id);
      }
    }
    loadArtisan();
  }, [product]);

  if (!product) return null;

  const handlePlayVoiceStory = () => {
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 3500);
  };

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button onClick={onBack} style={styles.backBtn}>
        <ArrowLeft size={18} />
        <span>Back to Marketplace</span>
      </button>

      <div style={styles.mainGrid}>
        {/* Left Column: Image Gallery & Voice Player */}
        <div style={styles.galleryCol}>
          <div style={styles.mainImageWrapper}>
            <img
              src={product.image_urls?.[activeImgIndex] || product.image_urls?.[0]}
              alt={product.title}
              style={styles.mainImg}
            />
          </div>

          {/* Thumbnails */}
          {product.image_urls?.length > 1 && (
            <div style={styles.thumbRow}>
              {product.image_urls.map((url, i) => (
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
                <h4 style={styles.voiceTitle}>Listen to Artisan Craft Story</h4>
                <p style={styles.voiceSub}>Narrated by {artisan?.full_name || 'Master Weaver'}</p>
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
              <span>{isPlayingAudio ? '🔊 Playing Audio Narrative...' : '▶ Listen in Regional Language'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Title, Specs & Order Action */}
        <div style={styles.detailsCol}>
          {/* Category & Region */}
          <div style={styles.metaBadgeRow}>
            <span className="badge badge-terracotta">{product.category}</span>
            <span style={styles.regionTag}>
              <MapPin size={14} color="#7C8A5A" />
              <span>{artisan?.region || 'Kerala, India'}</span>
            </span>
          </div>

          <h1 style={styles.productTitle}>{product.title}</h1>

          {/* Price & Fair Wage Floor Banner */}
          <div style={styles.priceBox}>
            <span style={styles.priceVal}>
              ₹{Number(product.final_price || 1500).toLocaleString('en-IN')}
            </span>
            <span style={styles.priceSub}>Direct Artisan Price (No Commission)</span>
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
              <span style={styles.craftedByTag}>MASTER ARTISAN</span>
              <h4 style={styles.artisanName}>{artisan?.full_name || 'Devaki Amma'}</h4>
              <p style={styles.artisanBioSnippet}>{artisan?.bio || 'Preserving centuries-old handloom weaving traditions.'}</p>
            </div>
            <UserCheck size={20} color="#C1602C" />
          </div>

          {/* Specs List */}
          <div style={styles.specsBox}>
            <div style={styles.specItem}>
              <Clock size={16} color="#C1602C" />
              <span>Crafting Time: <strong>{product.production_hours || 12} Hours</strong></span>
            </div>
            <div style={styles.specItem}>
              <Layers size={16} color="#7C8A5A" />
              <span>Dimensions: <strong>{product.size || 'Customizable'}</strong></span>
            </div>
            <div style={styles.specItem}>
              <ShieldCheck size={16} color="#D9A441" />
              <span>Available Units: <strong>{product.quantity_available || 5} Ready in Stock</strong></span>
            </div>
          </div>

          {/* Story Description */}
          <div style={styles.descriptionBox}>
            <h4 style={styles.descHeading}>Heritage & Craft Story</h4>
            <p style={styles.descBody}>{product.description}</p>
          </div>

          {/* Order / Inquiry CTA Button */}
          <button
            onClick={() => setShowOrderModal(true)}
            className="btn btn-primary btn-large-touch"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <ShoppingBag size={20} />
            <span>Contact Artisan / Submit Order Inquiry</span>
          </button>
        </div>
      </div>

      {/* Signature AI Market Linkage Panel Section */}
      <section style={{ marginTop: '48px' }}>
        <MarketMatchPanel product={product} />
      </section>

      {/* Order Modal Popup */}
      {showOrderModal && (
        <OrderModal
          product={product}
          artisan={artisan}
          onClose={() => setShowOrderModal(false)}
        />
      )}
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
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '40px'
  },
  galleryCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  mainImageWrapper: {
    width: '100%',
    height: '420px',
    borderRadius: '20px',
    overflow: 'hidden',
    backgroundColor: '#F8F3EA',
    border: '1px solid #E8D9C5'
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
    width: '74px',
    height: '74px',
    borderRadius: '12px',
    objectFit: 'cover',
    border: '2px solid',
    cursor: 'pointer'
  },
  voiceCard: {
    backgroundColor: '#FAF3E7',
    border: '1px solid #E8D9C5',
    borderRadius: '16px',
    padding: '18px',
    marginTop: '12px'
  },
  voiceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '14px'
  },
  micBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: '#F8ECE4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  voiceTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.05rem',
    color: '#3B2A1E'
  },
  voiceSub: {
    fontSize: '0.82rem',
    color: '#6E5B4D'
  },
  playAudioBtn: {
    width: '100%',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.88rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  detailsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  metaBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  regionTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#5C693E'
  },
  productTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.2rem',
    color: '#3B2A1E',
    lineHeight: '1.2'
  },
  priceBox: {
    backgroundColor: '#FAF2DF',
    border: '1px solid #E5B24E',
    borderRadius: '14px',
    padding: '14px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceVal: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    fontWeight: '800',
    color: '#C1602C'
  },
  priceSub: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  artisanCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '16px',
    padding: '14px 18px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  artisanAvatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  craftedByTag: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#C1602C',
    letterSpacing: '0.1em'
  },
  artisanName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.1rem',
    color: '#3B2A1E'
  },
  artisanBioSnippet: {
    fontSize: '0.8rem',
    color: '#6E5B4D',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  specsBox: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    backgroundColor: '#FAF3E7',
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1px solid #E8D9C5'
  },
  specItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    color: '#3B2A1E'
  },
  descriptionBox: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '16px',
    padding: '20px'
  },
  descHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.1rem',
    color: '#3B2A1E',
    marginBottom: '8px'
  },
  descBody: {
    fontSize: '0.92rem',
    color: '#6E5B4D',
    lineHeight: '1.6'
  }
};
