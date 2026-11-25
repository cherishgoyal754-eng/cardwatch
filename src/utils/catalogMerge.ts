import { CreditCard, LiveDevaluationEntry } from '../types';

/**
 * Pure helper to merge baseline catalog with admin overrides and archive exclusions.
 */
export function mergeCardCatalog(
  baseCards: CreditCard[],
  overrides: Record<string, CreditCard>,
  archivedIds: string[],
  includeArchived = false
): CreditCard[] {
  const archivedSet = new Set(archivedIds);
  const baseIds = new Set(baseCards.map(c => c.id));

  const mergedBase = baseCards.map(card => (overrides[card.id] ? overrides[card.id] : card));
  const customAdditions = Object.values(overrides).filter(c => !baseIds.has(c.id));

  const combined = [...customAdditions, ...mergedBase];
  return includeArchived ? combined : combined.filter(c => !archivedSet.has(c.id));
}

/**
 * Pure helper to merge live RSS devaluations with admin-curated circulars.
 */
export function mergeLiveDevaluations(
  staticEntries: LiveDevaluationEntry[],
  customEntries: Record<string, LiveDevaluationEntry>,
  dismissedIds: string[]
): LiveDevaluationEntry[] {
  const dismissedSet = new Set(dismissedIds);
  const staticIds = new Set(staticEntries.map(d => d.id));

  const mergedStatic = staticEntries.map(entry =>
    customEntries[entry.id] ? customEntries[entry.id] : entry
  );
  const adminAdditions = Object.values(customEntries).filter(d => !staticIds.has(d.id));

  return [...adminAdditions, ...mergedStatic].filter(d => !dismissedSet.has(d.id));
}
