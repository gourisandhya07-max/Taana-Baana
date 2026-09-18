import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CraftMap from '../components/CraftMap';
import { api } from '../lib/supabaseClient';
import { translations, getLocalizedCategory, getLocalizedRegion, getLocalizedProduct } from '../lib/translations';
import { Search, Sparkles } from 'lucide-react';

const CRAFT_CATEGORIES = ['All Crafts', 'Weaving', 'Pottery', 'Woodwork', 'Metalwork', 'Embroidery'];
const REGIONS = ['All Regions', 'Kerala', 'Rajasthan', 'Uttar Pradesh', 'Chhattisgarh', 'Kashmir'];

export default function Marketplace({
  onSelectProduct,
  onSelectMarketMatch,
  currentLang = 'en'
}) {
  const [products, setProducts] = useState([]);
  const [artisansMap, setArtisansMap] = useState(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Crafts');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [sortBy, setSortBy] = useState('featured');
  const t = translations[currentLang] || translations.en;

  useEffect(() => {
    async function loadData() {
      const [prods, arts] = await Promise.all([
        api.getProducts({
          status: 'published',
          category: selectedCategory,
          region: selectedRegion,
          search: searchTerm
        }),
        api.getArtisans()
      ]);

      // Apply sorting
      let sorted = [...prods];
      if (sortBy === 'price-low') {
        sorted.sort((a, b) => (a.final_price || 0) - (b.final_price || 0));
      } else if (sortBy === 'price-high') {
        sorted.sort((a, b) => (b.final_price || 0) - (a.final_price || 0));
      }

      setProducts(sorted);
      setArtisansMap(new Map(arts.map(a => [a.id, a])));
    }
    loadData();
  }, [selectedCategory, selectedRegion, searchTerm, sortBy]);

  return (
    <div style={styles.container}>
      {/* Search Header Banner */}
      <div style={styles.headerBanner}>
        <h1 style={styles.heading}>{t.marketHeading}</h1>
        <p style={styles.subheading}>{t.marketSubheading}</p>

        {/* Search Input Bar */}
        <div style={styles.searchBar}>
          <Search size={20} color="#C1602C" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Filter Controls Row */}
      <div style={styles.filterRow}>
        {/* Category Pills */}
        <div style={styles.pillGroup}>
          {CRAFT_CATEGORIES.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...styles.filterPill,
                  backgroundColor: isSel ? '#C1602C' : '#FFFFFF',
                  color: isSel ? '#FFFFFF' : '#3B2A1E',
                  borderColor: isSel ? '#C1602C' : '#E8D9C5'
                }}
              >
                {getLocalizedCategory(cat, currentLang)}
              </button>
            );
          })}
        </div>

        {/* Region Dropdown & Sort */}
        <div style={styles.dropdownGroup}>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={styles.select}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {getLocalizedRegion(r, currentLang)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="featured">{t.sortFeatured}</option>
            <option value="price-low">{t.sortPriceLow}</option>
            <option value="price-high">{t.sortPriceHigh}</option>
          </select>
        </div>
      </div>

      {/* Interactive Geography Map */}
      <CraftMap
        selectedRegion={selectedRegion}
        currentLang={currentLang}
        onSelectRegion={(reg) => setSelectedRegion(reg)}
      />

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={styles.emptyState}>
          <Sparkles size={36} color="#C1602C" />
          <h3 style={styles.emptyTitle}>{t.emptyTitle}</h3>
          <p style={styles.emptySub}>{t.emptySub}</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Crafts');
              setSelectedRegion('All Regions');
            }}
            className="btn btn-outline"
            style={{ marginTop: '16px' }}
          >
            {t.resetFilters}
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((prod) => {
            const localizedProd = getLocalizedProduct(prod, currentLang);
            return (
              <ProductCard
                key={prod.id}
                product={localizedProd}
                artisan={artisansMap.get(prod.artisan_id)}
                currentLang={currentLang}
                onClick={() => onSelectProduct(localizedProd)}
                onSelectMarketMatch={onSelectMarketMatch}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '40px 24px 80px 24px'
  },
  headerBanner: {
    textAlign: 'center',
    marginBottom: '36px'
  },
  heading: {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    fontSize: '2.8rem',
    color: '#3B2A1E',
    marginBottom: '10px'
  },
  subheading: {
    fontSize: '1.1rem',
    color: '#6E5B4D',
    marginBottom: '28px',
    maxWidth: '720px',
    margin: '0 auto 28px auto'
  },
  searchBar: {
    maxWidth: '680px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E8D9C5',
    borderRadius: '32px',
    padding: '12px 24px',
    boxShadow: '0 6px 20px rgba(59, 42, 30, 0.06)'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: '#3B2A1E',
    backgroundColor: 'transparent'
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px'
  },
  pillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  filterPill: {
    padding: '8px 18px',
    borderRadius: '24px',
    border: '1px solid',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  dropdownGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  select: {
    padding: '9px 16px',
    borderRadius: '14px',
    border: '1px solid #E8D9C5',
    backgroundColor: '#FFFFFF',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#3B2A1E',
    outline: 'none'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '28px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '70px 20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px dashed #E8D9C5'
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    color: '#3B2A1E',
    marginTop: '16px'
  },
  emptySub: {
    fontSize: '0.95rem',
    color: '#6E5B4D',
    marginTop: '6px'
  }
};
