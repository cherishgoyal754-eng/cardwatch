import React, { useState, useMemo, useEffect } from 'react';
import {
  CreditCard,
  LiveDevaluationEntry,
  ProjectChangeCategory,
  ScreenType,
} from '../types';
import { useCardData } from '../context/CardDataContext';
import { useAuth } from '../context/AuthContext';
import { getAdminKeyFingerprint } from '../utils/adminVault';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sound } from '../utils/audio';
import { AdminLockGate } from '../components/admin/AdminLockGate';
import { AdminProjectOverviewTab } from '../components/admin/AdminProjectOverviewTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { CardEditorModal } from '../components/admin/CardEditorModal';
import { DevaluationEditorModal } from '../components/admin/DevaluationEditorModal';
import {
  ShieldCheck,
  LayoutDashboard,
  CreditCard as CardIcon,
  ShieldAlert,
  History,
  Settings,
  Lock,
  Plus,
  Search,
  Edit3,
  RotateCcw,
  Archive,
  ArchiveRestore,
  ExternalLink,
  Sparkles,
  Radar,
  Loader2,
  CheckCircle2,
  XCircle,
  Bell,
  Clock,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

type AdminTab = 'overview' | 'cards' | 'radar' | 'changes' | 'settings';

interface AdminScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectCard: (cardId: string) => void;
  isUnlocked: boolean;
  sessionKeyInMemory: string | null;
  onUnlocked: (rawMasterKey: string, trustedDevice: boolean) => void;
  onLockVault: () => void;
  onRotatedKey: (newRawKey: string) => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  onNavigate,
  onSelectCard,
  isUnlocked,
  sessionKeyInMemory,
  onUnlocked,
  onLockVault,
  onRotatedKey,
}) => {
  const {
    cards,
    allCardsIncludingArchived,
    modifiedCardIds,
    customCardIds,
    archivedCardIds,
    liveDevaluations,
    allDevaluationsIncludingDismissed,
    dismissedDevalIds,
    projectChangelog,
    cloudSync,
    upsertCard,
    archiveCard,
    restoreCard,
    revertCardOverride,
    addOrUpdateDevaluation,
    dismissDevaluation,
    restoreDevaluation,
    logProjectChange,
    revertChange,
    exportProjectSnapshot,
    importProjectSnapshot,
    resetAllAdminOverrides,
    refreshFromSupabase,
  } = useCardData();

  const { profile } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [editingCard, setEditingCard] = useState<CreditCard | null | undefined>(undefined);
  const [editingDeval, setEditingDeval] = useState<LiveDevaluationEntry | null | undefined>(undefined);

  // Cards tab filters
  const [cardSearch, setCardSearch] = useState('');
  const [cardFilter, setCardFilter] = useState<'all' | 'modified' | 'custom' | 'archived'>('all');
  const [bankFilter, setBankFilter] = useState('all');

  // Google News live radar state
  const [radarSyncing, setRadarSyncing] = useState(false);
  const [radarError, setRadarError] = useState<string | null>(null);
  const [radarKeyPrompt, setRadarKeyPrompt] = useState('');
  const [needsRadarKeyInput, setNeedsRadarKeyInput] = useState(false);
  const [stagedCirculars, setStagedCirculars] = useState<LiveDevaluationEntry[]>([]);

  // Changes tab state
  const [changeNoteTitle, setChangeNoteTitle] = useState('');
  const [changeNoteDesc, setChangeNoteDesc] = useState('');
  const [changeNoteCategory, setChangeNoteCategory] = useState<ProjectChangeCategory>('project_note');
  const [changeFilter, setChangeFilter] = useState<string>('all');
  const [dbAuditLogs, setDbAuditLogs] = useState<any[]>([]);
  const [auditLogsNote, setAuditLogsNote] = useState<string | null>(null);

  const uniqueBanks = useMemo(
    () => Array.from(new Set(allCardsIncludingArchived.map(c => c.bank))).sort(),
    [allCardsIncludingArchived]
  );

  const filteredCards = useMemo(() => {
    const q = cardSearch.trim().toLowerCase();
    const archivedSet = new Set(archivedCardIds);
    return allCardsIncludingArchived.filter(card => {
      const isArchived = archivedSet.has(card.id);
      if (cardFilter === 'archived' && !isArchived) return false;
      if (cardFilter !== 'archived' && isArchived) return false;
      if (cardFilter === 'modified' && !modifiedCardIds.has(card.id)) return false;
      if (cardFilter === 'custom' && !customCardIds.has(card.id)) return false;
      if (bankFilter !== 'all' && card.bank !== bankFilter) return false;
      if (q) {
        return (
          card.name.toLowerCase().includes(q) ||
          card.bank.toLowerCase().includes(q) ||
          card.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allCardsIncludingArchived, archivedCardIds, modifiedCardIds, customCardIds, cardSearch, cardFilter, bankFilter]);

  const filteredChangelog = useMemo(() => {
    if (changeFilter === 'all') return projectChangelog;
    return projectChangelog.filter(c => c.category === changeFilter || c.status === changeFilter);
  }, [projectChangelog, changeFilter]);

  // Fetch Supabase audit_logs when visiting Changes tab if signed in
  useEffect(() => {
    if (!isUnlocked || activeTab !== 'changes' || !isSupabaseConfigured) return;
    let active = true;
    async function loadLogs() {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);
      if (!active) return;
      if (error) {
        setAuditLogsNote(
          profile?.role === 'admin'
            ? `Supabase audit query note: ${error.message}`
            : 'Sign in with a Supabase admin profile to read DB audit_logs.'
        );
        setDbAuditLogs([]);
      } else {
        setAuditLogsNote(null);
        setDbAuditLogs(data || []);
      }
    }
    loadLogs();
    return () => {
      active = false;
    };
  }, [isUnlocked, activeTab, profile?.role]);

  if (!isUnlocked) {
    return <AdminLockGate onUnlocked={onUnlocked} onExit={() => onNavigate('home')} />;
  }

  const triggerLiveGoogleRadar = async (overrideKey?: string) => {
    const keyToUse = overrideKey || sessionKeyInMemory || radarKeyPrompt.trim();
    if (!keyToUse) {
      setNeedsRadarKeyInput(true);
      return;
    }

    setRadarSyncing(true);
    setRadarError(null);
    setNeedsRadarKeyInput(false);
    sound.playClick();

    try {
      const res = await fetch('/api/radar-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': keyToUse,
        },
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          'Live serverless endpoint /api/radar-sync is only active on Vercel deployments (or `vercel dev`). Use the daily GitHub Actions cron or add circulars manually below.'
        );
      }

      const payload = await res.json();
      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || `Radar sync returned HTTP ${res.status}`);
      }

      const incoming: LiveDevaluationEntry[] = (payload.circulars || []).map(
        (c: any, idx: number) => ({
          ...c,
          id: `live-pull-${Date.now()}-${idx}`,
          source: 'Google News + Gemini AI (Manual Pull)',
          syncedAt: payload.syncedAt || new Date().toISOString(),
        })
      );
      setStagedCirculars(incoming);
      sound.playSuccess();

      await logProjectChange({
        category: 'radar_sync',
        title: `Executed Manual Google News Radar Scan`,
        description: `Scanned ${payload.rawArticlesCount || 0} Google News India articles and staged ${incoming.length} structured circulars.`,
        afterSummary: `${incoming.length} circular candidates staged for review`,
      });
    } catch (err: any) {
      sound.playAlert();
      setRadarError(err?.message || 'Unable to reach Google News Radar endpoint.');
    } finally {
      setRadarSyncing(false);
    }
  };

  const handleLogCustomChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeNoteTitle.trim() || !changeNoteDesc.trim()) return;
    sound.playClick();
    await logProjectChange({
      category: changeNoteCategory,
      title: changeNoteTitle.trim(),
      description: changeNoteDesc.trim(),
      afterSummary: 'Logged manually in Project Ledger',
    });
    sound.playSuccess();
    setChangeNoteTitle('');
    setChangeNoteDesc('');
  };

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }> = [
    { id: 'overview', label: 'Project Details & Health', icon: LayoutDashboard },
    { id: 'cards', label: 'Card Catalog', icon: CardIcon, badge: `${cards.length}` },
    { id: 'radar', label: 'Devaluations & Radar', icon: ShieldAlert, badge: `${liveDevaluations.length}` },
    { id: 'changes', label: 'Project Changes', icon: History, badge: `${projectChangelog.length}` },
    { id: 'settings', label: 'Vault Key & Sync', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24">
      {/* Top Sovereign Vault Status Banner */}
      <div className="bg-slate-950 text-white border-b border-emerald-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-600/30 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Sovereign Admin Unlocked
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {getAdminKeyFingerprint()}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                CARDWATCH Owner Control Center
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setEditingCard(null)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </button>
            <button
              onClick={() => setEditingDeval(null)}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Publish Circular</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onLockVault();
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Lock Vault</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto pb-0.5">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(t.id);
                }}
                className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-emerald-400 text-white bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{t.label}</span>
                {t.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-200">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {activeTab === 'overview' && (
          <AdminProjectOverviewTab
            cards={cards}
            modifiedCount={modifiedCardIds.size}
            customCount={customCardIds.size}
            liveDevaluationsCount={liveDevaluations.length}
            changelogCount={projectChangelog.length}
            cloudSync={cloudSync}
            onRefreshSupabase={refreshFromSupabase}
            onJumpToEditCard={c => setEditingCard(c)}
          />
        )}

        {/* TAB 2: CARD CATALOG MANAGER */}
        {activeTab === 'cards' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  value={cardSearch}
                  onChange={e => setCardSearch(e.target.value)}
                  placeholder="Search 48+ cards by name, bank, or ID..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(['all', 'modified', 'custom', 'archived'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setCardFilter(f)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold capitalize cursor-pointer ${
                      cardFilter === f
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {f === 'all'
                      ? `All (${cards.length})`
                      : f === 'modified'
                      ? `Edited (${modifiedCardIds.size})`
                      : f === 'custom'
                      ? `Custom (${customCardIds.size})`
                      : `Archived (${archivedCardIds.length})`}
                  </button>
                ))}

                <select
                  value={bankFilter}
                  onChange={e => setBankFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="all">All Banks ({uniqueBanks.length})</option>
                  {uniqueBanks.map(b => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                      <th className="py-3 px-4">Credit Card</th>
                      <th className="py-3 px-3">Tier / Network</th>
                      <th className="py-3 px-3">Fees</th>
                      <th className="py-3 px-3">Lounge Quotas</th>
                      <th className="py-3 px-3">Audit Status</th>
                      <th className="py-3 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCards.map(card => {
                      const isModified = modifiedCardIds.has(card.id);
                      const isCustom = customCardIds.has(card.id);
                      const isArchived = archivedCardIds.includes(card.id);

                      return (
                        <tr key={card.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-slate-900">{card.name}</span>
                              {isCustom && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px] font-bold">
                                  CUSTOM
                                </span>
                              )}
                              {isModified && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                                  EDITED
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {card.bank} • {card.id}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-800">{card.tier}</span>
                            <div className="text-[11px] text-slate-500">{card.network}</div>
                          </td>
                          <td className="py-3 px-3 font-mono">
                            {card.isLifetimeFree ? (
                              <span className="text-emerald-700 font-bold">₹0 Lifetime Free</span>
                            ) : (
                              <span>
                                ₹{card.joiningFee.toLocaleString('en-IN')} / ₹{card.annualFee.toLocaleString('en-IN')}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-800">
                              Dom: {card.domesticLoungesPerQuarter}/qtr • Intl: {card.internationalLoungesPerYear}/yr
                            </div>
                            <div className="text-[11px] text-slate-500 max-w-xs truncate">
                              {card.loungeSpendCondition}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                card.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              {card.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onSelectCard(card.id)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                                title="View public card page"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingCard(card)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              {(isModified || isCustom) && (
                                <button
                                  onClick={() => revertCardOverride(card.id)}
                                  className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100"
                                  title={isCustom ? 'Delete custom card' : 'Revert to code baseline'}
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => (isArchived ? restoreCard(card.id) : archiveCard(card.id))}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700"
                                title={isArchived ? 'Restore card' : 'Archive/hide card'}
                              >
                                {isArchived ? (
                                  <ArchiveRestore className="w-3.5 h-3.5" />
                                ) : (
                                  <Archive className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEVALUATIONS & GOOGLE NEWS RADAR */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Radar className="w-5 h-5 text-emerald-600" />
                    Live Google News + Gemini Devaluation Radar Control
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Daily cron runs at 05:30 AM IST, or trigger an on-demand pull here using your Master Admin Key.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => triggerLiveGoogleRadar()}
                    disabled={radarSyncing}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {radarSyncing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{radarSyncing ? 'Scanning Google News...' : 'Pull Live Google News Now'}</span>
                  </button>
                  <button
                    onClick={() => setEditingDeval(null)}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Manual Circular</span>
                  </button>
                </div>
              </div>

              {needsRadarKeyInput && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <input
                    type="password"
                    value={radarKeyPrompt}
                    onChange={e => setRadarKeyPrompt(e.target.value)}
                    placeholder="Confirm Master Key to authorize serverless /api/radar-sync..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                  <button
                    onClick={() => triggerLiveGoogleRadar(radarKeyPrompt)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Authorize & Scan
                  </button>
                </div>
              )}

              {radarError && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                  {radarError}
                </div>
              )}

              {/* Staged AI discoveries ready to approve */}
              {stagedCirculars.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
                  <div className="text-xs font-black text-emerald-900 flex items-center justify-between">
                    <span>✨ Newly Discovered Circulars Ready for Approval ({stagedCirculars.length})</span>
                    <button
                      onClick={() => setStagedCirculars([])}
                      className="text-slate-500 hover:text-slate-800 text-[11px]"
                    >
                      Clear Tray
                    </button>
                  </div>
                  <div className="space-y-2">
                    {stagedCirculars.map(item => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-white border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-black text-slate-900">
                            [{item.bank}] {item.title}
                          </div>
                          <p className="text-[11px] text-slate-600">{item.summary}</p>
                          <div className="text-[10px] font-mono text-slate-500">
                            Notice: {item.announcedDate} • Deadline: {item.deadline} • Ref: {item.officialRef}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={async () => {
                              await addOrUpdateDevaluation(item, 'Approved live from Google News pull');
                              setStagedCirculars(prev => prev.filter(s => s.id !== item.id));
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Publish Live</span>
                          </button>
                          <button
                            onClick={() => setStagedCirculars(prev => prev.filter(s => s.id !== item.id))}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                          >
                            Discard
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Live Circulars List */}
            <div className="space-y-3">
              {allDevaluationsIncludingDismissed.map(entry => {
                const isDismissed = dismissedDevalIds.includes(entry.id);
                return (
                  <div
                    key={entry.id}
                    className={`rounded-2xl bg-white border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${
                      isDismissed ? 'border-slate-200 opacity-60' : 'border-red-100'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                          {entry.bank}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">{entry.cardName}</span>
                        {entry.announcedDate && (
                          <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1 text-slate-600">
                            <Bell className="w-3 h-3" /> {entry.announcedDate}
                          </span>
                        )}
                        <span className="text-[10px] font-mono bg-red-50 px-2 py-0.5 rounded flex items-center gap-1 text-red-700 font-bold">
                          <Clock className="w-3 h-3" /> Deadline: {entry.deadline || entry.date}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{entry.title}</h4>
                      <p className="text-xs text-slate-600">{entry.summary}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingDeval(entry)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          isDismissed ? restoreDevaluation(entry.id) : dismissDevaluation(entry.id)
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                          isDismissed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {isDismissed ? (
                          <>
                            <ArchiveRestore className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Hide</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PROJECT CHANGES & AUDIT LEDGER */}
        {activeTab === 'changes' && (
          <div className="space-y-6">
            {/* Manual Change Logger */}
            <form
              onSubmit={handleLogCustomChange}
              className="rounded-3xl bg-white border border-emerald-200 p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Log Project Change / Milestone / Deployment Note</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <select
                  value={changeNoteCategory}
                  onChange={e => setChangeNoteCategory(e.target.value as ProjectChangeCategory)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="project_note">Project Note / Update</option>
                  <option value="system_release">Release / Deployment</option>
                  <option value="radar_sync">Circular Review</option>
                </select>
                <input
                  required
                  value={changeNoteTitle}
                  onChange={e => setChangeNoteTitle(e.target.value)}
                  placeholder="Change title (e.g., Audited Axis Magnus May 2026 rates)"
                  className="sm:col-span-3 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  required
                  value={changeNoteDesc}
                  onChange={e => setChangeNoteDesc(e.target.value)}
                  placeholder="Details of what changed in your project..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shrink-0 cursor-pointer"
                >
                  Record Change
                </button>
              </div>
            </form>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Changes' },
                { id: 'card_updated', label: 'Card Edits' },
                { id: 'card_created', label: 'New Cards' },
                { id: 'devaluation_published', label: 'Circulars Published' },
                { id: 'milestone', label: 'Project Releases' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setChangeFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    changeFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Chronological Ledger */}
            <div className="space-y-3">
              {filteredChangelog.map(item => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white border border-slate-200 p-5 space-y-2.5 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase ${
                          item.status === 'milestone'
                            ? 'bg-purple-100 text-purple-800'
                            : item.status === 'reverted'
                            ? 'bg-slate-100 text-slate-500 line-through'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(item.timestamp).toLocaleString()} • By {item.actor}
                      </span>
                    </div>

                    {item.status === 'applied' && (item.targetId || item.beforeSnapshot !== undefined) && (
                      <button
                        onClick={() => revertChange(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Undo Change</span>
                      </button>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                  {(item.beforeSummary || item.afterSummary) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] font-mono">
                      {item.beforeSummary && (
                        <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-200 text-red-900">
                          <span className="font-bold block text-[10px] uppercase text-red-600">Before</span>
                          {item.beforeSummary}
                        </div>
                      )}
                      {item.afterSummary && (
                        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 flex items-center gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 hidden sm:block" />
                          <div>
                            <span className="font-bold block text-[10px] uppercase text-emerald-600">After</span>
                            {item.afterSummary}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Live Supabase Security audit_logs Feed */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
              <h3 className="text-sm font-black text-slate-900">Supabase Security Audit Logs (`public.audit_logs`)</h3>
              {auditLogsNote ? (
                <p className="text-xs text-slate-500">{auditLogsNote}</p>
              ) : dbAuditLogs.length === 0 ? (
                <p className="text-xs text-slate-500">No remote security audit events returned.</p>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto text-xs font-mono">
                  {dbAuditLogs.map((log, i) => (
                    <div key={log.id || i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between gap-2">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className="text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: VAULT KEY & CLOUD SYNC SETTINGS */}
        {activeTab === 'settings' && (
          <AdminSettingsTab
            cloudSync={cloudSync}
            onRefreshSupabase={refreshFromSupabase}
            onExportSnapshot={exportProjectSnapshot}
            onImportSnapshot={importProjectSnapshot}
            onResetAllOverrides={resetAllAdminOverrides}
            onLockVault={onLockVault}
            onRotatedKey={onRotatedKey}
          />
        )}
      </div>

      {/* Modals */}
      {editingCard !== undefined && (
        <CardEditorModal
          initialCard={editingCard}
          onClose={() => setEditingCard(undefined)}
          onSave={async (card, reason) => {
            await upsertCard(card, reason);
          }}
        />
      )}

      {editingDeval !== undefined && (
        <DevaluationEditorModal
          cards={cards}
          initialEntry={editingDeval}
          onClose={() => setEditingDeval(undefined)}
          onSave={async (entry, reason) => {
            await addOrUpdateDevaluation(entry, reason);
          }}
        />
      )}
    </div>
  );
};
