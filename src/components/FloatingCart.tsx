/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CheckoutModal from './CheckoutModal';

export default function FloatingCart() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isCartOpen, setCartOpen, isCheckoutOpen, setCheckoutOpen } = useCart();
  const [prevCount, setPrevCount] = useState(totalItems);
  const [countBounce, setCountBounce] = useState(false);

  // Bounce effect when count changes
  if (totalItems !== prevCount) {
    setPrevCount(totalItems);
    setCountBounce(true);
    setTimeout(() => setCountBounce(false), 400);
  }

  return (
    <>
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onBack={() => { setCheckoutOpen(false); setCartOpen(true); }}
      />

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
        {/* Cart Panel */}
        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              id="floating-cart-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="w-[340px] max-h-[70vh] bg-[#1E0F09]/98 border border-white/10 rounded-sm shadow-2xl shadow-black/60 backdrop-blur-xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4 text-[#D2A078]" />
                  <h4 className="font-serif italic text-[#E0D8D0] text-sm tracking-wide">Your Order</h4>
                  {totalItems > 0 && (
                    <span className="text-[10px] font-mono bg-[#D2A078]/20 text-[#D2A078] px-2 py-0.5 rounded-sm">
                      {totalItems} item{totalItems !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <button
                  id="cart-close-btn"
                  onClick={() => setCartOpen(false)}
                  className="text-[#E0D8D0]/40 hover:text-[#D2A078] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-4 text-center px-6">
                    <div className="w-12 h-12 rounded-sm border border-white/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-[#E0D8D0]/30" />
                    </div>
                    <div>
                      <p className="text-[#E0D8D0]/50 text-xs font-serif italic">Your order is empty</p>
                      <p className="text-[#E0D8D0]/30 text-[10px] font-mono mt-1">Browse our menu below</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    <AnimatePresence>
                      {items.map(item => (
                        <motion.div
                          key={item.menuItemId}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-3 p-3 rounded-sm border border-white/5 bg-white/3 hover:border-white/10 transition-colors"
                        >
                          {/* Image thumbnail */}
                          {item.image && (
                            <div className="w-10 h-10 rounded-sm overflow-hidden flex-shrink-0 border border-white/10">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          )}

                          {/* Name + controls */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[#E0D8D0] text-xs font-serif italic truncate leading-tight">{item.name}</p>
                            <p className="text-[#D2A078] text-[10px] font-mono mt-0.5">{item.price}</p>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-[#E0D8D0]/50 hover:text-[#D2A078] border border-white/10 rounded-sm hover:border-[#D2A078]/30 transition-all cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 0.7 }}
                              animate={{ scale: 1 }}
                              className="w-6 text-center text-[#E0D8D0] text-xs font-mono"
                            >
                              {item.quantity}
                            </motion.span>
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-[#E0D8D0]/50 hover:text-[#D2A078] border border-white/10 rounded-sm hover:border-[#D2A078]/30 transition-all cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.menuItemId)}
                            className="flex-shrink-0 text-[#E0D8D0]/30 hover:text-red-400 transition-colors cursor-pointer ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer with total + CTA */}
              {items.length > 0 && (
                <div className="border-t border-white/10 p-4 space-y-3 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#E0D8D0]/50 uppercase tracking-[0.2em] font-mono">Order Total</span>
                    <motion.span
                      key={totalPrice}
                      initial={{ scale: 0.9, color: '#D2A078' }}
                      animate={{ scale: 1 }}
                      className="text-xl font-mono text-[#D2A078] font-bold"
                    >
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </motion.span>
                  </div>
                  <motion.button
                    id="proceed-to-order-btn"
                    onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#D2A078] to-[#8B5E3C] hover:from-[#E0B590] hover:to-[#A06840] text-[#1E0F09] font-semibold text-xs tracking-[0.2em] uppercase rounded-sm transition-all duration-300 shadow-lg hover:shadow-[#D2A078]/20 cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Proceed to Order <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Cart Icon Button */}
        <motion.button
          id="floating-cart-btn"
          onClick={() => setCartOpen(!isCartOpen)}
          className={`relative w-14 h-14 rounded-sm border flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
            isCartOpen
              ? 'bg-[#D2A078] border-[#D2A078] text-[#1E0F09] shadow-[#D2A078]/20'
              : 'bg-[#1E0F09]/95 border-white/15 text-[#E0D8D0] hover:border-[#D2A078]/50 hover:bg-[#2A1208] backdrop-blur-xl'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="w-5 h-5" />

          {/* Item count badge */}
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: countBounce ? [1, 1.4, 1] : 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-[#D2A078] text-[#1E0F09] text-[10px] font-mono font-bold rounded-full flex items-center justify-center shadow-md"
              >
                {totalItems > 9 ? '9+' : totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
