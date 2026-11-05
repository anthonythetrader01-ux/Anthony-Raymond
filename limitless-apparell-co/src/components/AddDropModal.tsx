import React, { useState } from 'react';
import { X, Upload, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface AddDropModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDropModal: React.FC<AddDropModalProps> = ({ isOpen, onClose }) => {
  const { addNewProduct } = useStore();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(1800);
  const [originalPrice, setOriginalPrice] = useState<number>(2200);
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('New Drop');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageError, setImageError] = useState('');
  const [stockPerSize, setStockPerSize] = useState({
    S: 4,
    M: 6,
    L: 5,
    XL: 3
  });
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Constrain price between 1500 and 2000 as requested
    const validPrice = Math.min(2000, Math.max(1500, Number(price) || 1800));
    const finalImage = imagePreview || '/assets/aistudio/BOYS_DONT_CRY_eae38144.jpg';

    const skuPrefix = 'LMT-' + name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X') + '-' + Math.floor(100 + Math.random() * 900);

    const newProduct: Product = {
      id: `prod-drop-${Date.now()}`,
      name: name.trim(),
      category: 'clothing',
      subcategory: 'Graphic Tees',
      gender: 'unisex',
      price: validPrice,
      originalPrice: originalPrice > validPrice ? originalPrice : validPrice + 400,
      description: description.trim() || 'Heavyweight oversized streetwear graphic drop tailored for Nairobi Gen Z. Premium combed cotton with reinforced collar.',
      details: [
        'Heavyweight 260GSM combed cotton jersey',
        'Drop-shoulder boxy streetwear cut',
        'High-density screen printed graphics',
        'Parcel Grid pickup ready across Kenya'
      ],
      materials: '100% Combed Cotton.',
      care: 'Machine wash cold inside out. Hang dry.',
      fit: 'Relaxed oversized boxy fit.',
      image: finalImage,
      galleryImages: [finalImage],
      badge: badge.trim() || `Drop · KSh ${validPrice.toLocaleString()}`,
      rating: 5.0,
      reviewsCount: 1,
      variants: [
        { sku: `${skuPrefix}-S`, size: 'S', color: 'Black', colorHex: '#121214', stock: stockPerSize.S, reserved: 0 },
        { sku: `${skuPrefix}-M`, size: 'M', color: 'Black', colorHex: '#121214', stock: stockPerSize.M, reserved: 0 },
        { sku: `${skuPrefix}-L`, size: 'L', color: 'Black', colorHex: '#121214', stock: stockPerSize.L, reserved: 0 },
        { sku: `${skuPrefix}-XL`, size: 'XL', color: 'Black', colorHex: '#121214', stock: stockPerSize.XL, reserved: 0 },
      ]
    };

    addNewProduct(newProduct);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative bg-neutral-950 border border-neutral-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display text-lg font-bold text-white tracking-tight">
              Auto-Drop / Add New Product
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-display text-lg font-bold text-white">Drop Published Live!</h4>
            <p className="text-xs text-neutral-400 font-mono">
              Product added to catalog and available for Parcel Grid pickup immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Preview & Upload */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-300">Product Photo</label>
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-neutral-600" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-mono border border-neutral-700 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                  <input
                    type="text"
                    value={imagePreview}
                    onChange={(e) => setImagePreview(e.target.value)}
                    placeholder="Or paste image URL (/assets/...)"
                    className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 font-mono"
                  />
                  {imageError && <div className="text-[11px] text-rose-400">{imageError}</div>}
                </div>
              </div>
            </div>

            {/* Product Name */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Drop Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Travis Scott Utopia FE!N Tee"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-700 font-medium"
              />
            </div>

            {/* Pricing Section (1500 - 2000 KSh strictly) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-emerald-400">Price (KSh 1,500 - 2,000)</label>
                <input
                  type="number"
                  min={1500}
                  max={2000}
                  step={50}
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Original Price (Slash)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-400 font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Stock Per Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300">Initial Stock Per Size</label>
              <div className="grid grid-cols-4 gap-2">
                {(['S', 'M', 'L', 'XL'] as const).map((size) => (
                  <div key={size} className="bg-neutral-900 p-2 rounded-lg border border-neutral-800 text-center">
                    <div className="text-[10px] font-mono text-neutral-400">{size}</div>
                    <input
                      type="number"
                      min={0}
                      value={stockPerSize[size]}
                      onChange={(e) => setStockPerSize(prev => ({ ...prev, [size]: Number(e.target.value) || 0 }))}
                      className="w-full text-center bg-transparent font-mono text-xs text-white focus:outline-none mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details on fit, cotton weight, graphic print..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-700"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex justify-end gap-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-900 text-neutral-400 hover:text-white rounded-lg text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-md"
              >
                Publish to Store
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
