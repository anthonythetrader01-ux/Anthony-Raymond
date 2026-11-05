import React, { useState } from 'react';
import { X, ShieldCheck, Heart, Truck, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetailModalDialog: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const { addToCart, wishlist, toggleWishlist } = useStore();

  // Selected state - unconditionally called on mount of dialog
  const [selectedColor, setSelectedColor] = useState<string>(product.variants[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState<string>(product.variants[0]?.size || '');
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const isFavorited = wishlist.includes(product.id);

  // Available unique colors
  const availableColors = Array.from(new Set(product.variants.map(v => v.color)));
  
  // Variants for selected color
  const variantsForColor = product.variants.filter(v => v.color === selectedColor);

  // Active selected variant
  const currentVariant = product.variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const availableStock = currentVariant ? Math.max(0, currentVariant.stock - currentVariant.reserved) : 0;
  const isSoldOut = availableStock <= 0;

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
    setFeedbackMessage(null);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Find matching size or first available size in new color
    const inColor = product.variants.filter(v => v.color === color);
    const sameSize = inColor.find(v => v.size === selectedSize);
    if (sameSize) {
      setSelectedSize(sameSize.size);
    } else if (inColor[0]) {
      setSelectedSize(inColor[0].size);
    }
    setQuantity(1);
    setFeedbackMessage(null);
  };

  const handleAddToCart = () => {
    if (!currentVariant) return;

    if (isSoldOut) {
      setFeedbackMessage({ text: 'This size is sold out.', isError: true });
      return;
    }

    const res = addToCart(product.id, selectedSize, selectedColor, quantity);
    if (res.success) {
      setFeedbackMessage({ text: `Added ${quantity} item(s) to your bag.`, isError: false });
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      setFeedbackMessage({ text: res.message || 'Unable to reserve item.', isError: true });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="relative bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-neutral-700/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 flex flex-col space-y-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-800 border border-neutral-800">
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnail selector if gallery has multiple */}
            {product.galleryImages && product.galleryImages.length > 1 && (
              <div className="flex items-center gap-3">
                {product.galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === img ? 'border-white' : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Product Craft Details */}
            <div className="pt-4 border-t border-neutral-800/80 space-y-2 text-xs text-neutral-400">
              <div>
                <strong className="text-neutral-200">Materials:</strong> {product.materials}
              </div>
              <div>
                <strong className="text-neutral-200">Fit Guide:</strong> {product.fit}
              </div>
              <div>
                <strong className="text-neutral-200">Care:</strong> {product.care}
              </div>
            </div>
          </div>

          {/* Right Column: Purchase Module */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Badge */}
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                  {product.category} · {product.subcategory}
                </div>
                {product.badge && (
                  <span className="text-xs font-mono text-emerald-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
                  <span className="font-mono text-2xl font-bold text-white tabular-nums">
                    KSh {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="font-mono text-sm text-neutral-500 line-through tabular-nums">
                      KSh {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs text-emerald-400 font-mono">M-PESA ready</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-300 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Color: <strong className="text-white">{selectedColor}</strong></span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {availableColors.map((colorName) => {
                    const match = product.variants.find(v => v.color === colorName);
                    const isSelected = selectedColor === colorName;
                    return (
                      <button
                        key={colorName}
                        onClick={() => handleColorSelect(colorName)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-neutral-800 text-white border-white' 
                            : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <span 
                          className="w-3 h-3 rounded-full border border-neutral-600" 
                          style={{ backgroundColor: match?.colorHex || '#333' }}
                        />
                        <span>{colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">
                    Select Size: <strong className="text-white">{selectedSize}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {variantsForColor.map((variant) => {
                    const avail = Math.max(0, variant.stock - variant.reserved);
                    const isSelected = selectedSize === variant.size;
                    const isOutOfStock = avail <= 0;
                    const isLow = avail > 0 && avail <= 2;

                    return (
                      <button
                        key={variant.sku}
                        disabled={isOutOfStock}
                        onClick={() => handleSizeSelect(variant.size)}
                        className={`relative p-2.5 rounded-lg text-xs font-mono text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-100 text-neutral-950 font-bold border-white ring-2 ring-neutral-400/50'
                            : isOutOfStock
                              ? 'bg-neutral-950 text-neutral-600 border-neutral-800/60 cursor-not-allowed opacity-50'
                              : 'bg-neutral-800/80 text-neutral-200 border-neutral-700 hover:border-neutral-500 hover:text-white'
                        }`}
                      >
                        <div className="font-semibold">{variant.size}</div>
                        <div className={`text-[10px] mt-0.5 tabular-nums ${
                          isOutOfStock 
                            ? 'text-neutral-600' 
                            : isSelected
                              ? 'text-neutral-800'
                              : isLow 
                                ? 'text-amber-400 font-medium' 
                                : 'text-neutral-400'
                        }`}>
                          {isOutOfStock ? 'Sold out' : isLow ? `${avail} left` : 'In stock'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clean Pickup info */}
              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-300">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Parcel Grid station pickup: KSh 200 (Nairobi) · KSh 300 (Upcountry). Free on orders over KSh 4k.</span>
              </div>

              {/* Feedback Alert */}
              {feedbackMessage && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  feedbackMessage.isError 
                    ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60' 
                    : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                }`}>
                  {feedbackMessage.isError ? (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                  <span>{feedbackMessage.text}</span>
                </div>
              )}

            </div>

            {/* Bottom Actions: Quantity Stepper & Add To Bag */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-800 text-sm font-mono">
                  <button
                    disabled={quantity <= 1 || isSoldOut}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2.5 font-semibold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= availableStock || isSoldOut}
                    onClick={() => setQuantity(q => Math.min(availableStock, q + 1))}
                    className="px-3 py-2.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Bag Button */}
                <button
                  disabled={isSoldOut}
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-5 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-extrabold uppercase tracking-wider rounded-lg text-xs transition-all duration-150 cursor-pointer disabled:cursor-not-allowed shadow active:scale-98"
                >
                  {isSoldOut ? 'Sold Out in Selected Size' : 'Add to Bag'}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Save to wishlist"
                  className="p-3 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secure M-PESA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Parcel Grid Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Size Exchange Support</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  if (!product) return null;
  return <ProductDetailModalDialog product={product} onClose={onClose} />;
};
