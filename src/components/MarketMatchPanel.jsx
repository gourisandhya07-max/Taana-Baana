import React from 'react';
import { Sparkles, ArrowUpRight, ShieldCheck, Leaf, Briefcase, Compass, Globe, Info } from 'lucide-react';
import { analyzeMarketMatches } from '../lib/marketMatchingEngine';
import { translations } from '../lib/translations';

const ICON_MAP = {
  Leaf: Leaf,
  Sparkles: Sparkles,
  Briefcase: Briefcase,
  Compass: Compass,
  Globe: Globe
};

export default function MarketMatchPanel({ product, lang = 'en' }) {
  const matches = analyzeMarketMatches(product, lang);
  const t = translations[lang] || translations.en;
  const productTitle = product?.title || 'this craft';

  return (
    <div style={styles.card}>
      {/* Signature Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <div style={styles.signatureBadge}>
            <Sparkles size={20} color="#D9A441" />
          </div>
          <div>
            <div style={styles.signatureTag}>{t.signatureAiFeature || "SIGNATURE AI FEATURE"}</div>
            <h3 style={styles.title}>{t.marketLinkageEngine || "AI Market Linkage Engine"}</h3>
          </div>
        </div>
        <p style={styles.subtitle}>
          {t.marketLinkageSub || "Ranked high-value buyer channels tailored for"} <strong>{productTitle}</strong>.
        </p>
      </div>

      {/* Ranked Segment List */}
      <div style={styles.list}>
        {matches.map((segment, index) => {
          const IconComp = ICON_MAP[segment.icon] || Sparkles;
          const isTopMatch = index === 0;

          return (
            <div
              key={segment.id}
              style={{
                ...styles.item,
                borderColor: isTopMatch ? '#C1602C' : '#E8D9C5',
                backgroundColor: isTopMatch ? '#FAF2DF' : '#FFFFFF',
                boxShadow: isTopMatch ? '0 6px 20px rgba(193, 96, 44, 0.12)' : 'none'
              }}
            >
              {/* Rank Badge + Icon */}
              <div style={styles.rankCol}>
                <span style={{
                  ...styles.rankNum,
                  backgroundColor: isTopMatch ? '#C1602C' : '#E8D9C5',
                  color: isTopMatch ? '#FFFFFF' : '#3B2A1E'
                }}>
                  #{index + 1}
                </span>
                <div style={styles.iconCircle}>
                  <IconComp size={18} color="#C1602C" />
                </div>
              </div>

              {/* Content */}
              <div style={styles.contentCol}>
                <div style={styles.itemHeader}>
                  <h4 style={styles.segmentName}>{segment.name}</h4>
                  <div style={styles.scorePill}>
                    <span style={styles.scoreText}>{segment.matchPercentage}% {t.match || "Match"}</span>
                  </div>
                </div>

                <p style={styles.descText}>{segment.description}</p>

                {/* AI Rationale & Actionable Tip */}
                <div style={styles.reasonBox}>
                  <div style={styles.reasonRow}>
                    <Info size={14} color="#C1602C" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>{t.aiRationale || "AI Rationale:"}</strong> {segment.reasoning}</span>
                  </div>
                  <div style={styles.tipRow}>
                    <ShieldCheck size={14} color="#7C8A5A" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>{t.artisanTip || "Artisan Tip:"}</strong> {segment.actionTip}</span>
                  </div>
                </div>

                {/* Typical Margin & Target Buyer */}
                <div style={styles.metaRow}>
                  <span style={styles.metaPill}><strong>{t.target || "Target:"}</strong> {segment.targetBuyer}</span>
                  <span style={styles.metaPillGold}><strong>{t.estMargin || "Est. Margin:"}</strong> {segment.typicalMargin}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#FAF3E7',
    border: '2px solid #D9A441',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 8px 30px rgba(217, 164, 65, 0.12)',
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    marginBottom: '20px'
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '6px'
  },
  signatureBadge: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    backgroundColor: '#3B2A1E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(59, 42, 30, 0.2)'
  },
  signatureTag: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#C1602C',
    letterSpacing: '0.12em'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.45rem',
    color: '#3B2A1E'
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#6E5B4D',
    marginTop: '4px'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  item: {
    borderRadius: '14px',
    border: '1px solid',
    padding: '18px',
    display: 'flex',
    gap: '16px',
    transition: 'all 0.25s ease'
  },
  rankCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  rankNum: {
    fontSize: '0.78rem',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '10px'
  },
  iconCircle: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#F8ECE4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  segmentName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.1rem',
    color: '#3B2A1E'
  },
  scorePill: {
    backgroundColor: '#C1602C',
    color: '#FFFFFF',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: '800'
  },
  descText: {
    fontSize: '0.85rem',
    color: '#6E5B4D',
    lineHeight: '1.4'
  },
  reasonBox: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '10px',
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    margin: '6px 0'
  },
  reasonRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    fontSize: '0.82rem',
    color: '#3B2A1E'
  },
  tipRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    fontSize: '0.82rem',
    color: '#5C693E'
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px'
  },
  metaPill: {
    fontSize: '0.75rem',
    color: '#5C6B73',
    backgroundColor: '#EBF0F3',
    padding: '2px 8px',
    borderRadius: '6px'
  },
  metaPillGold: {
    fontSize: '0.75rem',
    color: '#3B2A1E',
    backgroundColor: '#FAF2DF',
    border: '1px solid #E5B24E',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '6px'
  }
};
