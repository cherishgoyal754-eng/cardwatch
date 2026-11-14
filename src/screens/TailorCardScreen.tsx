import React, { useState } from 'react';
import { ALL_CREDIT_CARDS } from '../data/cards';
import { sound } from '../utils/audio';
import { CreditCard } from '../types';
import {
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Coins,
  Check,
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react';

interface TailorCardScreenProps {
  onSelectCard: (cardId: string) => void;
  userSalary?: number;
}

interface SpendJudgment {
  isFeeWaived: boolean;
  feeWaiverThreshold: number;
  feeSaved: number;
  netAnnualFee: number;
  isLoungeUnlocked: boolean;
  loungeSpendThreshold: number;
  grossAnnualRewards: number;
  loungePerkValue: number;
  netAnnualBenefit: number;
  netReturnRate: number;
  spendVerdict: string;
}

function calculateSpendJudgment(card: CreditCard, yearlySpend: number): SpendJudgment {
  const monthlySpend = Math.round(yearlySpend / 12);
  const quarterlySpend = Math.round(yearlySpend / 4);

  // 1. Fee Waiver Threshold
  let feeWaiverThreshold = 300000;
  if (card.id === 'hdfc-regalia-gold') feeWaiverThreshold = 400000;
  else if (card.id === 'hdfc-infinia-metal') feeWaiverThreshold = 1000000;
  else if (card.id === 'hdfc-diners-black') feeWaiverThreshold = 800000;
  else if (card.id === 'sbi-cashback') feeWaiverThreshold = 200000;
  else if (card.id === 'axis-magnus') feeWaiverThreshold = 2500000;
  else if (card.id === 'tata-neu-infinity') feeWaiverThreshold = 300000;
  else if (card.id === 'icici-sapphiro') feeWaiverThreshold = 600000;
  else if (card.id === 'amex-plat-travel') feeWaiverThreshold = 99999999;
  else if (card.id === 'sbi-aurum') feeWaiverThreshold = 600000;
  else if (card.id === 'amex-platinum') feeWaiverThreshold = 99999999; // Never waived
  else if (card.isLifetimeFree) feeWaiverThreshold = 0;
  else if (card.tier === 'Super Premium') feeWaiverThreshold = 1000000;
  else if (card.tier === 'Premium') feeWaiverThreshold = 500000;
  else feeWaiverThreshold = 200000;

  const isFeeWaived = card.isLifetimeFree || yearlySpend >= feeWaiverThreshold;
  const feeSaved = isFeeWaived && !card.isLifetimeFree ? card.annualFee : 0;
  const netAnnualFee = isFeeWaived ? 0 : card.annualFee;

  // 2. Quarterly Lounge Threshold Check
  let loungeSpendThreshold = 0;
  let isLoungeUnlocked = true;

  if (card.domesticLoungesPerQuarter === 0 || card.loungeNetwork === 'None') {
    isLoungeUnlocked = false;
  } else if (card.id === 'hdfc-regalia-gold') {
    loungeSpendThreshold = 60000; // ₹60k/quarter
    isLoungeUnlocked = quarterlySpend >= 60000;
  } else if (card.id === 'scapia-federal') {
    loungeSpendThreshold = 60000; // ₹20k/month = ₹60k/quarter
    isLoungeUnlocked = monthlySpend >= 20000;
  } else if (card.id === 'indusind-tiger') {
    loungeSpendThreshold = 0;
    isLoungeUnlocked = true; // 2 domestic lounges/quarter complimentary via card
  } else if (card.id === 'hdfc-infinia-metal' || card.id === 'hdfc-diners-black' || card.id === 'amex-platinum') {
    loungeSpendThreshold = 0;
    isLoungeUnlocked = true; // Unconditional lounges
  } else if (card.loungeSpendCondition.toLowerCase().includes('lakh')) {
    loungeSpendThreshold = 100000;
    isLoungeUnlocked = quarterlySpend >= 100000;
  } else if (card.loungeSpendCondition.toLowerCase().includes('50,000') || card.loungeSpendCondition.toLowerCase().includes('50k')) {
    loungeSpendThreshold = 50000;
    isLoungeUnlocked = quarterlySpend >= 50000;
  }

  // 3. Rewards Simulation at this spend level
  let grossAnnualRewards = 0;
  if (card.id === 'sbi-cashback') {
    // 5% on online up to ₹2k/mo cap (₹24k/yr) + 1% offline (₹24k/yr cap)
    const onlineSpend = yearlySpend * 0.65;
    const onlineCashback = Math.min(24000, onlineSpend * 0.05);
    const otherCashback = Math.min(24000, (yearlySpend - onlineSpend) * 0.01);
    grossAnnualRewards = Math.round(onlineCashback + otherCashback);
  } else if (card.id === 'hdfc-infinia-metal') {
    // 3.3% base up to 10-33% on flights via SmartBuy (average ~5.5% realistic blended)
    grossAnnualRewards = Math.round(yearlySpend * 0.055);
  } else if (card.id === 'hdfc-diners-black') {
    grossAnnualRewards = Math.round(yearlySpend * 0.045);
  } else if (card.id === 'hdfc-regalia-gold') {
    grossAnnualRewards = Math.round(yearlySpend * 0.030);
  } else if (card.id === 'icici-amazon-pay') {
    // 5% Amazon + 1% other = blended 2.6%
    grossAnnualRewards = Math.round(yearlySpend * 0.026);
  } else if (card.id === 'scapia-federal') {
    // 20% on Scapia app travel + 10% Visa / 5% RuPay = blended 4.0%
    grossAnnualRewards = Math.round(yearlySpend * 0.040);
  } else if (card.id === 'indusind-tiger') {
    // Up to 6X accelerated rewards (2.4% valueback) + 1.5% forex + LTF = blended ~2.8%
    grossAnnualRewards = Math.round(yearlySpend * 0.028);
  } else if (card.id === 'tata-neu-infinity') {
    grossAnnualRewards = Math.round(yearlySpend * 0.035);
  } else if (card.id === 'icici-sapphiro') {
    // 2 RP/₹100 (0.5%) + BookMyShow BOGO savings (up to ₹12k/yr)
    grossAnnualRewards = Math.round(yearlySpend * 0.0075 + 12000);
  } else if (card.id === 'axis-magnus') {
    // 12 pts/₹200 base (2.4%) + 35 pts/₹200 on spend > ₹1.5L/mo (7%) + 5X on Travel EDGE = blended ~4.2%
    grossAnnualRewards = Math.round(yearlySpend * 0.042);
  } else if (card.id === 'amex-plat-travel') {
    // 1 MR / ₹50 base + milestone bonus points + ₹10,000 Taj voucher on ₹4L spend
    grossAnnualRewards = yearlySpend >= 400000
      ? Math.round(yearlySpend * 0.02 + 10000 + 40000 * 0.4)
      : Math.round(yearlySpend * 0.02);
  } else if (card.id === 'amex-platinum') {
    // 2.5% points + ₹45,000 luxury vouchers & Taj/Marriott gold tiers
    grossAnnualRewards = Math.round(yearlySpend * 0.028 + 45000);
  } else {
    grossAnnualRewards = Math.round(yearlySpend * 0.022);
  }

  // 4. Lounge Perk Valuation (₹1,200 per domestic lounge visit)
  const visitsPerQuarter = typeof card.domesticLoungesPerQuarter === 'number' ? card.domesticLoungesPerQuarter : 0;
  const loungePerkValue = isLoungeUnlocked ? Math.min(24000, visitsPerQuarter * 4 * 1200) : 0;

  // 5. Net Benefit & Return ROI
  const netAnnualBenefit = grossAnnualRewards + loungePerkValue + feeSaved - netAnnualFee;
  const netReturnRate = yearlySpend > 0 ? Number(((netAnnualBenefit / yearlySpend) * 100).toFixed(1)) : 0;

  // 6. Spend Verdict Label
  let spendVerdict = 'Optimal Spend Match';
  if (isFeeWaived && isLoungeUnlocked) {
    spendVerdict = 'Maximum Value Unlocked (Fee Waived & Lounges Active)';
  } else if (isFeeWaived) {
    spendVerdict = 'Fee Waived (₹0 Net Cost)';
  } else if (!isFeeWaived && card.annualFee > 5000 && yearlySpend < feeWaiverThreshold) {
    spendVerdict = 'High Fee Warning (Spend Below Waiver Target)';
  }

  return {
    isFeeWaived,
    feeWaiverThreshold,
    feeSaved,
    netAnnualFee,
    isLoungeUnlocked,
    loungeSpendThreshold,
    grossAnnualRewards,
    loungePerkValue,
    netAnnualBenefit,
    netReturnRate,
    spendVerdict,
  };
}

export const TailorCardScreen: React.FC<TailorCardScreenProps> = ({
  onSelectCard,
  userSalary = 120000,
}) => {
  const [selectedLifestyles, setSelectedLifestyles] = useState<string[]>(['fly', 'dining']);
  const [monthlySpend, setMonthlySpend] = useState<number>(50000);
  const [spendMode, setSpendMode] = useState<'monthly' | 'yearly'>('monthly');
  const [salary, setSalary] = useState<number>(userSalary);
  const [cibilScore, setCibilScore] = useState<number>(780);
  const [preferLtf, setPreferLtf] = useState<boolean>(false);

  const yearlySpend = monthlySpend * 12;
  const quarterlySpend = Math.round(yearlySpend / 4);

  const lifestyleOptions = [
    { id: 'fly', label: '✈️ I Fly Often (Airport Lounges & Air Miles)' },
    { id: 'upi', label: '📱 UPI QR Payments (Scan & Pay RuPay)' },
    { id: 'dining', label: '🍽️ Dining & Food Delivery (Zomato / Swiggy)' },
    { id: 'shopping', label: '🛍️ Online Shopping (Amazon / Flipkart / Myntra)' },
    { id: 'grocery', label: '🛒 Grocery & Quick-Commerce (Blinkit / Zepto)' },
    { id: 'fuel', label: '⛽ Fuel Surcharge Waiver & Petrol Pumps' },
    { id: 'movies', label: '🎬 Movie Person (BookMyShow BOGO Tickets)' },
    { id: 'golf', label: '⛳ Golf Lessons & Luxury Club Access' },
    { id: 'forex', label: '🌍 International Travel (Zero / Low Forex)' },
    { id: 'new-to-cards', label: '🔰 New to Credit Cards (First Card / Low CIBIL)' },
    { id: 'business', label: '💼 Business Spends & High Tax Payments' },
  ];

  const spendPresets = [
    { label: '₹25k/mo', monthly: 25000, yearlyLabel: '₹3L/yr', tag: 'Starter' },
    { label: '₹50k/mo', monthly: 50000, yearlyLabel: '₹6L/yr', tag: 'Balanced' },
    { label: '₹1 Lakh/mo', monthly: 100000, yearlyLabel: '₹12L/yr', tag: 'High Spender' },
    { label: '₹2.5 Lakh/mo', monthly: 250000, yearlyLabel: '₹30L/yr', tag: 'Ultra HNI' },
  ];

  const toggleLifestyle = (id: string) => {
    sound.playClick();
    if (selectedLifestyles.includes(id)) {
      setSelectedLifestyles(selectedLifestyles.filter(l => l !== id));
    } else {
      setSelectedLifestyles([...selectedLifestyles, id]);
    }
  };

  const handleSpendChange = (val: number, mode: 'monthly' | 'yearly') => {
    if (mode === 'monthly') {
      setMonthlySpend(Math.max(5000, Math.min(500000, val)));
    } else {
      setMonthlySpend(Math.max(5000, Math.min(500000, Math.round(val / 12))));
    }
  };

  // Tailored recommendation logic based on SPEND, LIFESTYLE, and SALARY
  const getTailoredRecommendations = () => {
    const scoredCards = ALL_CREDIT_CARDS.map(card => {
      let score = 0;
      const reasons: string[] = [];

      // Calculate spend judgment
      const judgment = calculateSpendJudgment(card, yearlySpend);

      // 1. SPEND JUDGMENT SCORING (Primary Evaluation Engine)
      if (judgment.isFeeWaived) {
        score += 35;
        if (!card.isLifetimeFree) {
          reasons.push(`Annual fee (₹${card.annualFee.toLocaleString('en-IN')}) is 100% waived on your ₹${(yearlySpend / 100000).toFixed(1)}L spend`);
        } else {
          reasons.push('100% Lifetime Free unconditionally — ₹0 annual overhead');
        }
      } else {
        // High fee penalty if spend is below waiver criteria
        if (card.annualFee >= 10000) {
          score -= 45;
        } else {
          score -= 15;
        }
      }

      // Lounge threshold evaluation
      if (judgment.isLoungeUnlocked && card.domesticLoungesPerQuarter > 0) {
        score += 25;
        reasons.push(`Your ₹${(quarterlySpend / 1000).toFixed(0)}k/qtr spend fully unlocks ${card.domesticLoungesPerQuarter} lounge visits/quarter`);
      } else if (card.domesticLoungesPerQuarter > 0 && !judgment.isLoungeUnlocked) {
        score -= 20;
      }

      // Reward return yield contribution
      score += Math.round(judgment.netReturnRate * 7);

      // Spend Tier Matching:
      // High spenders (> ₹10L/yr) get premium/super-premium boost
      if (yearlySpend >= 1000000 && (card.tier === 'Super Premium' || card.id === 'hdfc-infinia-metal' || card.id === 'hdfc-diners-black')) {
        score += 35;
        reasons.push('Super-premium multiplier yields massive rewards at your spend level');
      }
      // Low spenders (< ₹3.5L/yr) get cashback & LTF boost
      if (yearlySpend < 350000 && (card.tags.includes('cashback') || card.isLifetimeFree || card.id === 'sbi-cashback')) {
        score += 30;
        reasons.push('Maximum net return for your budget without hefty fee locks');
      }

      // 2. Lifestyle matches
      if (selectedLifestyles.includes('fly') && card.domesticLoungesPerQuarter > 0) {
        score += 20;
      }
      if (selectedLifestyles.includes('upi') && card.tags.includes('upi')) {
        score += 25;
        reasons.push('RuPay scan-and-pay UPI cashback supported');
      }
      if (selectedLifestyles.includes('shopping') && (card.tags.includes('cashback') || card.id === 'sbi-cashback')) {
        score += 20;
      }
      if (selectedLifestyles.includes('forex') && card.forexMarkup <= 2.0) {
        score += 25;
        reasons.push(`0% - 2% low forex markup on overseas transactions`);
      }
      if (selectedLifestyles.includes('dining') && card.tags.includes('dining')) {
        score += 15;
      }

      // 3. Salary & CIBIL eligibility
      if (salary >= card.minSalaryMonthly) {
        score += 20;
      } else {
        score -= 35;
      }

      // 4. LTF preference
      if (preferLtf) {
        if (card.isLifetimeFree) score += 40;
        else score -= 50;
      }

      return {
        card,
        score,
        judgment,
        reasons: reasons.slice(0, 3),
        approvalChance: salary >= card.minSalaryMonthly && cibilScore >= 750 ? 'Very High (95%)' : 'Moderate (65%)',
      };
    });

    return scoredCards.sort((a, b) => b.score - a.score);
  };

  const recommendations = getTailoredRecommendations();
  const bestMatch = recommendations[0];
  const runnersUp = recommendations.slice(1, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-28 text-slate-900">

      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <span>Spend-Based Card Recommendation & Referral Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Tailor Card by Monthly & Yearly Spend
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl font-medium">
          Tell us your expected monthly or yearly card spend. CARDWATCH judges every card's mathematical fee waivers, quarterly lounge thresholds, and net cashback to refer your #1 product.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Interactive Spend & Lifestyle Selectors */}
        <div className="lg:col-span-6 space-y-6">

          {/* 1. EXPECTED SPEND CALCULATOR & JUDGMENT BASIS (THE CORE NEW FEATURE) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-emerald-300 shadow-lg space-y-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase font-mono tracking-wider">
                    1. Expected Monthly & Yearly Spend
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Calculates fee waivers, lounge quotas & net returns
                  </span>
                </div>
              </div>

              {/* Mode Toggle: Monthly vs Yearly */}
              <div className="flex items-center bg-emerald-50 p-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSpendMode('monthly');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    spendMode === 'monthly'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSpendMode('yearly');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    spendMode === 'yearly'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Spend Display Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">
                  {spendMode === 'monthly' ? 'Estimated Monthly Spend' : 'Estimated Annual Spend'}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-800 tracking-tight">
                  ₹{spendMode === 'monthly' ? monthlySpend.toLocaleString('en-IN') : yearlySpend.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
                  {spendMode === 'monthly' ? 'Annualized' : 'Per Month'}
                </span>
                <span className="text-sm sm:text-base font-extrabold font-mono text-slate-800">
                  {spendMode === 'monthly' ? `₹${(yearlySpend / 100000).toFixed(1)} Lakhs/yr` : `₹${monthlySpend.toLocaleString('en-IN')}/mo`}
                </span>
                <span className="text-[10px] font-mono text-slate-500 block">
                  (₹{(quarterlySpend / 1000).toFixed(0)}k/quarter)
                </span>
              </div>
            </div>

            {/* Interactive Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={spendMode === 'monthly' ? 10000 : 120000}
                max={spendMode === 'monthly' ? 300000 : 3600000}
                step={spendMode === 'monthly' ? 5000 : 60000}
                value={spendMode === 'monthly' ? monthlySpend : yearlySpend}
                onChange={e => handleSpendChange(Number(e.target.value), spendMode)}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-100 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono font-semibold">
                <span>{spendMode === 'monthly' ? '₹10k/mo' : '₹1.2L/yr'}</span>
                <span>{spendMode === 'monthly' ? '₹1 Lakh/mo' : '₹12L/yr'}</span>
                <span>{spendMode === 'monthly' ? '₹3 Lakh+/mo' : '₹36L+/yr'}</span>
              </div>
            </div>

            {/* Quick 1-Click Spend Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-500 block">
                Quick Spend Presets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {spendPresets.map(preset => {
                  const isSelected = monthlySpend === preset.monthly;
                  return (
                    <button
                      key={preset.monthly}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setMonthlySpend(preset.monthly);
                      }}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                          : 'bg-white border-emerald-200 text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="block font-mono">{preset.label}</span>
                      <span className={`text-[10px] block opacity-80 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {preset.yearlyLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Lifestyle Habits */}
          <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>2. Your Lifestyle & Category Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lifestyleOptions.map(opt => {
                const isSelected = selectedLifestyles.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleLifestyle(opt.id)}
                    className={`p-3.5 rounded-2xl text-left text-xs font-bold border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-emerald-50/50 text-slate-800 border-emerald-200 hover:border-emerald-400 hover:bg-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Salary & Eligibility Inputs */}
          <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Eligibility & Income Baseline</span>
            </h3>

            {/* Salary slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                <span className="text-slate-600">Monthly In-Hand Salary</span>
                <span className="font-mono text-emerald-700 text-base">
                  ₹{salary.toLocaleString('en-IN')} / mo
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="400000"
                step="10000"
                value={salary}
                onChange={e => setSalary(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-600 font-mono mt-1 font-semibold">
                <span>₹20k (Entry)</span>
                <span>₹1.5L (Premium)</span>
                <span>₹3L+ (Super-Premium)</span>
              </div>
            </div>

            {/* CIBIL Score slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                <span className="text-slate-600">Estimated CIBIL Score</span>
                <span className="font-mono text-emerald-700 text-base">
                  {cibilScore}
                </span>
              </div>
              <input
                type="range"
                min="650"
                max="850"
                step="5"
                value={cibilScore}
                onChange={e => setCibilScore(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-600 font-mono mt-1 font-semibold">
                <span>650 (Fair)</span>
                <span>750 (Excellent)</span>
                <span>850 (Exceptional)</span>
              </div>
            </div>

            {/* LTF Toggle */}
            <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  Strictly 100% Lifetime Free (LTF)
                </span>
                <span className="text-xs text-slate-500">
                  Zero joining and zero annual fee unconditionally
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setPreferLtf(!preferLtf);
                }}
                className={`w-14 h-7 rounded-full transition-colors p-1 flex items-center ${
                  preferLtf ? 'bg-emerald-600 justify-end' : 'bg-slate-200 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Judged Recommendation & Referrals based on Spend */}
        <div className="lg:col-span-6 space-y-6">

          {bestMatch && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-400 shadow-xl relative space-y-6">

              {/* Match badge */}
              <div className="flex justify-between items-start">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-mono font-extrabold shadow-sm">
                  <Award className="w-4 h-4" />
                  <span>#1 REFERRED CARD FOR YOUR ₹{(yearlySpend / 100000).toFixed(1)}L SPEND</span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-slate-500 block uppercase font-bold">Approval Chance</span>
                  <span className="text-sm font-extrabold text-emerald-700 font-mono">
                    {bestMatch.approvalChance}
                  </span>
                </div>
              </div>

              {/* Card Title & Headline */}
              <div>
                <span className="text-xs font-mono uppercase text-emerald-700 font-bold">
                  {bestMatch.card.bank}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                  {bestMatch.card.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                  {bestMatch.card.headlineBenefit}
                </p>
              </div>

              {/* SPEND JUDGMENT METRIC SUMMARY (KEY HIGHLIGHT) */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <div>
                  <span className="text-xs text-slate-600 font-bold block">Net Annual Profit</span>
                  <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-700">
                    ₹{bestMatch.judgment.netAnnualBenefit.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-800 block font-bold mt-0.5">
                    {bestMatch.judgment.netReturnRate}% net return on spend
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-600 font-bold block">Annual Fee Status</span>
                  <div className="text-base sm:text-lg font-mono font-extrabold text-slate-900 mt-1">
                    {bestMatch.judgment.isFeeWaived ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Fee 100% Waived</span>
                      </span>
                    ) : (
                      <span className="text-amber-800 font-bold">
                        ₹{bestMatch.card.annualFee.toLocaleString('en-IN')} Payable
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 block font-medium">
                    {bestMatch.judgment.isFeeWaived
                      ? `Saved ₹${bestMatch.card.annualFee.toLocaleString('en-IN')} on ₹${(yearlySpend / 100000).toFixed(1)}L spend`
                      : `Waiver threshold: ₹${(bestMatch.judgment.feeWaiverThreshold / 100000).toFixed(1)}L`}
                  </span>
                </div>
              </div>

              {/* SPEND AUDIT BREAKDOWN: FEE WAIVER & LOUNGE THRESHOLD */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <span className="font-mono font-extrabold uppercase text-slate-700 block">
                  Spend Feasibility Breakdown (₹{monthlySpend.toLocaleString('en-IN')}/mo • ₹{yearlySpend.toLocaleString('en-IN')}/yr):
                </span>

                <div className="space-y-1.5 font-medium">
                  {/* Fee Waiver Row */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-700">Annual Fee Waiver:</span>
                    {bestMatch.judgment.isFeeWaived ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>✓ Target Met (Waived)</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold flex items-center gap-1 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Need ₹{((bestMatch.judgment.feeWaiverThreshold - yearlySpend) / 100000).toFixed(1)}L more</span>
                      </span>
                    )}
                  </div>

                  {/* Lounge Spend Row */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-700">Quarterly Lounge Spend:</span>
                    {bestMatch.judgment.isLoungeUnlocked ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>✓ Unlocked ({bestMatch.card.domesticLoungesPerQuarter} visits/qtr)</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold flex items-center gap-1 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Below ₹{(bestMatch.judgment.loungeSpendThreshold / 1000).toFixed(0)}k/qtr condition</span>
                      </span>
                    )}
                  </div>

                  {/* Annual Rewards Earned */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-700">Gross Rewards & Cashback:</span>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{bestMatch.judgment.grossAnnualRewards.toLocaleString('en-IN')} / yr
                    </span>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-emerald-800 font-extrabold block">
                  Why this card wins for your spend:
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-800 font-medium">
                  {bestMatch.reasons.map((r, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your salary of ₹{(salary / 1000).toFixed(0)}k/mo passes bank minimum</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectCard(bestMatch.card.id);
                  }}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>Review Complete Card Specs & Toll-Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* Alternative Ranked Cards based on Spend */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-emerald-800 font-extrabold">
              Alternative Cards Judged for ₹{(yearlySpend / 100000).toFixed(1)}L/yr Spend:
            </h3>

            <div className="space-y-2.5">
              {runnersUp.map((item, idx) => (
                <div
                  key={item.card.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectCard(item.card.id);
                  }}
                  className="p-4 rounded-2xl bg-white hover:bg-emerald-50/60 transition-colors cursor-pointer flex items-center justify-between border border-emerald-200 shadow-sm"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        #{idx + 2}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.card.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {item.judgment.spendVerdict} • {item.judgment.netReturnRate}% Return
                    </p>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <span className="text-sm font-mono text-emerald-700 font-black block">
                      +₹{item.judgment.netAnnualBenefit.toLocaleString('en-IN')}/yr
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {item.judgment.isFeeWaived ? 'Fee Waived' : `₹${item.card.annualFee} fee`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
