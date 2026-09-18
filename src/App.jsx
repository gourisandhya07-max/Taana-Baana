import React, { useState, useEffect } from 'react';
import SplashIntro from './components/SplashIntro';
import InitialLanguageModal from './components/InitialLanguageModal';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import ArtisanStorefront from './pages/ArtisanStorefront';
import ArtisanDashboard from './pages/ArtisanDashboard';
import AddProduct from './pages/AddProduct';
import Onboarding from './pages/Onboarding';
import OrderModal from './components/OrderModal';
import { api } from './lib/supabaseClient';
import './styles/theme.css';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [userMode, setUserMode] = useState('buyer'); // 'artisan' | 'buyer'
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('taana_lang_selected') || 'en';
  });
  const [showInitialLangModal, setShowInitialLangModal] = useState(() => {
    return !localStorage.getItem('taana_lang_selected');
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [currentArtisanProfile, setCurrentArtisanProfile] = useState({
    id: "artisan_1",
    full_name: "Devaki Amma",
    phone: "+91 98470 12345",
    preferred_language: "ml",
    craft_type: "Handloom Weaving & Sarees",
    region: "Chendamangalam, Kerala",
    bio: "Weaving Kasavu cotton sarees with traditional gold zari borders for over 38 years. Leader of local weavers' collective."
  });
  const [inquiryCartCount, setInquiryCartCount] = useState(2);
  const [showCartModal, setShowCartModal] = useState(false);

  // Sync saved orders count
  useEffect(() => {
    async function loadOrders() {
      const ords = await api.getOrders('artisan_1');
      setInquiryCartCount(ords.length);
    }
    loadOrders();
  }, []);

  const handleSelectInitialLang = (langCode) => {
    localStorage.setItem('taana_lang_selected', langCode);
    setCurrentLang(langCode);
    setShowInitialLangModal(false);
  };

  const handleSelectLang = (langCode) => {
    localStorage.setItem('taana_lang_selected', langCode);
    setCurrentLang(langCode);
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMarketMatch = (prod) => {
    setSelectedProduct(prod);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewArtisanStorefront = (artisanObj) => {
    setSelectedArtisan(artisanObj || currentArtisanProfile);
    setActiveView('artisan-storefront');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingComplete = (artisanData) => {
    setCurrentArtisanProfile(artisanData);
    setUserMode('artisan');
    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductAdded = (newProd) => {
    setSelectedProduct(newProd);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. First-Time Visitor Language Selection Screen */}
      {showInitialLangModal && (
        <InitialLanguageModal onSelectLanguage={handleSelectInitialLang} />
      )}

      {/* 2. Animated Splash Intro (Session tracked) */}
      <SplashIntro
        lang={currentLang}
        onComplete={() => {}}
      />

      {/* 3. Main Sticky Navbar */}
      <Navbar
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentLang={currentLang}
        onSelectLang={handleSelectLang}
        userMode={userMode}
        currentArtisanProfile={currentArtisanProfile}
        onOpenAuth={() => setShowAuthModal(true)}
        cartCount={inquiryCartCount}
        onOpenCart={() => setShowCartModal(true)}
      />

      {/* 4. Main Page View Routing */}
      <main style={{ flex: 1 }}>
        {activeView === 'home' && (
          <Home
            onNavigate={(v) => {
              if ((v === 'dashboard' || v === 'add-product') && userMode !== 'artisan') {
                setShowAuthModal(true);
                return;
              }
              setActiveView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={handleSelectProduct}
            onSelectMarketMatch={handleSelectMarketMatch}
            currentLang={currentLang}
          />
        )}

        {activeView === 'marketplace' && (
          <Marketplace
            onSelectProduct={handleSelectProduct}
            onSelectMarketMatch={handleSelectMarketMatch}
            currentLang={currentLang}
          />
        )}

        {activeView === 'product-detail' && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setActiveView('marketplace')}
            onViewArtisanStorefront={handleViewArtisanStorefront}
            currentLang={currentLang}
          />
        )}

        {activeView === 'artisan-storefront' && (
          <ArtisanStorefront
            artisan={selectedArtisan || currentArtisanProfile}
            onBack={() => setActiveView('marketplace')}
            onSelectProduct={handleSelectProduct}
            onSelectMarketMatch={handleSelectMarketMatch}
          />
        )}

        {activeView === 'dashboard' && (
          <ArtisanDashboard
            artisan={currentArtisanProfile}
            onNavigate={(v) => {
              setActiveView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={handleSelectProduct}
            onSelectMarketMatch={handleSelectMarketMatch}
          />
        )}

        {activeView === 'add-product' && (
          <AddProduct
            artisan={currentArtisanProfile}
            onComplete={handleProductAdded}
            currentLang={currentLang}
          />
        )}

        {activeView === 'onboarding' && (
          <Onboarding
            currentLang={currentLang}
            onSelectLang={handleSelectLang}
            onComplete={handleOnboardingComplete}
          />
        )}
      </main>

      {/* 5. Dual Persona Login / Signup Auth Modal */}
      {showAuthModal && (
        <AuthModal
          currentLang={currentLang}
          onClose={() => setShowAuthModal(false)}
          onLoginArtisan={(profile) => {
            setCurrentArtisanProfile(profile);
            setUserMode('artisan');
            setActiveView('dashboard');
          }}
          onSelectBuyerMode={() => {
            setUserMode('buyer');
            setActiveView('marketplace');
          }}
        />
      )}

      {/* 6. Order Inquiry Modal */}
      {showCartModal && (
        <OrderModal
          product={selectedProduct || { id: 'prod_1', title: 'Chendamangalam Handwoven Kasavu Saree', final_price: 3950 }}
          artisan={currentArtisanProfile}
          onClose={() => setShowCartModal(false)}
        />
      )}

      {/* 7. Historic Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <div style={styles.footerLogoBadge}>🧵</div>
            <div>
              <span style={styles.footerTitle}>taana-baana</span>
              <span style={styles.footerSub}>From Hands to Markets • Powered by AI</span>
            </div>
          </div>
          <p style={styles.copyright}>
            © 2026 Taana Baana. Interlocking tradition with ethical commerce.
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  footer: {
    backgroundColor: '#3B2A1E',
    color: '#FAF3E7',
    borderTop: '4px solid #C1602C',
    padding: '36px 24px'
  },
  footerInner: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  footerLogoBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: '#FAF3E7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem'
  },
  footerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#FAF3E7',
    display: 'block'
  },
  footerSub: {
    fontSize: '0.78rem',
    color: '#D9A441',
    fontWeight: '600'
  },
  copyright: {
    fontSize: '0.85rem',
    color: '#E8D9C5'
  }
};
