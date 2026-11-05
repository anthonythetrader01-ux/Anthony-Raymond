/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MerchantPortal } from './components/MerchantPortal';
import { OrderHistoryView } from './components/OrderHistoryView';
import { LiveToast } from './components/LiveToast';
import { Footer } from './components/Footer';
import { Product, Category, Gender } from './types';
import { SlidersHorizontal, ArrowUpDown, Check, RefreshCw } from 'lucide-react';

function StorefrontContent() {
  const { products, activeView, setActiveView } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedGender, setSelectedGender] = useState<Gender>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'stock'>('featured');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const catalogSectionRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'shoes' && product.category !== 'shoes') return false;
        if (selectedCategory === 'clothing' && product.category !== 'clothing') return false;
        if (selectedCategory === 'outerwear' && product.category !== 'outerwear') return false;
      }

      // Gender filter
      if (selectedGender !== 'all' && product.gender !== 'unisex' && product.gender !== selectedGender) {
        return false;
      }

      // In stock only filter
      if (inStockOnly) {
        const totalStock = product.variants.reduce((acc, v) => acc + (v.stock - v.reserved), 0);
        if (totalStock <= 0) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesSubcat = product.subcategory.toLowerCase().includes(q);
        const matchesVariants = product.variants.some(v => 
          v.color.toLowerCase().includes(q) || v.size.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesDesc && !matchesSubcat && !matchesVariants) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock') {
        const stockA = a.variants.reduce((acc, v) => acc + (v.stock - v.reserved), 0);
        const stockB = b.variants.reduce((acc, v) => acc + (v.stock - v.reserved), 0);
        return stockB - stockA;
      }
      return 0; // featured order
    });
  }, [products, selectedCategory, selectedGender, inStockOnly, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans">
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'merchant' ? (
          <MerchantPortal />
        ) : activeView === 'orders' ? (
          <OrderHistoryView />
        ) : (
          <>
            {/* Storefront Hero with high-fidelity campaign imagery */}
            <Hero onExploreClick={scrollToCatalog} />

            {/* Catalog Section */}
            <section ref={catalogSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-7">
              
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                    KSh 1,500 – 2,000 · Genuine Nairobi Heavy Streetwear
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                    Drop 03 Graphic Catalog
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-400">
                    Parcel Grid Pickups: KSh 200 Nairobi · KSh 300 Upcountry · Free over KSh 4k
                  </span>
                </div>
              </div>

              {/* Filter and Sorting Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-black/60 p-3 sm:p-4 rounded-xl border border-neutral-800">
                
                {/* Category Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none font-mono text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-white text-black font-bold shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    All Drops ({products.length})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('clothing')}
                    className={`px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                      selectedCategory === 'clothing'
                        ? 'bg-white text-black font-bold shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Graphic Tees ({products.filter(p => p.category === 'clothing').length})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('shoes')}
                    className={`px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                      selectedCategory === 'shoes'
                        ? 'bg-white text-black font-bold shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Kicks & Shoes ({products.filter(p => p.category === 'shoes').length})
                  </button>
                </div>

                {/* Secondary Filters & Sort Dropdown */}
                <div className="flex items-center gap-3 flex-wrap text-xs">
                  {/* Gender Filter */}
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value as Gender)}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-neutral-500 cursor-pointer"
                  >
                    <option value="all">All Genders</option>
                    <option value="men">Men's Sizing</option>
                    <option value="women">Women's Sizing</option>
                    <option value="unisex">Unisex Cuts</option>
                  </select>

                  {/* In Stock Only Checkbox */}
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer select-none px-2 py-1 bg-neutral-800/80 rounded-lg border border-neutral-700/60">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded bg-neutral-700 border-neutral-600 text-white"
                    />
                    <span>In-Stock Only</span>
                  </label>

                  {/* Sort By Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-neutral-500 cursor-pointer font-mono text-xs"
                    >
                      <option value="featured">Featured Sequence</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="stock">Stock Availability</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Active Search / Filter State Pill summary if filtered */}
              {(searchQuery || selectedCategory !== 'all' || selectedGender !== 'all' || inStockOnly) && (
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>
                    Showing {filteredProducts.length} of {products.length} products
                    {searchQuery && <span> matching "{searchQuery}"</span>}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedGender('all');
                      setSearchQuery('');
                      setInStockOnly(false);
                    }}
                    className="text-white underline hover:text-neutral-300 cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              )}

              {/* Product Grid (3-column on desktop, 2-column on tablet as specified in ecommerce guidelines) */}
              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-neutral-900/40 rounded-2xl border border-neutral-800">
                  <p className="text-sm text-neutral-400">No items match your selected filter criteria.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedGender('all');
                      setSearchQuery('');
                      setInStockOnly(false);
                    }}
                    className="px-4 py-2 bg-neutral-800 text-white text-xs rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    Clear Filter Selection
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setSelectedProductForModal(p)}
                    />
                  ))}
                </div>
              )}

            </section>
          </>
        )}
      </main>

      {/* Global Interactive Drawers & Modals */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}

      <CartDrawer />

      <CheckoutModal />

      <LiveToast />

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}
