/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, ChefHat } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../contexts/CartContext';

interface InteractiveMenuProps {
  onCategoryChange: (index: number) => void;
  activeCategoryIndex: number;
}

export default function InteractiveMenu({ onCategoryChange, activeCategoryIndex }: InteractiveMenuProps) {
  const { setMenuModalOpen } = useCart();

  return (
    <div 
      className="w-full max-w-3xl mx-auto p-8 md:p-14 rounded-sm border border-white/10 backdrop-blur-xl bg-white/5 shadow-2xl relative overflow-hidden text-center flex flex-col items-center justify-center"
      data-active-category={activeCategoryIndex}
    >
      {/* Decorative atmospheric glow backings */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D2A078]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8B5E3C]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Narrative Header */}
      <div className="relative z-10 mb-8 max-w-lg">
        <span className="text-[10px] tracking-[0.4em] font-display font-medium text-[#D2A078] uppercase block mb-3">
          Sensory Interactive Panel
        </span>
        <h3 className="text-3xl md:text-5xl font-serif text-[#E0D8D0] italic font-normal tracking-tight">
          Explore the Roasted Menu
        </h3>
        <p className="text-[#E0D8D0]/60 text-xs md:text-sm mt-3 font-sans tracking-wide leading-relaxed">
          Ready to experience premium culinary craftsmanship? Tap below to open our full, live menu of specialty sips, bites, sweets, and signature wood-fired creations.
        </p>
      </div>

      {/* Main Order Now CTA */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <motion.button 
          id="order-now-hero-btn"
          onClick={() => setMenuModalOpen(true)}
          className="relative overflow-hidden flex items-center justify-center gap-3 px-10 py-5 rounded-sm cursor-pointer group shadow-2xl shadow-[#D2A078]/10"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Elegant gold gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#D2A078] via-[#E8B98A] to-[#8B5E3C]" />
          
          {/* Shimmer reflection effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
          
          {/* Glow backdrop on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]" />

          <ChefHat className="w-5 h-5 relative z-10 text-[#1E0F09] group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10 text-[#1E0F09] font-bold text-sm md:text-base tracking-[0.25em] uppercase font-mono">
            Order Now
          </span>
          <Sparkles className="w-5 h-5 relative z-10 text-[#1E0F09] animate-pulse" />
        </motion.button>

        {/* Dynamic details strip */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[10px] font-mono tracking-widest text-[#E0D8D0]/50 uppercase">
          <span>72 Handcrafted Items</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D2A078]/40" />
          <span>Chef Specials</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D2A078]/40" />
          <span>Freshly Roasted</span>
        </div>
      </div>
    </div>
  );
}
