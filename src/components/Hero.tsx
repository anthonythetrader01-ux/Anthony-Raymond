import React from 'react';
import { ArrowRight, MapPin, Smartphone } from 'lucide-react';

export const Hero: React.FC<{ onExploreClick: () => void }> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-black border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Clean Gen Z Streetwear Campaign */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400">
              <span>Drop 03 · Limited Quantities</span>
            </div>

            {/* Official LIMITLESS Graphic */}
            <div className="py-1">
              <img 
                src="/assets/aistudio/Official_Limitless_Logo_724589fb.png" 
                alt="LIMITLESS" 
                className="h-16 sm:h-20 lg:h-24 w-auto object-contain brightness-110"
              />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1] [text-wrap:balance]">
              Heavy kicks and oversized cuts for the street.
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
              Premium heavyweight streetwear crafted for everyday wear. Pick up at your nearest <strong>Parcel Grid Station</strong> across Kenya and pay securely via <strong>M-PESA</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                <span>Shop Drop 03</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Clean, Customer-Centric Trust Points */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Smartphone className="w-3.5 h-3.5" />
                <span>M-PESA Express</span>
              </span>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Parcel Grid Station Pickups</span>
              </span>
            </div>
          </div>

          {/* Right Column: Visual Campaign */}
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
            <img
              src="/src/assets/images/hero_minimal_fashion_1793890976343.jpg"
              alt="LIMITLESS Drop Campaign"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Subtle Campaign Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-neutral-300 font-mono">
              <span className="text-white font-medium">Nairobi · Drop 03</span>
              <span className="text-emerald-400">Limited Production</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
