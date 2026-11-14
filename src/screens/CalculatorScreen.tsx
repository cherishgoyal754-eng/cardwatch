import React, { useState } from 'react';
import { ALL_CREDIT_CARDS } from '../data/cards';
import { sound } from '../utils/audio';
import { CreditCard } from '../types';
import {
  Calculator,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Award,
  TrendingUp,
  Sparkles,
  Check
} from 'lucide-react';

interface CalculatorScreenProps {
  onSelectCard: (cardId: string) => void;
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ onSelectCard }) => {
  const cards = ALL_CREDIT_CARDS;
  const [selectedCardId, setSelectedCardId] = useState<string>('hdfc-regalia-gold');

  // Spend breakdown inputs (monthly)
  const [spends, setSpends] = useState({
    onlineShopping: 25000,
    flightsHotels: 15000,
    dining: 8000,
    grocery: 12000,
    fuel: 5000,
    utilities: 6000,
    offline: 15000,
  });

  const handleSpendChange = (cat: keyof typeof spends, val: number) => {
    sound.playClick();
    setSpends(prev => ({ ...prev, [cat]: Math.max(0, val) }));
  };

  const card = cards.find(c => c.id === selectedCardId) || cards[0];

  // Total monthly & annual spend
  const totalMonthlySpend = Object.values(spends).reduce((a, b) => a + b, 0);
  const totalAnnualSpend = totalMonthlySpend * 12;
  const quarterlySpend = Math.round(totalAnnualSpend / 4);

  // Real formula simulation based on card specifics
  const calculateRewardYieldForCard = (targetCard: CreditCard) => {
    let monthlyPoints = 0;
    let monthlyCashbackRupees = 0;

    if (targetCard.id === 'hdfc-regalia-gold') {
      const travelPoints = (spends.flightsHotels / 150) * 20; // 5X RP on partner brands & travel
      const regularSpend = totalMonthlySpend - spends.flightsHotels - spends.fuel;
      const regularPoints = (Math.max(0, regularSpend) / 150) * 4;
      monthlyPoints = travelPoints + regularPoints;
      monthlyCashbackRupees = monthlyPoints * 0.65; // Up to ₹0.65 on flights, hotels & Gold Catalogue
    } else if (targetCard.id === 'hdfc-infinia-metal') {
      const travelPoints = Math.min(10000, (spends.flightsHotels / 150) * 50); // up to 10X RP on flights & hotels via SmartBuy (capped at 10k bonus RP/mo)
      const regularSpend = totalMonthlySpend - spends.flightsHotels - spends.fuel;
      const regularPoints = (Math.max(0, regularSpend) / 150) * 5; // 5 RP per ₹150 base (~3.33%)
      monthlyPoints = travelPoints + regularPoints;
      monthlyCashbackRupees = monthlyPoints * 1.0; // 1 RP = ₹1.00
    } else if (targetCard.id === 'hdfc-diners-black') {
      const travelPoints = Math.min(7500, (spends.flightsHotels / 150) * 20);
      const regularSpend = totalMonthlySpend - spends.flightsHotels - spends.fuel;
      const regularPoints = (Math.max(0, regularSpend) / 150) * 5;
      monthlyPoints = travelPoints + regularPoints;
      monthlyCashbackRupees = monthlyPoints * 1.0;
    } else if (targetCard.id === 'sbi-cashback') {
      const onlineCashback = Math.min(2000, spends.onlineShopping * 0.05); // Capped at ₹2,000/statement cycle
      const otherSpend = totalMonthlySpend - spends.onlineShopping - spends.fuel - spends.utilities;
      const otherCashback = Math.min(2000, Math.max(0, otherSpend) * 0.01); // Capped at ₹2,000/statement cycle
      monthlyCashbackRupees = onlineCashback + otherCashback;
      monthlyPoints = monthlyCashbackRupees;
    } else if (targetCard.id === 'indusind-tiger') {
      // IndusInd Tiger: Lifetime Free (₹0 fee)
      // Up to 6X accelerated rewards per ₹100 spent (milestones, 1 RP = ₹0.40 or 1:1 Air India miles)
      const acceleratedSpend = Math.min(83333, (spends.onlineShopping + spends.flightsHotels));
      const acceleratedPoints = Math.min(5000, (acceleratedSpend / 100) * 6);
      const otherSpend = Math.max(0, totalMonthlySpend - acceleratedSpend - spends.fuel);
      const regularPoints = (otherSpend / 100) * 1.5;
      monthlyPoints = acceleratedPoints + regularPoints;
      monthlyCashbackRupees = monthlyPoints * 0.40;
    } else if (targetCard.id === 'scapia-federal') {
      // 20% rewards on Scapia app travel bookings (flights/stays/experiences)
      // 10% rewards on Visa spends, 5% on RuPay UPI (5 Coins = ₹1)
      const travelCoins = spends.flightsHotels * 1.0; // 20% value back = 1 coin per ₹1 spent (5 coins = ₹1)
      const otherSpend = Math.max(0, totalMonthlySpend - spends.flightsHotels - spends.fuel);
      const otherCoins = otherSpend * 0.10; // 10% Scapia Coins
      monthlyPoints = travelCoins + otherCoins;
      monthlyCashbackRupees = monthlyPoints * 0.20; // 5 Coins = ₹1
    } else if (targetCard.id === 'tata-neu-infinity') {
      monthlyCashbackRupees = (spends.onlineShopping * 0.05) + (spends.grocery * 0.05) + (spends.offline * 0.015);
      monthlyPoints = monthlyCashbackRupees;
    } else if (targetCard.id === 'icici-amazon-pay') {
      monthlyCashbackRupees = (spends.onlineShopping * 0.05) + (spends.utilities * 0.02) + (spends.offline * 0.01);
      monthlyPoints = monthlyCashbackRupees;
    } else {
      monthlyCashbackRupees = (totalMonthlySpend - spends.fuel) * 0.018;
      monthlyPoints = monthlyCashbackRupees;
    }

    const annualGrossCash = Math.round(monthlyCashbackRupees * 12);

    // Fee waiver check
    let waiverLimit = 300000;
    if (targetCard.id === 'hdfc-regalia-gold') waiverLimit = 400000;
    else if (targetCard.id === 'hdfc-infinia-metal') waiverLimit = 1000000;
    else if (targetCard.id === 'hdfc-diners-black') waiverLimit = 800000;
    else if (targetCard.id === 'sbi-cashback') waiverLimit = 200000;
    else if (targetCard.id === 'tata-neu-infinity') waiverLimit = 300000;
    else if (targetCard.id === 'axis-magnus') waiverLimit = 2500000;
    else if (targetCard.isLifetimeFree) waiverLimit = 0;

    const isWaived = targetCard.isLifetimeFree || totalAnnualSpend >= waiverLimit;
    const feeSaved = isWaived && !targetCard.isLifetimeFree ? targetCard.annualFee : 0;
    const feeToPay = isWaived ? 0 : targetCard.annualFee;

    // Lounge check
    let isLoungeUnlocked = true;
    if (targetCard.domesticLoungesPerQuarter === 0) isLoungeUnlocked = false;
    else if (targetCard.id === 'hdfc-regalia-gold') isLoungeUnlocked = quarterlySpend >= 60000;
    else if (targetCard.id === 'indusind-tiger') isLoungeUnlocked = true; // 2 domestic lounges/quarter complimentary via card
    else if (targetCard.id === 'scapia-federal') isLoungeUnlocked = totalMonthlySpend >= 20000;

    const netAnnualProfit = annualGrossCash + feeSaved - feeToPay;
    const netReturnRate = totalAnnualSpend > 0 ? ((netAnnualProfit / totalAnnualSpend) * 100).toFixed(1) : '0.0';

    return {
      monthlyPoints: Math.round(monthlyPoints),
      monthlyRupees: Math.round(monthlyCashbackRupees),
      annualRupees: annualGrossCash,
      isWaived,
      feeSaved,
      waiverLimit,
      isLoungeUnlocked,
      netAnnualProfit,
      netReturnRate,
    };
  };

  const currentYield = calculateRewardYieldForCard(card);

  // Judge and Rank All Cards for This Spend Level
  const spendRankedCards = cards.map(c => {
    const yieldInfo = calculateRewardYieldForCard(c);
    return {
      card: c,
      yieldInfo,
    };
  }).sort((a, b) => b.yieldInfo.netAnnualProfit - a.yieldInfo.netAnnualProfit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-28 text-slate-900">

      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Calculator className="w-4 h-4 text-emerald-600" />
          <span>Credit Card Yield & Spend Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Reward Points & Spend Judgment Engine
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl font-medium">
          Enter your estimated category spends. CARDWATCH calculates exact rewards, verifies annual fee waivers, tests airport lounge spend thresholds, and ranks the best card for your spend.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Spending Breakdown Inputs */}
        <div className="lg:col-span-7 space-y-6">

          {/* Card Selector */}
          <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-3">
            <label className="text-xs font-mono font-extrabold text-emerald-800 uppercase block">
              Choose Card to Inspect:
            </label>
            <select
              value={selectedCardId}
              onChange={e => {
                sound.playClick();
                setSelectedCardId(e.target.value);
              }}
              className="w-full p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-300 text-slate-900 font-extrabold text-sm focus:outline-none focus:border-emerald-500"
            >
              {cards.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.bank}) — {c.isLifetimeFree ? 'LTF' : `₹${c.annualFee}/yr`}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly category sliders */}
          <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono">
                Monthly Category Spends
              </h3>
              <div className="text-right">
                <span className="font-mono text-base text-emerald-700 font-extrabold block">
                  ₹{totalMonthlySpend.toLocaleString('en-IN')} / mo
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  (₹{totalAnnualSpend.toLocaleString('en-IN')} / year)
                </span>
              </div>
            </div>

            {[
              { key: 'onlineShopping', label: '🛍️ Online Shopping (Amazon / Flipkart / Myntra)', min: 0, max: 100000, step: 2000 },
              { key: 'flightsHotels', label: '✈️ Flights & Hotel Bookings', min: 0, max: 150000, step: 5000 },
              { key: 'dining', label: '🍔 Dining & Food Delivery (Swiggy / Zomato)', min: 0, max: 50000, step: 1000 },
              { key: 'grocery', label: '🛒 Grocery & Supermarkets (Blinkit / Zepto / BigBasket)', min: 0, max: 50000, step: 1000 },
              { key: 'fuel', label: '⛽ Fuel & Petrol Pumps', min: 0, max: 25000, step: 1000 },
              { key: 'utilities', label: '⚡ Utilities & Mobile Recharges', min: 0, max: 30000, step: 1000 },
              { key: 'offline', label: '🏪 General Offline Store Swipes', min: 0, max: 100000, step: 2000 },
            ].map(item => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-mono font-extrabold text-slate-900">
                    ₹{spends[item.key as keyof typeof spends].toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={spends[item.key as keyof typeof spends]}
                  onChange={e => handleSpendChange(item.key as keyof typeof spends, Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Calculated Yield & Rewards Summary */}
        <div className="lg:col-span-5 space-y-6">

          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-400 shadow-xl space-y-6">

            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-700 font-bold">
                  {card.bank}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {card.name}
                </h3>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs font-mono shadow-md">
                {currentYield.netReturnRate}% Net Return
              </span>
            </div>

            {/* Main Value Display */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div>
                <span className="text-xs text-slate-600 font-bold block">Net Annual Profit:</span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-700">
                  ₹{currentYield.netAnnualProfit.toLocaleString('en-IN')}
                </div>
                <span className="text-xs text-slate-500 font-semibold">
                  (₹{currentYield.monthlyRupees.toLocaleString('en-IN')} / mo in statement credit or travel vouchers)
                </span>
              </div>

              <div className="pt-3 border-t border-emerald-200 flex justify-between text-xs font-bold">
                <span className="text-slate-700">Monthly Points Yield:</span>
                <span className="font-mono text-emerald-800">
                  {currentYield.monthlyPoints.toLocaleString('en-IN')} Points
                </span>
              </div>
            </div>

            {/* Fee Waiver Status Indicator */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-2 text-xs">
              <span className="font-bold text-slate-900 block">Annual Fee Waiver Judgment:</span>
              {card.isLifetimeFree ? (
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Card is unconditionally Lifetime Free (₹0 fee forever)</span>
                </div>
              ) : currentYield.isWaived ? (
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Annual spend (₹{totalAnnualSpend.toLocaleString('en-IN')}) meets waiver threshold! ₹{card.annualFee.toLocaleString('en-IN')} fee 100% WAIVED.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-800 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Annual spend is ₹{(totalAnnualSpend / 100000).toFixed(1)}L. Need ₹{((currentYield.waiverLimit - totalAnnualSpend) / 100000).toFixed(1)}L more to waive ₹{card.annualFee} fee.</span>
                </div>
              )}
            </div>

            {/* Lounge Status */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-1.5 text-xs">
              <span className="font-bold text-slate-900 block">Quarterly Lounge Spend Feasibility:</span>
              {currentYield.isLoungeUnlocked ? (
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your ₹{(quarterlySpend / 1000).toFixed(0)}k/quarter spend qualifies for domestic lounge visits!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-800 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Your quarterly spend is below the bank lounge spend threshold ({card.loungeSpendCondition}).</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onSelectCard(card.id);
              }}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
            >
              <span>Explore Complete Specs & Helplines</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>

      {/* SPEND JUDGMENT LEADERBOARD: TOP CARDS RANKED FOR YOUR SPEND */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Which Card Wins At Your Spend? (Referral Leaderboard)
              </h3>
              <p className="text-xs text-slate-500">
                Mathematical ranking of top credit cards evaluated for ₹{totalMonthlySpend.toLocaleString('en-IN')}/mo (₹{totalAnnualSpend.toLocaleString('en-IN')}/yr)
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full shrink-0">
            Top 5 Evaluated Matches
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spendRankedCards.slice(0, 6).map((item, idx) => (
            <div
              key={item.card.id}
              onClick={() => {
                sound.playClick();
                onSelectCard(item.card.id);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                idx === 0
                  ? 'bg-emerald-50/70 border-2 border-emerald-400 shadow-md ring-2 ring-emerald-300/40'
                  : 'bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                    idx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {idx === 0 ? '🏆 #1 TOP SPEND MATCH' : `#${idx + 1} ALTERNATIVE`}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    {item.yieldInfo.netReturnRate}% Return
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">
                  {item.card.bank}
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1">
                  {item.card.name}
                </h4>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-emerald-100 space-y-1">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500 font-medium">Net Annual Profit:</span>
                  <span className="font-mono font-black text-emerald-700 text-sm">
                    +₹{item.yieldInfo.netAnnualProfit.toLocaleString('en-IN')}/yr
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                  <span>Fee Status:</span>
                  <span className={item.yieldInfo.isWaived ? 'text-emerald-700 font-bold' : 'text-slate-700'}>
                    {item.yieldInfo.isWaived ? '✓ Fee Waived' : `₹${item.card.annualFee} fee`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-700 font-bold pt-1">
                <span>View Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
