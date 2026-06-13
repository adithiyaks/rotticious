/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import Scene3D from './components/Scene3D';
import ContentOverlay from './components/ContentOverlay';
import FloatingCart from './components/FloatingCart';
import FullMenuModal from './components/FullMenuModal';
import { CartProvider } from './contexts/CartContext';
import { Sparkles, Volume2, VolumeX, Eye, Info, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [isPlayingCrackle, setIsPlayingCrackle] = useState<boolean>(false);
  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(false);
  
  // Web Audio fireplace and espresso bar synthesiser references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hearthFilterRef = useRef<BiquadFilterNode | null>(null);
  const crackleNodeRef = useRef<ScriptProcessorNode | null>(null);

  // Initialize atmospheric sound generator (safe, completely programmatic, no assets needed)
  const toggleCrackleSound = async () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Lowpass filter to make it warm, soft, and comforting (like woodburning fireplace + steaming milk)
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 550; // soft low hum

        // Programmable node for fireplace pops and ambient steam crackle
        const bufferSize = 4096;
        const node = ctx.createScriptProcessor(bufferSize, 1, 1);
        
        node.onaudioprocess = (e) => {
          const output = e.outputBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            // Soft base noise
            let base = (Math.random() * 2 - 1) * 0.04;
            
            // Fireplace crackling pops (analogous to dough baking / beans roasting)
            if (Math.random() < 0.00035) {
              const pulse = (Math.random() * 2 - 1) * 0.65;
              base += pulse;
            }
            output[i] = base;
          }
        };

        node.connect(lowpass);
        lowpass.connect(ctx.destination);
        
        hearthFilterRef.current = lowpass;
        crackleNodeRef.current = node;
      }

      if (isPlayingCrackle) {
        await audioCtxRef.current.suspend();
        setIsPlayingCrackle(false);
      } else {
        await audioCtxRef.current.resume();
        setIsPlayingCrackle(true);
      }
    } catch (err) {
      console.warn('Web Audio Context is restricted or failed to load:', err);
    }
  };

  // Safe release of audio references
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <CartProvider>
      <div className="relative w-full text-[#E0D8D0] overflow-x-hidden selection:bg-[#D2A078]/30 selection:text-[#E0D8D0]">
      
      {/* 1. FIXED BACKPROPAGATED 3D WEBGL ENGINE CANVAS */}
      <Scene3D activeCategoryIndex={activeCategoryIndex} />

      {/* 2. SCROLLABLE SENSORY CHAPTER OVERLAY CHANNELS */}
      <div className="story-scroll-container w-full relative z-10">
        <ContentOverlay 
          onCategoryChange={setActiveCategoryIndex} 
          activeCategoryIndex={activeCategoryIndex} 
        />
      </div>

      {/* 3. COZY SENSORY SOUND BAR & INFO BOX (Fixed Floating Actions) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
        {/* Play programmatic hearth atmosphere */}
        <button
          id="toggle-cozy-sound"
          onClick={toggleCrackleSound}
          className={`flex items-center gap-2 p-3.5 rounded-sm border border-white/10 backdrop-blur-md cursor-pointer transition-all duration-300 shadow-lg text-xs tracking-wider font-serif italic uppercase font-semibold ${
            isPlayingCrackle 
              ? 'bg-[#D2A078] text-[#1E0F09] scale-105 border-[#D2A078] shadow-md shadow-[#D2A078]/15' 
              : 'bg-white/5 text-[#E0D8D0] hover:border-[#D2A078]/40 hover:bg-white/10'
          }`}
          title="Play cozy kiln & fireplace ambient sound"
        >
          {isPlayingCrackle ? (
            <>
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span className="hidden md:inline-block">Atmosphere On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span className="hidden md:inline-block">Cozy Atmosphere</span>
            </>
          )}
        </button>

        {/* Cafe status indicator */}
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-3 border border-white/5 rounded-sm bg-[#1E0F09]/90 backdrop-blur-md text-[10px] tracking-[0.2em] font-mono text-[#E0D8D0]/80">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
          <span>BAKERY STOREFRONT ONLINE</span>
        </div>
      </div>

      {/* FLOATING CART — always accessible, premium position */}
      <FloatingCart />

      {/* FULL MENU MODAL — popup triggered by any Order button */}
      <FullMenuModal />

      {/* 4. INTRO LUXURY SCREEN TRANSITION & LOADER */}
      <AnimatePresence>
        {!isIntroComplete && (
          <motion.div 
            id="loading-screen"
            className="fixed inset-0 bg-[#1E0F09] z-50 flex flex-col justify-between p-12 items-center"
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Top info */}
            <div className="text-[#D2A078] font-serif italic text-[11px] tracking-[0.3em] uppercase">
              The 3D Cinematic Storytelling Experience
            </div>

            {/* Centered logo */}
            <div className="text-center space-y-4">
              <span className="inline-flex p-3 rounded-sm border border-[#D2A078]/20 bg-[#D2A078]/5 text-[#D2A078] mb-2">
                <Coffee className="w-6 h-6" />
              </span>
              <h2 className="text-5xl md:text-8xl font-serif italic font-normal tracking-tight text-[#E0D8D0]">
                rotticious<span className="text-[#D2A078]">.</span>
              </h2>
              <div className="max-w-md mx-auto h-[1px] bg-white/10 overflow-hidden relative mt-4">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D2A078] to-[#1E0F09] rounded-sm"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.8, ease: 'easeInOut' }}
                  onAnimationComplete={() => setIsIntroComplete(true)}
                />
              </div>
              <p className="text-xs text-[#E0D8D0]/50 tracking-[0.2em] uppercase font-mono pt-4 selection:bg-transparent">
                Preloading WebGL Buffers & Culinary Geometry...
              </p>
            </div>

            {/* Bottom info */}
            <div className="text-center text-[10px] text-[#E0D8D0]/40 font-mono tracking-widest max-w-sm leading-relaxed mb-4">
              USE SCROLLBAR TO INTERPOLATE BETWEEN FLOATING BEANS, BAKING KILN CUP, AND THE LOGO SNAPPING SIGNATURE
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
    </CartProvider>
  );
}
