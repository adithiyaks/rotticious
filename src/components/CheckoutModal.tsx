/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ZOMATO_URL = 'https://www.zomato.com/chennai/rotticious-royapettah/order';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function CheckoutModal({ isOpen, onClose, onBack }: CheckoutModalProps) {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  const handleOrderOnZomato = () => {
    clearCart();
    window.open(ZOMATO_URL, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="checkout-modal-backdrop"
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-[#1E0F09]/90 backdrop-blur-2xl" />

          <motion.div
            id="checkout-modal-card"
            className="relative w-full max-w-md bg-[#1E0F09] border border-white/10 rounded-sm shadow-2xl overflow-hidden z-10"
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Glow decoration */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-[#D2A078]/8 rounded-full blur-3xl pointer-events-none" />

            {/* Close */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center text-[#E0D8D0]/50 hover:text-[#D2A078] cursor-pointer transition-all"
              whileHover={{ rotate: 90 }}
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>

            {/* Header */}
            <div className="p-6 pb-0 relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-[#D2A078]" />
                <span className="text-[10px] tracking-[0.3em] font-mono text-[#D2A078] uppercase">Order Summary</span>
              </div>
              <h3 className="text-2xl font-serif italic text-[#E0D8D0]">
                Your Rotticious Order
              </h3>
              <div className="w-16 h-[1px] bg-[#D2A078]/30 mt-3" />
            </div>

            {/* Order Items */}
            <div className="p-6 space-y-2 max-h-56 overflow-y-auto custom-scrollbar relative z-10">
              {items.map(item => (
                <div key={item.menuItemId} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-sm bg-[#D2A078]/10 border border-[#D2A078]/20 text-[#D2A078] text-[10px] font-mono flex items-center justify-center flex-shrink-0">
                      {item.quantity}
                    </span>
                    <span className="text-sm font-serif italic text-[#E0D8D0]/90 truncate max-w-[160px]">{item.name}</span>
                  </div>
                  <span className="text-[#D2A078] font-mono text-sm flex-shrink-0">
                    ₹{(item.priceRaw * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-6 pb-1 relative z-10">
              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <div>
                  <span className="text-[10px] text-[#E0D8D0]/40 uppercase tracking-[0.2em] font-mono block">
                    {totalItems} item{totalItems !== 1 ? 's' : ''} · Estimated Total
                  </span>
                </div>
                <span className="text-2xl font-mono text-[#D2A078] font-bold">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Redirect notice */}
            <div className="px-6 pb-4 relative z-10">
              <div className="p-3 rounded-sm bg-white/3 border border-white/8 flex items-start gap-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D2A078] mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-[#E0D8D0]/50 font-sans leading-relaxed">
                  We'll take you to Zomato to complete your order securely. Your selections above are for reference — please re-select on Zomato.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="px-6 pb-6 space-y-2 relative z-10">
              {/* Primary CTA — Zomato */}
              <motion.button
                id="order-on-zomato-btn"
                onClick={handleOrderOnZomato}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 relative overflow-hidden rounded-sm cursor-pointer group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#D2A078] via-[#E8B98A] to-[#8B5E3C]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2 text-[#1E0F09] font-semibold text-xs tracking-[0.2em] uppercase">
                  Order on Zomato
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </motion.button>

              {/* Back button */}
              <button
                id="back-to-cart-btn"
                onClick={onBack}
                className="w-full flex items-center justify-center gap-2 py-3 border border-white/10 text-[#E0D8D0]/60 hover:text-[#D2A078] hover:border-[#D2A078]/30 text-xs tracking-[0.2em] uppercase font-mono rounded-sm transition-all duration-200 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Cart
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
