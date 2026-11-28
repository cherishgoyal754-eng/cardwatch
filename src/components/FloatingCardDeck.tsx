import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../utils/audio';
import { Real3DCard, prefetchCardVisuals } from './Real3DCard';
import { useCardData } from '../context/CardDataContext';
import { ArrowRight } from 'lucide-react';

interface FloatingCardDeckProps {
  onSelectCard?: (cardId: string) => void;
  onExploreChanges?: () => void;
}

export const FloatingCardDeck: React.FC<FloatingCardDeckProps> = ({
  onSelectCard,
  onExploreChanges
}) => {
  const { cards } = useCardData();
  const [activeCardId, setActiveCardId] = useState<string>('amex-platinum');

  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];

  const showcaseCards = [
    { id: 'amex-platinum', label: 'Amex Platinum' },
    { id: 'slice-upi', label: 'slice UPI' },
    { id: 'scapia-federal', label: 'Scapia Federal (Vertical)' },
    { id: 'flipkart-axis', label: 'Flipkart Axis' },
    { id: 'hdfc-infinia-metal', label: 'HDFC Infinia' },
    { id: 'indusind-tiger', label: 'IndusInd Tiger' },
    { id: 'sbi-cashback', label: 'SBI Cashback' },
    { id: 'sbi-simplysave', label: 'SBI SimplySAVE' },
    { id: 'tata-neu-infinity', label: 'Tata Neu' },
    { id: 'swiggy-hdfc', label: 'Swiggy HDFC' },
    { id: 'hsbc-live-plus', label: 'HSBC Live+' },
    { id: 'idfc-first-millennia', label: 'IDFC Millennia' },
    { id: 'axis-indianoil', label: 'IndianOil Axis RuPay' },
    { id: 'axis-atlas', label: 'Axis ATLAS' },
    { id: 'hdfc-diners-black', label: 'Diners Black' },
  ];

  // Background idle prefetch for showcase cards (total ~320 KB across all 15 WebPs!)
  useEffect(() => {
    const warmAll = () => {
      showcaseCards.forEach(sc => {
        const card = cards.find(c => c.id === sc.id);
        if (card) prefetchCardVisuals(card);
      });
    };

    if (typeof window === 'undefined') return;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(warmAll, { timeout: 1200 });
      return () => win.cancelIdleCallback?.(id);
    }
    const timer = globalThis.setTimeout(warmAll, 400);
    return () => globalThis.clearTimeout(timer);
  }, [cards]);

  const toggleDeck = () => {
    sound.playCardFlip();
    setActiveCardId(prev => (prev === 'amex-platinum' ? 'hdfc-diners-black' : 'amex-platinum'));
  };

  return (
    <div className="relative w-full max-w-[560px] h-[420px] sm:h-[480px] flex flex-col items-center justify-center select-none">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-300/30 via-teal-200/20 to-emerald-400/25 rounded-full blur-3xl -z-10 animate-pulse-emerald pointer-events-none" />

      {/* Floating Alert Pill */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 sm:top-2 -right-2 sm:right-2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border-2 border-emerald-500 text-slate-900 text-xs font-bold shadow-xl cursor-pointer hover:scale-105 transition-transform"
        onClick={() => {
          sound.playAlert();
          if (onExploreChanges) onExploreChanges();
        }}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-80" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
        </span>
        <span className="font-extrabold text-emerald-700 tracking-wide">Live Devaluation:</span>
        <span className="text-slate-800 font-mono text-[11px]">HDFC Lounge 3 → 2</span>
        <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
      </motion.div>

      {/* Real-Life 3D Animated Card Component */}
      <div className="relative z-20 flex flex-col items-center">
        <Real3DCard
          card={activeCard}
          cardholderName="CHERISH GOYAL"
          autoRotate={true}
          isInteractive={true}
        />

        {/* Switch Card Pill Switcher */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
          {showcaseCards.map(sc => (
            <button
              key={sc.id}
              onMouseEnter={() => {
                const c = cards.find(item => item.id === sc.id);
                if (c) prefetchCardVisuals(c);
              }}
              onFocus={() => {
                const c = cards.find(item => item.id === sc.id);
                if (c) prefetchCardVisuals(c);
              }}
              onClick={() => {
                sound.playCardFlip();
                setActiveCardId(sc.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCardId === sc.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white border border-emerald-200 text-slate-700 hover:bg-emerald-50'
              }`}
            >
              {sc.label}
            </button>
          ))}

          {onSelectCard && (
            <button
              onClick={() => onSelectCard(activeCard.id)}
              className="p-1.5 rounded-full bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 shadow-sm"
              title="Review full specs"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
