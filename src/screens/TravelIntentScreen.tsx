import React, { useState } from 'react';
import { ALL_CREDIT_CARDS } from '../data/cards';
import { sound } from '../utils/audio';
import {
  Plane,
  ArrowRight,
  Coins,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Compass,
  Check,
  AlertTriangle,
  Info,
  Globe
} from 'lucide-react';

import { CreditCard } from '../types';

interface TravelIntentScreenProps {
  cards?: CreditCard[];
  onSelectCard: (cardId: string) => void;
  onNavigate?: (screen: any) => void;
}

interface FlightCardProfile {
  id: string;
  name: string;
  bank: string;
  badge: string;
  flightDiscount: string;
  flightDiscountHighlight: string;
  loungePrivilege: string;
  loungeCondition: string;
  isUnconditionalLounge: boolean;
  guestAccess: string;
  forexMarkup: string;
  annualFee: string;
  smartBuyYield: string;
  tags: ('discount' | 'lounge' | 'guest' | 'forex' | 'miles')[];
}

const FLIGHT_AND_LOUNGE_CARDS: FlightCardProfile[] = [
  {
    id: 'hdfc-infinia-metal',
    name: 'HDFC Bank Infinia Credit Card Metal Edition',
    bank: 'HDFC Bank',
    badge: '🏆 #1 KING OF FLIGHTS & LOUNGES (INVITE-ONLY)',
    flightDiscount: 'Up to 33.3% Return (Up to 10X RP via SmartBuy)',
    flightDiscountHighlight: '5 RP per ₹150 base (~3.33%) + up to 10X on SmartBuy flights & hotels (33.3%). 1 RP = ₹1 on flights, hotels, Apple, Tanishq or 1:1 air miles',
    loungePrivilege: 'Unlimited Complimentary Domestic & International Lounges (Priority Pass)',
    loungeCondition: 'Strictly 0 Spend Threshold (Unconditional access for primary & add-on members)',
    isUnconditionalLounge: true,
    guestAccess: 'Unlimited Priority Pass access for primary and verified add-on cardholders',
    forexMarkup: '2.0% Forex markup (Low foreign currency fee)',
    annualFee: '₹12,500 + GST (Waived on ₹10L spend; 12,500 renewal points + Club Marriott)',
    smartBuyYield: '33.3% on Flights & Hotels',
    tags: ['discount', 'lounge', 'guest'],
  },
  {
    id: 'amex-platinum',
    name: 'American Express Platinum Card',
    bank: 'American Express',
    badge: '👑 ULTIMATE GLOBAL LUXURY & FREE GUESTS',
    flightDiscount: '1 MR / ₹40 + 5X Points Multiplier + ₹45,000 Vouchers',
    flightDiscountHighlight: 'Complimentary airline voucher packs, Taj & Marriott Gold status, dedicated 24/7 Platinum Travel Concierge',
    loungePrivilege: 'Centurion Lounges, Delta SkyClub, Priority Pass, Plaza Premium Worldwide',
    loungeCondition: 'Strictly 0 Spend Threshold (Unconditional VIP entry)',
    isUnconditionalLounge: true,
    guestAccess: '2 FREE COMPLIMENTARY GUESTS PER VISIT (Save ₹3,000+ per lounge visit)',
    forexMarkup: '3.5% (Specialized luxury hotel benefits & concierge flight bookings)',
    annualFee: '₹60,000 (Non-waivable luxury metal card)',
    smartBuyYield: '5X Multiplier on Reward Xcelerator',
    tags: ['lounge', 'guest'],
  },
  {
    id: 'hdfc-diners-black',
    name: 'HDFC Diners Club Black Metal Edition',
    bank: 'HDFC Bank',
    badge: '💎 33.3% FLIGHT YIELD + UNLIMITED LOUNGES',
    flightDiscount: 'Up to 33.3% Return via SmartBuy Flights',
    flightDiscountHighlight: '10X Reward Points on SmartBuy flight tickets (1 pt = ₹1.00 directly for air tickets)',
    loungePrivilege: 'Unlimited Domestic & International Lounges at 1,300+ airports globally',
    loungeCondition: 'Strictly 0 Spend Threshold (Unconditional entry)',
    isUnconditionalLounge: true,
    guestAccess: 'Complimentary lounge access for verified add-on cardholders',
    forexMarkup: '2.0% Forex markup',
    annualFee: '₹10,000 (Waived on ₹8L spend)',
    smartBuyYield: '33.3% on Flights',
    tags: ['discount', 'lounge', 'guest'],
  },
  {
    id: 'axis-atlas',
    name: 'Axis Bank Atlas Credit Card',
    bank: 'Axis Bank',
    badge: '🛫 BEST AIRLINE MILES TRANSFER (1:2)',
    flightDiscount: '5 EDGE Miles per ₹100 on Travel (capped at ₹2L spend/mo)',
    flightDiscountHighlight: '1:2 Airline & Hotel Transfer (1 EDGE Mile = 2 partner miles on Accor ALL, Singapore KrisFlyer, Qatar Airways, Air India - up to 10%-15% return)',
    loungePrivilege: 'Up to 18 Domestic + 12 International Lounge Visits per year (Platinum Tier)',
    loungeCondition: 'Tier-based status maintenance (Silver: 8D/4I, Gold: 12D/6I, Platinum: 18D/12I)',
    isUnconditionalLounge: false,
    guestAccess: 'Tier-based lounge access for primary cardholders and companions',
    forexMarkup: '3.5% Forex markup',
    annualFee: '₹5,000 + GST (Milestone & tier bonus miles offset fee)',
    smartBuyYield: '1:2 Direct Airline Transfer',
    tags: ['discount', 'miles'],
  },
  {
    id: 'scapia-federal',
    name: 'Federal Bank Scapia Credit Card',
    bank: 'Federal Bank',
    badge: '🌍 BEST 0% FOREX & COMPLIMENTARY LOUNGE',
    flightDiscount: '20% Rewards on Travel Bookings via Scapia App',
    flightDiscountHighlight: '20% rewards on travel bookings (flights, stays, trains, buses, visas, experiences) via Scapia app (5 Coins = ₹1 with no redemption cap) + 0% Forex across 180+ countries',
    loungePrivilege: 'Unlimited Domestic Airport Lounge Visits + Airport Dining/Shopping Perks',
    loungeCondition: '₹20,000 monthly spend threshold in preceding billing cycle (also unlocks dining & shopping privileges up to ₹1,000)',
    isUnconditionalLounge: false,
    guestAccess: 'Single cardholder entry; companions charged at terminal rate',
    forexMarkup: '0.0% FOREX (Zero forex markup across 180+ countries)',
    annualFee: 'Nil Joining Fee & Nil Annual Fee (Lifetime Free unconditionally)',
    smartBuyYield: '20% Travel Rewards',
    tags: ['discount', 'forex', 'lounge', 'rupay'],
  },
  {
    id: 'hdfc-regalia-gold',
    name: 'HDFC Bank Regalia Gold Credit Card',
    bank: 'HDFC Bank',
    badge: '✈️ ACCESSIBLE PREMIUM TRAVEL & SMARTBUY',
    flightDiscount: '4 RP / ₹150 + 5X on Partner Brands & Flights (Up to ₹0.65/RP)',
    flightDiscountHighlight: '4 RP per ₹150 base + 5X on partner lifestyle brands (Myntra, Nykaa, Reliance Digital, M&S). 1 RP is valued up to ₹0.65 against flights and hotels',
    loungePrivilege: '3 Domestic Lounge visits per quarter + Priority Pass (6 International visits/yr)',
    loungeCondition: 'Spends of ₹60,000 or more in preceding calendar quarter for domestic lounges',
    isUnconditionalLounge: false,
    guestAccess: 'Primary cardholder; international Priority Pass covers member (6 visits/yr)',
    forexMarkup: '2.0% Forex markup',
    annualFee: '₹2,500 + taxes (Waived on ₹4L annual spend)',
    smartBuyYield: 'Up to ₹0.65 per RP',
    tags: ['discount', 'lounge'],
  },
];

const TRAVEL_DESTINATION_RULES = [
  {
    destination: 'Dubai (UAE) & Middle East',
    currency: 'AED',
    recommendedCards: ['scapia-federal', 'hdfc-infinia-metal', 'hdfc-regalia-gold'],
    keyTips: [
      'Scapia provides 0% forex markup on AED dirham retail shopping in Dubai Mall & Gold Souk.',
      'HDFC Infinia gives international lounge access with unlimited Priority Pass + guest visits.',
      'Always select "Pay in Local Currency (AED)" at the card swipe machine — never accept dynamic currency conversion (DCC) to INR.',
    ],
  },
  {
    destination: 'Europe & Schengen Area',
    currency: 'EUR',
    recommendedCards: ['scapia-federal', 'hdfc-infinia-metal', 'tata-neu-infinity'],
    keyTips: [
      'Contactless NFC tap-to-pay is mandatory across London Underground, Paris Metro, and European trains.',
      'PIN is always required for amounts above €50.',
      'Ensure international contactless payments are toggled "ON" in your Indian banking app before boarding.',
    ],
  },
  {
    destination: 'USA & North America',
    currency: 'USD',
    recommendedCards: ['scapia-federal', 'hdfc-infinia-metal', 'amex-platinum'],
    keyTips: [
      'Visa and Mastercard are accepted universally; American Express gives access to Centurion lounges in NYC, SFO, LAX.',
      'Tips (18-22%) in US restaurants are authorized after your base bill is swiped — keep international limits active.',
      'Zero forex cards save ₹4,130 on every $1,000 spent.',
    ],
  },
  {
    destination: 'Southeast Asia (Singapore, Thailand, Bali)',
    currency: 'SGD / THB / IDR',
    recommendedCards: ['scapia-federal', 'hdfc-regalia-gold', 'hdfc-infinia-metal'],
    keyTips: [
      'Carry Scapia for zero forex on hotel check-in deposits and Grab taxi rides.',
      'In Thailand, local ATMs charge an extra 220 THB (~₹550) per withdrawal; swipe card wherever possible.',
      'Singapore Changi Airport lounges honor Priority Pass and DreamFolks passes seamlessly.',
    ],
  },
];

export const TravelIntentScreen: React.FC<TravelIntentScreenProps> = ({ onSelectCard }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'discount' | 'lounge' | 'guest' | 'forex'>('all');
  const [annualFlightSpend, setAnnualFlightSpend] = useState<number>(100000);
  const [annualLoungeVisits, setAnnualLoungeVisits] = useState<number>(8);
  const [selectedDestIndex, setSelectedDestIndex] = useState<number>(0);

  // Calculations
  const estimatedFlightSavings = Math.round(annualFlightSpend * 0.333); // Infinia potential
  const estimatedLoungeBuffetValue = annualLoungeVisits * 1500; // ₹1,500 per lounge buffet/comfort
  const totalTravelValueUnlocked = estimatedFlightSavings + estimatedLoungeBuffetValue;

  const filteredCards = FLIGHT_AND_LOUNGE_CARDS.filter(c => {
    if (activeTab === 'all') return true;
    return c.tags.includes(activeTab);
  });

  const activeDest = TRAVEL_DESTINATION_RULES[selectedDestIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-28 text-slate-900">

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-black text-emerald-800 uppercase tracking-widest mb-3 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs">
            <Plane className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>AIRPLANE MODE • FLIGHT DISCOUNTS & LUXURY LOUNGE RADAR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Best Cards for <span className="text-emerald-700 underline decoration-emerald-300 underline-offset-8">Flights & Lounges</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl font-medium leading-relaxed">
            Stop booking flights at sticker price and getting turned away at lounge counters. Compare the cards that give up to 33.3% flight discounts, zero forex on foreign airfares, and unconditional airport lounge access.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold shrink-0">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Up to ₹{totalTravelValueUnlocked.toLocaleString('en-IN')}/yr Value Unlocked</span>
        </div>
      </div>

      {/* INTERACTIVE FLIGHT DISCOUNT & LOUNGE SAVINGS CALCULATOR */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-300 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-black bg-emerald-600 text-white px-2 py-0.5 rounded">
                SIMULATOR
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Your Annual Flight & Airport Lounge Savings Potential
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust your flight booking volume and lounge frequency to see real cash benefits.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono uppercase font-bold text-slate-500 block">Total Benefit</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
              ₹{totalTravelValueUnlocked.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">/ yr</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider 1: Annual Flight Spends */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Annual Flight Ticket Spends</span>
              <span className="font-mono text-emerald-800 text-sm">
                ₹{annualFlightSpend.toLocaleString('en-IN')} / yr
              </span>
            </div>
            <input
              type="range"
              min="25000"
              max="500000"
              step="25000"
              value={annualFlightSpend}
              onChange={e => setAnnualFlightSpend(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-100 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>₹25k (Domestic trips)</span>
              <span>₹2.5L (Family holiday)</span>
              <span>₹5L+ (Frequent flyer)</span>
            </div>
          </div>

          {/* Slider 2: Lounge Visits */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Airport Lounge Visits (Self + Family)</span>
              <span className="font-mono text-emerald-800 text-sm">
                {annualLoungeVisits} Visits / yr
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              step="2"
              value={annualLoungeVisits}
              onChange={e => setAnnualLoungeVisits(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-100 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>2 Visits/yr</span>
              <span>8 Visits (Quarterly flyer)</span>
              <span>24 Visits (VIP Flyer)</span>
            </div>
          </div>
        </div>

        {/* Output Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">Flight Discounts</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
              ₹{estimatedFlightSavings.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Via SmartBuy 33.3% points yield on Air India, Indigo, Emirates
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">Lounge Buffet & Comfort</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
              ₹{estimatedLoungeBuffetValue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Free food buffets, high-speed Wi-Fi & quiet terminal seating
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">0% Forex Savings</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
              ₹4,130 <span className="text-xs font-normal text-slate-500">/ ₹1L spend</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Avoiding 3.5% + 18% GST markup on international flight booking
            </p>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Top Flight & Airport Lounge Cards Ranked</span>
          </h3>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Champions (6)' },
              { id: 'discount', label: '✈️ 33% Flight Discounts' },
              { id: 'lounge', label: '🛋️ Unlimited Lounges' },
              { id: 'guest', label: '👥 Free Companion / Guests' },
              { id: 'forex', label: '🌍 0% Forex' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-emerald-50/70 text-slate-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-3xl bg-white border-2 border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                {/* Badge & Bank */}
                <div>
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 block w-fit mb-1.5">
                    {c.badge}
                  </span>
                  <span className="text-xs font-mono uppercase text-emerald-700 font-bold block">
                    {c.bank}
                  </span>
                  <h4
                    onClick={() => {
                      sound.playClick();
                      onSelectCard(c.id);
                    }}
                    className="text-base sm:text-lg font-black text-slate-950 group-hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {c.name}
                  </h4>
                </div>

                {/* 1. FLIGHT DISCOUNT PRIVILEGE */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900">
                    <Plane className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Flight Discount Power:</span>
                  </div>
                  <div className="text-sm font-black text-emerald-800 font-mono">
                    {c.flightDiscount}
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    {c.flightDiscountHighlight}
                  </p>
                </div>

                {/* 2. LOUNGE PRIVILEGE & ACCESS CONDITIONS */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">Lounge Privilege:</span>
                    {c.isUnconditionalLounge ? (
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        0 SPEND BARRIER
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        SPEND THRESHOLD
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-800 leading-snug">
                    {c.loungePrivilege}
                  </div>
                  <div className="pt-1 text-[11px] text-slate-500 font-medium">
                    <strong className="text-slate-700">Access Condition:</strong> {c.loungeCondition}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    <strong className="text-slate-700">Guest Access:</strong> {c.guestAccess}
                  </div>
                </div>

                {/* Micro Meta (Forex & Fee) */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div className="p-2 rounded-xl bg-emerald-50/40 border border-emerald-100">
                    <span className="text-slate-500 block font-bold">Forex Rate:</span>
                    <span className="text-slate-900 font-black">{c.forexMarkup}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/40 border border-emerald-100">
                    <span className="text-slate-500 block font-bold">Annual Fee:</span>
                    <span className="text-slate-900 font-black">{c.annualFee}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-emerald-100">
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectCard(c.id);
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 group-hover:scale-[1.01]"
                >
                  <span>Select Card Specs & Toll-Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 CRITICAL FLIGHT BOOKING & LOUNGE RULES (INDUSTRY SECRETS) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-emerald-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              4 Critical Flight Booking & Lounge Rules to Remember
            </h3>
            <p className="text-xs text-slate-500">Essential wisdom to prevent airport rejection and save thousands on airfares.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold flex items-center justify-center">1</span>
              <h4 className="text-xs font-bold text-slate-900">Always Book via SmartBuy for 33.3% Return</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium pl-7">
              Booking directly on Indigo or Air India website earns 1–2% points. Booking the exact same flight via HDFC SmartBuy on Infinia or Diners Black earns 5X to 10X points (equivalent to 16.6%–33.3% cash discount).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-xs font-mono font-bold flex items-center justify-center">2</span>
              <h4 className="text-xs font-bold text-rose-950">Never Swipe Priority Pass at Indian Domestic Terminals</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium pl-7">
              Indian banks charge $32 + 18% GST (~₹3,200) if you swipe Priority Pass at Delhi, Mumbai, or Bengaluru domestic terminals! Always tap your physical credit card or use DreamFolks QR for domestic lounges.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold flex items-center justify-center">3</span>
              <h4 className="text-xs font-bold text-slate-900">Free Companion Access: Amex Platinum & Diners Black</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium pl-7">
              Most Indian cards charge ₹1,500+ if your spouse or child joins you in the lounge. American Express Platinum allows 2 guests completely free, and Diners Black covers add-on cardholders with 0 spend conditions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold flex items-center justify-center">4</span>
              <h4 className="text-xs font-bold text-slate-900">Watch Out for Foreign Airline Currency Conversion</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium pl-7">
              Booking international airlines (Emirates, Singapore Airlines, Qatar Airways) often processes transactions outside India, triggering a 4.13% forex surcharge unless paid with a zero-forex card (Scapia) or low-forex card.
            </p>
          </div>
        </div>
      </div>

      {/* DESTINATION QUICK SELECTOR (PRESERVED DESTINATION GUIDE) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <span>Destination-Specific Flight & Currency Guidelines</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Field-tested tips for international flights & shopping
          </span>
        </div>

        {/* Destination Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRAVEL_DESTINATION_RULES.map((dest, i) => (
            <button
              key={i}
              onClick={() => {
                sound.playClick();
                setSelectedDestIndex(i);
              }}
              className={`p-4 rounded-2xl text-left border transition-all ${
                selectedDestIndex === i
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 font-bold'
                  : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <MapPin className={`w-4 h-4 shrink-0 ${selectedDestIndex === i ? 'text-white' : 'text-emerald-600'}`} />
                <span className="font-mono text-xs font-bold uppercase">{dest.currency}</span>
              </div>
              <div className="text-xs font-extrabold line-clamp-1">{dest.destination.split('(')[0]}</div>
            </button>
          ))}
        </div>

        {/* Selected Destination Intel */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-800 uppercase block">
            {activeDest.destination} Travel & Airport Advice:
          </span>
          <div className="space-y-2">
            {activeDest.keyTips.map((tip, i) => (
              <div key={i} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800 font-medium flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
