/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MENU_ITEMS, MenuCategory, MenuItem } from '../types';
import { Sparkles, Trophy, Star, Coffee, UtensilsCrossed, Cake, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveMenuProps {
  onCategoryChange: (index: number) => void;
  activeCategoryIndex: number;
}

const CATEGORIES: { name: MenuCategory; icon: typeof Coffee }[] = [
  { name: 'Sips', icon: Coffee },
  { name: 'Bites', icon: UtensilsCrossed },
  { name: 'Sweets', icon: Cake },
  { name: 'Signatures', icon: Award }
];

export default function InteractiveMenu({ onCategoryChange, activeCategoryIndex }: InteractiveMenuProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(
    MENU_ITEMS.filter(item => item.category === CATEGORIES[activeCategoryIndex].name)[0] || null
  );

  const activeCategory = CATEGORIES[activeCategoryIndex].name;
  const filteredItems = MENU_ITEMS.filter(item => item.category === activeCategory);

  const handleCategorySelect = (index: number) => {
    onCategoryChange(index);
    const categoryName = CATEGORIES[index].name;
    const defaultItem = MENU_ITEMS.filter(item => item.category === categoryName)[0];
    setSelectedItem(defaultItem || null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 rounded-sm border border-white/10 backdrop-blur-xl bg-white/5 shadow-2xl">
      
      {/* Narrative Header */}
      <div className="text-center mb-8 relative">
        <span className="text-[10px] tracking-[0.4em] font-display font-medium text-[#D2A078] uppercase block mb-2">
          Sensory Interactive Panel
        </span>
        <h3 className="text-3xl md:text-5xl font-serif text-[#E0D8D0] italic font-normal tracking-tight">
          Explore the Roasted Menu
        </h3>
        <p className="text-[#E0D8D0]/60 max-w-xl mx-auto text-xs mt-2 font-sans tracking-wide">
          Select a category below to synchronize our physical 3D bakeries and highlight specialty craftsmanship.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {CATEGORIES.map((cat, idx) => {
          const IconComponent = cat.icon;
          const isActive = idx === activeCategoryIndex;
          
          return (
            <button
              id={`category-tab-${cat.name.toLowerCase()}`}
              key={cat.name}
              onClick={() => handleCategorySelect(idx)}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-sm border transition-all duration-300 font-serif text-sm tracking-widest italic cursor-pointer ${
                isActive
                  ? 'bg-white/10 text-[#D2A078] border-[#D2A078] shadow-lg shadow-[#D2A078]/5'
                  : 'bg-transparent text-[#E0D8D0] border-white/5 hover:border-white/20 hover:bg-white/3'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#D2A078]' : 'text-[#E0D8D0]/50'}`} />
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive list of items */}
        <div className="lg:col-span-7 space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const isItemCurrentlySelected = selectedItem?.id === item.id;
              return (
                <motion.div
                  id={`menu-item-${item.id}`}
                  key={item.id}
                  layoutId={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`relative p-4 rounded-sm border cursor-pointer transition-all duration-300 flex items-center justify-between group ${
                    isItemCurrentlySelected
                      ? 'bg-white/5 border-[#D2A078] shadow-md shadow-[#D2A078]/5'
                      : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-white/2'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif italic font-normal text-lg text-[#E0D8D0] group-hover:text-[#D2A078] transition-colors">
                        {item.name}
                      </h4>
                      {item.isPopular && (
                        <span className="flex items-center gap-1 text-[8px] border border-[#D2A078]/30 text-[#D2A078] px-2 py-0.5 rounded-sm uppercase tracking-wider font-semibold font-mono bg-[#D2A078]/5">
                          <Trophy className="w-2.5 h-2.5" /> Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#E0D8D0]/60 line-clamp-2 max-w-md">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right pl-4">
                    <span className="font-mono text-[#D2A078] font-semibold text-base block">
                      {item.price}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#E0D8D0]/40 mt-1">
                      <Star className="w-3 h-3 text-[#D2A078] fill-[#D2A078]" /> {item.rating}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right: Immersive item showcase card */}
        <div className="lg:col-span-5 h-full">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-sm bg-[#1E0F09] border border-white/10 flex flex-col justify-between h-full relative overflow-hidden"
              >
                {/* Decorative glowing gradient backing matching Sophisticated radial lights */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D2A078]/5 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2C1A12]/5 rounded-full blur-2xl" />

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] px-3 py-1 rounded-sm border border-[#D2A078]/20 text-[#D2A078] uppercase tracking-wider font-mono bg-[#D2A078]/5">
                      {selectedItem.category} Category
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#E0D8D0]/80 bg-white/5 px-2.5 py-1 rounded-sm border border-white/10 font-semibold font-mono">
                      ⭐ {selectedItem.rating} Rating
                    </span>
                  </div>

                  <h4 className="text-2xl font-serif italic text-[#E0D8D0]">
                    {selectedItem.name}
                  </h4>

                  <p className="text-sm text-[#E0D8D0]/70 leading-relaxed font-sans">
                    {selectedItem.description}
                  </p>

                  {/* Attribute culinary tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedItem.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-white/5 border border-white/10 text-[#E0D8D0]/80 px-2.5 py-1 rounded-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                  <div>
                    <span className="text-[10px] text-[#E0D8D0]/40 uppercase tracking-widest block font-mono">
                      Aesthetic Pricing
                    </span>
                    <span className="text-3xl font-mono text-[#D2A078] font-bold block mt-1">
                      {selectedItem.price}
                    </span>
                  </div>
                  <button 
                    id={`order-now-${selectedItem.id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D2A078]/80 to-[#2C1A12]/80 hover:from-[#D2A078] hover:to-[#2C1A12] text-[#E0D8D0] border border-[#D2A078]/20 rounded-sm text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md hover:shadow-[#D2A078]/10 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Order Now
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full text-[#E0D8D0]/40 text-sm">
                Select an item to view craft details
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
