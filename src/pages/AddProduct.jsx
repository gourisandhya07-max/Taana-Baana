import React, { useState } from 'react';
import VoiceRecorder from '../components/VoiceRecorder';
import PriceSuggestionCard from '../components/PriceSuggestionCard';
import MarketMatchPanel from '../components/MarketMatchPanel';
import { generateCraftCatalogWithGemini } from '../lib/geminiApi';
import { api } from '../lib/supabaseClient';
import { translations } from '../lib/translations';
import { Camera, Sparkles, Check, Image as ImageIcon, Wand2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AddProduct({ artisan, onComplete, currentLang = 'en' }) {
  const [step, setStep] = useState(1); // 1: Photo & AI, 2: Voice & Story, 3: Pricing, 4: Market Linkage
  const [imageUrl, setImageUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);

  // Form Fields (AI pre-filled or artisan edited)
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

  const t = translations[currentLang] || translations.en;

  const AI_SAMPLE_PRESETS = [
    {
      title: "Chendamangalam Pure Pit-Loom Kasavu Saree",
      category: "Weaving",
      description: "Handwoven with 100% organic cotton yarn on traditional wooden pit looms with fine gold zari temple border.",
      tags: ["Kasavu", "Handloom", "Saree", "Organic Cotton", "Gold Zari"],
      materialCost: 1100,
      hours: 16,
      img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Molela Village Hand-Molded Terracotta Votive Pitcher",
      category: "Pottery",
      description: "Sculpted from local Molela river clay, wood-ash glazed for natural water cooling and mineral enrichment.",
      tags: ["Terracotta", "Molela", "Pottery", "Eco-friendly", "Cooling"],
      materialCost: 300,
      hours: 6,
      img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handlePhotoSelect = async (presetIndex = 0) => {
    setIsAnalyzing(true);
    const selected = AI_SAMPLE_PRESETS[presetIndex];
    setImageUrl(selected.img);

    // Call Gemini AI analysis service
    const aiResult = await generateCraftCatalogWithGemini({
      textDescription: selected.description,
      categoryHint: selected.category
    });

    setTitle(aiResult.title || selected.title);
    setCategory(aiResult.category || selected.category);
    setDescription(aiResult.description || selected.description);
    setTags(aiResult.tags || selected.tags);
    setMaterialCost(aiResult.materialCost || selected.materialCost);
    setProductionHours(aiResult.hours || selected.hours);
    setIsAnalyzing(false);
  };

  const handlePublish = async () => {
    try {
      const newProd = await api.addProduct({
        artisan_id: artisan?.id || "artisan_1",
        title: title || "Handcrafted Heritage Artifact",
        description: description || "Handmade by traditional Indian artisan.",
        category,
        tags,
        image_urls: [imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
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

      {/* STEP 1: Photo Upload + AI Smart Vision */}
      {step === 1 && (
        <div style={styles.card}>
          <h2 style={styles.title}>{t.stepPhoto}: Smart AI Photo Analysis</h2>
          <p style={styles.subtitle}>Upload a photo of your craft. Gemini AI will auto-detect category, pattern, and title.</p>

          <div style={styles.uploadArea}>
            {imageUrl ? (
              <div style={styles.previewBox}>
                <img
                  src={imageUrl}
                  alt="Product preview"
                  style={{
                    ...styles.previewImg,
                    filter: isEnhanced ? 'brightness(1.06) contrast(1.08) saturate(1.12)' : 'none'
                  }}
                />
                <button
                  onClick={() => setIsEnhanced(!isEnhanced)}
                  style={{
                    ...styles.enhanceBtn,
                    backgroundColor: isEnhanced ? '#7C8A5A' : '#3B2A1E'
                  }}
                >
                  <Wand2 size={16} />
                  <span>{isEnhanced ? 'Enhanced (Lighting Boosted)' : 'Auto-Enhance Photo'}</span>
                </button>
              </div>
            ) : (
              <div style={styles.uploadPlaceholder}>
                <Camera size={44} color="#C1602C" />
                <p style={styles.uploadPrompt}>{t.photoUploadPrompt}</p>
                <div style={styles.presetButtons}>
                  <button onClick={() => handlePhotoSelect(0)} style={styles.presetBtn}>
                    📸 Demo Photo 1 (Kasavu Saree)
                  </button>
                  <button onClick={() => handlePhotoSelect(1)} style={styles.presetBtn}>
                    📸 Demo Photo 2 (Terracotta Pitcher)
                  </button>
                </div>
              </div>
            )}
          </div>

          {isAnalyzing && (
            <div style={styles.aiAnalyzingBox}>
              <Sparkles size={20} color="#D9A441" />
              <span>Gemini AI is analyzing craft pattern, yarn quality, and origin...</span>
            </div>
          )}

          {/* AI Pre-filled Review Fields */}
          {title && !isAnalyzing && (
            <div style={styles.aiResultForm}>
              <div style={styles.aiTagBadge}>
                <Sparkles size={14} color="#D9A441" />
                <span>Gemini AI Generated — Review & Edit</span>
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
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '820px',
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
  uploadArea: {
    backgroundColor: '#FAF3E7',
    border: '2px dashed #E8D9C5',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    marginBottom: '20px'
  },
  uploadPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  uploadPrompt: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#3B2A1E'
  },
  presetButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px'
  },
  presetBtn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #C1602C',
    color: '#C1602C',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  previewBox: {
    position: 'relative',
    display: 'inline-block'
  },
  previewImg: {
    width: '100%',
    maxHeight: '340px',
    objectFit: 'cover',
    borderRadius: '14px'
  },
  enhanceBtn: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '0.85rem',
    display: 'flex',
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
    marginBottom: '20px'
  },
  aiResultForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#F8F3EA',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #E8D9C5'
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
