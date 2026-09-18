# 🧵 Taana Baana — From Hands to Markets.

An AI-powered multilingual platform designed to empower Indian artisans (weavers, potters, woodworkers, sculptors, needlework artists) to digitize, catalog, price, and sell their handmade products directly to high-value markets.

---

## 🌟 Key Features

### 1. Historic Indian Craft Theme & Motion System
- **Metaphor**: Artisans as warp (the fixed foundation), markets as weft (the dynamic thread of commerce).
- **Aesthetics**: Warm Cream (`#FAF3E7`), Terracotta (`#C1602C`), Olive (`#7C8A5A`), Deep Espresso (`#3B2A1E`), Gold (`#D9A441`).
- **Typography**: Display craft headers (`Playfair Display`, `Rozha One`) & clean body text (`Plus Jakarta Sans`).

### 2. Animated Weaving Splash Intro (`<SplashIntro />`)
- Full-screen animated sequence with Madhubani temple border draw-in, Warli art village motifs, and interlocking SVG thread lines weaving together to reveal the logo monogram.
- `sessionStorage` session tracking and skippable intro.

### 3. Signature AI Market Linkage Engine (`marketMatchingEngine.js` & `<MarketMatchPanel />`)
- Ranks high-value buyer channels (Eco-friendly Boutiques, Luxury Decorators, Corporate Gifting, Tourist Souvenir Retailers, Fair-Trade Exports).
- Provides confidence scores (0-100%), plain-language AI rationale, and actionable artisan tips.

### 4. Multilingual & Voice Onboarding (`<VoiceRecorder />` & `<Onboarding />`)
- **Languages Supported**: English, Malayalam (മലയാളം), Hindi (हिंदी).
- **Phone OTP Verification**: Guided icon-driven profile creation.
- **Voice Description**: Speak in regional languages using Web Speech API integration.

### 5. AI Smart Cataloging & Pricing Assistant (`<AddProduct />` & `<PriceSuggestionCard />`)
- Auto-extracts product title, category, description, and search tags from product photos.
- Auto-enhances photo lighting & background contrast.
- Calculates fair artisan wage floor (₹150/hr base) + material costs to recommend competitive, standard, and premium price bands.

### 6. Marketplace, Storefronts & Inquiry System (`<Marketplace />`, `<ProductDetail />`, `<OrderModal />`)
- Filterable craft gallery with search, state/region filters, and interactive Craft Map of India.
- Direct customer-to-artisan order inquiry transmission without middleman commission.

### 7. Artisan Analytics Dashboard (`<ArtisanDashboard />`)
- At-a-glance stat cards (Total Crafts, Views, Active Inquiries, Revenue) and visual bar chart tracking monthly buyer interest.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Canvas-Confetti
- **Styling**: Vanilla CSS3 with Custom Design Tokens
- **Backend & Database**: Supabase JS Client & Postgres SQL Schema (`supabase/schema.sql`)

---

## 🛠️ Local Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/gourisandhya07-max/Taana-Baana.git
cd Taana-Baana

# 2. Install dependencies
npm install

# 3. Start local dev server
npm run dev
```

Open `http://localhost:3000/` in your browser.
