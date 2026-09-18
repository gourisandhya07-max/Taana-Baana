import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CraftMap from '../components/CraftMap';
import { api } from '../lib/supabaseClient';
import { translations } from '../lib/translations';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

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
        <h1 style={styles.heading}>Artisan Craft Marketplace</h1>
        <p style={styles.subheading}>Buy authentic handlooms & heritage crafts directly from India's master artisans</p>

        {/* Search Input Bar */}
        <div style={styles.searchBar}>
          <Search size={20} color="#C1602C" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder || "Search Kasavu sarees, terracotta pitchers, brass statues..."}
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
                {cat}
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
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="featured">Featured Crafts</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Interactive Geography Map */}
      <CraftMap
        selectedRegion={selectedRegion}
        onSelectRegion={(reg) => setSelectedRegion(reg)}
      />

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={styles.emptyState}>
          <Sparkles size={36} color="#C1602C" />
          <h3 style={styles.emptyTitle}>No Crafts Match Your Criteria</h3>
          <p style={styles.emptySub}>Try adjusting search term or state filter</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Crafts');
              setSelectedRegion('All Regions');
            }}
            className="btn btn-outline"
            style={{ marginTop: '12px' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              artisan={artisansMap.get(prod.artisan_id)}
              onClick={() => onSelectProduct(prod)}
              onSelectMarketMatch={onSelectMarketMatch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '30px 24px 60px 24px'
  },
  headerBanner: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.6rem',
    color: '#3B2A1E',
    marginBottom: '6px'
  },
  subheading: {
    fontSize: '1.05rem',
    color: '#6E5B4D',
    marginBottom: '24px'
  },
  searchBar: {
    maxWidth: '640px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E8D9C5',
    borderRadius: '30px',
    padding: '10px 20px',
    boxShadow: '0 4px 18px rgba(59, 42, 30, 0.06)'
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
    marginBottom: '28px'
  },
  pillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  filterPill: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  dropdownGroup: {
    display: 'flex',
    gap: '10px'
  },
  select: {
    padding: '8px 14px',
    borderRadius: '12px',
    border: '1px solid #E8D9C5',
    backgroundColor: '#FFFFFF',
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#3B2A1E'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px dashed #E8D9C5'
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.4rem',
    color: '#3B2A1E',
    marginTop: '12px'
  },
  emptySub: {
    fontSize: '0.9rem',
    color: '#6E5B4D'
  }
};
