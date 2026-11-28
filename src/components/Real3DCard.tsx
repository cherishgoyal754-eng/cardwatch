import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { CreditCard } from '../types';
import { sound } from '../utils/audio';
import {
  RotateCcw,
  Eye,
  EyeOff,
  Move
} from 'lucide-react';

export interface CardVisualAssets {
  front: string;
  back: string;
  hasPreprintedName?: boolean;
  isVertical?: boolean;
}

const prefetchedUrls = new Set<string>();

/**
 * Robustly resolves card asset paths across GitHub Pages (/cardwatch/),
 * Vercel root (/), local development, and direct URLs.
 */
export function resolveCardAsset(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const clean = path.replace(/^\.?\/?(cardwatch\/)?/, '');

  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('github.io') || window.location.pathname.includes('/cardwatch')) {
      return `/cardwatch/${clean}`;
    }
  }

  return `/${clean}`;
}

/**
 * Preloads a card image into the browser HTTP/memory cache without duplicates.
 */
export function prefetchCardAsset(path: string): void {
  if (typeof window === 'undefined' || !path) return;
  const resolved = resolveCardAsset(path);
  if (!resolved || prefetchedUrls.has(resolved)) return;
  prefetchedUrls.add(resolved);

  const img = new Image();
  img.decoding = 'async';
  img.src = resolved;
}

/**
 * Prefetches the front visual of a card (e.g. on pill hover or idle warmup).
 */
export function prefetchCardVisuals(card: { id?: string; name?: string; bank?: string; cardStyle?: string }): void {
  const visuals = getCardVisuals(card);
  prefetchCardAsset(visuals.front);
}

function makeCardVisuals(front: string, back: string, isVertical = false, hasPreprintedName = false): CardVisualAssets {
  return {
    front: resolveCardAsset(front),
    back: resolveCardAsset(back),
    hasPreprintedName,
    isVertical,
  };
}

/**
 * Returns optimized Retina-sharp WebP front and back images for every credit card.
 */
export function getCardVisuals(card: { id?: string; name?: string; bank?: string; cardStyle?: string }): CardVisualAssets {
  const id = card.id?.toLowerCase() || '';
  const bank = card.bank?.toLowerCase() || '';
  const name = card.name?.toLowerCase() || '';

  // 0. slice UPI Credit Card (Vibrant Magenta "super slicer" - Vertical)
  if (id.includes('slice') || name.includes('slice') || bank.includes('slice')) {
    return makeCardVisuals('/cards/slice-upi-front.webp', '/cards/scapia-federal-back.webp', true, false);
  }

  // 1. American Express Platinum / Platinum Travel (Exact Centurion Roman Soldier)
  if (id.includes('amex') || bank.includes('american express') || card.cardStyle === 'amex-platinum') {
    return makeCardVisuals('/cards/amex-platinum-front-clean.webp', '/cards/amex-platinum-back-clean.webp', false, false);
  }

  // 2. IndusInd Bank Tiger Credit Card (Geometric Tiger Wireframe & Real physical card back)
  if (id.includes('indusind') || name.includes('tiger')) {
    return makeCardVisuals('/cards/indusind-tiger-front.webp', '/cards/indusind-tiger-back.webp', true, false);
  }

  // 3. HSBC Live+ (Exact crimson-wine gradient with Visa Signature)
  if (id.includes('hsbc') || name.includes('live')) {
    return makeCardVisuals('/cards/hsbc-live-plus-front.webp', '/cards/hsbc-live-plus-back.webp', true, false);
  }

  // 4. HDFC Infinia Metal Edition (Deep Navy Titanium)
  if (id === 'hdfc-infinia-metal' || name.includes('infinia')) {
    return makeCardVisuals('/cards/hdfc-infinia-front.webp', '/cards/hdfc-millennia-back.webp', false, false);
  }

  // 5. HDFC Regalia Gold (Obsidian & Gold Geometric)
  if (id === 'hdfc-regalia-gold' || name.includes('regalia')) {
    return makeCardVisuals('/cards/hdfc-regalia-gold-front.webp', '/cards/hdfc-millennia-back.webp', false, false);
  }

  // 6. HDFC Diners Club Privilege (Violet/Purple World Map)
  if (id === 'hdfc-diners-privilege' || name.includes('privilege')) {
    return makeCardVisuals('/cards/hdfc-diners-privilege-front.webp', '/cards/hdfc-millennia-back.webp', false, false);
  }

  // 7. Marriott Bonvoy HDFC Bank Diners Club (Matte Black & Gold)
  if (id.includes('marriott') || name.includes('marriott') || name.includes('bonvoy')) {
    return makeCardVisuals('/cards/hdfc-marriott-bonvoy-front.webp', '/cards/hdfc-millennia-back.webp', false, false);
  }

  // 8. HDFC Diners Club Black Metal Edition (Diners Globe Emblem)
  if (id === 'hdfc-diners-black' || name.includes('diners')) {
    return makeCardVisuals('/cards/hdfc-diners-black-front.webp', '/cards/hdfc-millennia-back.webp', false, false);
  }

  // 9. Tata Neu Infinity HDFC RuPay (Purple 'N' Emblem)
  if (id.includes('tata-neu') || name.includes('neu')) {
    return makeCardVisuals('/cards/tata-neu-infinity-front.webp', '/cards/hdfc-millennia-back.webp', false, false);
  }

  // 10. Swiggy HDFC Bank (Vibrant Sunset Gradient)
  if (id.includes('swiggy') || name.includes('swiggy')) {
    return makeCardVisuals('/cards/swiggy-hdfc-front.webp', '/cards/hdfc-millennia-back.webp', false, false);
  }

  // 11. HDFC Millennia (Cobalt Mosaic Pattern)
  if (id.includes('millennia') && !id.includes('idfc')) {
    return makeCardVisuals('/cards/hdfc-millennia-front.webp', '/cards/hdfc-millennia-back.webp', false, false);
  }

  // 12. SBI Card SimplyCLICK (Emerald Green Mandala Pattern)
  if (id.includes('simplyclick') || name.includes('simplyclick') || name.includes('simply click')) {
    return makeCardVisuals('/cards/sbi-simplyclick-front.webp', '/cards/sbi-cashback-back.webp', false, false);
  }

  // 13. BPCL SBI Card OCTANE (Black & Molten Gold Swirl)
  if (id.includes('bpcl') || name.includes('bpcl') || name.includes('octane')) {
    return makeCardVisuals('/cards/sbi-bpcl-octane-front.webp', '/cards/sbi-cashback-back.webp', false, false);
  }

  // 14. SBI Card PRIME (Prismatic Rainbow Mandala on Black)
  if (id.includes('sbi-prime') || (id.includes('prime') && id.includes('sbi')) || name.includes('sbi card prime')) {
    return makeCardVisuals('/cards/sbi-prime-front.webp', '/cards/sbi-cashback-back.webp', false, false);
  }

  // 15. IRCTC SBI Card RuPay Platinum (Vande Bharat Train Artwork)
  if (id.includes('irctc') || name.includes('irctc')) {
    return makeCardVisuals('/cards/sbi-irctc-front.webp', '/cards/sbi-cashback-back.webp', false, false);
  }

  // 16. Air India SBI Card Signature (Air India Flying Sun Logo on Blue)
  if (id.includes('air-india') || name.includes('air india')) {
    return makeCardVisuals('/cards/sbi-air-india-front.webp', '/cards/sbi-cashback-back.webp', false, false);
  }

  // 17. SBI Card SimplySAVE (Blue Mandala Pattern)
  if (id.includes('simplysave') || name.includes('simplysave')) {
    return makeCardVisuals('/cards/sbi-simplysave-front.webp', '/cards/sbi-cashback-back.webp', false, false);
  }

  // 18. SBI Cashback (Purple & Yellow Chevron)
  if (id === 'sbi-cashback' || name.includes('cashback')) {
    return makeCardVisuals('/cards/sbi-cashback-front.webp', '/cards/sbi-cashback-back.webp', false, false);
  }

  // 19. Federal Bank Scapia (Zero Forex Traveler - Vertical Direction)
  if (id.includes('scapia') || name.includes('scapia')) {
    return makeCardVisuals('/cards/scapia-federal-front.webp', '/cards/scapia-federal-back.webp', true, false);
  }

  // 20. Axis Bank Magnus (Magenta Feather on Black)
  if (id === 'axis-magnus' || name.includes('magnus')) {
    return makeCardVisuals('/cards/axis-magnus-front.webp', '/cards/axis-flipkart-back.webp', false, false);
  }

  // 21. Axis Bank ATLAS (Pink Earth Globe)
  if (id.includes('atlas') || name.includes('atlas')) {
    return makeCardVisuals('/cards/axis-atlas-front.webp', '/cards/axis-flipkart-back.webp', false, false);
  }

  // 22. Axis Bank IndianOil RuPay (Speedometer Dial)
  if (id.includes('indianoil') || name.includes('indianoil')) {
    return makeCardVisuals('/cards/axis-indianoil-front.webp', '/cards/axis-flipkart-back.webp', false, false);
  }

  // 23. Flipkart Axis Bank (Dual Ribbon with exact back)
  if (id.includes('flipkart') || name.includes('flipkart')) {
    return makeCardVisuals('/cards/flipkart-axis-front.webp', '/cards/axis-flipkart-back.webp', false, false);
  }

  // 24. Axis Bank ACE (Google Pay Collaboration)
  if (id.includes('axis-ace') || (id.includes('ace') && !id.includes('space'))) {
    return makeCardVisuals('/cards/axis-ace-front.webp', '/cards/axis-flipkart-back.webp', false, false);
  }

  // 25. Airtel Axis Bank (Black & Crimson Metallic Loop)
  if (id.includes('airtel') || name.includes('airtel')) {
    return makeCardVisuals('/cards/axis-airtel-front.webp', '/cards/axis-flipkart-back.webp', false, false);
  }

  // 26. Axis Bank MY ZONE (Burgundy Headphones Artwork)
  if (id.includes('myzone') || id.includes('my-zone') || name.includes('my zone')) {
    return makeCardVisuals('/cards/axis-myzone-front.webp', '/cards/axis-flipkart-back.webp', false, false);
  }

  // 27. Axis Bank NEO (Online Lifestyle & Dining)
  if (id === 'axis-neo' || (id.includes('neo') && id.includes('axis')) || name.includes('neo')) {
    return makeCardVisuals('/cards/axis-neo-front.webp', '/cards/axis-flipkart-back.webp', false, false);
  }

  // 28. Kiwi Axis RuPay
  if (id.includes('kiwi') || id.includes('kwik')) {
    return makeCardVisuals('/cards/kiwi-axis-rupay-front.webp', '/cards/axis-flipkart-back.webp', false, false);
  }

  // 29. ICICI Bank Amazon Pay
  if (id.includes('amazon') || name.includes('amazon')) {
    return makeCardVisuals('/cards/icici-amazon-pay-front.webp', '/cards/icici-amazon-pay-back.webp', false, false);
  }

  // 30. ICICI Bank Coral (Vibrant Orange Gemstone)
  if (id.includes('coral') || name.includes('coral')) {
    return makeCardVisuals('/cards/icici-coral-front.webp', '/cards/icici-amazon-pay-back.webp', false, false);
  }

  // 31. ICICI Bank Rubyx (Dual Gemstone Design)
  if (id.includes('rubyx') || name.includes('rubyx')) {
    return makeCardVisuals('/cards/icici-rubyx-front.webp', '/cards/icici-amazon-pay-back.webp', false, false);
  }

  // 32. ICICI Bank Emeralde Private (Emerald Cut Crystal)
  if (id.includes('emeralde') || name.includes('emeralde')) {
    return makeCardVisuals('/cards/icici-emeralde-private-front.webp', '/cards/icici-amazon-pay-back.webp', false, false);
  }

  // 33. ICICI Bank MakeMyTrip (Travel Skyline on Black)
  if (id.includes('makemytrip') || id.includes('mmt') || name.includes('makemytrip')) {
    return makeCardVisuals('/cards/icici-makemytrip-front.webp', '/cards/icici-amazon-pay-back.webp', false, false);
  }

  // 34. ICICI Bank HPCL Super Saver
  if (id.includes('hpcl') || name.includes('hpcl')) {
    return makeCardVisuals('/cards/icici-coral-front.webp', '/cards/icici-amazon-pay-back.webp', false, false);
  }

  // 35. ICICI Sapphiro
  if (id.includes('sapphiro') || name.includes('sapphiro') || bank.includes('icici')) {
    return makeCardVisuals('/cards/icici-sapphiro-front.webp', '/cards/icici-amazon-pay-back.webp', false, false);
  }

  // 36. IDFC FIRST Millennia
  if (id.includes('idfc') && (id.includes('millennia') || name.includes('millennia'))) {
    return makeCardVisuals('/cards/idfc-first-millennia-front.webp', '/cards/idfc-first-wealth-back.webp', false, false);
  }

  // 37. IDFC FIRST Select
  if (id === 'idfc-first-select' || (id.includes('select') && id.includes('idfc')) || name.includes('first select')) {
    return makeCardVisuals('/cards/idfc-first-select-front.webp', '/cards/idfc-first-wealth-back.webp', false, false);
  }

  // 38. RBL Bank World Safari
  if (id.includes('world-safari') || (id.includes('safari') && id.includes('rbl')) || name.includes('world safari')) {
    return makeCardVisuals('/cards/rbl-world-safari-front.webp', '/cards/axis-flipkart-back.webp', false, true);
  }

  // 39. OneCard Metal (Vertical)
  if (id.includes('onecard') || name.includes('onecard') || name.includes('one card')) {
    return makeCardVisuals('/cards/bobcard-onecard-front.webp', '/cards/axis-flipkart-back.webp', true, true);
  }

  // 40. AU Zenith+ Metal (Vertical)
  if (id.includes('zenith') || name.includes('zenith')) {
    return makeCardVisuals('/cards/au-zenith-plus-front.webp', '/cards/axis-flipkart-back.webp', true, false);
  }

  // 41. ixigo AU Credit Card (Vertical)
  if (id.includes('ixigo') || name.includes('ixigo')) {
    return makeCardVisuals('/cards/au-ixigo-front.webp', '/cards/axis-flipkart-back.webp', true, true);
  }

  // 42. IDFC FIRST Bank Wealth
  if (id.includes('idfc') || bank.includes('idfc')) {
    return makeCardVisuals('/cards/idfc-first-wealth-front.webp', '/cards/idfc-first-wealth-back.webp', false, false);
  }

  // Default fallback
  return makeCardVisuals('/cards/hdfc-infinia-front.webp', '/cards/hdfc-millennia-back.webp', false, false);
}

interface Real3DCardProps {
  card: CreditCard;
  className?: string;
  isInteractive?: boolean;
  autoRotate?: boolean;
  cardholderName?: string;
}

export const Real3DCard: React.FC<Real3DCardProps> = ({
  card,
  className = '',
  isInteractive = true,
  autoRotate = true,
  cardholderName = 'CHERISH GOYAL',
}) => {
  const visuals = getCardVisuals(card);
  const isVertical = visuals.isVertical ?? false;

  const [isFlipped, setIsFlipped] = useState(false);
  const [showMaskedDetails, setShowMaskedDetails] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [shouldLoadBack, setShouldLoadBack] = useState(false);

  const frontImgRef = useRef<HTMLImageElement>(null);

  // Sync instant cache availability whenever the displayed card image changes
  useEffect(() => {
    const img = frontImgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setFrontLoaded(true);
    } else {
      setFrontLoaded(false);
    }
  }, [visuals.front]);

  // Defer back image load slightly until after visible front card finishes rendering or user flips/hovers
  useEffect(() => {
    if (isFlipped) {
      setShouldLoadBack(true);
      return;
    }
    if (!frontLoaded) return;
    const timer = window.setTimeout(() => setShouldLoadBack(true), 250);
    return () => window.clearTimeout(timer);
  }, [frontLoaded, isFlipped]);

  // Motion values for full 3D dragging and tilting
  const dragRotateX = useMotionValue(0);
  const dragRotateY = useMotionValue(0);

  const springX = useSpring(dragRotateX, { stiffness: 180, damping: 20 });
  const springY = useSpring(dragRotateY, { stiffness: 180, damping: 20 });

  const cardRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0, initRotateX: 0, initRotateY: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractive) return;
    setShouldLoadBack(true);
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      initRotateX: dragRotateX.get(),
      initRotateY: dragRotateY.get(),
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isInteractive) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    dragRotateY.set(dragStart.current.initRotateY + deltaX * 0.7);
    dragRotateX.set(dragStart.current.initRotateX - deltaY * 0.7);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handleFlipToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playCardFlip();
    setShouldLoadBack(true);
    setIsFlipped(prev => !prev);
  };

  const handleResetAngle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    dragRotateX.set(0);
    dragRotateY.set(0);
    setIsFlipped(false);
  };

  return (
    <div
      className={`relative flex flex-col items-center select-none ${className}`}
      onPointerEnter={() => setShouldLoadBack(true)}
    >
      {/* 3D Perspective Container */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative cursor-grab active:cursor-grabbing transition-all duration-300 ${
          isVertical
            ? 'w-[220px] sm:w-[250px] md:w-[270px] h-[340px] sm:h-[390px] md:h-[420px]'
            : 'w-[320px] sm:w-[370px] md:w-[400px] h-[200px] sm:h-[230px] md:h-[250px]'
        }`}
        style={{ perspective: 1200 }}
      >
        <motion.div
          animate={
            autoRotate && !isDragging
              ? {
                  y: [-5, 5, -5],
                  rotateZ: [-1, 1, -1],
                  rotateX: isFlipped ? [180, 180, 180] : [-3, 3, -3],
                  rotateY: isFlipped ? [174, 186, 174] : [-10, 10, -10],
                }
              : {
                  y: 0,
                  rotateZ: 0,
                }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            transformStyle: 'preserve-3d',
            rotateX: springX,
            rotateY: isFlipped ? 180 : springY,
          }}
          className="relative w-full h-full rounded-[22px] sm:rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-shadow hover:shadow-[0_25px_65px_rgba(5,150,105,0.4)]"
        >
          {/* 1. FRONT SIDE */}
          <div
            className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[24px] flex flex-col justify-between overflow-hidden border border-white/20 backface-hidden shadow-inner bg-slate-900"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Instant Metallic Shimmer Fallback While Fetching Uncached Bytes */}
            {!frontLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950 flex flex-col justify-between p-5 animate-pulse">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono font-bold text-emerald-400/90 uppercase tracking-widest">
                    {card.bankLogoText || card.bank}
                  </span>
                  <div className="w-8 h-6 rounded bg-amber-300/30" />
                </div>
                <div className="text-xs font-extrabold text-white/75 truncate">{card.name}</div>
              </div>
            )}

            <div className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[24px] overflow-hidden">
              <img
                ref={frontImgRef}
                src={resolveCardAsset(visuals.front)}
                alt={`${card.name} Front`}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onLoad={() => setFrontLoaded(true)}
                onError={(e) => {
                  const target = e.currentTarget;
                  const attempts = Number(target.dataset.attempts || 0);
                  const filename = (visuals.front || '').split('/').pop() || '';
                  if (attempts === 0) {
                    target.dataset.attempts = '1';
                    if (target.src.includes('/cardwatch/')) {
                      target.src = `/cards/${filename}`;
                    } else {
                      target.src = `/cardwatch/cards/${filename}`;
                    }
                  } else if (attempts === 1) {
                    target.dataset.attempts = '2';
                    target.src = `./cards/${filename}`;
                  } else {
                    target.style.display = 'none';
                    setFrontLoaded(true);
                  }
                }}
                className={`w-full h-full object-cover rounded-[22px] sm:rounded-[24px] pointer-events-none select-none transition-opacity duration-200 ${
                  frontLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>

            {/* Embossed Cardholder Name & Digits overlay */}
            <div className="relative z-20 flex justify-between items-end p-5 sm:p-6 h-full pointer-events-none">
              <div className="text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                <p className="font-mono text-[11px] sm:text-xs tracking-[0.2em] font-bold text-slate-100/90 drop-shadow">
                  {showMaskedDetails ? card.cardNumberPreview : '•••• •••• •••• 4821'}
                </p>
                <p className="text-[10px] sm:text-xs font-black tracking-wider uppercase mt-0.5 text-white drop-shadow">
                  {cardholderName}
                </p>
              </div>
            </div>

            {/* Specular Glare Reflection */}
            <motion.div
              animate={{ x: ['-130%', '230%'] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none z-30"
            />
          </div>

          {/* 2. BACK SIDE (Lazy-Mounted Until Hover, Flip, or Front Complete) */}
          <div
            className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[24px] flex flex-col justify-between overflow-hidden border border-white/20 backface-hidden shadow-2xl bg-slate-950"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[24px] overflow-hidden">
              {shouldLoadBack && (
                <img
                  src={resolveCardAsset(visuals.back)}
                  alt={`${card.name} Back`}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const attempts = Number(target.dataset.attempts || 0);
                    const filename = (visuals.back || '').split('/').pop() || '';
                    if (attempts === 0) {
                      target.dataset.attempts = '1';
                      if (target.src.includes('/cardwatch/')) {
                        target.src = `/cards/${filename}`;
                      } else {
                        target.src = `/cardwatch/cards/${filename}`;
                      }
                    } else if (attempts === 1) {
                      target.dataset.attempts = '2';
                      target.src = `./cards/${filename}`;
                    } else {
                      target.style.display = 'none';
                    }
                  }}
                  className="w-full h-full object-cover rounded-[22px] sm:rounded-[24px] pointer-events-none select-none"
                />
              )}
            </div>

            <div className="relative z-20 flex justify-between items-center px-6 pt-24 pointer-events-none">
              <div className="font-serif italic text-slate-800 text-xs font-bold drop-shadow bg-white/70 px-2 py-0.5 rounded">
                {cardholderName}
              </div>
              <div className="font-mono text-xs font-black text-slate-900 bg-white/90 px-1.5 py-0.5 rounded shadow">
                {showMaskedDetails ? '•••' : '821'}
              </div>
            </div>

            <motion.div
              animate={{ x: ['-130%', '230%'] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none z-30"
            />
          </div>
        </motion.div>
      </div>

      {/* Floating 3D Interaction Toolbar */}
      {isInteractive && (
        <div className="mt-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={handleFlipToggle}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-900 text-[11px] font-bold border border-emerald-300 shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            title="Flip to view card back"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isFlipped ? 'View Front Side' : 'Flip Card 180°'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMaskedDetails(!showMaskedDetails)}
            className="p-1.5 rounded-full bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-emerald-200 shadow-sm transition-transform active:scale-90"
            title={showMaskedDetails ? 'Show Card Digits' : 'Mask Card Digits'}
          >
            {showMaskedDetails ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
          </button>

          <button
            type="button"
            onClick={handleResetAngle}
            className="p-1.5 rounded-full bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-emerald-200 shadow-sm transition-transform active:scale-90"
            title="Reset 3D Angle"
          >
            <Move className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline-block ml-1">
            Drag in 3D
          </span>
        </div>
      )}
    </div>
  );
};
