import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  CreditCard,
  LiveDevaluationEntry,
  ProjectChangeEntry,
  ProjectChangeCategory,
} from '../types';
import { CREDIT_CARDS_DATA } from '../data/cards';
import rawLiveDevaluations from '../data/live-devaluations.json';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mergeCardCatalog, mergeLiveDevaluations } from '../utils/catalogMerge';

const STORAGE_KEYS = {
  CARD_OVERRIDES: 'cardwatch_admin_card_overrides_v1',
  ARCHIVED_CARDS: 'cardwatch_admin_archived_cards_v1',
  CUSTOM_DEVALS: 'cardwatch_admin_devaluations_v1',
  DISMISSED_DEVALS: 'cardwatch_admin_dismissed_devals_v1',
  CHANGELOG: 'cardwatch_admin_project_changelog_v1',
};

export interface CloudSyncStatus {
  supabaseConfigured: boolean;
  cloudTablesReady: boolean;
  lastSyncedAt: string | null;
  status: 'idle' | 'syncing' | 'synced' | 'local-only' | 'error';
  message: string;
}

const BASE_PROJECT_MILESTONES: ProjectChangeEntry[] = [
  {
    id: 'milestone-sovereign-admin-2026-11-25',
    timestamp: '2026-11-25T15:00:00.000Z',
    category: 'system_release',
    title: 'Sovereign Admin Vault & Live Project CMS Deployed',
    description:
      'Added SHA-256 salted Saved-Key Admin Vault, real-time card & circular CMS overrides, Google News Live Radar endpoint, and live project change ledger.',
    actor: 'System Architecture',
    afterSummary: 'Salted SHA-256 Key Gate + Rate Limiter + 5-Tab Admin Console',
    status: 'milestone',
  },
  {
    id: 'milestone-2026-audit-registry',
    timestamp: '2026-11-21T05:24:00.000Z',
    category: 'system_release',
    title: '2026 48-Card Accuracy Audit & Permanent Validator Suite',
    description:
      'Verified 48 Indian credit cards with official issuer circulars, MITC links, 2026 benefit audit registry, and 59 passing unit & audit tests.',
    actor: 'CardWatch Audit Engine',
    afterSummary: '48 cards verified • 100% validator score • Unverified claims isolated',
    status: 'milestone',
  },
  {
    id: 'milestone-google-news-radar-2026-11-19',
    timestamp: '2026-11-19T01:57:00.000Z',
    category: 'radar_sync',
    title: 'Google News RSS + Gemini AI Daily Devaluation Pipeline',
    description:
      'Connected live Google News India RSS feeds with Gemini AI extraction and daily GitHub Actions cron (05:30 AM IST) into live-devaluations.json.',
    actor: 'Automation Pipeline',
    afterSummary: 'Automated daily circular discovery with Notice & Deadline tracking',
    status: 'milestone',
  },
  {
    id: 'milestone-supabase-auth-2026-11-13',
    timestamp: '2026-11-13T18:00:00.000Z',
    category: 'security_vault',
    title: 'Supabase PostgreSQL Auth, RLS Policies & Role Protection',
    description:
      'Provisioned profiles, user_cards, notification_preferences, and immutable audit_logs tables with anti-privilege-escalation triggers.',
    actor: 'Security Migration',
    afterSummary: 'RLS active across all user tables • Admin role protected by trigger',
    status: 'milestone',
  },
];

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage?.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Unable to persist ${key}:`, err);
  }
}

function normalizeStaticDevaluations(): LiveDevaluationEntry[] {
  return (rawLiveDevaluations as any[]).map((item, idx) => ({
    ...item,
    id: item.id || `rss-${item.cardId || 'bank'}-${idx}-${String(item.title || '').slice(0, 16).replace(/\W+/g, '').toLowerCase()}`,
    cardId: item.cardId || 'general-banking',
    cardName: item.cardName || item.bank || 'General Banking Circular',
    bank: item.bank || 'Indian Banks',
  }));
}

interface CardDataContextValue {
  cards: CreditCard[];
  allCardsIncludingArchived: CreditCard[];
  cardOverrides: Record<string, CreditCard>;
  archivedCardIds: string[];
  modifiedCardIds: Set<string>;
  customCardIds: Set<string>;
  liveDevaluations: LiveDevaluationEntry[];
  allDevaluationsIncludingDismissed: LiveDevaluationEntry[];
  dismissedDevalIds: string[];
  projectChangelog: ProjectChangeEntry[];
  cloudSync: CloudSyncStatus;
  upsertCard: (card: CreditCard, customReason?: string, actor?: string) => Promise<void>;
  archiveCard: (cardId: string, actor?: string) => Promise<void>;
  restoreCard: (cardId: string, actor?: string) => Promise<void>;
  revertCardOverride: (cardId: string, actor?: string) => Promise<void>;
  addOrUpdateDevaluation: (entry: LiveDevaluationEntry, customReason?: string, actor?: string) => Promise<void>;
  dismissDevaluation: (devalId: string, actor?: string) => Promise<void>;
  restoreDevaluation: (devalId: string, actor?: string) => Promise<void>;
  logProjectChange: (input: {
    category: ProjectChangeCategory;
    title: string;
    description: string;
    targetId?: string;
    targetName?: string;
    beforeSummary?: string;
    afterSummary?: string;
    beforeSnapshot?: unknown;
    afterSnapshot?: unknown;
    actor?: string;
  }) => Promise<ProjectChangeEntry>;
  revertChange: (changeId: string) => Promise<{ success: boolean; message: string }>;
  exportProjectSnapshot: () => string;
  importProjectSnapshot: (jsonStr: string) => { success: boolean; message: string };
  resetAllAdminOverrides: () => void;
  refreshFromSupabase: () => Promise<CloudSyncStatus>;
}

const CardDataContext = createContext<CardDataContextValue | undefined>(undefined);

export const CardDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cardOverrides, setCardOverrides] = useState<Record<string, CreditCard>>(() =>
    safeReadJson<Record<string, CreditCard>>(STORAGE_KEYS.CARD_OVERRIDES, {})
  );
  const [archivedCardIds, setArchivedCardIds] = useState<string[]>(() =>
    safeReadJson<string[]>(STORAGE_KEYS.ARCHIVED_CARDS, [])
  );
  const [customDevaluations, setCustomDevaluations] = useState<Record<string, LiveDevaluationEntry>>(() =>
    safeReadJson<Record<string, LiveDevaluationEntry>>(STORAGE_KEYS.CUSTOM_DEVALS, {})
  );
  const [dismissedDevalIds, setDismissedDevalIds] = useState<string[]>(() =>
    safeReadJson<string[]>(STORAGE_KEYS.DISMISSED_DEVALS, [])
  );
  const [userChangelog, setUserChangelog] = useState<ProjectChangeEntry[]>(() =>
    safeReadJson<ProjectChangeEntry[]>(STORAGE_KEYS.CHANGELOG, [])
  );

  const [cloudSync, setCloudSync] = useState<CloudSyncStatus>({
    supabaseConfigured: isSupabaseConfigured,
    cloudTablesReady: false,
    lastSyncedAt: null,
    status: isSupabaseConfigured ? 'idle' : 'local-only',
    message: isSupabaseConfigured
      ? 'Checking Supabase Admin CMS tables...'
      : 'Running in Local Vault Mode.',
  });

  const staticDevals = useMemo(() => normalizeStaticDevaluations(), []);
  const baseCardIds = useMemo(() => new Set(CREDIT_CARDS_DATA.map(c => c.id)), []);

  // Persist local state
  useEffect(() => {
    safeWriteJson(STORAGE_KEYS.CARD_OVERRIDES, cardOverrides);
  }, [cardOverrides]);

  useEffect(() => {
    safeWriteJson(STORAGE_KEYS.ARCHIVED_CARDS, archivedCardIds);
  }, [archivedCardIds]);

  useEffect(() => {
    safeWriteJson(STORAGE_KEYS.CUSTOM_DEVALS, customDevaluations);
  }, [customDevaluations]);

  useEffect(() => {
    safeWriteJson(STORAGE_KEYS.DISMISSED_DEVALS, dismissedDevalIds);
  }, [dismissedDevalIds]);

  useEffect(() => {
    safeWriteJson(STORAGE_KEYS.CHANGELOG, userChangelog);
  }, [userChangelog]);

  // Progressive Supabase Cloud CMS Hydration
  const refreshFromSupabase = async (): Promise<CloudSyncStatus> => {
    if (!isSupabaseConfigured) {
      const localState: CloudSyncStatus = {
        supabaseConfigured: false,
        cloudTablesReady: false,
        lastSyncedAt: null,
        status: 'local-only',
        message: 'Supabase keys not configured. Admin changes are stored in Local Vault.',
      };
      setCloudSync(localState);
      return localState;
    }

    setCloudSync(prev => ({ ...prev, status: 'syncing', message: 'Syncing with Supabase Cloud CMS...' }));

    try {
      const [cardsRes, devalsRes] = await Promise.all([
        supabase.from('cardwatch_admin_cards').select('card_id, card_data, is_archived'),
        supabase.from('cardwatch_admin_devaluations').select('id, devaluation_data, is_dismissed'),
      ]);

      // If table doesn't exist yet (404 / 42P01 / PGRST205), fallback smoothly to Local Vault Mode
      if (cardsRes.error || devalsRes.error) {
        const errCode = cardsRes.error?.code || devalsRes.error?.code || '';
        const errMsg = cardsRes.error?.message || devalsRes.error?.message || 'CMS tables not provisioned';
        const isMissingTable =
          errCode === '42P01' ||
          errCode === 'PGRST205' ||
          errMsg.toLowerCase().includes('does not exist') ||
          errMsg.toLowerCase().includes('could not find');

        const statusObj: CloudSyncStatus = {
          supabaseConfigured: true,
          cloudTablesReady: false,
          lastSyncedAt: null,
          status: 'local-only',
          message: isMissingTable
            ? 'Local Vault Active (Run Admin CMS SQL in Vault Settings to enable global cloud sync).'
            : `Cloud check note: ${errMsg}`,
        };
        setCloudSync(statusObj);
        return statusObj;
      }

      if (cardsRes.data && cardsRes.data.length > 0) {
        setCardOverrides(prev => {
          const next = { ...prev };
          for (const row of cardsRes.data) {
            if (row.card_data) next[row.card_id] = row.card_data as CreditCard;
          }
          return next;
        });
        const remoteArchived = cardsRes.data.filter(r => r.is_archived).map(r => r.card_id);
        if (remoteArchived.length > 0) {
          setArchivedCardIds(prev => Array.from(new Set([...prev, ...remoteArchived])));
        }
      }

      if (devalsRes.data && devalsRes.data.length > 0) {
        setCustomDevaluations(prev => {
          const next = { ...prev };
          for (const row of devalsRes.data) {
            if (row.devaluation_data) next[row.id] = row.devaluation_data as LiveDevaluationEntry;
          }
          return next;
        });
        const remoteDismissed = devalsRes.data.filter(r => r.is_dismissed).map(r => r.id);
        if (remoteDismissed.length > 0) {
          setDismissedDevalIds(prev => Array.from(new Set([...prev, ...remoteDismissed])));
        }
      }

      const syncedState: CloudSyncStatus = {
        supabaseConfigured: true,
        cloudTablesReady: true,
        lastSyncedAt: new Date().toISOString(),
        status: 'synced',
        message: 'Connected to Supabase Global Admin CMS.',
      };
      setCloudSync(syncedState);
      return syncedState;
    } catch (err: any) {
      const errState: CloudSyncStatus = {
        supabaseConfigured: true,
        cloudTablesReady: false,
        lastSyncedAt: null,
        status: 'local-only',
        message: err?.message || 'Operating in Local Vault Mode.',
      };
      setCloudSync(errState);
      return errState;
    }
  };

  useEffect(() => {
    refreshFromSupabase();
  }, []);

  const cards = useMemo(
    () => mergeCardCatalog(CREDIT_CARDS_DATA, cardOverrides, archivedCardIds, false),
    [cardOverrides, archivedCardIds]
  );

  const allCardsIncludingArchived = useMemo(
    () => mergeCardCatalog(CREDIT_CARDS_DATA, cardOverrides, archivedCardIds, true),
    [cardOverrides, archivedCardIds]
  );

  const modifiedCardIds = useMemo(
    () => new Set(Object.keys(cardOverrides).filter(id => baseCardIds.has(id))),
    [cardOverrides, baseCardIds]
  );

  const customCardIds = useMemo(
    () => new Set(Object.keys(cardOverrides).filter(id => !baseCardIds.has(id))),
    [cardOverrides, baseCardIds]
  );

  const liveDevaluations = useMemo(
    () => mergeLiveDevaluations(staticDevals, customDevaluations, dismissedDevalIds),
    [staticDevals, customDevaluations, dismissedDevalIds]
  );

  const allDevaluationsIncludingDismissed = useMemo(
    () => mergeLiveDevaluations(staticDevals, customDevaluations, []),
    [staticDevals, customDevaluations]
  );

  const projectChangelog = useMemo(
    () => [...userChangelog, ...BASE_PROJECT_MILESTONES],
    [userChangelog]
  );

  // Best-effort cloud persistence helper when cloud CMS tables exist
  async function syncAuditAndRecordToCloud(
    changeEntry: ProjectChangeEntry,
    tableOperation?: () => Promise<void>
  ) {
    if (!isSupabaseConfigured || !cloudSync.cloudTablesReady) return;
    try {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user?.id || null;
      if (tableOperation) {
        await tableOperation();
      }
      await supabase.from('cardwatch_project_changes').upsert({
        id: changeEntry.id,
        category: changeEntry.category,
        title: changeEntry.title,
        description: changeEntry.description,
        target_id: changeEntry.targetId || null,
        before_state: changeEntry.beforeSnapshot ?? null,
        after_state: changeEntry.afterSnapshot ?? null,
        created_by: userId,
        created_at: changeEntry.timestamp,
      });
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: `ADMIN_${changeEntry.category.toUpperCase()}`,
        metadata: { title: changeEntry.title, targetId: changeEntry.targetId },
      });
    } catch (err) {
      console.warn('Cloud sync skipped (local vault saved):', err);
    }
  }

  const logProjectChange: CardDataContextValue['logProjectChange'] = async input => {
    const entry: ProjectChangeEntry = {
      id: `chg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      category: input.category,
      title: input.title,
      description: input.description,
      targetId: input.targetId,
      targetName: input.targetName,
      actor: input.actor || 'Owner (Master Key)',
      beforeSummary: input.beforeSummary,
      afterSummary: input.afterSummary,
      beforeSnapshot: input.beforeSnapshot,
      afterSnapshot: input.afterSnapshot,
      status: 'applied',
    };
    setUserChangelog(prev => [entry, ...prev]);
    await syncAuditAndRecordToCloud(entry);
    return entry;
  };

  const upsertCard: CardDataContextValue['upsertCard'] = async (card, customReason, actor) => {
    const existing = allCardsIncludingArchived.find(c => c.id === card.id);
    const isNew = !existing;
    const timestampedCard: CreditCard = {
      ...card,
      lastVerifiedDate:
        card.lastVerifiedDate ||
        new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    setCardOverrides(prev => ({
      ...prev,
      [timestampedCard.id]: timestampedCard,
    }));
    setArchivedCardIds(prev => prev.filter(id => id !== timestampedCard.id));

    const entry: ProjectChangeEntry = {
      id: `chg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      category: isNew ? 'card_created' : 'card_updated',
      title: isNew
        ? `Added New Card: ${timestampedCard.name}`
        : `Updated Card: ${timestampedCard.name}`,
      description:
        customReason ||
        (isNew
          ? `Added new ${timestampedCard.bank} (${timestampedCard.tier}) card to live catalog.`
          : `Modified fees, rewards, lounge rules, or audit details on ${timestampedCard.name}.`),
      targetId: timestampedCard.id,
      targetName: timestampedCard.name,
      actor: actor || 'Owner (Master Key)',
      beforeSummary: existing
        ? `Annual ₹${existing.annualFee} | ${existing.headlineBenefit.slice(0, 60)}`
        : 'Not in catalog',
      afterSummary: `Annual ₹${timestampedCard.annualFee} | ${timestampedCard.headlineBenefit.slice(0, 60)}`,
      beforeSnapshot: existing ? (cardOverrides[timestampedCard.id] ?? null) : null,
      afterSnapshot: timestampedCard,
      status: 'applied',
    };

    setUserChangelog(prev => [entry, ...prev]);
    await syncAuditAndRecordToCloud(entry, async () => {
      await supabase.from('cardwatch_admin_cards').upsert({
        card_id: timestampedCard.id,
        card_data: timestampedCard,
        is_archived: false,
        updated_at: new Date().toISOString(),
      });
    });
  };

  const archiveCard: CardDataContextValue['archiveCard'] = async (cardId, actor) => {
    const target = allCardsIncludingArchived.find(c => c.id === cardId);
    setArchivedCardIds(prev => (prev.includes(cardId) ? prev : [...prev, cardId]));

    await logProjectChange({
      category: 'card_archived',
      title: `Archived Card: ${target?.name || cardId}`,
      description: `Hidden ${target?.name || cardId} from public catalog views.`,
      targetId: cardId,
      targetName: target?.name || cardId,
      beforeSummary: 'Active in public catalog',
      afterSummary: 'Archived by Admin',
      actor,
    });
  };

  const restoreCard: CardDataContextValue['restoreCard'] = async (cardId, actor) => {
    const target = allCardsIncludingArchived.find(c => c.id === cardId);
    setArchivedCardIds(prev => prev.filter(id => id !== cardId));

    await logProjectChange({
      category: 'card_restored',
      title: `Restored Card: ${target?.name || cardId}`,
      description: `Restored ${target?.name || cardId} to active public catalog.`,
      targetId: cardId,
      targetName: target?.name || cardId,
      beforeSummary: 'Archived',
      afterSummary: 'Active in public catalog',
      actor,
    });
  };

  const revertCardOverride: CardDataContextValue['revertCardOverride'] = async (cardId, actor) => {
    const prevOverride = cardOverrides[cardId];
    setCardOverrides(prev => {
      const next = { ...prev };
      delete next[cardId];
      return next;
    });
    setArchivedCardIds(prev => prev.filter(id => id !== cardId));

    const base = CREDIT_CARDS_DATA.find(c => c.id === cardId);
    await logProjectChange({
      category: 'card_restored',
      title: `Reverted Card to Baseline: ${base?.name || cardId}`,
      description: base
        ? `Cleared admin override and restored verified repository baseline for ${base.name}.`
        : `Removed custom admin card ${cardId}.`,
      targetId: cardId,
      targetName: base?.name || prevOverride?.name || cardId,
      beforeSnapshot: prevOverride,
      afterSnapshot: base || null,
      actor,
    });
  };

  const addOrUpdateDevaluation: CardDataContextValue['addOrUpdateDevaluation'] = async (
    entryInput,
    customReason,
    actor
  ) => {
    const id =
      entryInput.id ||
      `adm-deval-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const existing = allDevaluationsIncludingDismissed.find(d => d.id === id);
    const fullEntry: LiveDevaluationEntry = {
      ...entryInput,
      id,
      syncedAt: new Date().toISOString(),
      source: entryInput.source || 'Admin Published Circular',
    };

    setCustomDevaluations(prev => ({ ...prev, [id]: fullEntry }));
    setDismissedDevalIds(prev => prev.filter(did => did !== id));

    const changeEntry = await logProjectChange({
      category: existing ? 'devaluation_updated' : 'devaluation_published',
      title: existing
        ? `Updated Circular: ${fullEntry.title}`
        : `Published Circular: ${fullEntry.title}`,
      description:
        customReason ||
        `${fullEntry.bank} (${fullEntry.cardName}) • Notice: ${fullEntry.announcedDate || fullEntry.date} • Deadline: ${fullEntry.deadline || fullEntry.date}`,
      targetId: id,
      targetName: `${fullEntry.bank} — ${fullEntry.cardName}`,
      beforeSummary: existing ? existing.newValue : 'Not published',
      afterSummary: fullEntry.newValue,
      beforeSnapshot: existing || null,
      afterSnapshot: fullEntry,
      actor,
    });

    await syncAuditAndRecordToCloud(changeEntry, async () => {
      await supabase.from('cardwatch_admin_devaluations').upsert({
        id,
        devaluation_data: fullEntry,
        is_dismissed: false,
        updated_at: new Date().toISOString(),
      });
    });
  };

  const dismissDevaluation: CardDataContextValue['dismissDevaluation'] = async (devalId, actor) => {
    const target = allDevaluationsIncludingDismissed.find(d => d.id === devalId);
    setDismissedDevalIds(prev => (prev.includes(devalId) ? prev : [...prev, devalId]));

    await logProjectChange({
      category: 'devaluation_dismissed',
      title: `Dismissed Radar Entry: ${target?.title || devalId}`,
      description: `Removed or hid radar notice for ${target?.bank || 'Bank'} from public Devaluations feed.`,
      targetId: devalId,
      targetName: target?.cardName,
      actor,
    });
  };

  const restoreDevaluation: CardDataContextValue['restoreDevaluation'] = async (devalId, actor) => {
    const target = allDevaluationsIncludingDismissed.find(d => d.id === devalId);
    setDismissedDevalIds(prev => prev.filter(id => id !== devalId));

    await logProjectChange({
      category: 'devaluation_published',
      title: `Restored Radar Entry: ${target?.title || devalId}`,
      description: `Re-enabled notice in public Devaluations feed.`,
      targetId: devalId,
      targetName: target?.cardName,
      actor,
    });
  };

  const revertChange: CardDataContextValue['revertChange'] = async changeId => {
    const target = userChangelog.find(c => c.id === changeId);
    if (!target || target.status !== 'applied') {
      return { success: false, message: 'Only applied admin changes can be reverted.' };
    }

    if ((target.category === 'card_updated' || target.category === 'card_created') && target.targetId) {
      if (target.beforeSnapshot) {
        setCardOverrides(prev => ({
          ...prev,
          [target.targetId!]: target.beforeSnapshot as CreditCard,
        }));
      } else {
        setCardOverrides(prev => {
          const next = { ...prev };
          delete next[target.targetId!];
          return next;
        });
      }
    } else if (target.category === 'card_archived' && target.targetId) {
      setArchivedCardIds(prev => prev.filter(id => id !== target.targetId));
    } else if (target.category === 'devaluation_published' && target.targetId) {
      setDismissedDevalIds(prev => Array.from(new Set([...prev, target.targetId!])));
    } else if (target.category === 'devaluation_dismissed' && target.targetId) {
      setDismissedDevalIds(prev => prev.filter(id => id !== target.targetId));
    }

    setUserChangelog(prev =>
      prev.map(c => (c.id === changeId ? { ...c, status: 'reverted' } : c))
    );

    return { success: true, message: `Reverted "${target.title}".` };
  };

  const exportProjectSnapshot = () => {
    return JSON.stringify(
      {
        app: 'CARDWATCH',
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        cardOverrides,
        archivedCardIds,
        customDevaluations,
        dismissedDevalIds,
        userChangelog,
      },
      null,
      2
    );
  };

  const importProjectSnapshot = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || parsed.app !== 'CARDWATCH') {
        return { success: false, message: 'Invalid snapshot file: missing CARDWATCH header.' };
      }
      if (parsed.cardOverrides && typeof parsed.cardOverrides === 'object') {
        setCardOverrides(parsed.cardOverrides);
      }
      if (Array.isArray(parsed.archivedCardIds)) {
        setArchivedCardIds(parsed.archivedCardIds);
      }
      if (parsed.customDevaluations && typeof parsed.customDevaluations === 'object') {
        setCustomDevaluations(parsed.customDevaluations);
      }
      if (Array.isArray(parsed.dismissedDevalIds)) {
        setDismissedDevalIds(parsed.dismissedDevalIds);
      }
      if (Array.isArray(parsed.userChangelog)) {
        setUserChangelog(parsed.userChangelog);
      }
      logProjectChange({
        category: 'project_note',
        title: 'Imported Project Snapshot Backup',
        description: `Restored admin overrides & changelog snapshot exported at ${parsed.exportedAt || 'unknown'}.`,
      });
      return { success: true, message: 'Project snapshot restored cleanly.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to parse snapshot JSON.' };
    }
  };

  const resetAllAdminOverrides = () => {
    setCardOverrides({});
    setArchivedCardIds([]);
    setCustomDevaluations({});
    setDismissedDevalIds([]);
    logProjectChange({
      category: 'project_note',
      title: 'Reset Local Admin Overrides to Code Baseline',
      description: 'Cleared all custom local card edits and circular overrides.',
    });
  };

  return (
    <CardDataContext.Provider
      value={{
        cards,
        allCardsIncludingArchived,
        cardOverrides,
        archivedCardIds,
        modifiedCardIds,
        customCardIds,
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
      }}
    >
      {children}
    </CardDataContext.Provider>
  );
};

export function useCardData(): CardDataContextValue {
  const ctx = useContext(CardDataContext);
  if (!ctx) {
    throw new Error('useCardData must be used within a CardDataProvider');
  }
  return ctx;
}
