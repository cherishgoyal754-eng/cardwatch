import React, { useMemo, useState } from 'react';
import { CreditCard } from '../../types';
import { validateAllCards } from '../../utils/cardValidator';
import { CARD_BENEFIT_AUDITS } from '../../data/benefitAudits';
import { CloudSyncStatus } from '../../context/CardDataContext';
import {
  CheckCircle2,
  AlertTriangle,
  Database,
  Globe,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Search,
  Sparkles,
  FileCheck2,
  GitBranch,
  Cpu,
  Clock,
} from 'lucide-react';

interface AdminProjectOverviewTabProps {
  cards: CreditCard[];
  modifiedCount: number;
  customCount: number;
  liveDevaluationsCount: number;
  changelogCount: number;
  cloudSync: CloudSyncStatus;
  onRefreshSupabase: () => Promise<CloudSyncStatus>;
  onJumpToEditCard: (card: CreditCard) => void;
}

export const AdminProjectOverviewTab: React.FC<AdminProjectOverviewTabProps> = ({
  cards,
  modifiedCount,
  customCount,
  liveDevaluationsCount,
  changelogCount,
  cloudSync,
  onRefreshSupabase,
  onJumpToEditCard,
}) => {
  const [auditSearch, setAuditSearch] = useState('');
  const [isPinging, setIsPinging] = useState(false);

  const auditReport = useMemo(() => validateAllCards(cards), [cards]);

  const filteredBenefitAudits = useMemo(() => {
    const q = auditSearch.trim().toLowerCase();
    if (!q) return CARD_BENEFIT_AUDITS.slice(0, 20);
    return CARD_BENEFIT_AUDITS.filter(
      a =>
        a.cardName.toLowerCase().includes(q) ||
        a.benefitName.toLowerCase().includes(q) ||
        a.verificationStatus.toLowerCase().includes(q)
    );
  }, [auditSearch]);

  const cardCircularsTotal = useMemo(
    () => cards.reduce((acc, c) => acc + (c.changeHistory?.length || 0), 0),
    [cards]
  );

  const hasGeminiKey = Boolean(
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY
  );

  const handlePing = async () => {
    setIsPinging(true);
    try {
      await onRefreshSupabase();
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Active Card Catalog
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-950 font-mono">{cards.length}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {modifiedCount} edited • {customCount} new
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Live across Explorer, Compare & AI Advisor</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Live Accuracy Audit
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-black font-mono ${
                auditReport.accuracyScore >= 95 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {auditReport.accuracyScore}%
            </span>
            <span className="text-xs font-bold text-slate-600 font-mono">
              {auditReport.validCardsCount}/{auditReport.totalCardsAudited} valid
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {auditReport.errors.length} validator note(s) detected
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-xs space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Circulars & Devaluations
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-600 font-mono">
              {liveDevaluationsCount + cardCircularsTotal}
            </span>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
              {liveDevaluationsCount} Google/Live Radar
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Plus {cardCircularsTotal} per-card circular records</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Project Change Ledger
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-700 font-mono">{changelogCount}</span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              Reversible Logs
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Tracks all project releases & admin edits</p>
        </div>
      </div>

      {/* Infrastructure & Project Important Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <Globe className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Important Project Details & Stack</h3>
                <p className="text-[11px] text-slate-500">Production URLs, Automation & Intelligence Engines</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between gap-2">
              <span className="text-slate-500 font-medium">Vercel Production</span>
              <a
                href="https://credit-blue.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                credit-blue.vercel.app <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-2">
              <span className="text-slate-500 font-medium">GitHub Pages Mirror</span>
              <a
                href="https://cherishgoyal754-eng.github.io/cardwatch/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-slate-800 hover:underline flex items-center gap-1"
              >
                /cardwatch/ <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-2">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" /> Source Repository
              </span>
              <a
                href="https://github.com/cherishgoyal754-eng/cardwatch"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-slate-800 hover:underline flex items-center gap-1"
              >
                cherishgoyal754-eng/cardwatch <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-2">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Google News Daily Cron
              </span>
              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                05:30 AM IST (0 0 * * *)
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-2">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400" /> Gemini AI Engine
              </span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded ${
                  hasGeminiKey ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                {hasGeminiKey ? 'API Key Active (Vite + Vercel)' : 'Server/Local Fallback'}
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-2">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-slate-400" /> Audited Benefit Registry
              </span>
              <span className="font-mono font-bold text-slate-800">
                {CARD_BENEFIT_AUDITS.length} Verified Circular Citations
              </span>
            </div>
          </div>
        </div>

        {/* Supabase Live DB Health + Validator Errors */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
                <Database className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Supabase Backend & Validator Health</h3>
                <p className="text-[11px] text-slate-500 font-mono">Project Ref: umurvsjwvrebmjdgwuzt</p>
              </div>
            </div>

            <button
              onClick={handlePing}
              disabled={isPinging}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>Ping Cloud</span>
            </button>
          </div>

          <div
            className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
              cloudSync.cloudTablesReady
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="font-extrabold flex items-center gap-1.5">
              {cloudSync.cloudTablesReady ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              )}
              <span>{cloudSync.cloudTablesReady ? 'Global Cloud CMS Connected' : 'Local Vault Mode Active'}</span>
            </div>
            <p className="text-[11px] leading-relaxed">{cloudSync.message}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">
              Live Card Accuracy Validator Issues ({auditReport.errors.length})
            </h4>
            {auditReport.errors.length === 0 ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All {cards.length} cards pass every LTF, CIBIL, forex, lounge & URL invariant cleanly.</span>
              </div>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {auditReport.errors.slice(0, 8).map((err, idx) => {
                  const matchedCard = cards.find(c => c.id === err.cardId);
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-mono font-bold text-amber-900">{err.cardId}</span>
                        <span className="text-amber-800"> — {err.message}</span>
                      </div>
                      {matchedCard && (
                        <button
                          onClick={() => onJumpToEditCard(matchedCard)}
                          className="px-2 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold shrink-0 hover:bg-amber-100"
                        >
                          Fix
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benefit Audit Registry Search */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              2026 Audited Benefit Registry ({CARD_BENEFIT_AUDITS.length} Citations)
            </h3>
            <p className="text-[11px] text-slate-500">
              Source-verified rules across HDFC, SBI, ICICI, Axis & Amex circulars
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={auditSearch}
              onChange={e => setAuditSearch(e.target.value)}
              placeholder="Search audited cards or rules..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                <th className="py-2 pr-3">Card / Rule</th>
                <th className="py-2 pr-3">Current Verified Policy</th>
                <th className="py-2 pr-3">Dates (Announced / Effective)</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBenefitAudits.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-2.5 pr-3 align-top">
                    <div className="font-bold text-slate-900">{rec.cardName}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">{rec.benefitName}</div>
                  </td>
                  <td className="py-2.5 pr-3 align-top text-slate-700 max-w-md">{rec.currentValue}</td>
                  <td className="py-2.5 pr-3 align-top font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    <div>Notified: {rec.announcementDate}</div>
                    <div className="text-slate-900 font-bold">Effective: {rec.effectiveDate}</div>
                  </td>
                  <td className="py-2.5 pr-3 align-top whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        rec.verificationStatus === 'Verified Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rec.verificationStatus === 'Announced - Not Yet Effective'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {rec.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
