import React, { useEffect, useRef, useState } from 'react';
import { Wifi, Sparkles } from 'lucide-react';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hoverType, setHoverType] = useState<'default' | 'clickable' | 'card' | 'input'>('default');
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  // Raw mouse coordinates (instant)
  const mousePos = useRef({ x: -100, y: -100 });
  // Trailing smoothed coordinates
  const trailingPos = useRef({ x: -100, y: -100 });

  const dotRef = useRef<HTMLDivElement>(null);
  const trailingRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable custom cursor on devices with a fine mouse/pointer (not touchscreens)
    const isTouch =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(hover: none)').matches ||
        'ontouchstart' in window);

    if (isTouch) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!isVisible) {
        setIsVisible(true);
        trailingPos.current = { x: e.clientX, y: e.clientY };
      }

      // Detect what element is being hovered
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      const isCard =
        target.closest('[data-cursor="card"]') !== null ||
        target.closest('.real-3d-card') !== null ||
        target.closest('[data-card-id]') !== null ||
        target.closest('.card-gradient-aurum') !== null ||
        target.closest('.card-gradient-infinia') !== null ||
        target.closest('.card-gradient-white') !== null ||
        target.closest('.card-gradient-scapia') !== null;

      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer') ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.closest('[role="button"]') !== null ||
        target.closest('.cursor-pointer') !== null;

      if (isInput) {
        setHoverType('input');
      } else if (isCard) {
        setHoverType('card');
      } else if (isClickable) {
        setHoverType('clickable');
      } else {
        setHoverType('default');
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      // Spawn a contactless NFC shockwave ripple at click coordinates
      const newRipple: ClickRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };

      setRipples(prev => [...prev.slice(-3), newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      setIsVisible(true);
      mousePos.current = { x: e.clientX, y: e.clientY };
      trailingPos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth physics lerp loop (60-120fps)
    const animate = () => {
      // Direct position for the precision dot & EMV chip
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      // Physics trailing smoothing for the magnetic NFC field
      const lerpFactor = 0.18;
      trailingPos.current.x += (mousePos.current.x - trailingPos.current.x) * lerpFactor;
      trailingPos.current.y += (mousePos.current.y - trailingPos.current.y) * lerpFactor;

      if (trailingRef.current) {
        trailingRef.current.style.transform = `translate3d(${trailingPos.current.x}px, ${trailingPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none">
      {/* 1. CONTACTLESS TAP CLICK RIPPLES (NFC Terminal Wave Burst) */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="pointer-events-none absolute"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Outer NFC wave expanding */}
          <div className="absolute -inset-6 rounded-full border-2 border-emerald-400/80 animate-ping opacity-75" />
          {/* Inner gold EMV pulse wave */}
          <div className="w-12 h-12 rounded-full border border-amber-300 bg-emerald-400/10 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse" />
        </div>
      ))}

      {/* 2. TRAILING LIQUID MAGNETIC AURA (Contactless Field) */}
      <div
        ref={trailingRef}
        className={`pointer-events-none absolute top-0 left-0 transition-opacity duration-300 will-change-transform ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`relative -top-1/2 -left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center ${
            hoverType === 'input'
              ? 'w-1 h-6 rounded-full bg-emerald-500 shadow-[0_0_12px_#10B981]'
              : hoverType === 'card'
              ? 'w-20 h-14 rounded-2xl border-2 border-amber-300/80 bg-emerald-950/20 shadow-[0_0_30px_rgba(245,158,11,0.35)] backdrop-blur-[1px]'
              : hoverType === 'clickable'
              ? 'w-14 h-14 rounded-full border-2 border-emerald-400 bg-emerald-400/15 shadow-[0_0_25px_rgba(16,185,129,0.45)] scale-110'
              : 'w-10 h-10 rounded-full border border-emerald-400/40 bg-emerald-500/[0.04] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
          }`}
        >
          {/* Subtle rotating crosshair orbit ticks when at rest */}
          {hoverType === 'default' && (
            <div className="absolute inset-0 rounded-full animate-spin [animation-duration:14s] pointer-events-none opacity-60">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-emerald-400 rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-emerald-400 rounded-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-emerald-400 rounded-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-emerald-400 rounded-full" />
            </div>
          )}

          {/* Interactive Floating Badge when hovering a 3D Card */}
          {hoverType === 'card' && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-950/90 text-emerald-300 border border-emerald-400/70 text-[9px] font-mono font-black tracking-widest shadow-xl flex items-center gap-1 whitespace-nowrap animate-bounce">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>TAP • 3D</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. PRIMARY POINTER: REALISTIC MINI GOLD EMV CHIP & PRECISION RETICLE */}
      <div
        ref={dotRef}
        className={`pointer-events-none absolute top-0 left-0 transition-opacity duration-200 will-change-transform ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`relative transition-transform duration-150 ease-out ${
            isClicking ? 'scale-75' : hoverType === 'clickable' ? 'scale-115' : 'scale-100'
          }`}
        >
          {/* Precision Emerald Laser Aiming Core at exact (x, y) */}
          <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white/90 shadow-[0_0_10px_#10B981] z-30" />

          {/* Realistic Miniature Gold EMV Credit Card Chip (Offset for ergonomic visibility) */}
          {hoverType !== 'input' && (
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1 group">
              {/* Miniature Photorealistic Gold EMV Chip */}
              <div className="relative w-4 h-3 rounded-[3px] bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 shadow-md p-[1.5px] flex flex-col justify-between overflow-hidden">
                {/* Circuit Grid Etching */}
                <div className="w-full h-px bg-amber-950/50" />
                <div className="w-full h-px bg-amber-950/50" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-amber-950/50" />
                {/* Micro center contact pin */}
                <div className="absolute inset-y-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500/80 border border-amber-900/40" />
              </div>

              {/* Contactless Radio / RFID Wave Badge */}
              <div
                className={`flex items-center transition-all ${
                  hoverType === 'clickable' || hoverType === 'card'
                    ? 'text-emerald-400 scale-110 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                    : 'text-emerald-600/70'
                }`}
              >
                <Wifi className="w-2.5 h-2.5 rotate-90" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
