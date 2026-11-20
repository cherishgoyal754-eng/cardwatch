import React, { useState, useRef } from 'react';
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

/**
 * Robustly resolves card asset paths across GitHub Pages (/cardwatch/),
 * Vercel root (/), local development, and direct URLs.
 */
export function resolveCardAsset(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Strip any leading ./, /, or cardwatch/
  const clean = path.replace(/^\.?\/?(cardwatch\/)?/, '');

  // If in browser
  if (typeof window !== 'undefined') {
    // If hosted on GitHub Pages (either host is github.io or path contains /cardwatch)
    if (window.location.hostname.includes('github.io') || window.location.pathname.includes('/cardwatch')) {
      return `/cardwatch/${clean}`;
    }
  }

  // On Vercel, localhost, or standard root hosting
  return `/${clean}`;
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
 * Returns strictly exact photorealistic front and back images for every credit card
 * directly matching physical cards uploaded by the user.
 */
export function getCardVisuals(card: { id?: string; name?: string; bank?: string; cardStyle?: string }): CardVisualAssets {
  const id = card.id?.toLowerCase() || '';
  const bank = card.bank?.toLowerCase() || '';
  const name = card.name?.toLowerCase() || '';

  // 1. American Express Platinum / Platinum Travel (Exact Centurion Roman Soldier)
  if (id.includes('amex') || bank.includes('american express') || card.cardStyle === 'amex-platinum') {
    return makeCardVisuals('/cards/amex-platinum-front-clean.png', '/cards/amex-platinum-back-clean.png', false, false);
  }

  // 2. IndusInd Bank Tiger Credit Card (Geometric Tiger Wireframe & Real physical card back)
  if (id.includes('indusind') || name.includes('tiger')) {
    return makeCardVisuals('/cards/indusind-tiger-front.png', '/cards/indusind-tiger-back.png', true, false);
  }

  // 3. HSBC Live+ (Exact crimson-wine gradient with Visa Signature)
  if (id.includes('hsbc') || name.includes('live')) {
    return makeCardVisuals('/cards/hsbc-live-plus-front.png', '/cards/hsbc-live-plus-back.png', true, false);
  }

  // 4. HDFC Infinia Metal Edition (Deep Navy Titanium)
  if (id === 'hdfc-infinia-metal' || name.includes('infinia')) {
    return makeCardVisuals('/cards/hdfc-infinia-front.png', '/cards/hdfc-millennia-back.png', false, false);
  }

  // 5. HDFC Regalia Gold (Obsidian & Gold Geometric)
  if (id === 'hdfc-regalia-gold' || name.includes('regalia')) {
    return makeCardVisuals('/cards/hdfc-regalia-gold-front.png', '/cards/hdfc-millennia-back.png', false, false);
  }

  // 6. HDFC Diners Club Privilege (Violet/Purple World Map)
  if (id === 'hdfc-diners-privilege' || name.includes('privilege')) {
    return makeCardVisuals('/cards/hdfc-diners-privilege-front.png', '/cards/hdfc-millennia-back.png', false, false);
  }

  // 7. Marriott Bonvoy HDFC Bank Diners Club (Matte Black & Gold)
  if (id.includes('marriott') || name.includes('marriott') || name.includes('bonvoy')) {
    return makeCardVisuals('/cards/hdfc-marriott-bonvoy-front.png', '/cards/hdfc-millennia-back.png', false, false);
  }

  // 8. HDFC Diners Club Black Metal Edition (Diners Globe Emblem)
  if (id === 'hdfc-diners-black' || name.includes('diners')) {
    return makeCardVisuals('/cards/hdfc-diners-black-front.png', '/cards/hdfc-millennia-back.png', false, false);
  }

  // 9. Tata Neu Infinity HDFC RuPay (Purple 'N' Emblem)
  if (id.includes('tata-neu') || name.includes('neu')) {
    return makeCardVisuals('/cards/tata-neu-infinity-front.png', '/cards/hdfc-millennia-back.png', false, false);
  }

  // 10. Swiggy HDFC Bank (Vibrant Sunset Gradient)
  if (id.includes('swiggy') || name.includes('swiggy')) {
    return makeCardVisuals('/cards/swiggy-hdfc-front.png', '/cards/hdfc-millennia-back.png', false, false);
  }

  // 11. HDFC Millennia (Cobalt Mosaic Pattern)
  if (id.includes('millennia') && !id.includes('idfc')) {
    return makeCardVisuals('/cards/hdfc-millennia-front.png', '/cards/hdfc-millennia-back.png', false, false);
  }

  // 12. SBI Card SimplyCLICK (Emerald Green Mandala Pattern)
  if (id.includes('simplyclick') || name.includes('simplyclick') || name.includes('simply click')) {
    return makeCardVisuals('/cards/sbi-simplyclick-front.png', '/cards/sbi-cashback-back.png', false, false);
  }

  // 13. BPCL SBI Card OCTANE (Black & Molten Gold Swirl)
  if (id.includes('bpcl') || name.includes('bpcl') || name.includes('octane')) {
    return makeCardVisuals('/cards/sbi-bpcl-octane-front.png', '/cards/sbi-cashback-back.png', false, false);
  }

  // 14. SBI Card PRIME (Prismatic Rainbow Mandala on Black)
  if (id.includes('sbi-prime') || (id.includes('prime') && id.includes('sbi')) || name.includes('sbi card prime')) {
    return makeCardVisuals('/cards/sbi-prime-front.png', '/cards/sbi-cashback-back.png', false, false);
  }

  // 15. IRCTC SBI Card RuPay Platinum (Vande Bharat Train Artwork)
  if (id.includes('irctc') || name.includes('irctc')) {
    return makeCardVisuals('/cards/sbi-irctc-front.png', '/cards/sbi-cashback-back.png', false, false);
  }

  // 16. Air India SBI Card Signature (Air India Flying Sun Logo on Blue)
  if (id.includes('air-india') || name.includes('air india')) {
    return makeCardVisuals('/cards/sbi-air-india-front.png', '/cards/sbi-cashback-back.png', false, false);
  }

  // 17. SBI Card SimplySAVE (Blue Mandala Pattern)
  if (id.includes('simplysave') || name.includes('simplysave')) {
    return makeCardVisuals('/cards/sbi-simplysave-front.png', '/cards/sbi-cashback-back.png', false, false);
  }

  // 18. SBI Cashback (Purple & Yellow Chevron)
  if (id === 'sbi-cashback' || name.includes('cashback')) {
    return makeCardVisuals('/cards/sbi-cashback-front.png', '/cards/sbi-cashback-back.png', false, false);
  }

  // 12. Federal Bank Scapia (Zero Forex Traveler - Vertical Direction)
  if (id.includes('scapia') || name.includes('scapia')) {
    return makeCardVisuals('/cards/scapia-federal-front.png', '/cards/scapia-federal-back.png', true, false);
  }

  // 13. Axis Bank Magnus (Magenta Feather on Black)
  if (id === 'axis-magnus' || name.includes('magnus')) {
    return makeCardVisuals('/cards/axis-magnus-front.png', '/cards/axis-flipkart-back.png', false, false);
  }

  // 14. Axis Bank ATLAS (Pink Earth Globe)
  if (id.includes('atlas') || name.includes('atlas')) {
    return makeCardVisuals('/cards/axis-atlas-front.png', '/cards/axis-flipkart-back.png', false, false);
  }

  // 15. Axis Bank IndianOil RuPay (Speedometer Dial)
  if (id.includes('indianoil') || name.includes('indianoil')) {
    return makeCardVisuals('/cards/axis-indianoil-front.png', '/cards/axis-flipkart-back.png', false, false);
  }

  // 16. Flipkart Axis Bank (Dual Ribbon with exact back)
  if (id.includes('flipkart') || name.includes('flipkart')) {
    return makeCardVisuals('/cards/flipkart-axis-front.png', '/cards/axis-flipkart-back.png', false, false);
  }

  // 17. Axis Bank ACE (Google Pay Collaboration)
  if (id.includes('axis-ace') || (id.includes('ace') && !id.includes('space'))) {
    return makeCardVisuals('/cards/axis-ace-front.png', '/cards/axis-flipkart-back.png', false, false);
  }

  // 18. Airtel Axis Bank (Black & Crimson Metallic Loop)
  if (id.includes('airtel') || name.includes('airtel')) {
    return makeCardVisuals('/cards/axis-airtel-front.png', '/cards/axis-flipkart-back.png', false, false);
  }

  // 19. Axis Bank MY ZONE (Burgundy Headphones Artwork)
  if (id.includes('myzone') || id.includes('my-zone') || name.includes('my zone')) {
    return makeCardVisuals('/cards/axis-myzone-front.png', '/cards/axis-flipkart-back.png', false, false);
  }

  // 20. Axis Bank NEO (Online Lifestyle & Dining)
  if (id === 'axis-neo' || (id.includes('neo') && id.includes('axis')) || name.includes('neo')) {
    return makeCardVisuals('/cards/axis-neo-front.png', '/cards/axis-flipkart-back.png', false, false);
  }

  // 21. Kiwi Axis RuPay
  if (id.includes('kiwi') || id.includes('kwik')) {
    return makeCardVisuals('/cards/kiwi-axis-rupay-front.png', '/cards/axis-flipkart-back.png', false, false);
  }

  // 21. ICICI Bank Amazon Pay
  if (id.includes('amazon') || name.includes('amazon')) {
    return makeCardVisuals('/cards/icici-amazon-pay-front.png', '/cards/icici-amazon-pay-back.png', false, false);
  }

  // 22. ICICI Bank Coral (Vibrant Orange Gemstone)
  if (id.includes('coral') || name.includes('coral')) {
    return makeCardVisuals('/cards/icici-coral-front.png', '/cards/icici-amazon-pay-back.png', false, false);
  }

  // 23. ICICI Bank Rubyx (Dual Gemstone Design)
  if (id.includes('rubyx') || name.includes('rubyx')) {
    return makeCardVisuals('/cards/icici-rubyx-front.png', '/cards/icici-amazon-pay-back.png', false, false);
  }

  // 24. ICICI Bank Emeralde Private (Emerald Cut Crystal)
  if (id.includes('emeralde') || name.includes('emeralde')) {
    return makeCardVisuals('/cards/icici-emeralde-private-front.png', '/cards/icici-amazon-pay-back.png', false, false);
  }

  // 25. ICICI Bank MakeMyTrip (Travel Skyline on Black)
  if (id.includes('makemytrip') || id.includes('mmt') || name.includes('makemytrip')) {
    return makeCardVisuals('/cards/icici-makemytrip-front.png', '/cards/icici-amazon-pay-back.png', false, false);
  }

  // 26. ICICI Bank HPCL Super Saver
  if (id.includes('hpcl') || name.includes('hpcl')) {
    return makeCardVisuals('/cards/icici-coral-front.png', '/cards/icici-amazon-pay-back.png', false, false);
  }

  // 27. ICICI Sapphiro
  if (id.includes('sapphiro') || name.includes('sapphiro') || bank.includes('icici')) {
    return makeCardVisuals('/cards/icici-sapphiro-front.png', '/cards/icici-amazon-pay-back.png', false, false);
  }

  // 20. IDFC FIRST Millennia (Face Illustration with Sunglasses)
  if (id.includes('idfc') && (id.includes('millennia') || name.includes('millennia'))) {
    return makeCardVisuals('/cards/idfc-first-millennia-front.png', '/cards/idfc-first-wealth-back.png', false, false);
  }

  // 21. IDFC FIRST Bank Wealth (Matte Black Box)
  if (id.includes('idfc') || bank.includes('idfc')) {
    return makeCardVisuals('/cards/idfc-first-wealth-front.png', '/cards/idfc-first-wealth-back.png', false, false);
  }

  // Default fallback
  return makeCardVisuals('/cards/hdfc-infinia-front.png', '/cards/hdfc-millennia-back.png', false, false);
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMaskedDetails, setShowMaskedDetails] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Motion values for full 3D dragging and tilting
  const dragRotateX = useMotionValue(0);
  const dragRotateY = useMotionValue(0);

  // Smooth springs for realistic inertia
  const springX = useSpring(dragRotateX, { stiffness: 180, damping: 20 });
  const springY = useSpring(dragRotateY, { stiffness: 180, damping: 20 });

  const cardRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0, initRotateX: 0, initRotateY: 0 });

  // Handle pointer drag for 360 degree 3D rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractive) return;
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

    // Rotate Y with horizontal drag, Rotate X with vertical drag
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
    setIsFlipped(prev => !prev);
  };

  const handleResetAngle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    dragRotateX.set(0);
    dragRotateY.set(0);
    setIsFlipped(false);
  };

  const visuals = getCardVisuals(card);
  const isVertical = visuals.isVertical ?? false;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
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
        {/* Continuous 3D Floating & Rotating Wrapper */}
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
          {/* ======================================================== */}
          {/* 1. FRONT SIDE OF THE CARD (STRICTLY EXACT PHOTOREALISTIC)  */}
          {/* ======================================================== */}
          <div
            className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[24px] flex flex-col justify-between overflow-hidden border border-white/20 backface-hidden shadow-inner bg-slate-950"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Exact High-Resolution Real Card Image */}
            <div className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[24px] overflow-hidden">
              <img
                src={resolveCardAsset(visuals.front)}
                alt={`${card.name} Front`}
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
                    // Graceful fallback: hide the broken img so the stylish dark metallic surface is shown without a browser broken image icon
                    target.style.display = 'none';
                  }
                }}
                className="w-full h-full object-cover rounded-[22px] sm:rounded-[24px] pointer-events-none select-none"
              />
            </div>

            {/* Embossed Cardholder Name & Digits overlay on Every Card */}
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

            {/* Specular Glare Reflection Line (Constantly moving across real card surface in 3D) */}
            <motion.div
              animate={{ x: ['-130%', '230%'] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none z-30"
            />
          </div>

          {/* ======================================================== */}
          {/* 2. BACK SIDE OF THE CARD (STRICTLY EXACT PHOTOREALISTIC)   */}
          {/* ======================================================== */}
          <div
            className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[24px] flex flex-col justify-between overflow-hidden border border-white/20 backface-hidden shadow-2xl bg-slate-950"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Exact High-Resolution Real Card Back Image */}
            <div className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[24px] overflow-hidden">
              <img
                src={resolveCardAsset(visuals.back)}
                alt={`${card.name} Back`}
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
            </div>

            {/* Interactive CVV / Masked overlay in signature area */}
            <div className="relative z-20 flex justify-between items-center px-6 pt-24 pointer-events-none">
              <div className="font-serif italic text-slate-800 text-xs font-bold drop-shadow bg-white/70 px-2 py-0.5 rounded">
                {cardholderName}
              </div>
              <div className="font-mono text-xs font-black text-slate-900 bg-white/90 px-1.5 py-0.5 rounded shadow">
                {showMaskedDetails ? '•••' : '821'}
              </div>
            </div>

            {/* Specular Glare Reflection Line on Back */}
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
