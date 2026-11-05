import React from 'react';
import { Smartphone, Activity } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useStore();

  return (
    <footer className="bg-black border-t border-neutral-800 text-neutral-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-3">
            <img 
              src="/assets/aistudio/Official_Limitless_Logo_724589fb.png" 
              alt="LIMITLESS" 
              className="h-9 w-auto object-contain"
            />
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Underground Gen Z streetwear and footwear label. Order online, pick up at your nearest Parcel Grid station nationwide, and pay securely with M-PESA.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
              <span>Parcel Grid Pickups · Lipa Na M-PESA</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-semibold text-neutral-200 text-xs tracking-wider uppercase font-mono">
              Quick Links
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <button onClick={() => setActiveView('store')} className="hover:text-white transition-colors cursor-pointer">
                  Shop The Drop
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('orders')} className="hover:text-white transition-colors cursor-pointer">
                  Track Parcel Grid Pickup
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView('merchant')} 
                  className="text-neutral-500 hover:text-emerald-400 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <span>Master Portal (/master)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Pickup */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-semibold text-neutral-200 text-xs tracking-wider uppercase font-mono">
              Delivery & Payments
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dispatched via <strong>Parcel Grid</strong> to lockers and pickup stations across Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and Thika. Pay seamlessly via Safaricom M-PESA.
            </p>
            <div className="flex items-center gap-2 pt-1 text-white flex-wrap font-mono text-[11px]">
              <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 font-semibold rounded border border-emerald-800 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                M-PESA Express
              </span>
              <span className="px-2.5 py-1 bg-neutral-900 rounded border border-neutral-800">
                Till 849201
              </span>
              <span className="px-2.5 py-1 bg-neutral-900 rounded border border-neutral-800">
                Parcel Grid
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Baseline */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-mono">
          <div>
            © {new Date().getFullYear()} LIMITLESS Apparel Ltd. Nairobi, Kenya.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span aria-hidden="true">·</span>
            <span>Terms</span>
            <span aria-hidden="true">·</span>
            <span>Nairobi Sizing Guide</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
