/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * "Loved Across Chennai" — Social Proof Section
 */

import { motion } from 'motion/react';
import { Instagram, Star, Trophy, Heart, ExternalLink } from 'lucide-react';
import { ROTTICIOUS_MENU } from '../menuData';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 'rev-1',
    text: 'The pistachio cruffin is unlike anything I\'ve had in Chennai. The cardamom sugar shell shatters perfectly. We drove 40 minutes just for this.',
    author: 'Ananya R.',
    rating: 5,
    initials: 'AR',
    role: 'Food Explorer, Chennai',
  },
  {
    id: 'rev-2',
    text: 'Rotticious has single-handedly raised the bar for specialty cafés in the city. The smoked hot chocolate is theatrical and indulgent. Come for the experience.',
    author: 'Karan M.',
    rating: 5,
    initials: 'KM',
    role: 'Café Critic, Zomato Gold',
  },
  {
    id: 'rev-3',
    text: 'I order from here every Sunday. The espresso tonic hits different — cold, citrusy, and complex. Perfect with the butter croissant. Non-negotiable combo.',
    author: 'Priya S.',
    rating: 5,
    initials: 'PS',
    role: 'Regular, Royapettah',
  },
];

const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    gradient: 'from-amber-900/60 via-orange-900/40 to-[#1A0B06]',
    accent: '#D2A078',
    label: 'The Pistachio Cruffin',
    tag: '@rotticious',
    likes: '2.4k',
    comments: '187',
  },
  {
    id: 'ig-2',
    gradient: 'from-stone-800/60 via-amber-950/40 to-[#1A0B06]',
    accent: '#C0956A',
    label: 'Smoked Hot Chocolate',
    tag: '@rotticious',
    likes: '3.1k',
    comments: '234',
  },
  {
    id: 'ig-3',
    gradient: 'from-green-950/50 via-stone-900/40 to-[#1A0B06]',
    accent: '#8FAF78',
    label: 'Pistachio Matcha Cloud',
    tag: '@rotticious',
    likes: '1.8k',
    comments: '142',
  },
];

// Top sellers by rating + isPopular
const TOP_SELLERS = ROTTICIOUS_MENU
  .filter(i => i.isPopular)
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 3);

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function InstagramCard({ post, index }: { post: typeof INSTAGRAM_POSTS[0]; index: number }) {
  return (
    <motion.a
      id={`ig-card-${post.id}`}
      href="https://www.instagram.com/rotticious"
      target="_blank"
      rel="noopener noreferrer"
      className="relative block rounded-sm overflow-hidden border border-white/10 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(210,160,120,0.35)' }}
    >
      {/* Gradient art card */}
      <div className={`aspect-square bg-gradient-to-br ${post.gradient} relative`}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 30%, ${post.accent}40 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${post.accent}20 0%, transparent 40%)`,
          }}
        />
        {/* Center rotticious watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-serif italic text-white/10 select-none tracking-tight">r.</span>
        </div>
        {/* Instagram overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <ExternalLink className="w-6 h-6 text-white" />
        </div>
        {/* Like / comment count */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-white/80 text-[10px] font-mono">{post.likes} ♥</span>
          <span className="text-white/60 text-[10px] font-mono">{post.comments} 💬</span>
        </div>
      </div>
      {/* Caption */}
      <div className="p-3 bg-[#1A0B06]">
        <p className="text-xs font-serif italic text-[#E0D8D0]/80 truncate">{post.label}</p>
        <p className="text-[10px] font-mono text-[#D2A078]/60 mt-0.5">{post.tag}</p>
      </div>
    </motion.a>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof TESTIMONIALS[0]; index: number }) {
  return (
    <motion.div
      id={`testimonial-${testimonial.id}`}
      className="p-5 rounded-sm border border-white/8 bg-white/3 hover:border-[#D2A078]/20 hover:bg-white/5 transition-all duration-300 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-3 h-3 text-[#D2A078] fill-[#D2A078]" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm font-serif italic text-[#E0D8D0]/80 leading-relaxed flex-1">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/8">
        <div className="w-8 h-8 rounded-sm bg-[#D2A078]/15 border border-[#D2A078]/20 flex items-center justify-center text-[#D2A078] text-[10px] font-mono font-bold flex-shrink-0">
          {testimonial.initials}
        </div>
        <div>
          <p className="text-xs text-[#E0D8D0]/80 font-serif">{testimonial.author}</p>
          <p className="text-[10px] text-[#E0D8D0]/40 font-mono">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
export default function SocialProof() {
  return (
    <section id="social-proof-section" className="relative w-full py-24 md:py-32 px-4 md:px-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#160904] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D2A078]/15 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(210,160,120,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#D2A078]/40" />
            <Heart className="w-3.5 h-3.5 text-[#D2A078] fill-[#D2A078]" />
            <div className="h-px w-10 bg-[#D2A078]/40" />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif italic font-normal text-[#E0D8D0] tracking-tight leading-tight">
            Loved Across Chennai
          </h2>
          <p className="text-[#E0D8D0]/50 text-sm max-w-md mx-auto font-sans leading-relaxed">
            From Royapettah to Anna Nagar — Rotticious has become the city's favourite artisan café.
          </p>
        </motion.div>

        {/* Three column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Column 1: Instagram */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2.5 mb-6"
            >
              <Instagram className="w-4 h-4 text-[#D2A078]" />
              <span className="text-xs font-mono text-[#E0D8D0]/70 uppercase tracking-[0.2em]">@rotticious</span>
              <a
                id="instagram-follow-link"
                href="https://www.instagram.com/rotticious"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-[10px] font-mono text-[#D2A078]/60 hover:text-[#D2A078] border border-[#D2A078]/20 hover:border-[#D2A078]/50 px-2.5 py-1 rounded-sm transition-all"
              >
                Follow
              </a>
            </motion.div>
            <div className="grid grid-cols-3 gap-2">
              {INSTAGRAM_POSTS.map((post, i) => (
                <InstagramCard key={post.id} post={post} index={i} />
              ))}
            </div>
            <motion.a
              href="https://www.instagram.com/rotticious"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 border border-white/10 text-[#E0D8D0]/50 hover:text-[#D2A078] hover:border-[#D2A078]/30 text-[10px] font-mono uppercase tracking-[0.2em] rounded-sm transition-all"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Instagram className="w-3.5 h-3.5" /> View on Instagram
            </motion.a>
          </div>

          {/* Column 2: Testimonials */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2.5 mb-6"
            >
              <Star className="w-4 h-4 text-[#D2A078] fill-[#D2A078]" />
              <span className="text-xs font-mono text-[#E0D8D0]/70 uppercase tracking-[0.2em]">What People Say</span>
            </motion.div>
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>

          {/* Column 3: Best Sellers */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2.5 mb-6"
            >
              <Trophy className="w-4 h-4 text-[#D2A078]" />
              <span className="text-xs font-mono text-[#E0D8D0]/70 uppercase tracking-[0.2em]">Best Sellers</span>
            </motion.div>
            {TOP_SELLERS.map((item, i) => (
              <motion.div
                id={`best-seller-${item.id}`}
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-sm border border-white/8 bg-white/3 hover:border-[#D2A078]/25 hover:bg-white/5 transition-all duration-300 group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                {/* Rank */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-sm flex items-center justify-center font-mono font-bold text-sm ${
                  i === 0
                    ? 'bg-[#D2A078] text-[#1E0F09]'
                    : i === 1
                    ? 'bg-[#D2A078]/20 text-[#D2A078] border border-[#D2A078]/30'
                    : 'bg-white/5 text-[#E0D8D0]/50 border border-white/10'
                }`}>
                  #{i + 1}
                </div>
                {/* Thumbnail */}
                {item.image && (
                  <div className="w-10 h-10 rounded-sm overflow-hidden flex-shrink-0 border border-white/10">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-serif italic text-[#E0D8D0] group-hover:text-[#D2A078] transition-colors truncate">
                    {item.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 text-[#D2A078] fill-[#D2A078]" />
                      <span className="text-[10px] font-mono text-[#E0D8D0]/50">{item.rating}</span>
                    </div>
                    <span className="text-[#E0D8D0]/20 text-[10px]">·</span>
                    <span className="text-[10px] font-mono text-[#D2A078]/70">{item.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Rating summary */}
            <motion.div
              className="mt-6 p-4 rounded-sm border border-white/8 bg-[#D2A078]/5 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-4xl font-mono text-[#D2A078] font-bold">4.9</div>
              <div className="flex justify-center gap-0.5 my-1.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i === 5 ? 'text-[#D2A078]/50 fill-[#D2A078]/50' : 'text-[#D2A078] fill-[#D2A078]'}`} />
                ))}
              </div>
              <p className="text-[10px] text-[#E0D8D0]/50 font-mono uppercase tracking-[0.2em]">Average Rating · 500+ Reviews</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
