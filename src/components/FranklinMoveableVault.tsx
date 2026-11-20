import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { sound } from '../utils/audio';
import { Move, Sparkles, Layers, ShieldCheck, RefreshCw, ZoomIn, Eye } from 'lucide-react';

interface FranklinMoveableVaultProps {
  onExploreCards?: () => void;
  onExploreChanges?: () => void;
}

export const FranklinMoveableVault: React.FC<FranklinMoveableVaultProps> = ({
  onExploreCards,
  onExploreChanges,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Motion values for smooth 3D mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for natural organic motion
  const springConfig = { damping: 24, stiffness: 220, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), springConfig);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);
  const shadowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const shadowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const toggleZoom = () => {
    sound.playClick();
    setIsZoomed(prev => !prev);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[460px] h-[520px] sm:h-[580px] flex items-center justify-center select-none perspective-[1200px]"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic Ambient Shadow & Currency Backlight */}
      <motion.div
        animate={{
          scale: isHovered ? 1.05 : [1, 1.03, 1],
          opacity: isHovered ? 0.45 : 0.28,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[360px] h-[460px] bg-gradient-to-tr from-slate-900/40 via-zinc-600/30 to-emerald-900/25 rounded-[36px] blur-3xl -z-10 pointer-events-none"
      />

      {/* Interactive Moveable 3D Poster Canvas */}
      <motion.div
        drag
        dragConstraints={{ left: -40, right: 40, top: -35, bottom: 35 }}
        dragElastic={0.18}
        onDragStart={() => {
          setIsDragging(true);
          sound.playCardFlip();
        }}
        onDragEnd={() => setIsDragging(false)}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isZoomed ? 1.08 : isHovered ? 1.02 : 1,
          y: isHovered || isDragging ? 0 : [-5, 5, -5],
        }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          scale: { type: 'spring', damping: 20, stiffness: 200 },
        }}
        className="relative w-[320px] sm:w-[350px] h-[470px] sm:h-[520px] rounded-[28px] cursor-grab active:cursor-grabbing shadow-2xl transition-shadow"
      >
        {/* Physical Paper Frame with Currency Stamp Guilloche Borders */}
        <div className="absolute inset-0 rounded-[28px] bg-neutral-900 p-[3px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] overflow-hidden border border-neutral-700/60">
          
          {/* Inner Paper Sheet */}
          <div className="relative w-full h-full rounded-[25px] overflow-hidden bg-[#e5e4de] flex flex-col justify-between">
            
            {/* The Franklin Torn Banknote Image */}
            <img
              src="/franklin-hero.jpg"
              alt="Benjamin Franklin Currency Engraving - Torn Paper Artwork"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none filter contrast-[1.08] brightness-[0.98]"
              draggable={false}
            />

            {/* Specular Glare Layer that follows mouse movement */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `radial-gradient(circle 320px at ${glareX} ${glareY}, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0) 65%)`,
                mixBlendMode: 'overlay',
              }}
            />

            {/* Vintage Banknote Engraving Overlay & Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35 pointer-events-none z-10" />

            {/* TOP HEADER OVERLAY: Micro-Engraved Currency Watermark */}
            <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 shadow-lg text-[10px] font-mono tracking-wider font-extrabold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>BENJAMIN FRANKLIN $100</span>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                  toggleZoom();
                }}
                className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white/90 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-md"
                title="Zoom into engraving detail"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FLOATING MOVEABLE INDICATOR BADGE (Pill) */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-20 self-center px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-neutral-300 shadow-xl flex items-center gap-2 text-xs font-bold text-neutral-900"
            >
              <Move className="w-3.5 h-3.5 text-neutral-700 animate-spin-slow" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-800">
                Moveable 3D Art • Drag to Tilt
              </span>
            </motion.div>

            {/* BOTTOM AUTHENTICITY BAR & SIGNATURE METADATA */}
            <div className="relative z-20 p-4 sm:p-5 bg-gradient-to-t from-black/85 via-black/50 to-transparent pt-8 space-y-2">
              <div className="flex items-center justify-between text-white/90">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-bold">
                    Currency Intelligence
                  </div>
                  <div className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5 font-serif">
                    <span>Cardwatch Reserve Note</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[9px] font-mono text-neutral-400">SERIES 2026</div>
                  <div className="text-[11px] font-mono font-bold text-emerald-400">100% VERIFIED</div>
                </div>
              </div>

              {/* Micro-guilloche border line */}
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent my-1" />

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300">
                <span>"Knowledge Pays Interest"</span>
                <span className="text-neutral-400">Tap or Drag to Move</span>
              </div>
            </div>

          </div>
        </div>

        {/* Floating 3D Corner Accent / Micro Stamp */}
        <motion.div
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-3 -left-3 z-30 px-3 py-1 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-[10px] font-mono font-extrabold shadow-xl flex items-center gap-1.5 pointer-events-none"
        >
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>FRANKLIN NOIR</span>
        </motion.div>
      </motion.div>

      {/* Action shortcuts below moveable artwork */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 whitespace-nowrap">
        {onExploreChanges && (
          <button
            onClick={() => {
              sound.playClick();
              onExploreChanges();
            }}
            className="px-3 py-1.5 rounded-full bg-white/95 border border-neutral-300 text-neutral-800 hover:bg-neutral-100 text-[11px] font-bold shadow-md transition-all flex items-center gap-1"
          >
            <span>Track Bank Slashes</span>
          </button>
        )}
        {onExploreCards && (
          <button
            onClick={() => {
              sound.playClick();
              onExploreCards();
            }}
            className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-md transition-all flex items-center gap-1"
          >
            <span>Browse 48 Cards</span>
          </button>
        )}
      </div>
    </div>
  );
};
