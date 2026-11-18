import React, { useState } from 'react';
import { CreditCard, CardChangeHistory, ScreenType } from '../types';
import { sound } from '../utils/audio';
import liveDevaluations from '../data/live-devaluations.json';
import {
  Calendar,
  ArrowRight,
  TrendingDown,
  Search,
  ShieldAlert,
  Flame,
  FileText,
  AlertTriangle,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Bell,
  Check
} from 'lucide-react';

interface ChangesTrackerScreenProps {
  cards: CreditCard[];
  onSelectCard: (cardId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

interface FlattenedChange {
  cardId: string;
  cardName: string;
  bank: string;
  change: CardChangeHistory;
}

export const ChangesTrackerScreen: React.FC<ChangesTrackerScreenProps> = ({
  cards,
  onSelectCard,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('all');

  const allChanges: FlattenedChange[] = [];

  // 1. Live Google News & Gemini Radar circulars (auto-updated daily via GitHub Actions)
  (liveDevaluations as any[]).forEach(item => {
    allChanges.push({
      cardId: item.cardId || 'general-banking',
      cardName: item.cardName,
      bank: item.bank,
      change: {
        date: item.date,
        announcedDate: item.announcedDate,
        deadline: item.deadline,
        type: item.type,
        title: item.title,
        summary: item.summary,
        oldValue: item.oldValue,
        newValue: item.newValue,
        officialRef: item.officialRef,
        severity: item.severity,
        source: item.source,
        syncedAt: item.syncedAt,
      },
    });
  });

  // 2. Verified card circulars from database
  cards.forEach(card => {
    if (card.changeHistory && card.changeHistory.length > 0) {
      card.changeHistory.forEach(ch => {
        allChanges.push({
          cardId: card.id,
          cardName: card.name,
          bank: card.bank,
          change: ch,
        });
      });
    }
  });

  const uniqueBanks = Array.from(new Set(allChanges.map(c => c.bank)));

  const filteredChanges = allChanges.filter(item => {
    if (filterType !== 'all' && item.change.type !== filterType) return false;
    if (selectedBank !== 'all' && item.bank !== selectedBank) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.cardName.toLowerCase().includes(q) ||
        item.bank.toLowerCase().includes(q) ||
        item.change.title.toLowerCase().includes(q) ||
        item.change.summary.toLowerCase().includes(q) ||
        item.change.officialRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-[#FFFDFD] text-slate-900 pb-28">
      {/* Decorative Red & White Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-rose-100/60 via-red-50/30 to-transparent pointer-events-none" />
      <div className="absolute top-12 right-10 w-96 h-96 bg-red-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-black text-red-700 uppercase tracking-widest mb-3 bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200 shadow-xs">
              <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
              <span>LIVE BANK CIRCULAR & DEVALUATION RADAR</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Credit Card <span className="text-red-600 underline decoration-red-300 decoration-wavy underline-offset-8">Devaluations</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl font-medium leading-relaxed">
              Real-time catalog of verified bank circulars, slashed rewards, added quarterly lounge thresholds, and new merchant surcharges across Indian banks.
            </p>
          </div>

          {/* Live circular count badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-red-200 text-red-700 text-xs font-mono font-black shadow-md shadow-red-500/10 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span>{allChanges.length} Active Circulars Verified</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('wallet');
              }}
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-md shadow-red-600/25 flex items-center gap-2 transition-all shrink-0 hover:scale-[1.02]"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Check My Wallet Impact</span>
            </button>
          </div>
        </div>

        {/* EXECUTIVE KPI IMPACT CARDS (RED & WHITE THEME) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-red-100 hover:border-red-300 transition-all shadow-sm hover:shadow-md space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-700">Lounge Thresholds</span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-red-600 tracking-tight">
              6 Banks
            </div>
            <p className="text-xs text-slate-600 font-medium leading-tight">
              Mandatory ₹50k - ₹1 Lakh spend added per quarter
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-red-100 hover:border-red-300 transition-all shadow-sm hover:shadow-md space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-700">Reward Slashes</span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-red-600 tracking-tight">
              18 Cards
            </div>
            <p className="text-xs text-slate-600 font-medium leading-tight">
              Rent, school fees & utilities excluded from points
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-red-100 hover:border-red-300 transition-all shadow-sm hover:shadow-md space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-700">New Surcharges</span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-red-600 tracking-tight">
              1% - 1.5%
            </div>
            <p className="text-xs text-slate-600 font-medium leading-tight">
              Direct transaction fee on CRED & rent portals
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-red-100 hover:border-red-300 transition-all shadow-sm hover:shadow-md space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-700">Avg Value Lost</span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-slate-950 tracking-tight">
              ₹18,400 <span className="text-xs text-red-600 font-bold font-sans">/ yr</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-tight">
              Annual loss per cardholder if unaware of cuts
            </p>
          </div>
        </div>

        {/* WHY BANKS ARE DEVALUING CARDS BANNER (ATTRACTIVE RED & WHITE ALERT) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xl shadow-red-600/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-black uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                <span>Industry Devaluation Brief</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black">
                Why are Indian Banks Cutting Benefits in 2024–2025?
              </h3>
              <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed">
                Overcrowded airport lounges forced banks to mandate ₹50,000–₹1,00,000 previous-quarter spend requirements. In addition, RBI interchange caps and rising gateway fees led HDFC, ICICI, SBI & Axis to eliminate reward points on rent, government tax, education, and wallet reloads.
              </p>
            </div>

            <div className="flex sm:flex-col items-center gap-2 shrink-0">
              <div className="text-center px-4 py-2 bg-white/10 rounded-2xl border border-white/20">
                <span className="text-2xl font-black font-mono block">100%</span>
                <span className="text-[10px] font-mono font-bold uppercase text-red-200">RBI Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR (RED & WHITE THEME) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-red-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-red-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search devaluations (e.g. HDFC Regalia, Lounge, Rent, ICICI, SBI)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-red-50/40 border border-red-200 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-red-600 focus:bg-white transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-red-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: 'all', label: 'All Policy Cuts' },
              { id: 'devaluation', label: '🚨 Devaluations' },
              { id: 'restriction', label: '⚠️ Lounge & Spend Quotas' },
              { id: 'fee_revision', label: '💳 Fee Revisions' },
              { id: 'policy_update', label: '📋 Policy Updates' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => {
                  sound.playClick();
                  setFilterType(f.id);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                  filterType === f.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20 scale-[1.02]'
                    : 'bg-red-50/70 border border-red-200 text-slate-700 hover:bg-red-100 hover:text-red-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Bank Select */}
          <select
            value={selectedBank}
            onChange={e => {
              sound.playClick();
              setSelectedBank(e.target.value);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-red-50/50 border border-red-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600 shrink-0"
          >
            <option value="all">All Banks ({uniqueBanks.length})</option>
            {uniqueBanks.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* RESULTS COUNT */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
          <span>
            Showing <strong className="text-red-600 font-mono text-sm">{filteredChanges.length}</strong> verified circular{filteredChanges.length !== 1 ? 's' : ''}
          </span>
          {(filterType !== 'all' || selectedBank !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                sound.playClick();
                setFilterType('all');
                setSelectedBank('all');
                setSearchQuery('');
              }}
              className="text-red-600 hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* DEVALUATION CIRCULAR CARDS FEED (ATTRACTIVE RED & WHITE THEME) */}
        <div className="space-y-6">
          {filteredChanges.length > 0 ? (
            filteredChanges.map((item, index) => (
              <div
                key={index}
                className="group rounded-3xl bg-white p-6 sm:p-8 border-2 border-red-100 hover:border-red-500 transition-all duration-300 space-y-5 shadow-sm hover:shadow-xl hover:shadow-red-500/10 relative overflow-hidden"
              >
                {/* Left Visual Accent Bar */}
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-red-600 to-rose-600" />

                {/* Top Row: Bank Badge, Type, Date & Card Name */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-red-100">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-red-700 font-black bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
                        {item.bank}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded font-black uppercase bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>{item.change.type.replace('_', ' ')}</span>
                      </span>
                      {item.change.severity === 'critical' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase bg-red-600 text-white animate-pulse">
                          CRITICAL CUT
                        </span>
                      )}
                      {item.change.source && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
                          <span>Google News Radar</span>
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => {
                        sound.playClick();
                        onSelectCard(item.cardId);
                      }}
                      className="text-xl sm:text-2xl font-black text-slate-950 group-hover:text-red-600 cursor-pointer transition-colors pt-1"
                    >
                      {item.cardName}
                    </h3>
                  </div>

                  {/* Timeline: Announced Date (When Info Came) & Deadline (Enforcement) */}
                  <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 shrink-0">
                    {item.change.announcedDate && (
                      <div className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-slate-500" />
                        <span>Notice Sent: <strong className="text-slate-900 font-bold">{item.change.announcedDate}</strong></span>
                      </div>
                    )}
                    <div className="px-3 py-1.5 rounded-xl bg-red-50 border-2 border-red-200 text-xs font-mono text-red-900 flex items-center gap-1.5 shadow-xs">
                      <Clock className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                      <span>Deadline / Effective: <strong className="text-red-700 font-black">{item.change.deadline || item.change.date}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Headline Title & Detailed Summary */}
                <div className="space-y-1.5">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {item.change.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {item.change.summary}
                  </p>
                </div>

                {/* SIDE-BY-SIDE OLD VS NEW CONDITIONS (PURE RED & WHITE) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch pt-1">
                  {/* Old Discontinued Rule */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-red-50/60 border-2 border-red-200 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-[11px] font-mono font-black text-red-800 uppercase tracking-wider">
                          Previous Policy (Discontinued)
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-700 font-mono line-through decoration-red-500 decoration-2 leading-relaxed">
                        {item.change.oldValue}
                      </div>
                    </div>
                    <span className="text-[10px] text-red-600 font-mono font-bold uppercase tracking-wider block pt-2">
                      ❌ Slashed Benefit
                    </span>
                  </div>

                  {/* New Enforced Strict Rule */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-red-500 space-y-2 flex flex-col justify-between shadow-sm ring-2 ring-red-100">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span className="text-[11px] font-mono font-black text-red-700 uppercase tracking-wider">
                          New Strict Policy (Active & Enforced)
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-950 font-black font-mono leading-relaxed">
                        {item.change.newValue}
                      </div>
                    </div>
                    <span className="text-[10px] text-red-700 font-mono font-black uppercase tracking-wider block pt-2">
                      ⚠️ Current Live Restriction
                    </span>
                  </div>
                </div>

                {/* Footer: Official Bank Circular Reference & Action */}
                <div className="pt-4 border-t border-red-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      Official Circular Ref: <strong className="text-slate-950 font-mono font-bold">{item.change.officialRef}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectCard(item.cardId);
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-extrabold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform self-end sm:self-auto"
                  >
                    <span>View Card Specs & Alternatives</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="p-12 rounded-3xl bg-white border-2 border-red-200 text-center space-y-3 shadow-sm">
              <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
              <h4 className="text-base font-extrabold text-slate-900">No circulars match your current filter</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for another bank name (e.g. HDFC, ICICI, SBI) or reset the policy filters.
              </p>
              <button
                onClick={() => {
                  sound.playClick();
                  setFilterType('all');
                  setSelectedBank('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-extrabold text-xs shadow-md shadow-red-600/20"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
