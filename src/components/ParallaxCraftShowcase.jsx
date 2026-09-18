import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Compass, Award, HeartHandshake } from 'lucide-react';
import { translations } from '../lib/translations';

export default function ParallaxCraftShowcase({ lang = 'en', onNavigate }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);
  const t = translations[lang] || translations.en;

  // Track scroll position for smooth parallax
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse coordinates relative to container center for 3D tilt
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2); // -1 to 1
    const y = (e.clientY - centerY) / (rect.height / 2); // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Parallax offsets based on scroll and mouse tilt
  const tiltX = mousePos.y * -8;
  const tiltY = mousePos.x * 8;
  const bgScrollOffset = (scrollY * 0.08) % 40;
  const floatOffset1 = Math.sin(scrollY * 0.005) * 15 + mousePos.y * -15;
  const floatOffset2 = Math.cos(scrollY * 0.006) * 18 + mousePos.x * 15;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={styles.outerWrapper}
    >
      {/* Background Sacred Geometric Craft Lattice (Layer 0) */}
      <div
        style={{
          ...styles.bgLattice,
          transform: `translateY(${bgScrollOffset}px) scale(1.05)`
        }}
      />

      {/* Decorative Warm Ambient Glows */}
      <div style={{ ...styles.ambientGlow, top: '10%', left: '15%', background: 'radial-gradient(circle, rgba(193, 96, 44, 0.15) 0%, transparent 70%)' }} />
      <div style={{ ...styles.ambientGlow, bottom: '15%', right: '10%', background: 'radial-gradient(circle, rgba(217, 164, 65, 0.18) 0%, transparent 70%)' }} />

      <div style={styles.contentContainer}>
        {/* Header Badge & Titles */}
        <div style={styles.headerArea}>
          <div style={styles.badge}>
            <Compass size={14} color="#C1602C" />
            <span>{t.parallaxBadge}</span>
          </div>

          <h2 style={styles.title}>
            {t.parallaxTitle}
          </h2>

          <p style={styles.subtitle}>
            {t.parallaxSubtitle}
          </p>

          <div style={styles.interactiveIndicator}>
            <Sparkles size={13} color="#D9A441" />
            <span>{t.parallaxInteractiveTip}</span>
          </div>
        </div>

        {/* 3D Perspective Stage */}
        <div style={styles.perspectiveStage}>
          {/* Main 3D Tilting Card Pedestal (Layer 2) */}
          <div
            style={{
              ...styles.main3dCard,
              transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(20px)`
            }}
          >
            {/* 3 Craft Artifact Cards arranged in 3D Depth */}
            <div style={styles.cardsRow}>
              {/* Card 1: Kasavu Handloom */}
              <div
                style={{
                  ...styles.craftArtifactCard,
                  transform: `translateZ(40px) translateY(${floatOffset1}px)`
                }}
              >
                <div style={styles.artifactImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
                    alt={t.parallaxCard1Title}
                    style={styles.artifactImg}
                    loading="lazy"
                  />
                  <div style={styles.tagBadge}>Kerala • Weaving</div>
                </div>
                <div style={styles.artifactContent}>
                  <h3 style={styles.cardHeading}>{t.parallaxCard1Title}</h3>
                  <p style={styles.cardBody}>{t.parallaxCard1Desc}</p>
                  <div style={styles.priceHighlight}>₹3,950 <span>• Direct Price</span></div>
                </div>
              </div>

              {/* Card 2: Terracotta Art */}
              <div
                style={{
                  ...styles.craftArtifactCard,
                  ...styles.featuredCenterCard,
                  transform: `translateZ(70px) translateY(${floatOffset2}px)`
                }}
              >
                <div style={styles.artifactImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80"
                    alt={t.parallaxCard2Title}
                    style={styles.artifactImg}
                    loading="lazy"
                  />
                  <div style={{ ...styles.tagBadge, backgroundColor: '#FAF2DF', color: '#D9A441' }}>
                    Rajasthan • Terracotta
                  </div>
                </div>
                <div style={styles.artifactContent}>
                  <h3 style={styles.cardHeading}>{t.parallaxCard2Title}</h3>
                  <p style={styles.cardBody}>{t.parallaxCard2Desc}</p>
                  <div style={styles.priceHighlight}>₹1,450 <span>• Fair Wage Certified</span></div>
                </div>
              </div>

              {/* Card 3: Bastar Dhokra Brass */}
              <div
                style={{
                  ...styles.craftArtifactCard,
                  transform: `translateZ(40px) translateY(${floatOffset1 * -0.8}px)`
                }}
              >
                <div style={styles.artifactImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=600&q=80"
                    alt={t.parallaxCard3Title}
                    style={styles.artifactImg}
                    loading="lazy"
                  />
                  <div style={styles.tagBadge}>Chhattisgarh • Brass</div>
                </div>
                <div style={styles.artifactContent}>
                  <h3 style={styles.cardHeading}>{t.parallaxCard3Title}</h3>
                  <p style={styles.cardBody}>{t.parallaxCard3Desc}</p>
                  <div style={styles.priceHighlight}>₹2,900 <span>• 4000-Yr Technique</span></div>
                </div>
              </div>
            </div>

            {/* Bottom Trust Ribbons floating in 3D */}
            <div style={styles.trustBanner}>
              <div style={styles.trustItem}>
                <Award size={18} color="#C1602C" />
                <span>100% Certified Master Artisan Origin</span>
              </div>
              <div style={styles.trustItem}>
                <ShieldCheck size={18} color="#7C8A5A" />
                <span>Guaranteed Fair Artisan Living Wage</span>
              </div>
              <div style={styles.trustItem}>
                <HeartHandshake size={18} color="#D9A441" />
                <span>Zero Middleman Markups</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Bar below parallax */}
        <div style={styles.ctaRow}>
          <button
            onClick={() => onNavigate?.('marketplace')}
            className="btn btn-primary btn-large-touch"
            style={{ minWidth: '220px' }}
          >
            <span>{t.exploreMarketBtn}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  outerWrapper: {
    position: 'relative',
    overflow: 'hidden',
    padding: '80px 24px 90px 24px',
    backgroundColor: '#F7F1E6',
    borderTop: '1px solid #E8D9C5',
    borderBottom: '1px solid #E8D9C5'
  },
  bgLattice: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(#C1602C 0.85px, transparent 0.85px), radial-gradient(#7C8A5A 0.85px, #F7F1E6 0.85px)`,
    backgroundSize: '36px 36px',
    backgroundPosition: '0 0, 18px 18px',
    opacity: 0.45,
    pointerEvents: 'none',
    transition: 'transform 0.1s ease-out'
  },
  ambientGlow: {
    position: 'absolute',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    pointerEvents: 'none',
    filter: 'blur(60px)'
  },
  contentContainer: {
    maxWidth: '1240px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2
  },
  headerArea: {
    textAlign: 'center',
    maxWidth: '820px',
    margin: '0 auto 40px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#F8ECE4',
    border: '1px solid #C1602C',
    color: '#C1602C',
    fontSize: '0.8rem',
    fontWeight: '800',
    letterSpacing: '0.08em',
    padding: '6px 16px',
    borderRadius: '20px',
    marginBottom: '16px'
  },
  title: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '2.8rem',
    color: '#3B2A1E',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    marginBottom: '16px'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#6E5B4D',
    lineHeight: '1.7',
    marginBottom: '12px'
  },
  interactiveIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.82rem',
    color: '#7C8A5A',
    fontWeight: '700',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '4px 14px',
    borderRadius: '12px',
    border: '1px solid #E8D9C5'
  },
  perspectiveStage: {
    perspective: '1200px',
    margin: '20px 0 40px 0'
  },
  main3dCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    backdropFilter: 'blur(16px)',
    border: '1.5px solid #E8D9C5',
    borderRadius: '28px',
    padding: '36px 32px',
    boxShadow: '0 24px 64px rgba(59, 42, 30, 0.12), 0 4px 16px rgba(0,0,0,0.04)',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.15s ease-out'
  },
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: '24px',
    transformStyle: 'preserve-3d'
  },
  craftArtifactCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 28px rgba(59, 42, 30, 0.08)',
    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  featuredCenterCard: {
    borderColor: '#D9A441',
    boxShadow: '0 16px 40px rgba(217, 164, 65, 0.2)'
  },
  artifactImgWrapper: {
    position: 'relative',
    height: '210px',
    overflow: 'hidden',
    backgroundColor: '#FAF3E7'
  },
  artifactImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease'
  },
  tagBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    backdropFilter: 'blur(6px)',
    color: '#3B2A1E',
    fontWeight: '700',
    fontSize: '0.75rem',
    padding: '4px 10px',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  artifactContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  cardHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.25rem',
    color: '#3B2A1E',
    marginBottom: '8px'
  },
  cardBody: {
    fontSize: '0.88rem',
    color: '#6E5B4D',
    lineHeight: '1.6',
    flex: 1,
    marginBottom: '16px'
  },
  priceHighlight: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#C1602C',
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px'
  },
  trustBanner: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px dashed #E8D9C5',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '16px',
    transform: 'translateZ(30px)'
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  ctaRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  }
};
