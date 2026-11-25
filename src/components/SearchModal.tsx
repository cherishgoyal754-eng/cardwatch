import React, { useState, useMemo } from 'react';
import { ALL_CREDIT_CARDS } from '../data/cards';
import { ScreenType, CreditCard } from '../types';
import { sound } from '../utils/audio';
import { Search, X, ShieldAlert, ArrowRight, ArrowUpRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards?: CreditCard[];
  onSelectCard: (cardId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  cards = ALL_CREDIT_CARDS,
  onSelectCard,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  const filteredCards = useMemo(() => {
    if (!query.trim()) return cards.slice(0, 6);
    const q = query.toLowerCase();
    return cards.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.bank.toLowerCase().includes(q) ||
        c.tier.toLowerCase().includes(q) ||
        c.headlineBenefit.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [query, cards]);

  if (!isOpen) return null;

  const quickFilters = [
    { label: 'Airport Lounges', query: 'lounge' },
    { label: 'Lifetime Free (LTF)', query: 'lifetime-free' },
    { label: '0% Forex (Dubai & Overseas)', query: 'forex' },
    { label: 'UPI QR Cashback (RuPay)', query: 'upi' },
    { label: '5% Online Shopping', query: 'cashback' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/50 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border-2 border-emerald-400 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">

        {/* Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-emerald-100 gap-3 bg-emerald-50/50">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search by card name, bank, perk (e.g. Lounge, Dubai, UPI, LTF)..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              sound.playClick();
            }}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm font-semibold focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-500 hover:text-emerald-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-emerald-200 rounded-lg font-bold shadow-sm"
          >
            Esc
          </button>
        </div>

        {/* Quick Tag Recommendations */}
        <div className="px-5 py-3 bg-emerald-50/40 border-b border-emerald-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-emerald-800 text-xs font-mono font-bold shrink-0">Popular:</span>
          {quickFilters.map((qf, i) => (
            <button
              key={i}
              onClick={() => {
                sound.playClick();
                setQuery(qf.query);
              }}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-emerald-600 hover:text-white text-slate-800 border border-emerald-200 shadow-sm shrink-0 text-xs font-bold transition-colors"
            >
              {qf.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-emerald-50">
          {filteredCards.length > 0 ? (
            filteredCards.map(card => (
              <div
                key={card.id}
                onClick={() => {
                  sound.playClick();
                  onSelectCard(card.id);
                  onClose();
                }}
                className="p-3.5 rounded-2xl hover:bg-emerald-50/80 cursor-pointer transition-colors group flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[11px] font-mono font-bold text-emerald-800 group-hover:bg-emerald-200">
                    {card.network}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {card.name}
                      </span>
                      {card.isLifetimeFree && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white font-bold font-mono">
                          LTF
                        </span>
                      )}
                      {card.recentChangeAlert && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 font-bold">
                          <ShieldAlert className="w-2.5 h-2.5" />
                          <span>Revised</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                      {card.headlineBenefit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right shrink-0">
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-900">
                      {card.isLifetimeFree ? '₹0 Fee' : `₹${card.annualFee.toLocaleString('en-IN')}/yr`}
                    </div>
                    <div className="text-xs text-emerald-700 font-semibold">
                      Salary: ₹{(card.minSalaryMonthly / 1000).toFixed(0)}k/mo
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-800">
              <p className="text-sm font-bold">No credit cards found matching "{query}".</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for "HDFC", "Lounge", "Dubai", or "UPI".</p>
            </div>
          )}
        </div>

        {/* Bottom shortcut bar */}
        <div className="px-5 py-3 bg-emerald-50/50 border-t border-emerald-100 flex items-center justify-between text-xs text-slate-700 font-medium">
          <span>Navigate with mouse or keyboard</span>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('changes');
              onClose();
            }}
            className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 underline"
          >
            <span>View all recent devaluation announcements</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
