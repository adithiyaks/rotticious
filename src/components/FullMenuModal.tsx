/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Full Menu Modal — The complete Rotticious ordering experience
 * Opens as a full-screen popup from any "Order" button on the site
 */

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Search, ShoppingBag, Plus, Minus, Coffee, Snowflake,
  Blend, GlassWater, Zap, Flame, Sandwich, ChefHat,
  Pizza, Cake, Star, Sparkles, ExternalLink, Beef, ArrowRight,
  Leaf, CheckCircle2,
} from 'lucide-react';
import { ROTTICIOUS_MENU, SUBCATEGORY_LIST, SUBCAT_COLOR, getMenuBySubcategory, type MenuSubCategory, type RotticiousMenuItem } from '../menuData';
import { useCart } from '../contexts/CartContext';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-category icons
// ─────────────────────────────────────────────────────────────────────────────
const SUBCAT_ICON: Record<MenuSubCategory, typeof Coffee> = {
  'Hot Coffee':     Coffee,
  'Cold Coffee':    Snowflake,
  'Blended Coffee': Blend,
  'Thickshake':     GlassWater,
  'Fizzy & Slushy': Zap,
  'Appetizers':     Flame,
  'Sandwiches':     Sandwich,
  'Chicken Steaks': Beef,
  'Burgers':        ChefHat,
  'Pasta':          Sparkles,
  'Pizza':          Pizza,
  'Desserts':       Cake,
};

// ─────────────────────────────────────────────────────────────────────────────
// Quick-add flash state
// ─────────────────────────────────────────────────────────────────────────────
function useAddedFlash() {
  const [flashMap, setFlashMap] = useState<Record<string, boolean>>({});
  const flash = useCallback((id: string) => {
    setFlashMap(p => ({ ...p, [id]: true }));
    setTimeout(() => setFlashMap(p => ({ ...p, [id]: false })), 1000);
  }, []);
  return { flashMap, flash };
}

// ─────────────────────────────────────────────────────────────────────────────
// Single item row
// ─────────────────────────────────────────────────────────────────────────────
interface ItemRowProps {
  item: RotticiousMenuItem;
  isFlashed: boolean;
  onAdd: () => void;
  cartQty: number;
  onInc: () => void;
  onDec: () => void;
}

function ItemRow({ item, isFlashed, onAdd, cartQty, onInc, onDec }: ItemRowProps) {
  const [expanded, setExpanded] = useState(false);
  const color = SUBCAT_COLOR[item.subcategory];

  return (
    <motion.div
      id={`menu-item-${item.id}`}
      layout
      className="border border-white/8 rounded-sm bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/12 transition-all duration-200 overflow-hidden"
    >
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Color thumb / image */}
        <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 border border-white/8">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)` }}
            >
              {(() => { const Icon = SUBCAT_ICON[item.subcategory]; return <Icon className="w-5 h-5" style={{ color }} />; })()}
            </div>
          )}
        </div>

        {/* Name + tags */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Veg/Non-veg dot */}
            <span className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
              <span className={`block w-1.5 h-1.5 rounded-full m-auto mt-[1px] ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
            </span>
            <h5 className="text-sm font-serif italic text-[#E0D8D0] leading-snug truncate">
              {item.name}
            </h5>
            {item.isPopular && (
              <span className="flex-shrink-0 text-[9px] font-mono bg-[#D2A078]/20 text-[#D2A078] border border-[#D2A078]/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                Popular
              </span>
            )}
          </div>
          {!expanded && (
            <p className="text-[10px] text-[#E0D8D0]/40 font-sans mt-0.5 truncate leading-relaxed">
              {item.description}
            </p>
          )}
          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-2.5 h-2.5 text-[#D2A078] fill-[#D2A078]" />
            <span className="text-[9px] text-[#E0D8D0]/40 font-mono">{item.rating}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex-shrink-0 text-right mr-2">
          <span className="font-mono text-[#D2A078] font-semibold text-sm">{item.price}</span>
        </div>

        {/* Add / Qty controls */}
        <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
          <AnimatePresence mode="wait">
            {cartQty > 0 ? (
              <motion.div
                key="qty"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-0 border border-[#D2A078]/40 rounded-sm overflow-hidden"
              >
                <button
                  onClick={onDec}
                  className="w-7 h-7 flex items-center justify-center text-[#D2A078] hover:bg-[#D2A078]/10 transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center text-[#E0D8D0] text-xs font-mono font-semibold">{cartQty}</span>
                <button
                  onClick={onInc}
                  className="w-7 h-7 flex items-center justify-center text-[#D2A078] hover:bg-[#D2A078]/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={onAdd}
                className={`w-8 h-8 rounded-sm border flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isFlashed
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : 'border-[#D2A078]/30 text-[#D2A078] hover:bg-[#D2A078]/15 hover:border-[#D2A078]/60'
                }`}
                disabled={item.available === false}
              >
                {isFlashed
                  ? <CheckCircle2 className="w-4 h-4" />
                  : <Plus className="w-3.5 h-3.5" />
                }
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Expanded description */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 ml-16">
              <p className="text-xs text-[#E0D8D0]/60 font-sans leading-relaxed">{item.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.tags.map(t => (
                  <span key={t} className="text-[9px] bg-white/5 border border-white/10 text-[#E0D8D0]/50 px-2 py-0.5 rounded-sm font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main FullMenuModal
// ─────────────────────────────────────────────────────────────────────────────
export default function FullMenuModal() {
  const {
    isMenuModalOpen, setMenuModalOpen,
    items: cartItems, addItem, updateQuantity,
    totalItems, totalPrice,
    setCheckoutOpen,
  } = useCart();

  const [activeSubcat, setActiveSubcat] = useState<MenuSubCategory>('Hot Coffee');
  const [search, setSearch] = useState('');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const { flashMap, flash } = useAddedFlash();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuModalOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setMenuModalOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isMenuModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuModalOpen]);

  // Scroll main to top when category changes
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [activeSubcat]);

  // Search results (across all items)
  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return ROTTICIOUS_MENU.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [search]);

  const displayItems: RotticiousMenuItem[] = searchResults ?? getMenuBySubcategory(activeSubcat);

  // Cart helpers
  const getCartQty = (id: string) => cartItems.find(i => i.menuItemId === id)?.quantity ?? 0;

  const handleAdd = (item: RotticiousMenuItem) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      priceRaw: item.priceRaw,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    flash(item.id);
  };

  const handleInc = (item: RotticiousMenuItem) => {
    const qty = getCartQty(item.id);
    updateQuantity(item.id, qty + 1);
  };

  const handleDec = (item: RotticiousMenuItem) => {
    const qty = getCartQty(item.id);
    updateQuantity(item.id, qty - 1);
  };

  const handleProceed = () => {
    setMenuModalOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      {isMenuModalOpen && (
        <motion.div
          id="full-menu-modal-backdrop"
          className="fixed inset-0 z-[400] flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            onClick={() => setMenuModalOpen(false)}
          />

          {/* Modal panel */}
          <motion.div
            id="full-menu-modal-panel"
            className="relative w-full md:w-[95vw] lg:w-[1100px] h-[92vh] md:h-[88vh] bg-[#120805] border border-white/10 rounded-t-xl md:rounded-xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden z-10"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 35, mass: 0.8 }}
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D2A078]/6 rounded-full blur-3xl pointer-events-none" />

            {/* ── TOP BAR ── */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 flex-shrink-0 relative z-10">
              {/* Handle bar (mobile) */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/15 rounded-full md:hidden" />

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-[#D2A078]" />
                <div>
                  <h2 className="font-serif italic text-[#E0D8D0] text-base leading-none">Order from Rotticious</h2>
                  <p className="text-[9px] text-[#E0D8D0]/40 font-mono mt-0.5">10, Thiru Vika Road, Royapettah · {ROTTICIOUS_MENU.length} items</p>
                </div>
              </div>

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#E0D8D0]/30 pointer-events-none" />
                <input
                  id="menu-search"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search menu..."
                  className="w-full bg-white/5 border border-white/10 text-[#E0D8D0] text-xs placeholder:text-[#E0D8D0]/30 font-sans rounded-sm pl-9 pr-3 py-2.5 outline-none focus:border-[#D2A078]/40 focus:bg-white/8 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#E0D8D0]/30 hover:text-[#D2A078] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Close */}
              <motion.button
                id="full-menu-close-btn"
                onClick={() => setMenuModalOpen(false)}
                className="flex-shrink-0 w-9 h-9 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center text-[#E0D8D0]/50 hover:text-[#D2A078] hover:border-[#D2A078]/30 cursor-pointer transition-all"
                whileHover={{ rotate: 90, scale: 1.05 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* ── BODY ── */}
            <div className="flex flex-1 overflow-hidden relative z-10">

              {/* Sidebar (desktop) / horizontal tabs (mobile) */}
              <div
                ref={sidebarRef}
                className="hidden md:flex md:flex-col w-[220px] lg:w-[240px] border-r border-white/8 overflow-y-auto flex-shrink-0 bg-[#0E0602]/60 custom-scrollbar"
              >
                {SUBCATEGORY_LIST.map(cat => {
                  const Icon = SUBCAT_ICON[cat.id];
                  const isActive = cat.id === activeSubcat && !search;
                  const color = SUBCAT_COLOR[cat.id];
                  return (
                    <button
                      key={cat.id}
                      id={`sidebar-cat-${cat.id.replace(/\s/g, '-').toLowerCase()}`}
                      onClick={() => { setActiveSubcat(cat.id); setSearch(''); }}
                      className={`flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 border-l-2 cursor-pointer group ${
                        isActive
                          ? 'bg-white/5 border-l-[#D2A078]'
                          : 'border-l-transparent hover:bg-white/3 hover:border-l-white/20'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ background: isActive ? `${color}25` : 'transparent', border: isActive ? `1px solid ${color}30` : '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: isActive ? color : 'rgba(224,216,208,0.4)' }} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-sans block truncate transition-colors ${isActive ? 'text-[#E0D8D0]' : 'text-[#E0D8D0]/55 group-hover:text-[#E0D8D0]/80'}`}>
                          {cat.label}
                        </span>
                      </div>
                      <span className={`text-[9px] font-mono flex-shrink-0 ${isActive ? 'text-[#D2A078]' : 'text-[#E0D8D0]/25'}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}

                {/* Zomato link */}
                <div className="mt-auto p-3 border-t border-white/8">
                  <a
                    href="https://www.zomato.com/chennai/rotticious-royapettah/order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[9px] font-mono text-[#E0D8D0]/30 hover:text-[#D2A078] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> View on Zomato
                  </a>
                </div>
              </div>

              {/* Mobile: scrollable category tab bar */}
              <div className="md:hidden flex-shrink-0 border-b border-white/8 overflow-x-auto flex w-full bg-[#0E0602]/60 custom-scrollbar absolute top-0 left-0 right-0 z-20" style={{ height: '48px' }}>
                {SUBCATEGORY_LIST.map(cat => {
                  const isActive = cat.id === activeSubcat && !search;
                  const color = SUBCAT_COLOR[cat.id];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveSubcat(cat.id); setSearch(''); }}
                      className={`flex-shrink-0 px-3 h-full flex items-center gap-1.5 text-[10px] font-mono cursor-pointer border-b-2 transition-all whitespace-nowrap ${
                        isActive ? 'border-b-[#D2A078] text-[#D2A078]' : 'border-b-transparent text-[#E0D8D0]/50'
                      }`}
                    >
                      {cat.label}
                      <span className="text-[8px] opacity-60">({cat.count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Item list */}
              <div
                ref={mainRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-5 mt-12 md:mt-0"
              >
                {/* Category header */}
                {!search ? (
                  <motion.div
                    key={activeSubcat}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-5"
                  >
                    <h3 className="text-xl font-serif italic text-[#E0D8D0]">{activeSubcat}</h3>
                    <p className="text-[10px] text-[#E0D8D0]/40 font-mono mt-0.5">
                      {SUBCATEGORY_LIST.find(c => c.id === activeSubcat)?.count} items
                    </p>
                    <div className="w-10 h-px mt-2" style={{ background: SUBCAT_COLOR[activeSubcat] }} />
                  </motion.div>
                ) : (
                  <div className="mb-4">
                    <p className="text-xs text-[#E0D8D0]/60 font-mono">
                      {displayItems.length} result{displayItems.length !== 1 ? 's' : ''} for "{search}"
                    </p>
                  </div>
                )}

                {/* Items */}
                {displayItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
                    <Search className="w-8 h-8 text-[#E0D8D0]/20" />
                    <p className="text-[#E0D8D0]/40 text-sm font-serif italic">No items found</p>
                    <button onClick={() => setSearch('')} className="text-[10px] font-mono text-[#D2A078] hover:underline cursor-pointer">
                      Clear search
                    </button>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={search || activeSubcat}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-2"
                    >
                      {displayItems.map(item => (
                        <ItemRow
                          key={item.id}
                          item={item}
                          isFlashed={!!flashMap[item.id]}
                          onAdd={() => handleAdd(item)}
                          cartQty={getCartQty(item.id)}
                          onInc={() => handleInc(item)}
                          onDec={() => handleDec(item)}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Bottom padding */}
                <div className="h-20" />
              </div>
            </div>

            {/* ── BOTTOM BAR (cart summary) ── */}
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 80, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className="flex items-center justify-between px-5 py-4 border-t border-white/10 bg-[#1A0A06]/95 backdrop-blur-xl flex-shrink-0 relative z-20"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#E0D8D0]/50 uppercase tracking-[0.2em]">
                      {totalItems} item{totalItems !== 1 ? 's' : ''} added
                    </span>
                    <div className="text-2xl font-mono text-[#D2A078] font-bold leading-none mt-0.5">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <motion.button
                    id="menu-modal-proceed-btn"
                    onClick={handleProceed}
                    className="flex items-center gap-2.5 px-6 py-3 relative overflow-hidden rounded-sm cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D2A078] via-[#E8B98A] to-[#8B5E3C]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <ShoppingBag className="w-4 h-4 relative z-10 text-[#1E0F09]" />
                    <span className="relative z-10 text-[#1E0F09] font-semibold text-xs tracking-[0.2em] uppercase">
                      Proceed to Order
                    </span>
                    <ArrowRight className="w-4 h-4 relative z-10 text-[#1E0F09]" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
