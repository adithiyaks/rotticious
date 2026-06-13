/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useLayoutEffect } from 'react';
import { SCROLL_SECTIONS } from '../types';
import InteractiveMenu from './InteractiveMenu';
import OrderSection from './OrderSection';
import SocialProof from './SocialProof';
import { ChevronDown, MapPin, Clock, Phone, ArrowUp, Instagram, Heart, Navigation, ShoppingBag, ChefHat } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ContentOverlayProps {
  onCategoryChange: (index: number) => void;
  activeCategoryIndex: number;
}

export default function ContentOverlay({ onCategoryChange, activeCategoryIndex }: ContentOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animate HTML text sections dynamically on scroll
  useLayoutEffect(() => {
    const textSections = gsap.utils.toArray('.story-section');
    
    textSections.forEach((section: any, idx: number) => {
      // Stage 4 (index 3) is hidden on purpose, letting the 3D visual breathe
      if (idx === 3) return;

      const title = section.querySelector('.anim-title');
      const subtitle = section.querySelector('.anim-subtitle');
      const desc = section.querySelector('.anim-desc');
      const extra = section.querySelector('.anim-extra');

      // Timeline for each section's presentation
      const sectionTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play reverse play reverse',
        }
      });

      if (subtitle) {
        sectionTimeline.fromTo(subtitle, 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
      }
      if (title) {
        sectionTimeline.fromTo(title, 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );
      }
      if (desc) {
        sectionTimeline.fromTo(desc, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );
      }
      if (extra) {
        sectionTimeline.fromTo(extra, 
          { opacity: 0, scale: 0.95 }, 
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );
      }
    });

    // Custom pulse indicator
    gsap.fromTo('.scroll-indicator', 
      { y: 0 },
      { y: 12, repeat: -1, yoyo: true, duration: 1.5, ease: 'power1.inOut' }
    );

    // Fade out center hero logo on scroll
    const firstSection = textSections[0] as HTMLElement;
    if (firstSection) {
      gsap.fromTo('.hero-center-logo',
        { opacity: 0.8, scale: 1 },
        {
          opacity: 0,
          scale: 0.95,
          ease: 'none',
          scrollTrigger: {
            trigger: firstSection,
            start: 'top top',
            end: '60% top',
            scrub: true,
          }
        }
      );
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { setMenuModalOpen } = useCart();

  return (
    <div ref={containerRef} className="w-full relative z-10 select-none">
      
      {/* 2D Overlay Radial light mimicry to align with Sophisticated Dark style rules */}
      <div className="absolute inset-x-0 top-0 h-[100vh] bg-[radial-gradient(circle_at_50%_40%,rgba(210,160,120,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Centered Hero Logo Text that fades on scroll */}
      <div className="hero-center-logo fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-80">
        <h1 
          className="tracking-[-0.05em] leading-none select-none filter drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] uppercase scale-y-[1.12]"
          style={{ 
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: 'min(15vw, 12rem)',
            color: '#FAF6F0',
            fontWeight: 'bold'
          }}
        >
          rotticious
        </h1>
      </div>

      {/* Dynamic Header Badge / Top Nav bar matching layout */}
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 mix-blend-difference">
        <span className="font-serif italic font-normal tracking-[0.1em] text-[#E0D8D0] text-xl cursor-pointer hover:text-white transition-colors duration-300">
          rotticious<span className="text-[#D2A078]">.</span>
        </span>
        <div className="flex items-center gap-4 text-[10px] uppercase font-display tracking-[0.25em] text-[#E0D8D0]/80">
          <span className="hidden sm:inline-block">Specialty Cafe</span>
          <span className="hidden sm:inline-block">•</span>
          <span className="hidden sm:inline-block">Hand-Laminated Dough</span>
          <button
            id="header-order-btn"
            onClick={() => setMenuModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#D2A078]/15 border border-[#D2A078]/30 text-[#D2A078] px-4 py-2 rounded-sm backdrop-blur-md font-mono hover:bg-[#D2A078]/25 hover:border-[#D2A078]/60 transition-all duration-300 cursor-pointer mix-blend-normal"
          >
            <ChefHat className="w-3 h-3" />
            <span>Order</span>
          </button>
        </div>
      </header>

      {/* Sophisticated Fixed Left Vertical Section Indicators */}
      <div className="fixed left-10 top-1/2 -translate-y-1/2 flex flex-col gap-6 opacity-30 z-40 hidden xl:flex text-right pointer-events-none mix-blend-difference">
        <div className="[writing-mode:vertical-rl] rotate-180 text-[9px] tracking-[0.5em] uppercase text-[#E0D8D0]">01 Origin</div>
        <div className="[writing-mode:vertical-rl] rotate-180 text-[9px] tracking-[0.5em] uppercase text-[#E0D8D0]">02 Pour</div>
        <div className="[writing-mode:vertical-rl] rotate-180 text-[9px] tracking-[0.5em] uppercase text-[#E0D8D0]">03 Evolution</div>
        <div className="[writing-mode:vertical-rl] rotate-180 text-[9px] tracking-[0.5em] uppercase text-[#E0D8D0]">04 Craft</div>
        <div className="[writing-mode:vertical-rl] rotate-180 text-[9px] tracking-[0.5em] uppercase text-[#E0D8D0]">05 Hearth</div>
        <div className="[writing-mode:vertical-rl] rotate-180 text-[9px] tracking-[0.5em] uppercase text-[#E0D8D0]">06 Explosion</div>
        <div className="[writing-mode:vertical-rl] rotate-180 text-[9px] tracking-[0.5em] uppercase text-[#D2A078] opacity-100 font-bold">07 Signature</div>
      </div>

      {/* Rhythmic Scrolling Chapters */}
      
      {/* SECTION 1: THE ORIGIN (Floating Beans) */}
      <section className="story-section min-h-[140vh] flex flex-col justify-center px-6 md:px-24 max-w-4xl pt-56 relative">
        <div className="space-y-4 max-w-xl">
          <span className="anim-subtitle inline-block text-[#D2A078] font-serif text-sm tracking-[0.35em] uppercase font-semibold relative pl-8">
            <span className="absolute left-0 top-1/2 w-5 h-[1.5px] bg-[#D2A078]" />
            {SCROLL_SECTIONS[0].subtitle}
          </span>
          <h2 className="anim-title text-5xl md:text-7xl font-serif text-[#E0D8D0] italic font-normal tracking-tight leading-[1.02]">
            The Origin of Flavor
          </h2>
          <p className="anim-desc text-[#E0D8D0]/75 md:text-lg leading-relaxed font-sans font-light">
            {SCROLL_SECTIONS[0].description} Our coffee beans are slowly stone-roasted in small precision micro-batches to release high-density notes of raw dark cocoa and caramelized hazelnut.
          </p>
        </div>
        
        {/* Hover Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#D2A078]/60 font-display">
            Scroll to Pour
          </span>
          <ChevronDown className="scroll-indicator w-4 h-4 text-[#E0D8D0]/40" />
        </div>
      </section>

      {/* SECTION 2: THE POUR (Beans to Cup) */}
      <section className="story-section min-h-[140vh] flex flex-col justify-center items-end text-right px-6 md:px-24">
        <div className="space-y-4 max-w-xl">
          <span className="anim-subtitle inline-block text-[#D2A078] font-serif text-sm tracking-[0.35em] uppercase font-semibold relative pr-8">
            {SCROLL_SECTIONS[1].subtitle}
            <span className="absolute right-0 top-1/2 w-5 h-[1.5px] bg-[#D2A078]" />
          </span>
          <h2 className="anim-title text-5xl md:text-7xl font-serif text-[#E0D8D0] italic font-normal tracking-tight leading-[1.02]">
            The Alchemic Pour
          </h2>
          <p className="anim-desc text-[#E0D8D0]/75 md:text-lg leading-relaxed font-sans font-light">
            {SCROLL_SECTIONS[1].description} Fluid extraction is captured inside kiln-fired clay, cooling at exactly 0.8°C per minute to seal in deep botanical espresso elements.
          </p>
        </div>
      </section>

      {/* SECTION 3: THE TRANSFORMATION (Cup to Belan) */}
      <section className="story-section min-h-[140vh] flex flex-col justify-center px-6 md:px-24 max-w-4xl">
        <div className="space-y-4 max-w-xl">
          <span className="anim-subtitle inline-block text-[#D2A078] font-serif text-sm tracking-[0.35em] uppercase font-semibold relative pl-8">
            <span className="absolute left-0 top-1/2 w-5 h-[1.5px] bg-[#D2A078]" />
            {SCROLL_SECTIONS[2].subtitle}
          </span>
          <h2 className="anim-title text-5xl md:text-7xl font-serif text-[#E0D8D0] italic font-normal tracking-tight leading-[1.02]">
            The Artful Transformation
          </h2>
          <p className="anim-desc text-[#E0D8D0]/75 md:text-lg leading-relaxed font-sans font-light">
            {SCROLL_SECTIONS[2].description} Fluid curves stretch into linear alignment, changing from standard liquid cup extraction into structural, dense dough rolling dynamics. 
          </p>
        </div>
      </section>

      {/* SECTION 4: THE CRAFT (Rolling Dough - HIDDEN OVERLAY to let 3D breathe) */}
      {/* Expanded this section to give plenty of scroll room for steam/flour/rolling pin transitions */}
      <section className="story-section min-h-[780vh] flex flex-col justify-start pt-[50vh] px-6 md:px-24 relative">
        {/* On-purpose minimalistic atmospheric layer */}
        <div className="absolute right-12 top-24 max-w-xs text-right pr-4 border-r border-[#D2A078]/20 py-2 hidden md:block">
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#D2A078] font-display block mb-1">
            Visual Break
          </span>
          <p className="text-[10px] text-[#E0D8D0]/40 font-mono leading-none">
            Aromatic Dispersal: 0.4 m/s<br/>
            Thermal Lift: +4.2°C
          </p>
        </div>
      </section>

      {/* SECTION 5: THE MENU REVEAL (Dough splits into Categories) */}
      <section className="story-section min-h-[140vh] flex flex-col justify-center items-center text-center px-6">
        <div className="space-y-4 max-w-2xl">
          <span className="anim-subtitle inline-block text-[#D2A078] font-serif text-sm tracking-[0.35em] uppercase font-semibold">
            {SCROLL_SECTIONS[4].subtitle}
          </span>
          <h2 className="anim-title text-5xl md:text-7xl font-serif text-[#E0D8D0] italic font-normal tracking-tight leading-[1.02] max-w-xl mx-auto">
            The Broken Hearth
          </h2>
          <p className="anim-desc text-[#E0D8D0]/75 md:text-sm leading-relaxed font-sans font-light max-w-lg mx-auto">
            {SCROLL_SECTIONS[4].description} As heat cures the laminated sheets, the flat plane splits open, offering four distinct category realms:
          </p>
          <div className="anim-extra grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-lg mx-auto">
            {['Sips', 'Bites', 'Sweets', 'Signatures'].map((cat, idx) => (
              <div 
                id={`dough-split-item-${cat.toLowerCase()}`}
                key={cat} 
                className="p-4 border border-white/10 rounded-sm bg-white/5 backdrop-blur-md"
              >
                <span className="text-[9px] uppercase font-mono text-[#D2A078] block">Quadrant 0{idx+1}</span>
                <span className="text-sm font-serif italic text-[#E0D8D0] tracking-wider block mt-1">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: THE EXPLOSION (Interactive Experience Dashboard) */}
      <section className="story-section min-h-[170vh] flex flex-col justify-center px-4 md:px-12 py-24">
        {/* Interactive Menu Dashboard */}
        <div className="anim-extra w-full">
          <InteractiveMenu 
            onCategoryChange={onCategoryChange} 
            activeCategoryIndex={activeCategoryIndex} 
          />
        </div>
      </section>

      {/* ORDER FROM ROTTICIOUS — Immersive ordering experience */}
      <OrderSection />

      {/* LOVED ACROSS CHENNAI — Social proof */}
      <SocialProof />

      {/* SECTION 7: THE SIGNATURE (Logo Snap & Contact Footer) */}
      <section className="story-section min-h-[160vh] flex flex-col justify-between items-center px-6 pt-36 pb-12 text-center relative">
        <div className="absolute inset-x-0 bottom-0 h-[80vh] bg-[gradient-to-t,from-[#110603],to-[#1e0f09]] pointer-events-none" />
        
        {/* Perfectly aligned layout overlay behind 3D belan */}
        <div className="relative flex flex-col items-center justify-center h-96 w-full max-w-4xl justify-center scale-x-105">
          <div className="anim-subtitle absolute -top-12 z-0 font-serif text-[10px] md:text-xs tracking-[0.45em] text-[#D2A078] uppercase bg-[#1e100a] px-4">
            {SCROLL_SECTIONS[6].subtitle}
          </div>
          
          {/* Logo font overlay styled exactly as the storefront mockup */}
          <h1 
            className="anim-title tracking-[-0.05em] leading-none opacity-10 select-none z-0 filter drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] uppercase scale-y-[1.12]"
            style={{ 
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 'min(15vw, 12rem)',
              color: '#FAF6F0',
              fontWeight: 'bold'
            }}
          >
            rotticious
          </h1>
        </div>

        {/* Premium floating contact info + action buttons */}
        <div className="anim-extra w-full max-w-4xl relative z-20 space-y-8">

          {/* Location + hours info strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border border-white/8 bg-white/3 backdrop-blur-md rounded-sm">
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2 text-[#D2A078]">
                <MapPin className="w-4 h-4" />
                <h5 className="font-serif italic font-normal tracking-wider uppercase text-xs">Find Us</h5>
              </div>
              <p className="text-xs text-[#E0D8D0]/70 font-sans leading-relaxed">
                Rotticious,<br />
                Royapettah, Chennai
              </p>
            </div>
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2 text-[#D2A078]">
                <Clock className="w-4 h-4" />
                <h5 className="font-serif italic font-normal tracking-wider uppercase text-xs">Hours</h5>
              </div>
              <div className="text-xs text-[#E0D8D0]/70 font-sans space-y-0.5">
                <div className="flex justify-between gap-4"><span>Daily</span><span className="font-mono">08:00 AM – 10:00 PM</span></div>
                <div className="flex justify-between gap-4"><span>Pastries</span><span className="font-mono">Until Sold Out</span></div>
              </div>
            </div>
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2 text-[#D2A078]">
                <Phone className="w-4 h-4" />
                <h5 className="font-serif italic font-normal tracking-wider uppercase text-xs">Call Us</h5>
              </div>
              <a
                href="tel:+918754449754"
                className="text-xs font-mono text-[#D2A078] hover:text-[#E0B590] transition-colors"
              >
                +91 87544 49754
              </a>
            </div>
          </div>

          {/* Premium action buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Call Now */}
            <a
              id="contact-call-now"
              href="tel:+918754449754"
              className="group flex flex-col items-center gap-3 p-5 rounded-sm border border-white/10 bg-white/3 backdrop-blur-xl hover:border-[#D2A078]/50 hover:bg-[#D2A078]/8 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D2A078]/10 transition-all duration-300"
            >
              <span className="w-10 h-10 rounded-sm border border-white/10 group-hover:border-[#D2A078]/40 bg-white/5 group-hover:bg-[#D2A078]/10 flex items-center justify-center transition-all duration-300">
                <Phone className="w-4 h-4 text-[#E0D8D0]/60 group-hover:text-[#D2A078] transition-colors" />
              </span>
              <div className="text-center">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#E0D8D0]/70 group-hover:text-[#D2A078] transition-colors">Call Now</span>
                <span className="block text-[9px] font-mono text-[#E0D8D0]/30 mt-0.5">+91 87544 49754</span>
              </div>
            </a>

            {/* Get Directions */}
            <a
              id="contact-directions"
              href="https://maps.app.goo.gl/3JRT7L227P6zc7mP8"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-5 rounded-sm border border-white/10 bg-white/3 backdrop-blur-xl hover:border-[#D2A078]/50 hover:bg-[#D2A078]/8 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D2A078]/10 transition-all duration-300"
            >
              <span className="w-10 h-10 rounded-sm border border-white/10 group-hover:border-[#D2A078]/40 bg-white/5 group-hover:bg-[#D2A078]/10 flex items-center justify-center transition-all duration-300">
                <Navigation className="w-4 h-4 text-[#E0D8D0]/60 group-hover:text-[#D2A078] transition-colors" />
              </span>
              <div className="text-center">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#E0D8D0]/70 group-hover:text-[#D2A078] transition-colors">Directions</span>
                <span className="block text-[9px] font-mono text-[#E0D8D0]/30 mt-0.5">Royapettah, Chennai</span>
              </div>
            </a>

            {/* Instagram */}
            <a
              id="contact-instagram"
              href="https://www.instagram.com/rotticious"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-5 rounded-sm border border-white/10 bg-white/3 backdrop-blur-xl hover:border-[#D2A078]/50 hover:bg-[#D2A078]/8 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D2A078]/10 transition-all duration-300"
            >
              <span className="w-10 h-10 rounded-sm border border-white/10 group-hover:border-[#D2A078]/40 bg-white/5 group-hover:bg-[#D2A078]/10 flex items-center justify-center transition-all duration-300">
                <Instagram className="w-4 h-4 text-[#E0D8D0]/60 group-hover:text-[#D2A078] transition-colors" />
              </span>
              <div className="text-center">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#E0D8D0]/70 group-hover:text-[#D2A078] transition-colors">Instagram</span>
                <span className="block text-[9px] font-mono text-[#E0D8D0]/30 mt-0.5">@rotticious</span>
              </div>
            </a>

            {/* Order Online — opens full menu popup */}
            <button
              id="contact-order-online"
              onClick={() => setMenuModalOpen(true)}
              className="group flex flex-col items-center gap-3 p-5 rounded-sm border border-[#D2A078]/20 bg-[#D2A078]/5 backdrop-blur-xl hover:border-[#D2A078]/60 hover:bg-[#D2A078]/12 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D2A078]/15 transition-all duration-300 cursor-pointer"
            >
              <span className="w-10 h-10 rounded-sm border border-[#D2A078]/30 group-hover:border-[#D2A078]/60 bg-[#D2A078]/10 group-hover:bg-[#D2A078]/20 flex items-center justify-center transition-all duration-300">
                <ShoppingBag className="w-4 h-4 text-[#D2A078] transition-colors" />
              </span>
              <div className="text-center">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#D2A078] group-hover:text-[#E0B590] transition-colors">Order Online</span>
                <span className="block text-[9px] font-mono text-[#D2A078]/50 mt-0.5">View Full Menu</span>
              </div>
            </button>
          </div>
        </div>

        {/* Small Legal Disclaimer / Copyright */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4 pt-12 text-[#E0D8D0]/30 text-[10px] font-mono border-t border-white/5 relative z-20">
          <div className="flex items-center gap-2">
            <span>© 2026 ROTTICIOUS CO.</span>
            <span>•</span>
            <span>CINEMATIC ARCHITECTURE v1.4</span>
          </div>
          <div className="flex items-center gap-1">
            <span>CO-CRAFTED WITH SOUL</span>
            <Heart className="w-2.5 h-2.5 fill-[#D2A078] text-transparent" />
          </div>
          <button 
            id="scroll-to-top"
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-[#D2A078] transition-colors group cursor-pointer"
          >
            BACK TO SUMMIT <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </section>

    </div>
  );
}
