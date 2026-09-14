import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Grid,
  List,
  ChevronDown,
  RotateCcw,
  Cake
} from 'lucide-react';
import { productsAPI, categoriesAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import QuickViewModal from '../../components/QuickViewModal';

export default function CakesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters State from URL or defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedFlavour, setSelectedFlavour] = useState(searchParams.get('flavour') || 'All');
  const [selectedEggType, setSelectedEggType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(3500);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoriesAPI.getAll();
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedFlavour && selectedFlavour !== 'All') params.flavour = selectedFlavour;
        if (selectedEggType && selectedEggType !== 'All') params.eggType = selectedEggType;
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (maxPrice < 3500) params.maxPrice = maxPrice;
        if (minRating > 0) params.rating = minRating;
        if (inStockOnly) params.inStock = true;
        if (sortBy) params.sort = sortBy;

        const res = await productsAPI.getAll(params);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedFlavour, selectedEggType, searchTerm, maxPrice, minRating, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedFlavour('All');
    setSelectedEggType('All');
    setMaxPrice(3500);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('popular');
    setSearchParams({});
  };

  const flavoursList = ['Chocolate', 'Vanilla', 'Red Velvet', 'Black Forest', 'Butterscotch', 'Strawberry', 'Mango', 'Blueberry'];

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '0.85rem', color: '#8C532B', marginBottom: '6px' }}>
            Home / Artisanal Cakes
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#2A170E' }}>
            {selectedCategory === 'All' ? 'All Handcrafted Cakes' : selectedCategory}
          </h1>
          <p style={{ color: '#73645C', fontSize: '0.95rem', marginTop: '4px' }}>
            Showing {products.length} delicious cakes baked fresh with premium ingredients.
          </p>
        </div>

        {/* Search & Toolbar Bar */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid #EFE8DE',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
          boxShadow: '0 4px 15px rgba(42, 23, 14, 0.04)'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
            <input
              type="text"
              placeholder="Search by cake name, flavour, occasion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                borderRadius: '999px',
                border: '1.5px solid #EFE8DE',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <Search size={18} color="#C6923E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A4978E' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Controls: Mobile Filter Trigger, Sort, View Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="mobile-filter-btn"
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '999px',
                background: '#FAF7F2',
                border: '1px solid #EFE8DE',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#2A170E'
              }}
            >
              <SlidersHorizontal size={16} color="#8C532B" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#73645C', fontWeight: 500 }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #EFE8DE',
                  background: '#FFFFFF',
                  color: '#2A170E',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="popular">Popularity</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="best-rated">Highest Customer Rating</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {/* View Mode */}
            <div style={{ display: 'flex', background: '#FAF7F2', borderRadius: '8px', padding: '2px', border: '1px solid #EFE8DE' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'grid' ? '#8C532B' : '#73645C',
                  boxShadow: viewMode === 'grid' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none'
                }}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'list' ? '#8C532B' : '#73645C',
                  boxShadow: viewMode === 'list' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none'
                }}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '32px' }} className="shop-layout">
          
          {/* Desktop Filters Sidebar */}
          <aside className="filters-sidebar" style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #EFE8DE',
            height: 'fit-content',
            boxShadow: '0 4px 15px rgba(42, 23, 14, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.1rem', color: '#2A170E' }}>
                <Filter size={18} color="#C6923E" />
                <span>Filter Cakes</span>
              </div>
              <button
                onClick={handleResetFilters}
                style={{ fontSize: '0.78rem', color: '#E11D48', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            {/* Filter 1: Categories */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #F4ECE1' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#2A170E', marginBottom: '10px' }}>
                Categories
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                <button
                  onClick={() => setSelectedCategory('All')}
                  style={{
                    textAlign: 'left',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    background: selectedCategory === 'All' ? 'rgba(198, 146, 62, 0.12)' : 'transparent',
                    color: selectedCategory === 'All' ? '#8C532B' : '#2A170E',
                    fontWeight: selectedCategory === 'All' ? 700 : 500
                  }}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id || c.name}
                    onClick={() => setSelectedCategory(c.name)}
                    style={{
                      textAlign: 'left',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      background: selectedCategory === c.name ? 'rgba(198, 146, 62, 0.12)' : 'transparent',
                      color: selectedCategory === c.name ? '#8C532B' : '#73645C',
                      fontWeight: selectedCategory === c.name ? 700 : 500
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 2: Price Range Slider */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #F4ECE1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2A170E' }}>
                  Max Price
                </label>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#C6923E' }}>
                  ₹{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min={400}
                max={3500}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#C6923E', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#A4978E', marginTop: '4px' }}>
                <span>₹400</span>
                <span>₹3500+</span>
              </div>
            </div>

            {/* Filter 3: Flavours */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #F4ECE1' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#2A170E', marginBottom: '10px' }}>
                Flavour
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  onClick={() => setSelectedFlavour('All')}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    border: '1px solid #EFE8DE',
                    background: selectedFlavour === 'All' ? '#2A170E' : '#FAF7F2',
                    color: selectedFlavour === 'All' ? '#FFFFFF' : '#2A170E',
                    fontWeight: 600
                  }}
                >
                  All
                </button>
                {flavoursList.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFlavour(f)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      border: '1px solid #EFE8DE',
                      background: selectedFlavour === f ? '#C6923E' : '#FAF7F2',
                      color: selectedFlavour === f ? '#FFFFFF' : '#2A170E',
                      fontWeight: 600
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 4: Dietary / Egg Preference */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #F4ECE1' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#2A170E', marginBottom: '8px' }}>
                Dietary Preference
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="eggPref"
                    checked={selectedEggType === 'All'}
                    onChange={() => setSelectedEggType('All')}
                  />
                  <span>All Cakes</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="eggPref"
                    checked={selectedEggType === 'Eggless'}
                    onChange={() => setSelectedEggType('Eggless')}
                  />
                  <span style={{ color: '#2E7D32', fontWeight: 600 }}>100% Eggless (Vegetarian)</span>
                </label>
              </div>
            </div>

            {/* Filter 5: In Stock Switch */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: '#2A170E' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#C6923E' }}
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Products Grid */}
          <main>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '3px solid #EFE8DE',
                  borderTopColor: '#C6923E',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }} />
                <p style={{ color: '#73645C' }}>Gathering fresh cakes from our ovens...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '60px 30px',
                textAlign: 'center',
                border: '1px solid #EFE8DE'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: '#FAF7F2',
                  color: '#C6923E',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Cake size={36} />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#2A170E', marginBottom: '8px' }}>
                  No Cakes Matched Your Filters
                </h3>
                <p style={{ color: '#73645C', fontSize: '0.92rem', marginBottom: '20px' }}>
                  Try resetting filters or explore custom options in our Custom Cake Studio.
                </p>
                <button onClick={handleResetFilters} className="btn-primary">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : '1fr',
                gap: '24px'
              }}>
                {products.map((cake) => (
                  <ProductCard
                    key={cake.id}
                    product={cake}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Media queries for responsive filters */}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @media (max-width: 880px) {
          .shop-layout { grid-template-columns: 1fr !important; }
          .filters-sidebar { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
