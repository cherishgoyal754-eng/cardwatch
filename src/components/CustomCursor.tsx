import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../utils/audio';

interface ClickImpact {
  id: number;
  x: number;
  y: number;
}

// 8 radial particle directions (45° apart) for the click spark burst
const SPARK_DIRECTIONS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i * 45 * Math.PI) / 180;
  const distance = 42;
  return {
    dx: `${Math.round(Math.cos(angle) * distance)}px`,
    dy: `${Math.round(Math.sin(angle) * distance)}px`,
    color: i % 2 === 0 ? '#34D399' : '#FBBF24', // alternating emerald & gold
  };
});

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [clicks, setClicks] = useState<ClickImpact[]>([]);

  // Instant mouse position
  const mousePos = useRef({ x: -100, y: -100 });
  // Physics smoothed trailing position
  const trailingPos = useRef({ x: -100, y: -100 });

  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices (ignore mobile / touch devices)
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

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const overInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      const overInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer') ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.closest('[role="button"]') !== null ||
        target.closest('.cursor-pointer') !== null ||
        target.closest('.real-3d-card') !== null ||
        target.closest('[data-card-id]') !== null;

      setIsInput(overInput);
      setIsHovering(overInteractive && !overInput);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      // Play subtle metallic fintech click audio
      try {
        sound.playClick();
      } catch {
        // audio muted or blocked
      }

      // Add a high-impact shockwave ripple + particle burst at the exact click point
      const clickId = Date.now() + Math.random();
      const newClick: ClickImpact = {
        id: clickId,
        x: e.clientX,
        y: e.clientY,
      };

      setClicks(prev => [...prev.slice(-4), newClick]);

      setTimeout(() => {
        setClicks(prev => prev.filter(c => c.id !== clickId));
      }, 550);
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

    // Smooth physics lerp animation loop (60-120fps)
    const animate = () => {
      // Instant precision dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      // Smooth liquid trailing halo
      const lerpFactor = 0.22;
      trailingPos.current.x += (mousePos.current.x - trailingPos.current.x) * lerpFactor;
      trailingPos.current.y += (mousePos.current.y - trailingPos.current.y) * lerpFactor;

      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${trailingPos.current.x}px, ${trailingPos.current.y}px, 0)`;
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
      {/* 1. HIGH-IMPACT CLICK SHOCKWAVES & SPARK BURST */}
      {clicks.map(click => (
        <div
          key={click.id}
          className="pointer-events-none absolute"
          style={{
            left: click.x,
            top: click.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Outer Emerald Shockwave Ring */}
          <div className="absolute -inset-8 rounded-full border-2 border-emerald-400 bg-emerald-400/10 shadow-[0_0_25px_#10B981] animate-click-outer" />

          {/* Inner Gold Flash Ring */}
          <div className="absolute -inset-4 rounded-full border-2 border-amber-300 bg-amber-400/20 shadow-[0_0_15px_#F59E0B] animate-click-inner" />

          {/* High-Impact Center Flash Dot */}
          <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#ffffff] animate-ping" />

          {/* 8 Radiating FinTech Spark Particles */}
          {SPARK_DIRECTIONS.map((dir, idx) => (
            <div
              key={idx}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full animate-click-spark"
              style={
                {
                  '--dx': dir.dx,
                  '--dy': dir.dy,
                  backgroundColor: dir.color,
                  boxShadow: `0 0 8px ${dir.color}`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}

      {/* 2. LIQUID TRAILING HALO (Clean, sleek, smooth, and expands softly on clickable hover) */}
      <div
        ref={haloRef}
        className={`pointer-events-none absolute top-0 left-0 transition-opacity duration-300 will-change-transform ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ease-out flex items-center justify-center ${
            isInput
              ? 'w-1 h-6 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]'
              : isClicking
              ? 'w-6 h-6 border-2 border-emerald-400 bg-emerald-400/30 scale-75'
              : isHovering
              ? 'w-12 h-12 border-2 border-emerald-400 bg-emerald-400/15 shadow-[0_0_20px_rgba(16,185,129,0.35)] scale-110'
              : 'w-8 h-8 border border-emerald-500/40 bg-emerald-500/[0.04] shadow-[0_0_12px_rgba(16,185,129,0.12)]'
          }`}
        />
      </div>

      {/* 3. CENTER PRECISION DOT (Minimal, sharp, emerald green) */}
      <div
        ref={dotRef}
        className={`pointer-events-none absolute top-0 left-0 transition-opacity duration-200 will-change-transform ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150 ease-out flex items-center justify-center ${
            isInput
              ? 'opacity-0' // hide dot inside text inputs so caret is clean
              : isClicking
              ? 'w-2 h-2 bg-white ring-2 ring-emerald-400 scale-75 shadow-[0_0_12px_#ffffff]'
              : isHovering
              ? 'w-2.5 h-2.5 bg-emerald-400 ring-2 ring-white scale-110 shadow-[0_0_12px_#10B981]'
              : 'w-2 h-2 bg-emerald-500 ring-1.5 ring-white shadow-[0_0_8px_#10B981]'
          }`}
        />
      </div>
    </div>
  );
};
