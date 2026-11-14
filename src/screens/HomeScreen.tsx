import React, { useState } from 'react';
import { CreditCard, ScreenType, UserProfile } from '../types';
import { FloatingCardDeck } from '../components/FloatingCardDeck';
import { AnimatedVaultChamber } from '../components/AnimatedVaultChamber';
import { sound } from '../utils/audio';
import {
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Search,
  Plane
} from 'lucide-react';

interface HomeScreenProps {
  cards: CreditCard[];
  onNavigate: (screen: ScreenType) => void;
  onSelectCard: (cardId: string) => void;
  userProfile: UserProfile | null;
  onOpenSearch: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  cards,
  onNavigate,
  onSelectCard,
  userProfile,
  onOpenSearch,
}) => {
  const [selectedDiffCardId, setSelectedDiffCardId] = useState<string>('hdfc-regalia-gold');

  const diffCard = cards.find(c => c.id === selectedDiffCardId) || cards[0];

  const handleAction = (screen: ScreenType) => {
    sound.playClick();
    onNavigate(screen);
  };

  const recentlyUpdatedCards = cards.filter(c => c.recentChangeAlert).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 text-slate-900">

      {/* HERO SECTION (Cinematic Moving Chamber & Real 3D Deck) */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 border-2 border-emerald-200/90 bg-white/85 backdrop-blur-xl shadow-2xl shadow-emerald-600/10 overflow-hidden">
          {/* Moving 3D Chamber Background in Hero */}
          <AnimatedVaultChamber className="opacity-90" />

          {/* Ambient Glow Orbs */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-44 bg-gradient-to-r from-emerald-200/40 via-teal-100/50 to-emerald-300/40 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute -bottom-24 right-0 w-80 h-40 bg-emerald-200/30 blur-2xl pointer-events-none rounded-full" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* Left Text Column */}
            <div className="lg:col-span-7 space-y-6 text-left">

              {/* Live Intelligence Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 border border-emerald-300 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <span className="text-xs font-bold text-emerald-800 tracking-wide font-mono">
                  CARDWATCH INTEL • VERIFIED INDIAN BANK RADAR
                </span>
              </div>

              {/* Main Hero Headline (Pure White & Green Theme) */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
                Know what your bank changes{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500">
                  before it costs you money.
                </span>
              </h1>

              {/* Hero Subtitle */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
                Indian banks are quietly slashing airport lounges, capping online cashback, and imposing spend thresholds. CARDWATCH tracks every circular so you never swipe with outdated expectations.
              </p>

              {/* Quick Interactive Search Bar */}
              <div className="pt-2">
                <div
                  onClick={onOpenSearch}
                  className="w-full max-w-xl p-3 rounded-2xl bg-white border-2 border-emerald-300 hover:border-emerald-500 transition-all cursor-pointer shadow-lg shadow-emerald-500/10 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 pl-3">
                    <Search className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-slate-500 font-medium">
                      Search HDFC, ICICI, Lounge rules, 0% Forex...
                    </span>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onOpenSearch();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <span>Explore Cards</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Symmetrical Action Pills */}
              <div className="pt-1 flex flex-wrap gap-2.5 text-xs font-bold">
                <button
                  onClick={() => handleAction('changes')}
                  className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                  <span>Recent Devaluations</span>
                </button>
                <button
                  onClick={() => handleAction('compare')}
                  className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Compare & Recommend</span>
                </button>
                <button
                  onClick={() => handleAction('tailor')}
                  className="px-4 py-2 rounded-xl bg-white text-slate-800 hover:bg-emerald-50 border border-emerald-200 transition-colors shadow-sm"
                >
                  Tailor My Card
                </button>
                <button
                  onClick={() => handleAction('travel-intent')}
                  className="px-4 py-2 rounded-xl bg-white text-slate-800 hover:bg-emerald-50 border border-emerald-200 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plane className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Airplane Mode</span>
                </button>
              </div>

              {/* Micro stats */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-emerald-100 max-w-xl">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">14+ Banks</div>
                  <div className="text-xs text-slate-500 font-bold">Tracked Daily</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-rose-600 font-mono">38 Slashed</div>
                  <div className="text-xs text-slate-500 font-bold">Lounge Rules</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono">100% Free</div>
                  <div className="text-xs text-slate-500 font-bold">Zero Referral Bias</div>
                </div>
              </div>

            </div>

            {/* Right Floating Deck Column (Pure White & Green Style) */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <FloatingCardDeck
                onSelectCard={onSelectCard}
                onExploreChanges={() => handleAction('changes')}
              />
            </div>

          </div>
        </div>
      </section>

      {/* LIVE BANK ANNOUNCEMENT BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-6 rounded-3xl bg-white border-2 border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-emerald-500/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-rose-700">
                  Official Bank Notice
                </span>
                <span className="text-xs text-emerald-700 font-bold">• Effective Dec 1, 2024</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                <strong className="text-emerald-700">HDFC Regalia Gold:</strong> 3 domestic airport lounge visits per calendar quarter unlock on ₹60,000 spend in preceding quarter + 6 international visits via Priority Pass.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={() => handleAction('changes')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md"
            >
              <span>See All 6 Changes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE OLD-VERSUS-NEW BENEFIT COMPARISON (Pure White & Green) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-6">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider mb-2">
                <TrendingDown className="w-4 h-4" />
                <span>Side-by-Side Devaluation Inspector</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Before vs. After: The Real Impact on Your Spends
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mt-1 font-medium">
                Banks often disguise major cuts in 20-page legal PDF notices. Here is exactly what was taken away.
              </p>
            </div>

            {/* Card selector pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'amex-platinum', name: 'Amex Platinum (Metal)' },
                { id: 'hdfc-infinia-metal', name: 'HDFC Infinia (Invite-Only)' },
                { id: 'hdfc-diners-black', name: 'HDFC Diners Black (Metal)' },
                { id: 'hdfc-regalia-gold', name: 'HDFC Regalia Gold' },
                { id: 'indusind-tiger', name: 'IndusInd Tiger (LTF)' },
                { id: 'idfc-first-wealth', name: 'IDFC FIRST Wealth (LTF)' },
                { id: 'icici-amazon-pay', name: 'Amazon Pay ICICI (LTF)' },
                { id: 'kiwi-axis-rupay', name: 'Kiwi Axis Kwik (LTF)' },
                { id: 'icici-sapphiro', name: 'ICICI Sapphiro' },
                { id: 'tata-neu-infinity', name: 'Tata Neu Infinity' },
                { id: 'amex-plat-travel', name: 'Amex Plat Travel' },
                { id: 'scapia-federal', name: 'Scapia Federal' },
                { id: 'axis-magnus', name: 'Axis Magnus' },
                { id: 'sbi-cashback', name: 'SBI Cashback' },
                { id: 'axis-atlas', name: 'Axis ATLAS' },
                { id: 'flipkart-axis', name: 'Flipkart Axis' },
                { id: 'swiggy-hdfc', name: 'Swiggy HDFC' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedDiffCardId(item.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedDiffCardId === item.id
                      ? 'bg-emerald-600 text-white font-extrabold shadow-md'
                      : 'bg-white border border-emerald-200 text-slate-700 hover:border-emerald-400'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Side by side diff box */}
          {diffCard && (
            <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-100 gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span>{diffCard.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-200">
                      {diffCard.bank}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Official Verification: <span className="text-emerald-700 font-bold">{diffCard.lastVerifiedDate}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectCard(diffCard.id);
                    }}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-md"
                  >
                    View Toll-Free & Full Specs
                  </button>
                </div>
              </div>

              {/* Side-by-Side Old vs New Conditions */}
              {diffCard.changeHistory && diffCard.changeHistory.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">

                  {/* OLD BENEFIT (Previous Policy) */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/80 border-2 border-rose-300 space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase font-bold text-rose-800 px-2.5 py-0.5 rounded bg-rose-100 border border-rose-300">
                          Old Condition (Previous)
                        </span>
                        <span className="text-xs text-rose-600 font-bold line-through">Discontinued</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">
                        {diffCard.changeHistory[0].title}
                      </h4>

                      <div className="p-3.5 rounded-xl bg-white border border-rose-200 text-sm text-slate-800 font-mono line-through decoration-rose-500">
                        {diffCard.changeHistory[0].oldValue}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium pt-1">
                      Cardholders enjoyed this benefit without spending thresholds or merchant exclusions.
                    </p>
                  </div>

                  {/* NEW BENEFIT (Current Active Policy) */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/80 border-2 border-emerald-400 space-y-3 relative overflow-hidden flex flex-col justify-between shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase font-bold text-white px-2.5 py-0.5 rounded bg-emerald-600 shadow-sm">
                          New Enforced Condition
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-800">
                          Active Now
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">
                        Updated Requirement & Caps
                      </h4>

                      <div className="p-3.5 rounded-xl bg-white border-2 border-emerald-300 text-sm font-bold text-emerald-800 font-mono shadow-sm">
                        {diffCard.changeHistory[0].newValue}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium pt-1">
                      {diffCard.changeHistory[0].summary}
                    </p>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* RECENTLY UPDATED CARDS GRID */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recently Updated Credit Cards
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Verified updates from bank circulars released within the last 60 days.
            </p>
          </div>

          <button
            onClick={() => handleAction('explorer')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Browse All {cards.length} Cards</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentlyUpdatedCards.map(card => (
            <div
              key={card.id}
              onClick={() => {
                sound.playClick();
                onSelectCard(card.id);
              }}
              className="p-6 rounded-3xl bg-white border-2 border-emerald-100 hover:border-emerald-400 cursor-pointer group flex flex-col justify-between shadow-md transition-all"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 font-bold">
                    {card.bank}
                  </span>
                  {card.recentChangeAlert && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                      Revised
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {card.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-medium">
                  {card.headlineBenefit}
                </p>

                {/* Key specs */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Annual Fee</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {card.isLifetimeFree ? 'Lifetime Free' : `₹${card.annualFee.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Lounges</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      {card.domesticLoungesPerQuarter}/qtr
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified</span>
                </span>
                <span className="text-xs font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
                  <span>View Details & Toll-Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-emerald-100 pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-slate-900 font-bold">CARDWATCH Technologies</span>
            <span>— Indian Credit Card Intelligence</span>
          </div>
          <div className="text-slate-600">
            100% Verified Bank Circulars • All Helplines Toll-Free
          </div>
        </div>
      </footer>

    </div>
  );
};
