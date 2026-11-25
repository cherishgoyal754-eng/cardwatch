import React, { useState } from 'react';
import { CreditCard, LiveDevaluationEntry, CardChangeHistory } from '../../types';
import { X, Save, Bell, Clock, ShieldAlert } from 'lucide-react';

interface DevaluationEditorModalProps {
  cards: CreditCard[];
  initialEntry: LiveDevaluationEntry | null;
  onClose: () => void;
  onSave: (entry: LiveDevaluationEntry, reason: string) => Promise<void>;
}

export const DevaluationEditorModal: React.FC<DevaluationEditorModalProps> = ({
  cards,
  initialEntry,
  onClose,
  onSave,
}) => {
  const isNew = !initialEntry;
  const todayLabel = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const [cardId, setCardId] = useState(initialEntry?.cardId || cards[0]?.id || 'general-banking');
  const [cardName, setCardName] = useState(initialEntry?.cardName || cards[0]?.name || 'Bank Portfolio');
  const [bank, setBank] = useState(initialEntry?.bank || cards[0]?.bank || 'HDFC Bank');
  const [announcedDate, setAnnouncedDate] = useState(initialEntry?.announcedDate || todayLabel);
  const [deadline, setDeadline] = useState(initialEntry?.deadline || initialEntry?.date || todayLabel);
  const [type, setType] = useState<CardChangeHistory['type']>(initialEntry?.type || 'devaluation');
  const [severity, setSeverity] = useState<CardChangeHistory['severity']>(initialEntry?.severity || 'high');
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [summary, setSummary] = useState(initialEntry?.summary || '');
  const [oldValue, setOldValue] = useState(initialEntry?.oldValue || '');
  const [newValue, setNewValue] = useState(initialEntry?.newValue || '');
  const [officialRef, setOfficialRef] = useState(initialEntry?.officialRef || 'Issuer Bank Circular');
  const [circularPdfUrl, setCircularPdfUrl] = useState(initialEntry?.circularPdfUrl || '');
  const [changeReason, setChangeReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectCard = (selectedId: string) => {
    setCardId(selectedId);
    if (selectedId === 'general-banking') {
      setCardName('All Portfolio Credit Cards');
      return;
    }
    const found = cards.find(c => c.id === selectedId);
    if (found) {
      setCardName(found.name);
      setBank(found.bank);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;
    setIsSaving(true);
    try {
      const built: LiveDevaluationEntry = {
        id: initialEntry?.id || `adm-deval-${Date.now().toString(36)}`,
        cardId,
        cardName,
        bank,
        date: deadline.trim(),
        announcedDate: announcedDate.trim(),
        deadline: deadline.trim(),
        type,
        title: title.trim(),
        summary: summary.trim(),
        oldValue: oldValue.trim() || 'Previous standard terms',
        newValue: newValue.trim() || 'Revised bank circular terms',
        officialRef: officialRef.trim() || 'Admin Verified Circular',
        circularPdfUrl: circularPdfUrl.trim() || undefined,
        severity,
        source: initialEntry?.source || 'Admin Verified Circular',
        verificationStatus: 'Verified Active',
      };
      await onSave(
        built,
        changeReason.trim() ||
          (isNew
            ? `Published ${bank} circular "${built.title}" (Effective ${built.deadline})`
            : `Edited circular notice "${built.title}"`)
      );
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/65 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-white border border-red-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-red-950 to-slate-950 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-300 font-bold">
                Devaluation & Circular Radar Editor
              </span>
              <h2 className="text-lg font-black">
                {isNew ? 'Publish New Bank Circular Notice' : 'Edit Circular Notice'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-slate-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Target Credit Card</span>
              <select
                value={cards.some(c => c.id === cardId) ? cardId : 'general-banking'}
                onChange={e => handleSelectCard(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
              >
                {cards.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.bank} — {c.name}
                  </option>
                ))}
                <option value="general-banking">Custom / Bank-Wide Circular</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Bank Name *</span>
              <input
                required
                value={bank}
                onChange={e => setBank(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Card / Portfolio Label *</span>
              <input
                required
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-slate-500" />
                Notice Sent Date (When Info Came) *
              </span>
              <input
                required
                value={announcedDate}
                onChange={e => setAnnouncedDate(e.target.value)}
                placeholder="Nov 25, 2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-red-700 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-red-600" />
                Deadline / Effective Date *
              </span>
              <input
                required
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                placeholder="Dec 20, 2026"
                className="w-full px-3 py-2 rounded-xl border border-red-200 bg-red-50/40 text-xs font-mono font-bold"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Change Type</span>
              <select
                value={type}
                onChange={e => setType(e.target.value as CardChangeHistory['type'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
              >
                <option value="devaluation">Devaluation</option>
                <option value="restriction">Restriction</option>
                <option value="fee_revision">Fee Revision</option>
                <option value="policy_update">Policy Update</option>
                <option value="regulatory_update">Regulatory Update</option>
                <option value="enhancement">Positive Enhancement</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Severity</span>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as CardChangeHistory['severity'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
              >
                <option value="critical">Critical Cut</option>
                <option value="high">High Impact</option>
                <option value="medium">Medium Impact</option>
                <option value="low">Low Impact</option>
                <option value="positive">Positive Upgrade</option>
              </select>
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Headline Title *</span>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., ₹75,000 Quarterly Lounge Spend Condition Introduced"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
            />
          </label>

          <label className="space-y-1 block">
            <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Detailed Factual Summary *</span>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-red-700 uppercase">Old Policy (Discontinued)</span>
              <textarea
                rows={2}
                value={oldValue}
                onChange={e => setOldValue(e.target.value)}
                placeholder="What benefit existed previously"
                className="w-full px-3 py-2 rounded-xl border border-red-200 bg-red-50/30 text-xs"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase">New Policy (Enforced)</span>
              <textarea
                rows={2}
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="What applies after deadline"
                className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 text-xs"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Official Circular Ref *</span>
              <input
                required
                value={officialRef}
                onChange={e => setOfficialRef(e.target.value)}
                placeholder="e.g., HDFC/CC/2026/11"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Circular URL (Optional)</span>
              <input
                type="url"
                value={circularPdfUrl}
                onChange={e => setCircularPdfUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Change Ledger Note (Optional)</span>
            <input
              value={changeReason}
              onChange={e => setChangeReason(e.target.value)}
              placeholder="Note recorded in Project Change Ledger"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </label>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !title.trim() || !summary.trim()}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Publishing...' : isNew ? 'Publish Notice Live' : 'Save Circular Updates'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
