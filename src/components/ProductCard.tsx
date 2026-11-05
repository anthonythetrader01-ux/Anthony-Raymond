import React from 'react';
import { Heart, Eye, Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [quickAddedSize, setQuickAddedSize] = React.useState<string | null>(null);

  const isFavorited = wishlist.includes(product.id);

  // Compute live stock summary
  const totalStock = product.variants.reduce((acc, v) => acc + (v.stock - v.reserved), 0);
  const isSoldOut = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock <= 4;

  const handleQuickAdd = (e: React.MouseEvent, size: string, color: string) => {
    e.stopPropagation();
    const result = addToCart(product.id, size, color, 1);
    if (result.success) {
      setQuickAddedSize(size);
      setTimeout(() => setQuickAddedSize(null), 1800);
    }
  };

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-neutral-900/60 rounded-xl overflow-hidden border border-neutral-800/80 hover:border-neutral-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Stage (65-75% visual weight) */}
      <div className="relative aspect-[4/3] bg-neutral-800 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
        />

        {/* Subtle Scrim for Top Action Icons */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {/* Top Badges / Status */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {isSoldOut ? (
            <span className="text-xs font-mono bg-neutral-900/90 text-rose-400 px-2.5 py-1 rounded border border-rose-500/30">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-xs font-mono bg-neutral-900/90 text-amber-300 px-2.5 py-1 rounded border border-amber-500/30">
              Only {totalStock} Remaining
            </span>
          ) : product.badge ? (
            <span className="text-xs font-mono text-neutral-300 bg-neutral-900/80 backdrop-blur-sm px-2 py-0.5 rounded border border-neutral-700/60">
              {product.badge}
            </span>
          ) : <div />}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label="Add to wishlist"
            className="p-2 rounded-full bg-neutral-900/80 backdrop-blur-sm text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors pointer-events-auto border border-neutral-700/50"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} 
            />
          </button>
        </div>

        {/* Quick View Hover Trigger */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2.5 px-3 bg-neutral-900/95 hover:bg-neutral-900 text-white rounded-lg text-xs font-medium backdrop-blur-md flex items-center justify-center gap-2 border border-neutral-700 transition-colors shadow-md"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-300" />
            <span>Quick View & Sizes</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {/* Unboxed Metadata Line (anti-pill rule) */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <span className="capitalize">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.subcategory}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-white tracking-tight group-hover:text-neutral-200 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        {/* Price & Real-Time Availability Bar */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm sm:text-base font-bold text-white tabular-nums">
              KSh {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-neutral-500 line-through tabular-nums">
                KSh {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="text-right">
            <span className={`text-[11px] font-mono tabular-nums ${
              isSoldOut 
                ? 'text-neutral-500' 
                : isLowStock 
                  ? 'text-amber-400 font-medium' 
                  : 'text-neutral-400'
            }`}>
              {isSoldOut ? 'Sold Out' : isLowStock ? `Only ${totalStock} left` : 'In Stock'}
            </span>
          </div>
        </div>

        {/* Quick Size Select Bar on Card */}
        <div className="pt-1 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-neutral-500 mr-1">Sizes:</span>
          {product.variants.slice(0, 5).map((v) => {
            const avail = v.stock - v.reserved;
            const isAvail = avail > 0;
            const isJustAdded = quickAddedSize === v.size;

            return (
              <button
                key={v.sku}
                disabled={!isAvail}
                onClick={(e) => handleQuickAdd(e, v.size, v.color)}
                title={isAvail ? `${v.size} (${avail} available) - Click to add` : `${v.size} (Out of stock)`}
                className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                  isJustAdded
                    ? 'bg-emerald-500 text-white font-semibold'
                    : isAvail
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700/60'
                      : 'bg-neutral-900/60 text-neutral-600 line-through border border-neutral-800/40 cursor-not-allowed'
                }`}
              >
                {isJustAdded ? <Check className="w-2.5 h-2.5 inline mr-0.5" /> : null}
                {v.size.replace('US ', '').replace(' (46)', '').replace(' (48)', '').replace(' (50)', '').replace(' (52)', '').replace(' US', '')}
              </button>
            );
          })}
          {product.variants.length > 5 && (
            <span className="text-[10px] text-neutral-500 font-mono">
              +{product.variants.length - 5}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
