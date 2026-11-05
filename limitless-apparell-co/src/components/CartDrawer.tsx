import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Clock, Lock, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    setIsCheckoutOpen, 
    removeFromCart, 
    updateCartQuantity, 
    getCartSubtotal,
    remainingReservationSeconds 
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const subtotal = getCartSubtotal();
  const freeShippingThreshold = 4000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const discountAmount = appliedPromo ? (subtotal * appliedPromo.percent) / 100 : 0;
  const estimatedShipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 200;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + estimatedShipping);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'LIMITLESS10' || clean === 'GENZ10') {
      setAppliedPromo({ code: clean, percent: 10 });
    } else if (clean === 'NAIROBI20' || clean === 'VIP20') {
      setAppliedPromo({ code: clean, percent: 20 });
    } else {
      setPromoError('Invalid code. Try "LIMITLESS10"');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 text-neutral-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-lg font-bold text-white tracking-tight">Shopping Bag</h2>
              <span className="font-mono text-xs bg-neutral-800 px-2 py-0.5 rounded text-neutral-300 tabular-nums">
                {cart.reduce((a, b) => a + b.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Real-Time Reservation Bar */}
          {cart.length > 0 && (
            <div className="bg-neutral-800/90 border-b border-neutral-700/80 px-6 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-400">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span className="font-medium">Inventory Reserved</span>
              </div>
              <div className="font-mono tabular-nums text-white">
                Expires in <strong className="text-amber-400">{formatTimer(remainingReservationSeconds)}</strong>
              </div>
            </div>
          )}

          {/* Complimentary Shipping Progress */}
          {cart.length > 0 && (
            <div className="px-6 py-3 bg-neutral-900/60 border-b border-neutral-800/80 space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-300">
                <span>
                  {amountNeededForFreeShipping === 0 
                    ? '🎉 Free Parcel Grid Station Pickup unlocked' 
                    : `Add KSh ${amountNeededForFreeShipping.toLocaleString()} more for free Parcel Grid pickup`}
                </span>
                <span className="font-mono text-neutral-400">{progressToFreeShipping.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-500">
                  <Lock className="w-8 h-8 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-base font-semibold text-white">Your bag is empty</h3>
                  <p className="text-xs text-neutral-400 max-w-xs">
                    Items added to your bag are locked in the Nairobi vault for 10 minutes.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-white text-black text-xs font-extrabold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Explore Drop 03
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.cartItemId}
                  className="flex gap-4 p-3 bg-neutral-800/40 rounded-xl border border-neutral-800/80 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-neutral-800 rounded-lg overflow-hidden shrink-0 border border-neutral-700/50">
                    <img 
                      src={item.image} 
                      alt={item.productName} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-xs font-semibold text-white truncate">{item.productName}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span>Size: <strong className="text-neutral-200 font-mono">{item.size}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-700 rounded bg-neutral-800/80 text-xs font-mono">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-400 hover:text-white cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-white tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-400 hover:text-white cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-white tabular-nums">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          title="Remove item & release reservation"
                          className="text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-900/90 space-y-4">
              
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo (e.g. LIMITLESS10)"
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 rounded-lg font-medium border border-neutral-700 cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span>Code <strong>{appliedPromo.code}</strong> applied (-{appliedPromo.percent}%)</span>
                  <button onClick={() => setAppliedPromo(null)} className="text-neutral-400 hover:text-white text-[11px] underline cursor-pointer">
                    Remove
                  </button>
                </div>
              )}
              {promoError && (
                <div className="text-xs text-rose-400">{promoError}</div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-200 tabular-nums">KSh {subtotal.toLocaleString()}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedPromo.percent}%)</span>
                    <span className="font-mono tabular-nums">-KSh {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Parcel Grid Station Delivery</span>
                  <span className="font-mono text-neutral-200 tabular-nums">
                    {estimatedShipping === 0 ? 'Complimentary' : `KSh ${estimatedShipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total</span>
                  <span className="font-mono text-base tabular-nums">KSh {estimatedTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
              >
                <Lock className="w-4 h-4 text-black" />
                <span>Checkout with M-PESA</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Safaricom M-PESA STK & 256-Bit TLS Secured</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
