import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CreditCard } from '../types';
import {
  getBankHelpline,
  getCardMovieBenefit,
  getCardGolfBenefit,
  getCardExtrasBenefit
} from '../data/cards';
import { sound } from '../utils/audio';
import { Real3DCard } from '../components/Real3DCard';
import {
  GitCompare,
  Search,
  Sparkles,
  PhoneCall,
  Copy,
  Check,
  Plane,
  Coins,
  DollarSign,
  SlidersHorizontal,
  Utensils,
  Award,
  CheckCircle2,
  ArrowLeftRight,
  X,
  ChevronDown,
  Crown,
  Film,
  Flag,
  Gift
} from 'lucide-react';

interface CompareScreenProps {
  cards: CreditCard[];
  selectedCardIds: string[];
  onAddCard: (cardId: string) => void;
  onSetCompareSlot?: (slot: 0 | 1, cardId: string) => void;
  onRemoveCard: (cardId: string) => void;
  onSelectCard: (cardId: string) => void;
}

export const CompareScreen: React.FC<CompareScreenProps> = ({
  cards,
  selectedCardIds,
  onSetCompareSlot,
  onSelectCard,
}) => {
  // Independent Slot State: ensures Card 1 and Card 2 are never accidentally scrambled
  const [slot1Id, setSlot1Id] = useState<string>(selectedCardIds[0] || 'amex-platinum');
  const [slot2Id, setSlot2Id] = useState<string>(selectedCardIds[1] || 'hdfc-diners-black');

  // Top search bar states
  const [topSearchQuery, setTopSearchQuery] = useState('');
  const [topSearchTarget, setTopSearchTarget] = useState<0 | 1>(0); // 0 = Left Card, 1 = Right Card
  const [isTopSearchFocused, setIsTopSearchFocused] = useState(false);

  // In-place search states for each specific card column (that part only)
  const [slot1Search, setSlot1Search] = useState('');
  const [isSlot1DropdownOpen, setIsSlot1DropdownOpen] = useState(false);

  const [slot2Search, setSlot2Search] = useState('');
  const [isSlot2DropdownOpen, setIsSlot2DropdownOpen] = useState(false);

  const [filterMode, setFilterMode] = useState<'all' | 'differences'>('all');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const topSearchRef = useRef<HTMLDivElement>(null);
  const slot1Ref = useRef<HTMLDivElement>(null);
  const slot2Ref = useRef<HTMLDivElement>(null);

  // Synchronize with external changes if provided
  useEffect(() => {
    if (selectedCardIds[0] && selectedCardIds[0] !== slot1Id) {
      setSlot1Id(selectedCardIds[0]);
    }
    if (selectedCardIds[1] && selectedCardIds[1] !== slot2Id) {
      setSlot2Id(selectedCardIds[1]);
    }
  }, [selectedCardIds]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topSearchRef.current && !topSearchRef.current.contains(e.target as Node)) {
        setIsTopSearchFocused(false);
      }
      if (slot1Ref.current && !slot1Ref.current.contains(e.target as Node)) {
        setIsSlot1DropdownOpen(false);
      }
      if (slot2Ref.current && !slot2Ref.current.contains(e.target as Node)) {
        setIsSlot2DropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const card1 = cards.find(c => c.id === slot1Id) || cards.find(c => c.id === 'amex-platinum') || cards[0];
  const card2 = cards.find(c => c.id === slot2Id) || cards.find(c => c.id === 'hdfc-diners-black') || cards[1];

  const helpline1 = getBankHelpline(card1.bank);
  const helpline2 = getBankHelpline(card2.bank);

  const movie1 = getCardMovieBenefit(card1);
  const movie2 = getCardMovieBenefit(card2);

  const golf1 = getCardGolfBenefit(card1);
  const golf2 = getCardGolfBenefit(card2);

  const extras1 = getCardExtrasBenefit(card1);
  const extras2 = getCardExtrasBenefit(card2);

  // Updates Left Card ONLY (Slot 0), leaves Right Card 100% untouched
  const handleUpdateSlot1 = (newCardId: string) => {
    sound.playCardFlip();
    setSlot1Id(newCardId);
    if (onSetCompareSlot) {
      onSetCompareSlot(0, newCardId);
    }
    const cardName = cards.find(c => c.id === newCardId)?.name || 'Selected Card';
    setFeedbackNotice(`✓ Placed "${cardName}" on Left side. Right Card kept unchanged.`);
    setSlot1Search('');
    setIsSlot1DropdownOpen(false);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Updates Right Card ONLY (Slot 1), leaves Left Card 100% untouched
  const handleUpdateSlot2 = (newCardId: string) => {
    sound.playCardFlip();
    setSlot2Id(newCardId);
    if (onSetCompareSlot) {
      onSetCompareSlot(1, newCardId);
    }
    const cardName = cards.find(c => c.id === newCardId)?.name || 'Selected Card';
    setFeedbackNotice(`✓ Placed "${cardName}" on Right side. Left Card kept unchanged.`);
    setSlot2Search('');
    setIsSlot2DropdownOpen(false);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Swap Left & Right cards
  const handleSwapSlots = () => {
    sound.playCardFlip();
    const temp = slot1Id;
    setSlot1Id(slot2Id);
    setSlot2Id(temp);
    if (onSetCompareSlot) {
      onSetCompareSlot(0, slot2Id);
      onSetCompareSlot(1, temp);
    }
    setFeedbackNotice('⇄ Swapped Left and Right comparison cards.');
    setTimeout(() => setFeedbackNotice(null), 2500);
  };

  const copyToClipboard = (num: string) => {
    sound.playClick();
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  // Top search matching
  const topSearchResults = useMemo(() => {
    if (!topSearchQuery.trim()) return [];
    const q = topSearchQuery.toLowerCase();
    return cards.filter(
      c => c.name.toLowerCase().includes(q) || c.bank.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [topSearchQuery, cards]);

  const handleTopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topSearchQuery.trim()) return;
    const q = topSearchQuery.toLowerCase();
    const found = cards.find(
      c => c.name.toLowerCase().includes(q) || c.bank.toLowerCase().includes(q)
    );
    if (found) {
      if (topSearchTarget === 0) {
        handleUpdateSlot1(found.id);
      } else {
        handleUpdateSlot2(found.id);
      }
      setTopSearchQuery('');
      setIsTopSearchFocused(false);
    }
  };

  // Filtered lists for in-place column search
  const filteredSlot1Cards = useMemo(() => {
    if (!slot1Search.trim()) return cards;
    const q = slot1Search.toLowerCase();
    return cards.filter(
      c => c.name.toLowerCase().includes(q) || c.bank.toLowerCase().includes(q)
    );
  }, [slot1Search, cards]);

  const filteredSlot2Cards = useMemo(() => {
    if (!slot2Search.trim()) return cards;
    const q = slot2Search.toLowerCase();
    return cards.filter(
      c => c.name.toLowerCase().includes(q) || c.bank.toLowerCase().includes(q)
    );
  }, [slot2Search, cards]);

  // ========================================================
  // INTELLIGENT AI RECOMMENDATION ENGINE (SUMMED UP AT END)
  // ========================================================
  const aiRecommendation = useMemo(() => {
    if (
      (card1.id === 'amex-platinum' && card2.id === 'hdfc-diners-black') ||
      (card2.id === 'amex-platinum' && card1.id === 'hdfc-diners-black')
    ) {
      const amex = card1.id === 'amex-platinum' ? card1 : card2;
      const diners = card1.id === 'hdfc-diners-black' ? card1 : card2;
      return {
        overallWinnerName: diners.name,
        overallWinnerCard: diners,
        luxuryWinnerName: amex.name,
        luxuryWinnerCard: amex,
        verdictHeadline: 'HDFC Diners Club Black wins for Maximum Financial Value & 33.3% Reward Yield; Amex Platinum wins for Uncompromised Global Centurion Luxury.',
        keyPoints: [
          'Choose HDFC Diners Club Black if you want 33.3% net reward yield on flights/hotels via SmartBuy, 2X weekend dining points, and an achievable ₹8 Lakh annual fee waiver.',
          'Choose American Express Platinum if you want global Centurion Lounge access without spend requirements, 24x7 elite concierge, and Taj/Marriott elite hotel tier memberships.',
          '🏌️ Golf: Both cards provide complimentary golf (Amex: Unlimited global courses; Diners: 6 rounds/quarter).',
          '🎬 Movies: Diners Club Black provides BookMyShow BOGO weekend tickets (up to ₹250 2x/mo).',
        ],
        card1Pill: card1.id === 'amex-platinum' ? '👑 AI LUXURY & STATUS WINNER' : '🏆 AI VALUE & REWARDS WINNER',
        card2Pill: card2.id === 'amex-platinum' ? '👑 AI LUXURY & STATUS WINNER' : '🏆 AI VALUE & REWARDS WINNER',
      };
    }

    let score1 = 0;
    let score2 = 0;

    if (card1.isLifetimeFree && !card2.isLifetimeFree) score1 += 2;
    else if (card2.isLifetimeFree && !card1.isLifetimeFree) score2 += 2;
    else if (card1.annualFee < card2.annualFee) score1 += 1;
    else if (card2.annualFee < card1.annualFee) score2 += 1;

    if (card1.forexMarkup < card2.forexMarkup) score1 += 2;
    else if (card2.forexMarkup < card1.forexMarkup) score2 += 2;

    if (card1.domesticLoungesPerQuarter === 'Unlimited') score1 += 2;
    if (card2.domesticLoungesPerQuarter === 'Unlimited') score2 += 2;

    // Movies advantage
    if (movie1.score > movie2.score) score1 += 1;
    else if (movie2.score > movie1.score) score2 += 1;

    // Golf advantage
    if (golf1.score > golf2.score) score1 += 1;
    else if (golf2.score > golf1.score) score2 += 1;

    // Extras advantage
    if (extras1.score > extras2.score) score1 += 1;
    else if (extras2.score > extras1.score) score2 += 1;

    const winner = score1 >= score2 ? card1 : card2;
    const runnerUp = score1 >= score2 ? card2 : card1;

    const keyPoints = [
      `${winner.name}: Lower fee barrier and stronger everyday perks (${winner.headlineBenefit}).`,
      `${runnerUp.name}: Best suited if your primary priority is specific partner tier benefits or travel ecosystem locks.`,
    ];

    if (golf1.roundsPerQuarter !== golf2.roundsPerQuarter) {
      if (golf1.roundsPerQuarter !== 0 && golf2.roundsPerQuarter === 0) {
        keyPoints.push(`🏌️ Golf Advantage: ${card1.name} includes ${golf1.headline}, whereas ${card2.name} offers no golf perks.`);
      } else if (golf2.roundsPerQuarter !== 0 && golf1.roundsPerQuarter === 0) {
        keyPoints.push(`🏌️ Golf Advantage: ${card2.name} includes ${golf2.headline}, whereas ${card1.name} offers no golf perks.`);
      }
    }

    if (movie1.hasBogo !== movie2.hasBogo) {
      if (movie1.hasBogo) {
        keyPoints.push(`🎬 Cinema Advantage: ${card1.name} features ${movie1.headline}.`);
      } else if (movie2.hasBogo) {
        keyPoints.push(`🎬 Cinema Advantage: ${card2.name} features ${movie2.headline}.`);
      }
    }

    return {
      overallWinnerName: winner.name,
      overallWinnerCard: winner,
      luxuryWinnerName: runnerUp.name,
      luxuryWinnerCard: runnerUp,
      verdictHeadline: `AI Recommended: ${winner.name} delivers higher overall cost-to-benefit ratio for Indian cardholders.`,
      keyPoints,
      card1Pill: score1 >= score2 ? '🏆 AI RECOMMENDED PICK' : '⭐ ALTERNATIVE CONTENDER',
      card2Pill: score2 > score1 ? '🏆 AI RECOMMENDED PICK' : '⭐ ALTERNATIVE CONTENDER',
    };
  }, [card1, card2, movie1, movie2, golf1, golf2, extras1, extras2]);

  // Structured comparison parameters strictly following the sketch
  const comparisonItems = [
    {
      id: 'lounge',
      sketchLabel: 'ON THE BASES OF LOUNGE',
      title: 'Airport Lounge Access',
      icon: Plane,
      isDifferent: card1.domesticLoungesPerQuarter !== card2.domesticLoungesPerQuarter || card1.loungeSpendCondition !== card2.loungeSpendCondition,
      c1: {
        headline: `${card1.domesticLoungesPerQuarter} Visits / Quarter`,
        subline: card1.loungeSpendCondition,
      },
      c2: {
        headline: `${card2.domesticLoungesPerQuarter} Visits / Quarter`,
        subline: card2.loungeSpendCondition,
      },
      winner:
        card1.domesticLoungesPerQuarter === 'Unlimited' && card2.domesticLoungesPerQuarter !== 'Unlimited'
          ? 1
          : card2.domesticLoungesPerQuarter === 'Unlimited' && card1.domesticLoungesPerQuarter !== 'Unlimited'
          ? 2
          : 0,
    },
    {
      id: 'movies',
      sketchLabel: 'MOVIES & CINEMA',
      title: 'Movie Tickets & Entertainment BOGO',
      icon: Film,
      isDifferent: movie1.headline !== movie2.headline || movie1.hasBogo !== movie2.hasBogo,
      c1: {
        headline: movie1.headline,
        subline: movie1.subline,
      },
      c2: {
        headline: movie2.headline,
        subline: movie2.subline,
      },
      winner: movie1.score > movie2.score ? 1 : movie2.score > movie1.score ? 2 : 0,
    },
    {
      id: 'golf',
      sketchLabel: 'GOLF PRIVILEGES',
      title: 'Complimentary Golf Rounds & Lessons',
      icon: Flag,
      isDifferent: golf1.roundsPerQuarter !== golf2.roundsPerQuarter,
      c1: {
        headline: golf1.headline,
        subline: golf1.subline,
      },
      c2: {
        headline: golf2.headline,
        subline: golf2.subline,
      },
      winner: golf1.score > golf2.score ? 1 : golf2.score > golf1.score ? 2 : 0,
    },
    {
      id: 'dining',
      sketchLabel: 'DINING',
      title: 'Dining Privileges & Discounts',
      icon: Utensils,
      isDifferent: true,
      c1: {
        headline: card1.id === 'amex-platinum'
          ? 'Up to 20% Off at Taj, Oberoi & Marriott'
          : card1.id === 'hdfc-diners-black'
          ? 'Up to 25% Off at 10,000+ Restaurants'
          : 'Curated Dining Discounts via Partner Network',
        subline: card1.id === 'amex-platinum'
          ? 'Complimentary Fine Hotels & Resorts daily breakfast for 2 + $100 F&B credit.'
          : card1.id === 'hdfc-diners-black'
          ? '2X Reward Points on weekend dining + Swiggy Dineout table bookings.'
          : 'Discounts on bill payments at partnered restaurants across India.',
      },
      c2: {
        headline: card2.id === 'hdfc-diners-black'
          ? 'Up to 25% Off at 10,000+ Restaurants'
          : card2.id === 'amex-platinum'
          ? 'Up to 20% Off at Taj, Oberoi & Marriott'
          : 'Curated Dining Discounts via Partner Network',
        subline: card2.id === 'hdfc-diners-black'
          ? '2X Reward Points on weekend dining + Swiggy Dineout table bookings.'
          : card2.id === 'amex-platinum'
          ? 'Complimentary Fine Hotels & Resorts daily breakfast for 2 + $100 F&B credit.'
          : 'Discounts on bill payments at partnered restaurants across India.',
      },
      winner: 0,
    },
    {
      id: 'special',
      sketchLabel: 'SPECIAL',
      title: 'Special Privileges & 0% Forex',
      icon: Award,
      isDifferent: card1.forexMarkup !== card2.forexMarkup,
      c1: {
        headline: card1.forexMarkup === 0
          ? '0.0% (Zero Forex Markup)'
          : `${card1.forexMarkup}% Forex Markup`,
        subline: card1.id === 'amex-platinum'
          ? 'Centurion Lounge global access + 24x7 Platinum Concierge + Taj Epicure membership.'
          : card1.id === 'hdfc-diners-black'
          ? 'Unlimited guest lounge access + 6 complimentary golf games/quarter.'
          : card1.headlineBenefit,
      },
      c2: {
        headline: card2.forexMarkup === 0
          ? '0.0% (Zero Forex Markup)'
          : `${card2.forexMarkup}% Forex Markup`,
        subline: card2.id === 'hdfc-diners-black'
          ? 'Unlimited guest lounge access + 6 complimentary golf games/quarter.'
          : card2.id === 'amex-platinum'
          ? 'Centurion Lounge global access + 24x7 Platinum Concierge + Taj Epicure membership.'
          : card2.headlineBenefit,
      },
      winner: card1.forexMarkup < card2.forexMarkup ? 1 : card2.forexMarkup < card1.forexMarkup ? 2 : 0,
    },
    {
      id: 'extras',
      sketchLabel: 'EXTRAS & LIFESTYLE',
      title: 'Elite Hotel Status, Insurance & VIP Perks',
      icon: Gift,
      isDifferent: extras1.headline !== extras2.headline,
      c1: {
        headline: extras1.headline,
        subline: extras1.subline,
      },
      c2: {
        headline: extras2.headline,
        subline: extras2.subline,
      },
      winner: extras1.score > extras2.score ? 1 : extras2.score > extras1.score ? 2 : 0,
    },
    {
      id: 'rewards',
      sketchLabel: 'REWARDS & YIELD',
      title: 'Cashback Rate & Reward Points',
      icon: Coins,
      isDifferent: card1.cashbackRate !== card2.cashbackRate,
      c1: {
        headline: card1.cashbackRate,
        subline: `Redemption Ratio: ${card1.rewardPointValue}. Monthly cap: ${card1.cappingDetails}`,
      },
      c2: {
        headline: card2.cashbackRate,
        subline: `Redemption Ratio: ${card2.rewardPointValue}. Monthly cap: ${card2.cappingDetails}`,
      },
      winner: card1.rewardPointValue.includes('1.00') ? 1 : card2.rewardPointValue.includes('1.00') ? 2 : 0,
    },
    {
      id: 'fees',
      sketchLabel: 'FEES & WAIVERS',
      title: 'Annual Fee & Waiver Rules',
      icon: DollarSign,
      isDifferent: card1.annualFee !== card2.annualFee || card1.isLifetimeFree !== card2.isLifetimeFree,
      c1: {
        headline: card1.isLifetimeFree ? 'Lifetime Free (₹0)' : `₹${card1.annualFee.toLocaleString('en-IN')} / year`,
        subline: card1.isLifetimeFree ? 'Zero joining fee, zero annual renewal fee unconditionally.' : card1.annualFeeWaiverCondition,
      },
      c2: {
        headline: card2.isLifetimeFree ? 'Lifetime Free (₹0)' : `₹${card2.annualFee.toLocaleString('en-IN')} / year`,
        subline: card2.isLifetimeFree ? 'Zero joining fee, zero annual renewal fee unconditionally.' : card2.annualFeeWaiverCondition,
      },
      winner: card1.annualFee < card2.annualFee ? 1 : card2.annualFee < card1.annualFee ? 2 : 0,
    },
    {
      id: 'helpline',
      sketchLabel: 'BANK HELPLINE',
      title: 'Official Bank Toll-Free & Direct Concierge',
      icon: PhoneCall,
      isDifferent: false,
      c1: {
        headline: helpline1.conciergeNumber,
        subline: `${card1.bank} official 24x7 desk. Direct toll-free customer support and fraud desk.`,
      },
      c2: {
        headline: helpline2.conciergeNumber,
        subline: `${card2.bank} official 24x7 desk. Direct toll-free customer support and fraud desk.`,
      },
      winner: 0,
    },
  ];

  const displayedItems = useMemo(() => {
    if (filterMode === 'differences') {
      return comparisonItems.filter(item => item.isDifferent);
    }
    return comparisonItems;
  }, [filterMode, comparisonItems]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28 text-slate-900">

      {/* FEEDBACK TOAST: Confirms which card slot was updated */}
      {feedbackNotice && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{feedbackNotice}</span>
          <button onClick={() => setFeedbackNotice(null)} className="ml-1 text-emerald-200 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP TITLE SECTION & MAIN SEARCH WITH TARGET SLOT SELECTOR */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-2 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
            <GitCompare className="w-4 h-4 text-emerald-700" />
            <span>Interactive 3D Duel Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comparison
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
            Search or select a card for either slot independently. Updating one card leaves the other completely untouched.
          </p>
        </div>

        {/* TOP SEARCH BAR WITH DIRECT TARGET SLOT SELECTOR */}
        <div ref={topSearchRef} className="relative max-w-lg w-full">
          {/* Target Slot Toggle */}
          <div className="flex items-center justify-between text-xs mb-1.5 px-1 font-bold text-slate-600">
            <span>Place searched card in:</span>
            <div className="inline-flex rounded-lg bg-emerald-100/70 p-0.5 border border-emerald-300">
              <button
                type="button"
                onClick={() => setTopSearchTarget(0)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-black transition-all ${
                  topSearchTarget === 0
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-900 hover:text-emerald-700'
                }`}
              >
                Left Card
              </button>
              <button
                type="button"
                onClick={() => setTopSearchTarget(1)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-black transition-all ${
                  topSearchTarget === 1
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-900 hover:text-emerald-700'
                }`}
              >
                Right Card
              </button>
            </div>
          </div>

          <form onSubmit={handleTopSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              <input
                type="text"
                placeholder={`Search to replace ${topSearchTarget === 0 ? 'Left Card' : 'Right Card'}...`}
                value={topSearchQuery}
                onChange={e => {
                  setTopSearchQuery(e.target.value);
                  setIsTopSearchFocused(true);
                }}
                onFocus={() => setIsTopSearchFocused(true)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 shadow-sm"
              />
              {topSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTopSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 shrink-0"
            >
              Place Card
            </button>
          </form>

          {/* Top Search Autocomplete Results with Direct Slot Placement Buttons */}
          {isTopSearchFocused && topSearchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border-2 border-emerald-300 rounded-2xl shadow-2xl max-h-72 overflow-y-auto divide-y divide-emerald-100">
              <div className="px-3.5 py-2 bg-emerald-50/70 text-[10px] font-mono font-bold text-emerald-800 uppercase flex justify-between">
                <span>Matching Cards:</span>
                <span>Click to place on Left or Right</span>
              </div>
              {topSearchResults.map(c => (
                <div
                  key={c.id}
                  className="p-3 hover:bg-emerald-50/60 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-slate-900 truncate">{c.name}</div>
                    <div className="text-[10px] text-slate-500">{c.bank} • {c.tier}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateSlot1(c.id);
                        setTopSearchQuery('');
                        setIsTopSearchFocused(false);
                      }}
                      className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-600 text-emerald-900 hover:text-white font-mono text-[10px] font-black border border-emerald-300 transition-colors"
                      title="Display this card on the Left Slot only"
                    >
                      ← Left Slot
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateSlot2(c.id);
                        setTopSearchQuery('');
                        setIsTopSearchFocused(false);
                      }}
                      className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-600 text-emerald-900 hover:text-white font-mono text-[10px] font-black border border-emerald-300 transition-colors"
                      title="Display this card on the Right Slot only"
                    >
                      Right Slot →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3D ARENA & COMPARISON TABLE (Matching User Hand-Drawn Sketch) */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-white border-2 border-emerald-200 shadow-xl overflow-hidden">

        {/* COMPARISON TABLE HEADER: REAL-LIFE 3D CARDS AT TOP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-emerald-200 divide-y lg:divide-y-0 lg:divide-x-2 divide-emerald-200 bg-emerald-50/30">

          {/* COLUMN 1 HEADER: FEATURE PARAMETERS & SWAP BUTTON */}
          <div className="lg:col-span-3 p-6 flex flex-col justify-between bg-white/80">
            <div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                SIDE-BY-SIDE MATRIX
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Compare Parameters
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Both cards rotate continuously in 3D. Drag to tilt 360° or flip to inspect the magnetic stripe and toll-free helpline.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Controls</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterMode(filterMode === 'all' ? 'differences' : 'all')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{filterMode === 'all' ? 'Show Differences Only' : 'Show All Features'}</span>
                </button>

                <button
                  onClick={handleSwapSlots}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors shadow-sm flex items-center gap-1.5"
                  title="Swap Left and Right cards"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Swap Sides</span>
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 2 HEADER: CARD 1 (IN-PLACE SEARCH ON THIS PART ONLY) */}
          <div className="lg:col-span-4 p-6 sm:p-7 flex flex-col items-center justify-between text-center space-y-4 bg-white relative">

            {/* DEDICATED SEARCH BAR FOR CARD 1 (ON THIS PART ONLY) */}
            <div ref={slot1Ref} className="w-full relative space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-black text-emerald-800 uppercase px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                  LEFT CARD: {card1.bank}
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  Slot 1
                </span>
              </div>

              {/* In-Place Search Input for Left Card */}
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search & change Left Card..."
                  value={slot1Search}
                  onChange={e => {
                    setSlot1Search(e.target.value);
                    setIsSlot1DropdownOpen(true);
                  }}
                  onFocus={() => setIsSlot1DropdownOpen(true)}
                  className="w-full pl-8 pr-7 py-2 rounded-xl bg-emerald-50/70 border border-emerald-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setIsSlot1DropdownOpen(!isSlot1DropdownOpen)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-700 p-0.5 hover:bg-emerald-100 rounded"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* In-Place Dropdown for Left Card */}
              {isSlot1DropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border-2 border-emerald-400 rounded-2xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-emerald-50 text-left">
                  <div className="px-3 py-1.5 bg-emerald-100/60 text-[9.5px] font-mono font-extrabold text-emerald-900 uppercase">
                    Select Card for Left Slot (Right card stays unchanged):
                  </div>
                  {filteredSlot1Cards.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleUpdateSlot1(c.id)}
                      className={`w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center justify-between text-xs transition-colors ${
                        c.id === card1.id ? 'bg-emerald-50/90 font-black text-emerald-900' : 'text-slate-800'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="truncate font-bold">{c.name}</div>
                        <div className="text-[10px] text-slate-500">{c.bank}</div>
                      </div>
                      {c.id === card1.id ? (
                        <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-slate-600 hover:text-emerald-700">
                          Set Left
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Recommendation Pill on Card 1 */}
            <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-black tracking-wide shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{aiRecommendation.card1Pill}</span>
            </div>

            {/* REAL-LIFE 3D CONTINUOUSLY ANIMATED CARD */}
            <div className="py-1">
              <Real3DCard
                card={card1}
                cardholderName="CHERISH GOYAL"
                autoRotate={true}
                isInteractive={true}
              />
            </div>

            {/* Card Title & Headline */}
            <div className="space-y-1">
              <h3
                onClick={() => onSelectCard(card1.id)}
                className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors"
              >
                {card1.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                {card1.headlineBenefit}
              </p>
            </div>
          </div>

          {/* COLUMN 3 HEADER: CARD 2 (IN-PLACE SEARCH ON THIS PART ONLY) */}
          <div className="lg:col-span-5 p-6 sm:p-7 flex flex-col items-center justify-between text-center space-y-4 bg-white relative">

            {/* DEDICATED SEARCH BAR FOR CARD 2 (ON THIS PART ONLY) */}
            <div ref={slot2Ref} className="w-full relative space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-black text-emerald-800 uppercase px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                  RIGHT CARD: {card2.bank}
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  Slot 2
                </span>
              </div>

              {/* In-Place Search Input for Right Card */}
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search & change Right Card..."
                  value={slot2Search}
                  onChange={e => {
                    setSlot2Search(e.target.value);
                    setIsSlot2DropdownOpen(true);
                  }}
                  onFocus={() => setIsSlot2DropdownOpen(true)}
                  className="w-full pl-8 pr-7 py-2 rounded-xl bg-emerald-50/70 border border-emerald-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setIsSlot2DropdownOpen(!isSlot2DropdownOpen)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-700 p-0.5 hover:bg-emerald-100 rounded"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* In-Place Dropdown for Right Card */}
              {isSlot2DropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border-2 border-emerald-400 rounded-2xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-emerald-50 text-left">
                  <div className="px-3 py-1.5 bg-emerald-100/60 text-[9.5px] font-mono font-extrabold text-emerald-900 uppercase">
                    Select Card for Right Slot (Left card stays unchanged):
                  </div>
                  {filteredSlot2Cards.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleUpdateSlot2(c.id)}
                      className={`w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center justify-between text-xs transition-colors ${
                        c.id === card2.id ? 'bg-emerald-50/90 font-black text-emerald-900' : 'text-slate-800'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="truncate font-bold">{c.name}</div>
                        <div className="text-[10px] text-slate-500">{c.bank}</div>
                      </div>
                      {c.id === card2.id ? (
                        <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-slate-600 hover:text-emerald-700">
                          Set Right
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Recommendation Pill on Card 2 */}
            <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-black tracking-wide shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{aiRecommendation.card2Pill}</span>
            </div>

            {/* REAL-LIFE 3D CONTINUOUSLY ANIMATED CARD */}
            <div className="py-1">
              <Real3DCard
                card={card2}
                cardholderName="CHERISH GOYAL"
                autoRotate={true}
                isInteractive={true}
              />
            </div>

            {/* Card Title & Headline */}
            <div className="space-y-1">
              <h3
                onClick={() => onSelectCard(card2.id)}
                className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors"
              >
                {card2.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                {card2.headlineBenefit}
              </p>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* ROW-BY-ROW COMPARISON MATRIX (Strictly Following Sketch)   */}
        {/* ======================================================== */}
        <div className="divide-y-2 divide-emerald-100">
          {displayedItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x-2 divide-emerald-100 items-stretch hover:bg-emerald-50/20 transition-colors"
              >
                {/* Left Column: Sketch Criterion Title - HIGHLIGHTED AS ASKED */}
                <div className="lg:col-span-3 p-5 sm:p-6 bg-gradient-to-r from-emerald-100/70 via-emerald-50/90 to-white border-l-4 border-l-emerald-600 border-r-2 border-emerald-200 flex flex-col justify-center shadow-sm">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm mb-2 w-fit">
                    <Icon className="w-3.5 h-3.5 text-emerald-100" />
                    <span>{item.sketchLabel}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                </div>

                {/* Center Column: Card 1 Value Box */}
                <div
                  className={`lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between space-y-2 ${
                    item.winner === 1 ? 'bg-emerald-50/60' : 'bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                        {card1.bank}
                      </span>
                      {item.winner === 1 && (
                        <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>RECOMMENDED ADVANTAGE</span>
                        </span>
                      )}
                    </div>

                    <div className="text-base sm:text-lg font-mono font-extrabold text-slate-900 leading-snug">
                      {item.c1.headline}
                    </div>

                    <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-medium">
                      {item.c1.subline}
                    </p>
                  </div>

                  {item.id === 'helpline' && (
                    <div className="flex items-center gap-2 pt-2">
                      <a
                        href={`tel:${helpline1.conciergeNumber.replace(/\D/g, '')}`}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-sm hover:bg-emerald-500 flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Toll-Free</span>
                      </a>
                      <button
                        onClick={() => copyToClipboard(helpline1.conciergeNumber)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 border border-slate-300 text-xs"
                        title="Copy Number"
                      >
                        {copiedNumber === helpline1.conciergeNumber ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column: Card 2 Value Box */}
                <div
                  className={`lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-2 ${
                    item.winner === 2 ? 'bg-emerald-50/60' : 'bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                        {card2.bank}
                      </span>
                      {item.winner === 2 && (
                        <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>RECOMMENDED ADVANTAGE</span>
                        </span>
                      )}
                    </div>

                    <div className="text-base sm:text-lg font-mono font-extrabold text-slate-900 leading-snug">
                      {item.c2.headline}
                    </div>

                    <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-medium">
                      {item.c2.subline}
                    </p>
                  </div>

                  {item.id === 'helpline' && (
                    <div className="flex items-center gap-2 pt-2">
                      <a
                        href={`tel:${helpline2.conciergeNumber.replace(/\D/g, '')}`}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-sm hover:bg-emerald-500 flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Toll-Free</span>
                      </a>
                      <button
                        onClick={() => copyToClipboard(helpline2.conciergeNumber)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 border border-slate-300 text-xs"
                        title="Copy Number"
                      >
                        {copiedNumber === helpline2.conciergeNumber ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ======================================================== */}
      {/* FINAL AI VERDICT: SUM UP WHICH CARD IS MORE USEFUL (AT END) */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/15 relative overflow-hidden">
        <Crown className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-400/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </span>
              <span className="font-mono text-xs font-black tracking-wider uppercase text-emerald-100">
                FINAL AI SUMMARY: WHICH CARD IS MORE USEFUL?
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-emerald-900 font-mono text-[11px] font-black shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>COMPARISON COMPLETED</span>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
              {aiRecommendation.verdictHeadline}
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {aiRecommendation.keyPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                  <span className="p-1 rounded-full bg-white/20 text-white shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-200" />
                  </span>
                  <p className="text-xs text-white/95 leading-relaxed font-medium">
                    {pt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
