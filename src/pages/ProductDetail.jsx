import React, { useState, useEffect } from 'react';
import MarketMatchPanel from '../components/MarketMatchPanel';
import OrderModal from '../components/OrderModal';
import { api } from '../lib/supabaseClient';
import { translations, getLocalizedProduct, getLocalizedCategory, getLocalizedRegion } from '../lib/translations';
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

  const t = translations[currentLang] || translations.en;
  const localizedProd = getLocalizedProduct(product, currentLang);

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
        <span>{currentLang === 'en' ? 'Back to Marketplace' : currentLang === 'hi' ? 'बाजार पर वापस जाएं' : 'വിപണിയിലേക്ക് മടങ്ങുക'}</span>
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
                <h4 style={styles.voiceTitle}>{currentLang === 'en' ? 'Listen to Artisan Craft Story' : currentLang === 'hi' ? 'कारीगर की कला कहानी सुनें' : 'കരകൗശല കഥ കേൾക്കൂ'}</h4>
                <p style={styles.voiceSub}>{currentLang === 'en' ? 'Narrated by' : currentLang === 'hi' ? 'कहानी सुनाने वाले' : 'വിവരിച്ചത്'} {artisan?.full_name || 'Master Weaver'}</p>
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
              <span>{isPlayingAudio ? (currentLang === 'en' ? '🔊 Playing Audio Narrative...' : currentLang === 'hi' ? '🔊 ऑडियो कहानी चल रही है...' : '🔊 ഓഡിയോ കഥ കേൾക്കുന്നു...') : (currentLang === 'en' ? '▶ Listen in Regional Language' : currentLang === 'hi' ? '▶ स्थानीय भाषा में सुनें' : '▶ പ്രാദേശിക ഭാഷയിൽ കേൾക്കൂ')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Title, Specs & Order Action */}
        <div style={styles.detailsCol}>
          {/* Category & Region */}
          <div style={styles.metaBadgeRow}>
            <span className="badge badge-terracotta">{getLocalizedCategory(localizedProd.category, currentLang)}</span>
            <span style={styles.regionTag}>
              <MapPin size={14} color="#7C8A5A" />
              <span>{getLocalizedRegion(artisan?.region, currentLang) || 'Kerala, India'}</span>
            </span>
          </div>

          <h1 style={styles.productTitle}>{localizedProd.title}</h1>

          {/* Price & Fair Wage Floor Banner */}
          <div style={styles.priceBox}>
            <span style={styles.priceVal}>
              ₹{Number(localizedProd.final_price || 1500).toLocaleString('en-IN')}
            </span>
            <span style={styles.priceSub}>
              {currentLang === 'en' ? 'Direct Artisan Price (No Commission)' : currentLang === 'hi' ? 'सीधे कारीगर मूल्य (कोई कमीशन नहीं)' : 'നേരിട്ടുള്ള വില (കമ്മീഷൻ ഇല്ല)'}
            </span>
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
              <span style={styles.craftedByTag}>{currentLang === 'en' ? 'MASTER ARTISAN' : currentLang === 'hi' ? 'मास्टर आर्टिसन' : 'മാസ്റ്റർ ആർട്ടിസൻ'}</span>
              <h4 style={styles.artisanName}>{artisan?.full_name || 'Devaki Amma'}</h4>
              <p style={styles.artisanBioSnippet}>{artisan?.bio || 'Preserving centuries-old handloom weaving traditions.'}</p>
            </div>
            <UserCheck size={20} color="#C1602C" />
          </div>

          {/* Specs List */}
          <div style={styles.specsBox}>
            <div style={styles.specItem}>
              <Clock size={16} color="#C1602C" />
              <span>{currentLang === 'en' ? 'Crafting Time:' : currentLang === 'hi' ? 'बनाने का समय:' : 'പണി എടുത്ത സമയം:'} <strong>{localizedProd.production_hours || 12} {currentLang === 'en' ? 'Hours' : currentLang === 'hi' ? 'घंटे' : 'മണിക്കൂർ'}</strong></span>
            </div>
            <div style={styles.specItem}>
              <Layers size={16} color="#7C8A5A" />
              <span>{currentLang === 'en' ? 'Dimensions:' : currentLang === 'hi' ? 'माप:' : 'അളവുകൾ:'} <strong>{localizedProd.size || (currentLang === 'en' ? 'Customizable' : currentLang === 'hi' ? 'अनुकूलित' : 'ആവശ്യാനുസരണം')}</strong></span>
            </div>
            <div style={styles.specItem}>
              <ShieldCheck size={16} color="#D9A441" />
              <span>{currentLang === 'en' ? 'Available Units:' : currentLang === 'hi' ? 'उपलब्ध मात्रा:' : 'ലഭ്യമായ എണ്ണം:'} <strong>{localizedProd.quantity_available || 5} {currentLang === 'en' ? 'Ready in Stock' : currentLang === 'hi' ? 'स्टॉक में उपलब्ध' : 'സ്റ്റോക്കിൽ ലഭ്യമാണ്'}</strong></span>
            </div>
          </div>

          {/* Story Description */}
          <div style={styles.descriptionBox}>
            <h4 style={styles.descHeading}>{currentLang === 'en' ? 'Heritage & Craft Story' : currentLang === 'hi' ? 'परंपरा और कारीगरी की कहानी' : 'പാരമ്പര്യം & കരകൗശല കഥ'}</h4>
            <p style={styles.descBody}>{localizedProd.description}</p>
          </div>

          {/* Order / Inquiry CTA Button */}
          <button
            onClick={() => setShowOrderModal(true)}
            className="btn btn-primary btn-large-touch"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <ShoppingBag size={20} />
            <span>{currentLang === 'en' ? 'Contact Artisan / Submit Order Inquiry' : currentLang === 'hi' ? 'कारीगर से संपर्क करें / ऑर्डर पूछताछ भेजें' : 'കരകൗശല വിദഗ്ധനോട് സംസാരിക്കൂ / ഓർഡർ ചോദ്യം അയക്കൂ'}</span>
          </button>
        </div>
      </div>

      {/* Signature AI Market Linkage Panel Section */}
      <section style={{ marginTop: '48px' }}>
        <MarketMatchPanel product={localizedProd} lang={currentLang} />
      </section>

      {/* Order Modal Popup */}
      {showOrderModal && (
        <OrderModal
          product={localizedProd}
          artisan={artisan}
          onClose={() => setShowOrderModal(false)}
          currentLang={currentLang}
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
