import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { sound } from '../utils/audio';
import { ArrowDown, ShieldCheck, Sparkles, Move, Eye, Lock } from 'lucide-react';

interface FranklinAnimatedHeroProps {
  onScrollToSignIn?: () => void;
  onExploreCards?: () => void;
}

export const FranklinAnimatedHero: React.FC<FranklinAnimatedHeroProps> = ({
  onScrollToSignIn,
  onExploreCards,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 190, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['10%', '90%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['10%', '90%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[480px] h-[520px] sm:h-[590px] flex flex-col items-center justify-center select-none perspective-[1200px]"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic Ambient Banknote Aura */}
      <motion.div
        animate={{
          scale: isHovered ? 1.06 : [1, 1.04, 1],
          opacity: isHovered ? 0.5 : [0.28, 0.4, 0.28],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[340px] sm:w-[380px] h-[460px] sm:h-[500px] bg-gradient-to-tr from-emerald-600/30 via-slate-700/25 to-teal-400/25 rounded-[36px] blur-3xl -z-10 pointer-events-none"
      />

      {/* Interactive 3D Animated Currency Poster Card */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: isHovered ? -3 : [-7, 7, -7],
          rotateZ: isHovered ? 0 : [-0.8, 0.8, -0.8],
        }}
        transition={{
          y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
          rotateZ: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative w-[310px] sm:w-[350px] h-[460px] sm:h-[510px] rounded-[30px] p-[2.5px] bg-gradient-to-b from-neutral-800 via-neutral-900 to-black shadow-[0_30px_70px_-15px_rgba(0,0,0,0.45)] border border-neutral-700/80 cursor-grab active:cursor-grabbing transition-shadow"
      >
        {/* Inner Card Container */}
        <div className="relative w-full h-full rounded-[27px] overflow-hidden bg-[#e6e5df] flex flex-col justify-between">
          
          {/* Main Franklin Torn Image */}
          <img
            src="/franklin-animated-hero.jpg"
            alt="Benjamin Franklin $100 Torn Banknote Currency Radar"
            className="absolute inset-0 w-full h-full object-cover filter contrast-[1.08] brightness-[0.98] pointer-events-none"
            draggable={false}
          />

          {/* Living Scanning Radar Beam (Continuous Subtle Animated Sheen) */}
          <motion.div
            animate={{
              top: ['-100%', '200%'],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-emerald-400/18 to-transparent pointer-events-none z-10"
            style={{ mixBlendMode: 'overlay' }}
          />

          {/* Specular Glare reacting to mouse cursor */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `radial-gradient(circle 340px at ${glareX} ${glareY}, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Subtle Currency Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45 pointer-events-none z-10" />

          {/* TOP PILL BADGE: Live Currency Radar */}
          <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase">
                C. FRANKLIN • $100 RADAR
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-emerald-400 flex items-center justify-center shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* CENTER FLOATING INTERACTION PILL */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-20 self-center px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-neutral-300 shadow-xl flex items-center gap-2 text-xs font-bold text-neutral-900"
          >
            <Move className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-800">
              Interactive 3D • Move & Tilt
            </span>
          </motion.div>

          {/* BOTTOM METADATA & SCROLL CTA */}
          <div className="relative z-20 p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-6 space-y-2.5">
            <div className="flex items-center justify-between text-white/95">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Cardwatch Reserve
                </div>
                <div className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5 font-serif">
                  <span>Knowledge Pays Interest</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                </div>
              </div>

              <div className="text-right">
                <div className="text-[9px] font-mono text-neutral-400">SERIES 2026</div>
                <div className="text-[11px] font-mono font-bold text-emerald-400">VERIFIED RADAR</div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Quick Scroll Down CTA */}
            {onScrollToSignIn && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  sound.playClick();
                  onScrollToSignIn();
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md group"
              >
                <span>Scroll Down to Sign In</span>
                <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>

        </div>
      </motion.div>

      {/* Floating Indicator Below */}
      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="font-mono text-[11px]">Hover to Tilt 3D • Scroll for Sign In</span>
      </div>
    </div>
  );
};
