/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { RotticiousMenuItem } from '../menuData';

interface ProductModalProps {
  item: RotticiousMenuItem | null;
  onClose: () => void;
}

export default function ProductModal({ item, onClose }: ProductModalProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const { addItem, setCartOpen } = useCart();

  // Reset quantity when item changes
  useEffect(() => {
    setQty(1);
    setAdded(false);
  }, [item?.id]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Image parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    if (!item) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        menuItemId: item.id,
        name: item.name,
        priceRaw: item.priceRaw,
        price: item.price,
        image: item.image,
        category: item.category,
      });
    }
    setAdded(true);
    setTimeout(() => {
      onClose();
      setCartOpen(true);
    }, 900);
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="modal-backdrop"
          id="product-modal-backdrop"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-[#1E0F09]/85 backdrop-blur-2xl" />

          <motion.div
            id="product-modal-card"
            className="relative w-full max-w-3xl bg-[#1E0F09] border border-white/10 rounded-sm shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh]"
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Decorative radial glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D2A078]/6 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2C1A12]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Close button */}
            <motion.button
              id="product-modal-close"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center text-[#E0D8D0]/60 hover:text-[#D2A078] hover:border-[#D2A078]/30 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              whileHover={{ rotate: 90, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Left: Product Image */}
            <div
              ref={imageRef}
              className="w-full md:w-[55%] aspect-[4/3] md:aspect-auto overflow-hidden relative flex-shrink-0 bg-[#140A05]"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            >
              {item.image ? (
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  style={{
                    transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px) scale(1.06)`,
                    transition: 'transform 0.35s ease-out',
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-[#D2A078]/20 text-6xl font-serif italic">r.</div>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1E0F09]/60 pointer-events-none hidden md:block" />
              {/* Image tag on image */}
              {item.isPopular && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#D2A078] text-[#1E0F09] text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
                  <Sparkles className="w-3 h-3" /> Popular
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="flex flex-col justify-between p-6 md:p-8 flex-1 relative z-10 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {/* Category + Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-3 py-1 rounded-sm border border-[#D2A078]/20 text-[#D2A078] uppercase tracking-[0.2em] font-mono bg-[#D2A078]/5">
                    {item.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#E0D8D0]/70 bg-white/5 px-2.5 py-1 rounded-sm border border-white/10 font-mono">
                    <Star className="w-3 h-3 text-[#D2A078] fill-[#D2A078]" />
                    {item.rating}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-2xl md:text-3xl font-serif italic font-normal text-[#E0D8D0] leading-tight">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#E0D8D0]/70 leading-relaxed font-sans">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-white/5 border border-white/10 text-[#E0D8D0]/70 px-2.5 py-1 rounded-sm font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom: Price + Quantity + CTA */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-4">
                {/* Price */}
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-[#E0D8D0]/40 uppercase tracking-[0.2em] font-mono block">Price</span>
                    <span className="text-4xl font-mono text-[#D2A078] font-bold">{item.price}</span>
                  </div>
                  {/* Availability */}
                  {item.available === false && (
                    <span className="text-[10px] border border-red-500/30 text-red-400 px-3 py-1 rounded-sm font-mono uppercase tracking-wider">
                      Sold Out
                    </span>
                  )}
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-[#E0D8D0]/50 uppercase tracking-[0.2em] font-mono">Qty</span>
                  <div className="flex items-center gap-0 border border-white/10 rounded-sm overflow-hidden">
                    <button
                      id="qty-minus"
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-[#E0D8D0]/70 hover:text-[#D2A078] hover:bg-white/5 transition-all duration-200 cursor-pointer border-r border-white/10"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <motion.span
                      key={qty}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-10 text-center text-[#E0D8D0] font-mono text-sm"
                    >
                      {qty}
                    </motion.span>
                    <button
                      id="qty-plus"
                      onClick={() => setQty(q => Math.min(20, q + 1))}
                      className="w-9 h-9 flex items-center justify-center text-[#E0D8D0]/70 hover:text-[#D2A078] hover:bg-white/5 transition-all duration-200 cursor-pointer border-l border-white/10"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[#E0D8D0]/40 font-mono text-sm">
                    = <span className="text-[#D2A078]">₹{(item.priceRaw * qty).toLocaleString('en-IN')}</span>
                  </span>
                </div>

                {/* Add to cart CTA */}
                <AnimatePresence mode="wait">
                  {!added ? (
                    <motion.button
                      id={`add-to-cart-${item.id}`}
                      key="add-btn"
                      onClick={handleAddToCart}
                      disabled={item.available === false}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-[#D2A078] to-[#8B5E3C] hover:from-[#E0B590] hover:to-[#A06840] text-[#1E0F09] font-semibold text-xs tracking-[0.2em] uppercase rounded-sm transition-all duration-300 shadow-lg hover:shadow-[#D2A078]/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Order · {item.price}
                    </motion.button>
                  ) : (
                    <motion.div
                      key="added-confirm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-900/30 border border-green-500/30 text-green-400 text-xs tracking-[0.2em] uppercase rounded-sm font-semibold"
                    >
                      <Sparkles className="w-4 h-4" />
                      Added to your order
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
