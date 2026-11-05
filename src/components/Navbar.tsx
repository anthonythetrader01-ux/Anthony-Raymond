import React from 'react';
import { ShoppingBag, Heart, PackageCheck, Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  setSelectedCategory
}) => {
  const { 
    getTotalCartItems, 
    setIsCartOpen, 
    wishlist, 
    activeView, 
    setActiveView,
    orders
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const totalItems = getTotalCartItems();

  return (
    <>
      {/* Discreet Banner */}
      <div className="bg-neutral-950 border-b border-neutral-800/80 py-1.5 px-4 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
        {activeView === 'merchant' ? (
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold font-mono">● MASTER CONTROL ACTIVE (/master)</span>
            <button
              onClick={() => setActiveView('store')}
              className="text-white underline hover:text-neutral-300 font-mono text-[11px] cursor-pointer"
            >
              Exit to Customer Storefront
            </button>
          </div>
        ) : (
          <>
            <span className="text-white font-medium">Parcel Grid Pickups</span>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <span>KSh 200 Nairobi · KSh 300 Upcountry · Free over KSh 4k</span>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <span className="text-emerald-400 font-medium">Lipa Na M-PESA</span>
          </>
        )}
      </div>

      {/* Top Bar: Zone 1 (Logo) — Zone 2 (4 Links) — Zone 3 (Bag & Search) */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6 sm:gap-8">
          
          {/* Zone 1: LIMITLESS Official Logo */}
          <button 
            onClick={() => { setActiveView('store'); setSelectedCategory('all'); }} 
            className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
          >
            <img 
              src="/assets/aistudio/Official_Limitless_Logo_724589fb.png" 
              alt="LIMITLESS" 
              className="h-9 sm:h-11 w-auto object-contain group-hover:opacity-85 transition-opacity"
            />
          </button>

          {/* Zone 2: Clean, Straightforward Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-neutral-400">
            <button
              onClick={() => { setActiveView('store'); setSelectedCategory('all'); }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeView === 'store' ? 'text-white border-white' : 'border-transparent'
              }`}
            >
              The Drop
            </button>
            <button
              onClick={() => { setActiveView('store'); setSelectedCategory('shoes'); }}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              Kicks
            </button>
            <button
              onClick={() => { setActiveView('store'); setSelectedCategory('clothing'); }}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              Apparel
            </button>
            <button
              onClick={() => setActiveView('orders')}
              className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeView === 'orders' ? 'text-white border-white' : 'border-transparent'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Track Orders</span>
              {orders.length > 0 && <span className="text-[10px] text-neutral-400">({orders.length})</span>}
            </button>
          </nav>

          {/* Zone 3: Search, Saved, Shopping Bag */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-neutral-900 rounded-lg px-2.5 py-1.5 border border-neutral-700">
                  <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search drops..."
                    className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-36 sm:w-48"
                    autoFocus
                  />
                  <button 
                    onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                    className="text-neutral-400 hover:text-white ml-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search"
                  className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-900 cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Saved Wishlist */}
            <button
              onClick={() => setActiveView('store')}
              title="Saved items"
              className="relative p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-900 cursor-pointer hidden sm:block"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-neutral-200 text-black rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-98"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span className="hidden sm:inline">Bag</span>
              <span className="font-mono text-[11px] bg-black text-white rounded px-1.5 py-0.5 tabular-nums">
                {totalItems}
              </span>
            </button>
          </div>

        </div>
      </header>
    </>
  );
};
