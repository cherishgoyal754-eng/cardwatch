import React, { useState } from 'react';
import { CreditCard, CardCategory } from '../types';
import { getBankHelpline } from '../data/cards';
import { prefetchCardVisuals } from '../components/Real3DCard';
import { sound } from '../utils/audio';
import {
  Search,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  GitCompare,
  CreditCard as CardIcon,
  PhoneCall
} from 'lucide-react';

interface ExplorerScreenProps {
  cards: CreditCard[];
  onSelectCard: (cardId: string) => void;
  onAddToCompare: (cardId: string) => void;
  comparisonCardIds: string[];
  onAddToWallet: (cardId: string) => void;
  savedCardIds: string[];
}

export const ExplorerScreen: React.FC<ExplorerScreenProps> = ({
  cards,
  onSelectCard,
  onAddToCompare,
  comparisonCardIds,
  onAddToWallet,
  savedCardIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>('all');
  const [maxSalaryFilter, setMaxSalaryFilter] = useState<number>(300000);
  const [ltfOnly, setLtfOnly] = useState<boolean>(false);
  const [viewStatus, setViewStatus] = useState<'active' | 'discontinued'>('active');

  const categories: { id: CardCategory; label: string }[] = [
    { id: 'all', label: 'All Cards' },
    { id: 'lounge', label: 'Airport Lounge' },
    { id: 'lifetime-free', label: '100% Lifetime Free' },
    { id: 'forex', label: '0% Forex (Overseas)' },
    { id: 'cashback', label: 'Cashback & Grocery' },
    { id: 'upi', label: 'UPI RuPay QR' },
    { id: 'travel', label: 'Travel & Flights' },
    { id: 'dining', label: 'Dining & Food' },
    { id: 'movies', label: 'Movies & BOGO' },
    { id: 'premium', label: 'Super Premium Metal' },
  ];

  const filteredCards = cards.filter(card => {
    if (card.status !== viewStatus) return false;
    if (selectedCategory !== 'all' && !card.tags.includes(selectedCategory)) return false;
    if (ltfOnly && !card.isLifetimeFree) return false;
    if (card.minSalaryMonthly > maxSalaryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        card.name.toLowerCase().includes(q) ||
        card.bank.toLowerCase().includes(q) ||
        card.headlineBenefit.toLowerCase().includes(q) ||
        card.suitableFor.some(s => s.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 text-slate-900">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider mb-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CardIcon className="w-4 h-4 text-emerald-600" />
            <span>Card Intelligence Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Credit Card Explorer
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl font-medium">
            Explore verified terms, revised lounge criteria, cashback caps, and real benefits across top Indian credit cards.
          </p>
        </div>

        {/* Active vs Discontinued Toggle */}
        <div className="flex items-center bg-white border border-emerald-200 p-1.5 rounded-2xl shadow-sm shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setViewStatus('active');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewStatus === 'active'
                ? 'bg-emerald-600 text-white shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Cards ({cards.filter(c => c.status === 'active').length})
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setViewStatus('discontinued');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewStatus === 'discontinued'
                ? 'bg-rose-600 text-white font-extrabold shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Discontinued Cards
          </button>
        </div>
      </div>

      {/* Search & Quick Controls Bar */}
      <div className="p-5 rounded-3xl bg-white space-y-4 border border-emerald-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">

          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by card name, bank (HDFC, ICICI, Axis...), benefit..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Salary Filter Slider */}
          <div className="md:col-span-4 px-2">
            <div className="flex justify-between items-center text-xs mb-1 font-semibold">
              <span className="text-slate-600">My Monthly Salary:</span>
              <span className="font-mono text-emerald-700 font-extrabold">
                ₹{(maxSalaryFilter / 1000).toFixed(0)}k/mo
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="350000"
              step="10000"
              value={maxSalaryFilter}
              onChange={e => setMaxSalaryFilter(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* LTF Quick Toggle */}
          <div className="md:col-span-2 flex items-center justify-end">
            <button
              onClick={() => {
                sound.playClick();
                setLtfOnly(!ltfOnly);
              }}
              className={`w-full py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                ltfOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-extrabold'
                  : 'bg-emerald-50 text-slate-700 border-emerald-200 hover:border-emerald-400'
              }`}
            >
              <span>Lifetime Free</span>
              {ltfOnly && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 select-none ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50/80 text-slate-700 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map(card => {
          const isCompared = comparisonCardIds.includes(card.id);
          const isSavedInWallet = savedCardIds.includes(card.id);
          const helpline = getBankHelpline(card.bank);

          return (
            <div
              key={card.id}
              onMouseEnter={() => prefetchCardVisuals(card)}
              className="rounded-3xl bg-white border border-emerald-200 hover:border-emerald-400 p-6 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-lg group"
            >
              <div>

                {/* Top Badge Row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-extrabold">
                      {card.bank}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {card.network} • {card.category}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-mono font-extrabold text-slate-900">
                      {card.isLifetimeFree ? '₹0 Fee (LTF)' : `₹${card.annualFee.toLocaleString('en-IN')}/yr`}
                    </span>
                    {card.recentChangeAlert && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold">
                        <ShieldAlert className="w-2.5 h-2.5" />
                        <span>Revised Terms</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Title */}
                <h3
                  onClick={() => {
                    sound.playClick();
                    onSelectCard(card.id);
                  }}
                  className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  {card.name}
                </h3>

                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2 font-medium">
                  {card.headlineBenefit}
                </p>

                {/* Key Spec Grid (High Contrast Green & White) */}
                <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Domestic Lounge</span>
                    <span className="font-mono font-extrabold text-emerald-800">
                      {card.domesticLoungesPerQuarter} / quarter
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Forex Markup</span>
                    <span className={`font-mono font-extrabold ${card.forexMarkup === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                      {card.forexMarkup === 0 ? '0.0% (Zero Forex)' : `${card.forexMarkup}%`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Salary Needed</span>
                    <span className="font-mono text-slate-900 font-bold">
                      ₹{(card.minSalaryMonthly / 1000).toFixed(0)}k / month
                    </span>
                  </div>
                </div>

                {/* Direct Bank Toll-Free Phone on Card (Requested by user) */}
                <div className="mt-3 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-emerald-800 font-bold uppercase block leading-none">Toll-Free Support:</span>
                      <a href={`tel:${helpline.conciergeNumber.replace(/\D/g, '')}`} className="font-mono font-bold text-slate-900 hover:text-emerald-700 hover:underline">
                        {helpline.conciergeNumber}
                      </a>
                    </div>
                  </div>
                  <a
                    href={`tel:${helpline.conciergeNumber.replace(/\D/g, '')}`}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shadow-sm hover:bg-emerald-700 transition-colors"
                  >
                    Call
                  </a>
                </div>

                {/* Lounge Condition Alert Warning */}
                {card.loungeSpendCondition.includes('DEVALUATION') && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900 flex items-start gap-1.5 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{card.loungeSpendCondition}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-emerald-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onAddToCompare(card.id);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                      isCompared
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-400 font-extrabold'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-slate-800 border-emerald-200'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>{isCompared ? 'Compared' : '+ Compare'}</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onAddToWallet(card.id);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                      isSavedInWallet
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-slate-800 border-emerald-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isSavedInWallet ? 'In Wallet' : 'I Own This'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectCard(card.id);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                >
                  <span>Review Card & Helplines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
