/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "Order From Rotticious" — Category Showcase Section
 * Clicking any tile or the main CTA opens the FullMenuModal popup
 */

import { useRef } from 'react';
import { motion } from 'motion/react';
import { Coffee, Flame, ChefHat, Cake, ArrowRight, Sparkles, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { ROTTICIOUS_MENU } from '../menuData';

// ─────────────────────────────────────────────────────────────────────────────
// Category display groups
// ─────────────────────────────────────────────────────────────────────────────
const DISPLAY_GROUPS = [
  {
    id: 'sips',
    label: 'Coffees & Sips',
    sublabel: 'Hot, Iced, Blended',
    count: ROTTICIOUS_MENU.filter(i => i.category === 'Sips').length,
    icon: Coffee,
    gradient: 'from-[#3D1F10] via-[#2A1208] to-[#1A0B06]',
    accent: '#D2A078',
    glow: 'rgba(210,160,120,0.15)',
    description: 'Americano · Iced Spanish Latte · Biscoff Cold Coffee · Thickshakes · Fizzy & Slushy',
  },
  {
    id: 'bites',
    label: 'Bites & Starters',
    sublabel: 'Crispy, Saucy, Freshly Made',
    count: ROTTICIOUS_MENU.filter(i => i.category === 'Bites').length,
    icon: Flame,
    gradient: 'from-[#2A1510] via-[#1E0F08] to-[#140905]',
    accent: '#C47B7B',
    glow: 'rgba(196,123,123,0.15)',
    description: 'Wings · Fries · Garlic Bread · Chicken Nuggets · Sandwiches · Steaks',
  },
  {
    id: 'mains',
    label: 'Mains & Signatures',
    sublabel: 'Burgers, Pasta & Pizza',
    count: ROTTICIOUS_MENU.filter(i => i.category === 'Signatures').length,
    icon: ChefHat,
    gradient: 'from-[#1E1810] via-[#16100A] to-[#100905]',
    accent: '#C49B7B',
    glow: 'rgba(196,155,123,0.15)',
    description: 'Nashville Burger · Neopolitan Pizza · Pesto Pasta · Chicken Steaks',
  },
  {
    id: 'sweets',
    label: 'Desserts',
    sublabel: 'Brownies & Sweet Endings',
    count: ROTTICIOUS_MENU.filter(i => i.category === 'Sweets').length,
    icon: Cake,
    gradient: 'from-[#1C1210] via-[#14100A] to-[#0E0904]',
    accent: '#8B7B6E',
    glow: 'rgba(139,123,110,0.15)',
    description: 'Caramel Fudge Brownie · Biscoff Brownie · Decadent Chocolate Brownie',
  },
];

// Stats
const POPULAR_COUNT = ROTTICIOUS_MENU.filter(i => i.isPopular).length;
const TOTAL_ITEMS = ROTTICIOUS_MENU.length;

// ─────────────────────────────────────────────────────────────────────────────
// Category Tile
// ─────────────────────────────────────────────────────────────────────────────
interface TileProps {
  group: typeof DISPLAY_GROUPS[0];
  index: number;
  onOpen: () => void;
}

function CategoryTile({ group, index, onOpen }: TileProps) {
  const Icon = group.icon;

  return (
    <motion.div
      id={`order-tile-${group.id}`}
      onClick={onOpen}
      className={`relative overflow-hidden rounded-sm border border-white/8 cursor-pointer group bg-gradient-to-br ${group.gradient} hover:border-white/20 transition-all duration-400 flex flex-col justify-between p-6`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -3 }}
      style={{ minHeight: '200px' }}
    >
      {/* Glow blob */}
      <div
        className="absolute top-0 left-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: group.glow }}
      />

      {/* Icon */}
      <div className="relative z-10 flex items-center justify-between mb-auto">
        <div
          className="w-11 h-11 rounded-sm flex items-center justify-center border"
          style={{
            background: `${group.accent}15`,
            borderColor: `${group.accent}25`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: group.accent }} />
        </div>
        <span className="text-[10px] font-mono text-[#E0D8D0]/30 group-hover:text-[#E0D8D0]/60 transition-colors flex items-center gap-1">
          {group.count} items <ArrowRight className="w-3 h-3" />
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-8">
        <h3 className="text-xl md:text-2xl font-serif italic text-[#E0D8D0] group-hover:text-white transition-colors leading-tight">
          {group.label}
        </h3>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] mt-1 mb-3" style={{ color: group.accent }}>
          {group.sublabel}
        </p>
        <p className="text-[10px] text-[#E0D8D0]/40 font-sans leading-relaxed line-clamp-2">
          {group.description}
        </p>
      </div>

      {/* Hover CTA */}
      <motion.div
        className="relative z-10 mt-4 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{ color: group.accent }}
      >
        <Sparkles className="w-3 h-3" /> Browse →
      </motion.div>

      {/* Decorative line accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `linear-gradient(to right, transparent, ${group.accent}60, transparent)` }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────────────────
export default function OrderSection() {
  const { setMenuModalOpen } = useCart();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="order-section"
      className="relative w-full py-24 md:py-36 px-4 md:px-12 overflow-hidden"
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-[#110804] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D2A078]/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D2A078]/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(210,160,120,0.06)_0%,transparent_65%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#D2A078 1px, transparent 1px), linear-gradient(90deg, #D2A078 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-14 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#D2A078]/40" />
            <span className="text-[10px] tracking-[0.5em] font-mono text-[#D2A078] uppercase">Royapettah, Chennai</span>
            <div className="h-px w-12 bg-[#D2A078]/40" />
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic font-normal text-[#E0D8D0] tracking-tight leading-[1.02]">
            Order From Rotticious
          </h2>

          <p className="text-[#E0D8D0]/55 text-sm md:text-base max-w-lg mx-auto font-sans leading-relaxed">
            {TOTAL_ITEMS} crafted items · {POPULAR_COUNT} crowd favourites · Delivered by Zomato
          </p>

          {/* Live + Open indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-white/10 bg-white/3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono text-[#E0D8D0]/60 uppercase tracking-[0.2em]">Menu Live · 9:15 AM – 10:30 PM</span>
          </div>
        </motion.div>

        {/* ── Category tiles ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {DISPLAY_GROUPS.map((group, i) => (
            <CategoryTile
              key={group.id}
              group={group}
              index={i}
              onOpen={() => setMenuModalOpen(true)}
            />
          ))}
        </div>

        {/* ── Stats strip ── */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-14 p-5 border border-white/8 bg-white/3 rounded-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            { value: TOTAL_ITEMS.toString(), label: 'Menu Items' },
            { value: '4.1★', label: 'Zomato Rating' },
            { value: '1,617', label: 'Delivery Reviews' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-mono text-[#D2A078] font-bold">{stat.value}</div>
              <div className="text-[9px] font-mono text-[#E0D8D0]/40 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Main CTA ── */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          <motion.button
            id="open-full-menu-btn"
            onClick={() => setMenuModalOpen(true)}
            className="relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-sm cursor-pointer group shadow-xl shadow-black/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#D2A078] via-[#E8B98A] to-[#8B5E3C]" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <ChefHat className="w-4 h-4 relative z-10 text-[#1E0F09]" />
            <span className="relative z-10 text-[#1E0F09] font-semibold text-sm tracking-[0.2em] uppercase">
              View Full Menu
            </span>
            <ArrowRight className="w-4 h-4 relative z-10 text-[#1E0F09]" />
          </motion.button>

          <a
            id="zomato-direct-link"
            href="https://www.zomato.com/chennai/rotticious-royapettah/order"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-4 border border-white/15 text-[#E0D8D0]/70 hover:text-[#D2A078] hover:border-[#D2A078]/30 text-xs font-mono uppercase tracking-[0.2em] rounded-sm transition-all duration-300"
          >
            <Star className="w-3.5 h-3.5" />
            Order on Zomato
          </a>
        </motion.div>
      </div>
    </section>
  );
}
