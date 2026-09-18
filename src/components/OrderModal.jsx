import React, { useState } from 'react';
import { X, CheckCircle, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../lib/supabaseClient';
import { translations, getLocalizedProduct } from '../lib/translations';

export default function OrderModal({ product, artisan, onClose, currentLang = 'en' }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = translations[currentLang] || translations.en;
  const localizedProd = getLocalizedProduct(product, currentLang);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !contact) return;

    setIsSubmitting(true);
    try {
      await api.addOrderInquiry({
        product_id: localizedProd.id,
        artisan_id: artisan?.id || localizedProd.artisan_id,
        customer_name: name,
        customer_contact: contact,
        customer_email: email,
        quantity: Number(quantity),
        notes
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={20} color="#3B2A1E" />
        </button>

        {isSuccess ? (
          <div style={styles.successState}>
            <div style={styles.successIconBox}>
              <CheckCircle size={44} color="#7C8A5A" />
            </div>
            <h3 style={styles.successTitle}>{t.inquirySentTitle}</h3>
            <p style={styles.successText}>
              {t.inquirySentDesc}
            </p>
            <div style={styles.summaryCard}>
              <span>{t.quantity}: {quantity} {t.unit}</span>
              <span>{t.estimatedValue} ₹{((localizedProd.final_price || 1500) * quantity).toLocaleString('en-IN')}</span>
            </div>
            <button style={styles.doneBtn} onClick={onClose}>
              {t.returnMarketplace}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.header}>
              <Package size={24} color="#C1602C" />
              <div>
                <h3 style={styles.title}>{t.sendInquiry}</h3>
                <p style={styles.subtitle}>{t.directNoMarkup}</p>
              </div>
            </div>

            {/* Product Summary Row */}
            <div style={styles.productSummary}>
              <img
                src={localizedProd.image_urls?.[0]}
                alt={localizedProd.title}
                style={styles.summaryThumb}
              />
              <div>
                <h4 style={styles.prodTitle}>{localizedProd.title}</h4>
                <p style={styles.priceTag}>
                  ₹{Number(localizedProd.final_price || 1500).toLocaleString('en-IN')} / {t.unit}
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>{t.yourName}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldRow}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>{t.phoneContact}</label>
                <input
                  type="tel"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={styles.input}
                />
              </div>
              <div style={{ ...styles.fieldGroup, width: '110px' }}>
                <label style={styles.label}>{t.quantity}</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>{t.emailOptional}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anita@example.com"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>{t.customRequirements}</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                style={styles.textarea}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
            >
              {isSubmitting ? t.transmitting : t.transmitBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(59, 42, 30, 0.65)',
    backdropFilter: 'blur(6px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    maxWidth: '500px',
    width: '100%',
    padding: '32px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.24)',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: '#FAF3E7',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '20px'
  },
  title: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '1.4rem',
    color: '#3B2A1E'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#6E5B4D',
    marginTop: '2px'
  },
  productSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: '#FAF3E7',
    padding: '14px',
    borderRadius: '16px',
    marginBottom: '20px',
    border: '1px solid #E8D9C5'
  },
  summaryThumb: {
    width: '58px',
    height: '58px',
    borderRadius: '10px',
    objectFit: 'cover'
  },
  prodTitle: {
    fontSize: '0.96rem',
    fontWeight: '700',
    color: '#3B2A1E',
    lineHeight: '1.3'
  },
  priceTag: {
    fontSize: '0.88rem',
    fontWeight: '800',
    color: '#C1602C',
    marginTop: '2px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  fieldRow: {
    display: 'flex',
    gap: '14px'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  input: {
    padding: '11px 16px',
    borderRadius: '12px',
    border: '1px solid #E8D9C5',
    fontSize: '0.95rem',
    color: '#3B2A1E',
    outline: 'none'
  },
  textarea: {
    padding: '11px 16px',
    borderRadius: '12px',
    border: '1px solid #E8D9C5',
    fontSize: '0.95rem',
    color: '#3B2A1E',
    resize: 'none',
    outline: 'none'
  },
  successState: {
    textAlign: 'center',
    padding: '16px 0'
  },
  successIconBox: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    backgroundColor: '#F0F3E8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto'
  },
  successTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.6rem',
    color: '#3B2A1E',
    marginBottom: '10px'
  },
  successText: {
    fontSize: '0.94rem',
    color: '#6E5B4D',
    lineHeight: '1.6',
    marginBottom: '24px'
  },
  summaryCard: {
    backgroundColor: '#FAF3E7',
    padding: '16px',
    borderRadius: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '0.94rem',
    fontWeight: '700',
    color: '#3B2A1E',
    marginBottom: '24px'
  },
  doneBtn: {
    backgroundColor: '#3B2A1E',
    color: '#FAF3E7',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 4px 14px rgba(59, 42, 30, 0.2)'
  }
};
