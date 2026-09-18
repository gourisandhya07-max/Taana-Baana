import React, { useState, useRef } from 'react';
import CameraCaptureModal from '../components/CameraCaptureModal';
import VoiceRecorder from '../components/VoiceRecorder';
import PriceSuggestionCard from '../components/PriceSuggestionCard';
import MarketMatchPanel from '../components/MarketMatchPanel';
import { generateCraftCatalogWithGemini } from '../lib/geminiApi';
import { api } from '../lib/supabaseClient';
import { translations } from '../lib/translations';
import { Camera, Upload, Sparkles, Check, Wand2, Plus, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AddProduct({ artisan, onComplete, currentLang = 'en' }) {
  const [step, setStep] = useState(1); // 1: Photos & AI, 2: Voice & Story, 3: Pricing, 4: Market Linkage
  const [photos, setPhotos] = useState([]); // Array of photo data URLs (max 5)
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Weaving');
  const [tags, setTags] = useState([]);
  const [materialCost, setMaterialCost] = useState(800);
  const [productionHours, setProductionHours] = useState(12);
  const [size, setSize] = useState('6.2 meters (with blouse piece)');
  const [finalPrice, setFinalPrice] = useState(3800);
  const [suggestedMin, setSuggestedMin] = useState(3200);
  const [suggestedMax, setSuggestedMax] = useState(4800);

  const fileInputRef = useRef(null);
  const t = translations[currentLang] || translations.en;

  const handleAddPhotoUrl = async (imgUrl) => {
    const updatedPhotos = [...photos, imgUrl].slice(0, 5);
    setPhotos(updatedPhotos);

    // If first photo added, run Gemini AI analysis pipeline
    if (updatedPhotos.length === 1 && !title) {
      setIsAnalyzing(true);
      const aiResult = await generateCraftCatalogWithGemini({
        textDescription: description || "Handcrafted Indian artisan product",
        categoryHint: category
      });

      setTitle(aiResult.title);
      setCategory(aiResult.category);
      setDescription(aiResult.description);
      setTags(aiResult.tags);
      setMaterialCost(aiResult.materialCost);
      setProductionHours(aiResult.hours);
      setIsAnalyzing(false);
    }
  };

  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        handleAddPhotoUrl(evt.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePublish = async () => {
    try {
      const newProd = await api.addProduct({
        artisan_id: artisan?.id || "artisan_1",
        title: title || "Handcrafted Heritage Artifact",
        description: description || "Handmade by traditional Indian artisan.",
        category,
        tags,
        image_urls: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        material_cost: materialCost,
        production_hours: productionHours,
        size,
        suggested_price_min: suggestedMin,
        suggested_price_max: suggestedMax,
        final_price: finalPrice,
        status: 'published'
      });

      try {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      } catch (err) {}

      onComplete?.(newProd);
    } catch (e) {}
  };

  return (
    <div style={styles.container}>
      {/* Step Progress Bar */}
      <div style={styles.progressBar}>
        {[
          { num: 1, label: t.stepPhoto },
          { num: 2, label: t.stepVoice },
          { num: 3, label: t.stepPrice },
          { num: 4, label: t.stepMatch }
        ].map((s) => (
          <div
            key={s.num}
            style={{
              ...styles.progressStep,
              borderColor: step >= s.num ? '#C1602C' : '#E8D9C5',
              backgroundColor: step >= s.num ? '#FAF2DF' : '#FFFFFF'
            }}
            onClick={() => setStep(s.num)}
          >
            <span style={{
              ...styles.stepNum,
              backgroundColor: step >= s.num ? '#C1602C' : '#E8D9C5',
              color: step >= s.num ? '#FFFFFF' : '#3B2A1E'
            }}>
              {s.num}
            </span>
            <span style={styles.stepLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Multi-Photo Capture (Camera Stream + Upload) & AI */}
      {step === 1 && (
        <div style={styles.card}>
          <h2 style={styles.title}>{t.stepPhoto}: Capture or Upload Craft Photos</h2>
          <p style={styles.subtitle}>Take live camera photos or upload up to 5 photos of your craft item.</p>

          {/* Two Clear Options: Camera vs Device Upload */}
          <div style={styles.captureOptionsRow}>
            <button
              type="button"
              onClick={() => setShowCameraModal(true)}
              className="btn btn-primary btn-large-touch"
              style={{ flex: 1 }}
            >
              <Camera size={22} />
              <span>Take Photo (Live Camera)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-outline btn-large-touch"
              style={{ flex: 1 }}
            >
              <Upload size={22} />
              <span>Upload from Device</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          {/* Photo Gallery Grid Preview (Up to 5 Photos) */}
          <div style={styles.galleryPreviewGrid}>
            {photos.map((url, i) => (
              <div key={i} style={styles.photoThumbWrapper}>
                <img
                  src={url}
                  alt={`Craft photo ${i + 1}`}
                  style={{
                    ...styles.photoThumb,
                    filter: isEnhanced ? 'brightness(1.06) contrast(1.08)' : 'none'
                  }}
                />
                {i === 0 && <span style={styles.primaryBadge}>Primary Cover</span>}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  style={styles.removePhotoBtn}
                >
                  <X size={14} color="#FFFFFF" />
                </button>
              </div>
            ))}

            {photos.length < 5 && photos.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCameraModal(true)}
                style={styles.addMorePhotoBox}
              >
                <Plus size={24} color="#C1602C" />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#C1602C' }}>Add Photo</span>
              </button>
            )}
          </div>

          {/* AI Analysis & Auto-Enhancement Status */}
          {isAnalyzing && (
            <div style={styles.aiAnalyzingBox}>
              <Sparkles size={20} color="#D9A441" className="spin" />
              <span>Enhancing photo lighting & auto-generating craft details...</span>
            </div>
          )}

          {photos.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsEnhanced(!isEnhanced)}
                style={{
                  ...styles.enhanceToggleBtn,
                  backgroundColor: isEnhanced ? '#7C8A5A' : '#3B2A1E'
                }}
              >
                <Wand2 size={16} />
                <span>{isEnhanced ? 'Enhanced (Lighting & White-Balance Boosted)' : 'Auto-Enhance Photo Background'}</span>
              </button>
            </div>
          )}

          {/* Editable Review Screen */}
          {photos.length > 0 && !isAnalyzing && (
            <div style={styles.aiResultForm}>
              <div style={styles.aiTagBadge}>
                <Sparkles size={14} color="#D9A441" />
                <span>Gemini AI Generated — Review & Edit Fields</span>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>{t.aiTitleSuggested}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Craft Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={styles.select}
                >
                  <option value="Weaving">Weaving & Sarees</option>
                  <option value="Pottery">Pottery & Clay</option>
                  <option value="Woodwork">Woodwork & Toys</option>
                  <option value="Metalwork">Dhokra & Metal</option>
                  <option value="Embroidery">Needlework & Embroidery</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-primary btn-large-touch"
                style={{ width: '100%', marginTop: '16px' }}
              >
                Approve & Proceed to Voice Details ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Voice & Story Input */}
      {step === 2 && (
        <div style={styles.card}>
          <h2 style={styles.title}>{t.stepVoice}: Live Voice Recording</h2>
          <p style={styles.subtitle}>Speak in Malayalam, Hindi, or English to record your exact voice story.</p>

          <VoiceRecorder
            lang={currentLang}
            onTranscribed={(txt) => setDescription(txt)}
          />

          <div style={{ ...styles.fieldGroup, marginTop: '20px' }}>
            <label style={styles.label}>{t.aiDescSuggested}</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe yarn source, weaving technique, or cultural significance..."
              style={styles.textarea}
            />
          </div>

          <div style={styles.btnRow}>
            <button onClick={() => setStep(1)} className="btn btn-outline">Back</button>
            <button onClick={() => setStep(3)} className="btn btn-primary">Proceed to Smart Pricing ➔</button>
          </div>
        </div>
      )}

      {/* STEP 3: Smart Pricing Assistant */}
      {step === 3 && (
        <div style={styles.card}>
          <h2 style={styles.title}>{t.stepPrice}: AI-Assisted Pricing Assistant</h2>
          <p style={styles.subtitle}>Ensure fair artisan wages while remaining competitive in target markets.</p>

          <PriceSuggestionCard
            materialCost={materialCost}
            productionHours={productionHours}
            lang={currentLang}
            onApplyPrice={(price, min, max) => {
              setFinalPrice(price);
              setSuggestedMin(min);
              setSuggestedMax(max);
            }}
          />

          <div style={{ ...styles.btnRow, marginTop: '24px' }}>
            <button onClick={() => setStep(2)} className="btn btn-outline">Back</button>
            <button onClick={() => setStep(4)} className="btn btn-primary">Proceed to Market Linkage Analysis ➔</button>
          </div>
        </div>
      )}

      {/* STEP 4: AI Market Linkage Engine Preview & Publish */}
      {step === 4 && (
        <div style={styles.card}>
          <h2 style={styles.title}>{t.stepMatch}: AI Market Linkage Inspector</h2>
          <p style={styles.subtitle}>Review recommended market channels before publishing to the marketplace.</p>

          <MarketMatchPanel
            product={{
              title,
              category,
              final_price: finalPrice,
              material_cost: materialCost,
              production_hours: productionHours,
              region: artisan?.region || 'Kerala',
              tags
            }}
          />

          <div style={{ ...styles.btnRow, marginTop: '24px' }}>
            <button onClick={() => setStep(3)} className="btn btn-outline">Back</button>
            <button
              onClick={handlePublish}
              className="btn btn-gold btn-large-touch"
              style={{ flex: 1 }}
            >
              <Check size={20} />
              <span>Confirm & Publish Craft to Marketplace</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Web Camera Capture Modal */}
      {showCameraModal && (
        <CameraCaptureModal
          onClose={() => setShowCameraModal(false)}
          onCapturePhoto={handleAddPhotoUrl}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '840px',
    margin: '30px auto',
    padding: '0 20px'
  },
  progressBar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '24px'
  },
  progressStep: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '14px',
    border: '1px solid',
    cursor: 'pointer'
  },
  stepNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '800'
  },
  stepLabel: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 12px 36px rgba(59, 42, 30, 0.08)'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.6rem',
    color: '#3B2A1E'
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#6E5B4D',
    marginBottom: '24px'
  },
  captureOptionsRow: {
    display: 'flex',
    gap: '14px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  galleryPreviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
  },
  photoThumbWrapper: {
    position: 'relative',
    height: '130px',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '2px solid #E8D9C5'
  },
  photoThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  primaryBadge: {
    position: 'absolute',
    bottom: '4px',
    left: '4px',
    backgroundColor: '#C1602C',
    color: '#FFFFFF',
    fontSize: '0.65rem',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '8px'
  },
  removePhotoBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: 'rgba(59, 42, 30, 0.75)',
    border: 'none',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  addMorePhotoBox: {
    height: '130px',
    borderRadius: '14px',
    border: '2px dashed #C1602C',
    backgroundColor: '#FAF3E7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    cursor: 'pointer'
  },
  enhanceToggleBtn: {
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '0.85rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  },
  aiAnalyzingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#FAF2DF',
    border: '1px solid #E5B24E',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#3B2A1E',
    marginTop: '16px'
  },
  aiResultForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#F8F3EA',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #E8D9C5',
    marginTop: '20px'
  },
  aiTagBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#C1602C'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  input: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #E8D9C5',
    fontSize: '1rem',
    color: '#3B2A1E',
    backgroundColor: '#FFFFFF'
  },
  select: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #E8D9C5',
    fontSize: '1rem',
    color: '#3B2A1E',
    backgroundColor: '#FFFFFF'
  },
  textarea: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #E8D9C5',
    fontSize: '0.95rem',
    color: '#3B2A1E',
    backgroundColor: '#FFFFFF',
    resize: 'none'
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px'
  }
};
