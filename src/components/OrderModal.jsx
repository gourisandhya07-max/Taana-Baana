import React, { useState } from 'react';
import { X, Send, CheckCircle, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../lib/supabaseClient';

export default function OrderModal({ product, artisan, onClose }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !contact) return;

    setIsSubmitting(true);
    try {
      await api.addOrderInquiry({
        product_id: product.id,
        artisan_id: artisan?.id || product.artisan_id,
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
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={20} color="#3B2A1E" />
        </button>

        {isSuccess ? (
          <div style={styles.successState}>
            <div style={styles.successIconBox}>
              <CheckCircle size={44} color="#7C8A5A" />
            </div>
            <h3 style={styles.successTitle}>Inquiry Sent to Artisan!</h3>
            <p style={styles.successText}>
              Your inquiry for <strong>{product.title}</strong> has been transmitted directly to <strong>{artisan?.full_name || 'the artisan'}</strong> via SMS / Taana Baana voice alert.
            </p>
            <div style={styles.summaryCard}>
              <span>Quantity: {quantity} unit(s)</span>
              <span>Estimated Value: ₹{(product.final_price * quantity).toLocaleString('en-IN')}</span>
            </div>
            <button style={styles.doneBtn} onClick={onClose}>
              Return to Marketplace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.header}>
              <Package size={24} color="#C1602C" />
              <div>
                <h3 style={styles.title}>Send Order Inquiry</h3>
                <p style={styles.subtitle}>Direct connection to artisan — No middleman markup</p>
              </div>
            </div>

            {/* Product Summary Row */}
            <div style={styles.productSummary}>
              <img
                src={product.image_urls?.[0]}
                alt={product.title}
                style={styles.summaryThumb}
              />
              <div>
                <h4 style={styles.prodTitle}>{product.title}</h4>
                <p style={styles.priceTag}>
                  ₹{Number(product.final_price || 1500).toLocaleString('en-IN')} / unit
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anita Sharma"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldRow}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>Phone / WhatsApp *</label>
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
                <label style={styles.label}>Quantity</label>
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
              <label style={styles.label}>Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anita@example.com"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Custom Requirements / Message</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify color preference, bulk gifting requirements, or delivery deadline..."
                style={styles.textarea}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
            >
              {isSubmitting ? 'Sending...' : 'Transmit Inquiry to Artisan'}
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
    backgroundColor: 'rgba(59, 42, 30, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    maxWidth: '480px',
    width: '100%',
    padding: '28px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
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
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.3rem',
    color: '#3B2A1E'
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#6E5B4D'
  },
  productSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#FAF3E7',
    padding: '12px',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid #E8D9C5'
  },
  summaryThumb: {
    width: '54px',
    height: '54px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  prodTitle: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  priceTag: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#C1602C'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  fieldRow: {
    display: 'flex',
    gap: '12px'
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  input: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #E8D9C5',
    fontSize: '0.92rem',
    color: '#3B2A1E'
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #E8D9C5',
    fontSize: '0.92rem',
    color: '#3B2A1E',
    resize: 'none'
  },
  successState: {
    textAlign: 'center',
    padding: '12px 0'
  },
  successIconBox: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#F0F3E8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto'
  },
  successTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    color: '#3B2A1E',
    marginBottom: '8px'
  },
  successText: {
    fontSize: '0.9rem',
    color: '#6E5B4D',
    lineHeight: '1.5',
    marginBottom: '20px'
  },
  summaryCard: {
    backgroundColor: '#FAF3E7',
    padding: '14px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#3B2A1E',
    marginBottom: '20px'
  },
  doneBtn: {
    backgroundColor: '#3B2A1E',
    color: '#FAF3E7',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%'
  }
};
