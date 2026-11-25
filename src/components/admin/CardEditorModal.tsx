import React, { useState, useMemo } from 'react';
import { CreditCard, CardCategory, CardNetwork } from '../../types';
import { validateCard } from '../../utils/cardValidator';
import { X, Save, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';

interface CardEditorModalProps {
  initialCard: CreditCard | null;
  onClose: () => void;
  onSave: (card: CreditCard, changeReason: string) => Promise<void>;
}

const DEFAULT_NEW_CARD = (): CreditCard => {
  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  return {
    id: `custom-card-${Date.now().toString(36)}`,
    name: '',
    bank: 'HDFC Bank',
    bankLogoText: 'HDFC BANK',
    tier: 'Mid-Tier',
    network: 'Visa',
    cardStyle: 'aurum',
    cardNumberPreview: '•••• 8842',
    joiningFee: 1000,
    annualFee: 1000,
    annualFeeWaiverCondition: 'Waived on ₹1,00,000 annual retail spend',
    isLifetimeFree: false,
    gstApplicability: '18% GST applicable on joining & annual fees',
    welcomeBenefit: 'Welcome gift voucher upon paying joining fee & activating card',
    renewalBenefit: 'Renewal fee waived on achieving annual spend milestone',
    rewardConversionDetails: '1 Reward Point = ₹0.50 statement or travel portal value',
    minSalaryMonthly: 35000,
    minCibilScore: 730,
    status: 'active',
    headlineBenefit: '5% Cashback on Online Shopping • Complimentary Domestic Lounge Access',
    cashbackRate: '5% on preferred online merchants • 1% on all other eligible retail spends',
    rewardPointValue: '1 Reward Point = ₹0.50',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% fuel surcharge waiver on transactions between ₹400 and ₹4,000',
    domesticLoungesPerQuarter: 1,
    internationalLoungesPerYear: 0,
    railwayLoungesPerQuarter: 0,
    loungeSpendCondition: 'Requires ₹50,000 spend in the preceding calendar quarter',
    loungeNetwork: 'DreamFolks',
    merchantExclusions: ['Rent payments', 'Wallet loads', 'Fuel', 'Government taxes'],
    cappingDetails: 'Accelerated cashback capped at ₹1,000 per billing cycle.',
    officialCircularUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards',
    mitcUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards',
    lastVerifiedDate: todayStr,
    isVerified: true,
    auditVerificationStatus: 'fully_verified',
    rating: 4.5,
    popularityIndex: 80,
    changeHistory: [],
    tags: ['cashback', 'shopping'] as CardCategory[],
    suitableFor: ['Everyday online shoppers seeking predictable cashback'],
  };
};

export const CardEditorModal: React.FC<CardEditorModalProps> = ({
  initialCard,
  onClose,
  onSave,
}) => {
  const isNew = !initialCard;
  const [draft, setDraft] = useState<CreditCard>(() =>
    initialCard ? { ...initialCard } : DEFAULT_NEW_CARD()
  );
  const [exclusionsText, setExclusionsText] = useState(() =>
    (initialCard?.merchantExclusions || DEFAULT_NEW_CARD().merchantExclusions).join(', ')
  );
  const [tagsText, setTagsText] = useState(() =>
    (initialCard?.tags || ['cashback', 'shopping']).join(', ')
  );
  const [suitableText, setSuitableText] = useState(() =>
    (initialCard?.suitableFor || DEFAULT_NEW_CARD().suitableFor).join('\n')
  );
  const [changeReason, setChangeReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const builtCard = useMemo<CreditCard>(
    () => ({
      ...draft,
      joiningFee: draft.isLifetimeFree ? 0 : Number(draft.joiningFee) || 0,
      annualFee: draft.isLifetimeFree ? 0 : Number(draft.annualFee) || 0,
      forexMarkup: Number(draft.forexMarkup) || 0,
      minSalaryMonthly: Number(draft.minSalaryMonthly) || 0,
      minCibilScore: Number(draft.minCibilScore) || 700,
      merchantExclusions: exclusionsText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      tags: tagsText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean) as CardCategory[],
      suitableFor: suitableText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean),
    }),
    [draft, exclusionsText, tagsText, suitableText]
  );

  const validation = useMemo(() => validateCard(builtCard), [builtCard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!builtCard.id.trim() || !builtCard.name.trim()) return;
    setIsSaving(true);
    try {
      await onSave(
        builtCard,
        changeReason.trim() ||
          (isNew
            ? `Admin created new card "${builtCard.name}" (${builtCard.bank})`
            : `Admin updated specifications for "${builtCard.name}"`)
      );
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/65 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto rounded-3xl bg-white border border-emerald-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              {isNew ? 'New Catalog Entry' : `Editing Card ID: ${draft.id}`}
            </span>
            <h2 className="text-lg font-black">
              {isNew ? 'Add Credit Card to CARDWATCH' : draft.name || 'Edit Credit Card'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                validation.isValid
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}
            >
              {validation.isValid ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{validation.verifiedFieldsCount} Audit Checks Passed</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{validation.errors.filter(e => e.severity === 'critical').length} Critical Issue(s)</span>
                </>
              )}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 text-slate-900">
          {validation.errors.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
              <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Live CardValidator Checks ({validation.errors.length} note{validation.errors.length > 1 ? 's' : ''})
              </div>
              <ul className="text-[11px] text-amber-800 space-y-0.5 list-disc pl-5">
                {validation.errors.slice(0, 4).map((err, i) => (
                  <li key={i}>
                    <strong className="font-mono uppercase">{err.severity}</strong> [{err.field}]: {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 1: Core Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Card ID (Slug) *</span>
              <input
                required
                disabled={!isNew}
                value={draft.id}
                onChange={e => setDraft({ ...draft, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 disabled:bg-slate-100 text-xs font-mono"
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Official Card Name *</span>
              <input
                required
                value={draft.name}
                onChange={e => setDraft({ ...draft, name: e.target.value })}
                placeholder="e.g., HDFC Pixel Play Credit Card"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Issuing Bank *</span>
              <input
                required
                value={draft.bank}
                onChange={e =>
                  setDraft({ ...draft, bank: e.target.value, bankLogoText: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Tier</span>
              <select
                value={draft.tier}
                onChange={e => setDraft({ ...draft, tier: e.target.value as CreditCard['tier'] })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
              >
                <option value="Super Premium">Super Premium</option>
                <option value="Premium">Premium</option>
                <option value="Mid-Tier">Mid-Tier</option>
                <option value="Entry Level">Entry Level</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Network & Status</span>
              <div className="flex gap-2">
                <select
                  value={draft.network}
                  onChange={e => setDraft({ ...draft, network: e.target.value as CardNetwork })}
                  className="w-1/2 px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="RuPay">RuPay</option>
                  <option value="Amex">Amex</option>
                  <option value="Diners Club">Diners Club</option>
                </select>
                <select
                  value={draft.status}
                  onChange={e => setDraft({ ...draft, status: e.target.value as 'active' | 'discontinued' })}
                  className="w-1/2 px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="active">Active</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
            </label>
          </div>

          {/* Section 2: Fees & Eligibility */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Fees, Waiver & Eligibility Rules
              </h3>
              <label className="flex items-center gap-2 text-xs font-bold text-emerald-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.isLifetimeFree}
                  onChange={e =>
                    setDraft({
                      ...draft,
                      isLifetimeFree: e.target.checked,
                      joiningFee: e.target.checked ? 0 : draft.joiningFee,
                      annualFee: e.target.checked ? 0 : draft.annualFee,
                    })
                  }
                  className="w-4 h-4 accent-emerald-600"
                />
                <span>Lifetime Free (₹0)</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="space-y-1">
                <span className="text-[11px] font-mono text-slate-600">Joining Fee (₹)</span>
                <input
                  type="number"
                  min={0}
                  disabled={draft.isLifetimeFree}
                  value={draft.isLifetimeFree ? 0 : draft.joiningFee}
                  onChange={e => setDraft({ ...draft, joiningFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100 text-xs font-mono"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono text-slate-600">Annual Fee (₹)</span>
                <input
                  type="number"
                  min={0}
                  disabled={draft.isLifetimeFree}
                  value={draft.isLifetimeFree ? 0 : draft.annualFee}
                  onChange={e => setDraft({ ...draft, annualFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100 text-xs font-mono"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono text-slate-600">Min Salary / Mo (₹)</span>
                <input
                  type="number"
                  min={0}
                  value={draft.minSalaryMonthly}
                  onChange={e => setDraft({ ...draft, minSalaryMonthly: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono text-slate-600">Min CIBIL (600-900)</span>
                <input
                  type="number"
                  min={600}
                  max={900}
                  value={draft.minCibilScore}
                  onChange={e => setDraft({ ...draft, minCibilScore: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono"
                />
              </label>
            </div>

            <label className="space-y-1 block">
              <span className="text-[11px] font-mono text-slate-600">Annual Fee Waiver Condition</span>
              <input
                value={draft.annualFeeWaiverCondition}
                onChange={e => setDraft({ ...draft, annualFeeWaiverCondition: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              />
            </label>
          </div>

          {/* Section 3: Rewards & Lounge Quotas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Headline Benefit Summary *</span>
              <input
                required
                value={draft.headlineBenefit}
                onChange={e => setDraft({ ...draft, headlineBenefit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Cashback / Reward Rate *</span>
              <textarea
                rows={2}
                value={draft.cashbackRate}
                onChange={e => setDraft({ ...draft, cashbackRate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Point Valuation *</span>
              <textarea
                rows={2}
                value={draft.rewardPointValue}
                onChange={e => setDraft({ ...draft, rewardPointValue: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-mono text-slate-600">Forex Markup (%)</span>
              <input
                type="number"
                step="0.01"
                min={0}
                max={4.5}
                value={draft.forexMarkup}
                onChange={e => setDraft({ ...draft, forexMarkup: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono text-slate-600">Capping Details</span>
              <input
                value={draft.cappingDetails}
                onChange={e => setDraft({ ...draft, cappingDetails: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-mono text-slate-600">Domestic Lounges / Qtr (or "Unlimited")</span>
              <input
                value={String(draft.domesticLoungesPerQuarter)}
                onChange={e => {
                  const val = e.target.value;
                  setDraft({
                    ...draft,
                    domesticLoungesPerQuarter: /^\d+$/.test(val) ? Number(val) : val,
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono text-slate-600">International Lounges / Yr</span>
              <input
                value={String(draft.internationalLoungesPerYear)}
                onChange={e => {
                  const val = e.target.value;
                  setDraft({
                    ...draft,
                    internationalLoungesPerYear: /^\d+$/.test(val) ? Number(val) : val,
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </label>

            <label className="space-y-1 sm:col-span-2">
              <span className="text-[11px] font-mono text-slate-600">Lounge Spend Condition *</span>
              <input
                value={draft.loungeSpendCondition}
                onChange={e => setDraft({ ...draft, loungeSpendCondition: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </label>
          </div>

          {/* Section 4: Exclusions, Sources & Change Log Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-[11px] font-mono text-slate-600">Merchant Exclusions (comma separated)</span>
              <input
                value={exclusionsText}
                onChange={e => setExclusionsText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-mono text-slate-600">Category Tags (comma separated)</span>
              <input
                value={tagsText}
                onChange={e => setTagsText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[11px] font-mono text-slate-600">Official Bank / Circular URL *</span>
              <input
                type="url"
                value={draft.officialCircularUrl}
                onChange={e => setDraft({ ...draft, officialCircularUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[11px] font-mono text-slate-600">Key Suitability Highlights (1 per line)</span>
              <textarea
                rows={3}
                value={suitableText}
                onChange={e => setSuitableText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Project Change Ledger Reason (Recorded Automatically)
              </span>
              <input
                value={changeReason}
                onChange={e => setChangeReason(e.target.value)}
                placeholder="e.g., Updated quarterly lounge threshold per November bank circular"
                className="w-full px-3 py-2.5 rounded-xl border-2 border-emerald-200 bg-emerald-50/40 text-xs font-medium"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !draft.name.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Override...' : isNew ? 'Create & Log Card' : 'Save Card Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
