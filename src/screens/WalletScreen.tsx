import React, { useState, useEffect } from 'react';
import { CreditCard, UserProfile, ScreenType } from '../types';
import { getBankHelpline } from '../data/cards';
import { sound } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  Plus,
  Trash2,
  ShieldAlert,
  Bell,
  CheckCircle2,
  ArrowRight,
  KeyRound,
  Lock,
  AlertTriangle,
  Clock,
  Calendar,
  CreditCard as CardIcon,
  Sparkles,
  RefreshCw,
  Sliders,
  Check,
  TrendingUp,
  Receipt,
  Info
} from 'lucide-react';

export interface CardBillingInfo {
  cardId: string;
  creditLimit: number;
  usedAmount: number;
  billAmount: number;
  minimumDue: number;
  dueDate: string;
  daysRemaining: number;
  isPaid: boolean;
  lastPaidAt?: string;
}

const DEFAULT_BILLING_DATA: Record<string, Omit<CardBillingInfo, 'cardId'>> = {
  'icici-amazon-pay': {
    creditLimit: 300000,
    usedAmount: 42800,
    billAmount: 34200,
    minimumDue: 1710,
    dueDate: '15 Nov 2026',
    daysRemaining: 1, // URGENT: Due Tomorrow!
    isPaid: false,
  },
  'hdfc-regalia-gold': {
    creditLimit: 500000,
    usedAmount: 138000,
    billAmount: 42500,
    minimumDue: 2125,
    dueDate: '17 Nov 2026',
    daysRemaining: 3, // WARNING: Due in 3 days!
    isPaid: false,
  },
  'amex-platinum': {
    creditLimit: 1200000,
    usedAmount: 265000,
    billAmount: 88400,
    minimumDue: 4420,
    dueDate: '22 Nov 2026',
    daysRemaining: 8,
    isPaid: false,
  },
  'hdfc-diners-black': {
    creditLimit: 800000,
    usedAmount: 195000,
    billAmount: 64200,
    minimumDue: 3210,
    dueDate: '19 Nov 2026',
    daysRemaining: 5,
    isPaid: false,
  },
  'sbi-cashback': {
    creditLimit: 250000,
    usedAmount: 58000,
    billAmount: 22400,
    minimumDue: 1120,
    dueDate: '16 Nov 2026',
    daysRemaining: 2, // WARNING: Due in 2 days!
    isPaid: false,
  },
  'scapia-federal': {
    creditLimit: 200000,
    usedAmount: 38200,
    billAmount: 18900,
    minimumDue: 945,
    dueDate: '25 Nov 2026',
    daysRemaining: 11,
    isPaid: false,
  },
  'indusind-tiger': {
    creditLimit: 350000,
    usedAmount: 48500,
    billAmount: 21300,
    minimumDue: 1065,
    dueDate: '28 Nov 2026',
    daysRemaining: 14,
    isPaid: false,
  },
};

function getInitialBillingForCard(cardId: string, card?: CreditCard): CardBillingInfo {
  if (DEFAULT_BILLING_DATA[cardId]) {
    return {
      cardId,
      ...DEFAULT_BILLING_DATA[cardId],
    };
  }

  // Derive sensible numbers based on card tier or fees
  let limit = 300000;
  let used = 50000;
  let bill = 24000;
  let days = 4;

  if (card?.tier === 'Super Premium') {
    limit = 1000000;
    used = 240000;
    bill = 75000;
    days = 4;
  } else if (card?.tier === 'Premium') {
    limit = 500000;
    used = 110000;
    bill = 38000;
    days = 3;
  } else if (card?.tier === 'Entry Level') {
    limit = 150000;
    used = 28000;
    bill = 12500;
    days = 5;
  }

  return {
    cardId,
    creditLimit: limit,
    usedAmount: used,
    billAmount: bill,
    minimumDue: Math.round(bill * 0.05),
    dueDate: `${14 + days} Nov 2026`,
    daysRemaining: days,
    isPaid: false,
  };
}

interface WalletScreenProps {
  cards: CreditCard[];
  savedCardIds: string[];
  onRemoveFromWallet: (cardId: string) => void;
  onAddToWallet: (cardId: string) => void;
  onSelectCard: (cardId: string) => void;
  onNavigate: (screen: ScreenType) => void;
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
  cards,
  savedCardIds,
  onRemoveFromWallet,
  onAddToWallet,
  onSelectCard,
  onNavigate: _onNavigate,
  userProfile,
  onUpdateProfile,
}) => {
  const { isGuest, promptSignIn } = useAuth();
  const [selectedAddId, setSelectedAddId] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Billing state for each card with localStorage persistence
  const [billingMap, setBillingMap] = useState<Record<string, CardBillingInfo>>(() => {
    try {
      const stored = localStorage.getItem('cardwatch_wallet_card_billing');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    const initial: Record<string, CardBillingInfo> = {};
    savedCardIds.forEach(id => {
      initial[id] = getInitialBillingForCard(id);
    });
    return initial;
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('cardwatch_wallet_card_billing', JSON.stringify(billingMap));
  }, [billingMap]);

  // Ensure any newly added card gets default billing data
  useEffect(() => {
    setBillingMap(prev => {
      let changed = false;
      const updated = { ...prev };
      savedCardIds.forEach(id => {
        if (!updated[id]) {
          const matched = cards.find(c => c.id === id);
          updated[id] = getInitialBillingForCard(id, matched);
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [savedCardIds, cards]);

  // Edit Limit & Spends Modal State
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState<number>(0);
  const [editUsed, setEditUsed] = useState<number>(0);
  const [editBill, setEditBill] = useState<number>(0);
  const [editDueDate, setEditDueDate] = useState<string>('');
  const [editDaysRemaining, setEditDaysRemaining] = useState<number>(3);

  const ownedCards = savedCardIds
    .map(id => cards.find(c => c.id === id)!)
    .filter(Boolean);

  const personalAlerts = ownedCards
    .filter(c => c.recentChangeAlert)
    .map(c => ({
      cardId: c.id,
      cardName: c.name,
      bank: c.bank,
      alert: c.recentChangeAlert!,
    }));

  const handleTogglePref = (key: keyof NonNullable<UserProfile>['notificationPreferences']) => {
    if (!userProfile) return;
    sound.playClick();
    const updated = {
      ...userProfile,
      notificationPreferences: {
        ...userProfile.notificationPreferences,
        [key]: !userProfile.notificationPreferences[key],
      },
    };
    onUpdateProfile(updated);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddId) return;
    sound.playCardFlip();
    onAddToWallet(selectedAddId);
    setSelectedAddId('');
    setIsAdding(false);
  };

  // Payment Handlers
  const handleRepaySingleBill = (cardId: string) => {
    sound.playSuccess();
    const current = billingMap[cardId] || getInitialBillingForCard(cardId);
    const repaymentAmount = current.billAmount;
    
    // Reduce usedAmount by the bill amount, mark as paid
    const updatedUsed = Math.max(0, current.usedAmount - repaymentAmount);

    setBillingMap(prev => ({
      ...prev,
      [cardId]: {
        ...current,
        usedAmount: updatedUsed,
        isPaid: true,
        lastPaidAt: 'Today, ' + new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date()),
      },
    }));

    const cardObj = cards.find(c => c.id === cardId);
    setNotificationBanner(`✓ Payment of ₹${repaymentAmount.toLocaleString('en-IN')} for ${cardObj?.name || 'card'} successful! Statement settled.`);
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  const handleResetBillStatus = (cardId: string) => {
    sound.playClick();
    const current = billingMap[cardId] || getInitialBillingForCard(cardId);
    setBillingMap(prev => ({
      ...prev,
      [cardId]: {
        ...current,
        isPaid: false,
        usedAmount: current.usedAmount + current.billAmount,
      },
    }));
  };

  const handleSettleAllUrgentBills = () => {
    sound.playSuccess();
    let totalPaid = 0;
    const updated = { ...billingMap };

    ownedCards.forEach(card => {
      const b = updated[card.id] || getInitialBillingForCard(card.id, card);
      if (!b.isPaid && b.daysRemaining <= 3) {
        totalPaid += b.billAmount;
        updated[card.id] = {
          ...b,
          usedAmount: Math.max(0, b.usedAmount - b.billAmount),
          isPaid: true,
          lastPaidAt: 'Today, ' + new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date()),
        };
      }
    });

    setBillingMap(updated);
    setNotificationBanner(`✓ All urgent bills settled! Total ₹${totalPaid.toLocaleString('en-IN')} paid. CIBIL score (780+) and credit health protected!`);
    setTimeout(() => setNotificationBanner(null), 6000);
  };

  const handleOpenEditModal = (cardId: string) => {
    sound.playClick();
    const current = billingMap[cardId] || getInitialBillingForCard(cardId);
    setEditingCardId(cardId);
    setEditLimit(current.creditLimit);
    setEditUsed(current.usedAmount);
    setEditBill(current.billAmount);
    setEditDueDate(current.dueDate);
    setEditDaysRemaining(current.daysRemaining);
  };

  const handleSaveEditModal = () => {
    if (!editingCardId) return;
    sound.playClick();
    setBillingMap(prev => ({
      ...prev,
      [editingCardId]: {
        cardId: editingCardId,
        creditLimit: editLimit,
        usedAmount: editUsed,
        billAmount: editBill,
        minimumDue: Math.round(editBill * 0.05),
        dueDate: editDueDate,
        daysRemaining: editDaysRemaining,
        isPaid: prev[editingCardId]?.isPaid ?? false,
      },
    }));
    setEditingCardId(null);
  };

  // Aggregates
  let totalCreditLimit = 0;
  let totalUsedSpends = 0;
  let totalBillYetToPay = 0;
  let urgentUnpaidCardsCount = 0;
  let urgentUnpaidTotal = 0;

  ownedCards.forEach(card => {
    const b = billingMap[card.id] || getInitialBillingForCard(card.id, card);
    totalCreditLimit += b.creditLimit;
    totalUsedSpends += b.usedAmount;
    if (!b.isPaid) {
      totalBillYetToPay += b.billAmount;
      if (b.daysRemaining <= 3) {
        urgentUnpaidCardsCount += 1;
        urgentUnpaidTotal += b.billAmount;
      }
    }
  });

  const totalAvailableBalance = Math.max(0, totalCreditLimit - totalUsedSpends);
  const totalUtilization = totalCreditLimit > 0 ? ((totalUsedSpends / totalCreditLimit) * 100).toFixed(1) : '0';
  const totalAvailablePct = totalCreditLimit > 0 ? ((totalAvailableBalance / totalCreditLimit) * 100).toFixed(0) : '100';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28 text-slate-900">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider mb-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>Credit Card Wallet & Payment Radar</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            My Credit Card Wallet
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
            Monitor real-time card balances, credit limits, spent amounts, and receive urgent payment due alerts before late-fees and 42% APR interest apply.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isGuest) {
                sound.playClick();
                promptSignIn('Sign in to add cards to your personal wallet and track lounge eligibility.');
                return;
              }
              sound.playClick();
              setIsAdding(true);
            }}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card I Own</span>
          </button>
        </div>
      </div>

      {/* Instant Toast Notification */}
      {notificationBanner && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white flex items-center justify-between gap-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{notificationBanner}</span>
          </div>
          <button
            onClick={() => setNotificationBanner(null)}
            className="text-white/80 hover:text-white text-xs font-extrabold px-2 py-1 rounded-lg bg-emerald-700/60"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Guest Mode Callout */}
      {isGuest && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-sm">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">Guest Wallet Demo</h4>
              <p className="text-[11px] text-slate-600">
                You are viewing sample cards with active payment due schedules. Sign in to monitor your actual cards and receive verified bank devaluation alerts.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              promptSignIn('Sign in to save cards to your personal wallet.');
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 shrink-0 flex items-center justify-center gap-1.5 transition-all"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Sign In to Save</span>
          </button>
        </div>
      )}

      {/* TOP PAYMENT DUE WARNING ALERT SYSTEM */}
      {urgentUnpaidCardsCount > 0 ? (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-50 via-amber-50/70 to-rose-50/50 border-2 border-rose-300 shadow-lg space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-36 h-36 bg-rose-200/40 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-black bg-rose-600 text-white px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                    ⚠️ URGENT PAYMENT WARNING
                  </span>
                  <span className="text-xs text-rose-700 font-bold hidden sm:inline">
                    Avoid 42% APR Finance Charges & ₹1,200 Late Fees
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-rose-950 mt-1">
                  ₹{urgentUnpaidTotal.toLocaleString('en-IN')} Unpaid Bill Amount Due within 3 Days!
                </h3>
                <p className="text-xs text-slate-700 font-medium mt-0.5 max-w-xl">
                  You have <span className="font-bold text-rose-700">{urgentUnpaidCardsCount} card{urgentUnpaidCardsCount > 1 ? 's' : ''}</span> with statement payments due soon. Pay immediately to keep your CIBIL score (780+) pristine.
                </p>
              </div>
            </div>

            <button
              onClick={handleSettleAllUrgentBills}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition-all shrink-0 hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" />
              <span>Settle All Due Bills (₹{urgentUnpaidTotal.toLocaleString('en-IN')})</span>
            </button>
          </div>

          {/* Breakdown of Urgent Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {ownedCards
              .filter(c => {
                const b = billingMap[c.id];
                return b && !b.isPaid && b.daysRemaining <= 3;
              })
              .map(card => {
                const b = billingMap[card.id];
                const isTomorrow = b.daysRemaining <= 1;
                return (
                  <div
                    key={card.id}
                    className={`p-3.5 rounded-2xl bg-white border ${
                      isTomorrow ? 'border-rose-400 bg-rose-50/40' : 'border-amber-300 bg-amber-50/30'
                    } flex items-center justify-between gap-3 shadow-sm`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                          isTomorrow ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {isTomorrow ? '🚨 DUE TOMORROW' : `⚠️ DUE IN ${b.daysRemaining} DAYS`}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{b.dueDate}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{card.name}</h4>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-sm font-extrabold text-rose-700">₹{b.billAmount.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Min: ₹{b.minimumDue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRepaySingleBill(card.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1 transition-all shrink-0"
                    >
                      <span>Repay</span>
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-emerald-950">
                All Credit Card Bills Up-to-Date & Safe
              </h4>
              <p className="text-[11px] text-slate-600">
                No immediate overdue payments in the next 3 days. Your credit score and interest-free grace periods are secure.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300 shrink-0">
            0% Interest Incurred
          </span>
        </div>
      )}

      {/* PORTFOLIO TOTALS DASHBOARD BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Limit */}
        <div className="p-5 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Credit Limit</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CardIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            ₹{totalCreditLimit.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Across {ownedCards.length} active credit card{ownedCards.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Card 2: Available Balance */}
        <div className="p-5 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Available Balance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tracking-tight">
            ₹{totalAvailableBalance.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{totalAvailablePct}% remaining spend power</span>
          </div>
        </div>

        {/* Card 3: Used Spends */}
        <div className="p-5 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Used Credit</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mono tracking-tight">
            ₹{totalUsedSpends.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-600 font-medium">
            <span className="font-bold text-slate-900">{totalUtilization}% utilization</span> • Optimal &lt;30% for CIBIL
          </p>
        </div>

        {/* Card 4: Total Unpaid Bill to Repay */}
        <div className={`p-5 rounded-3xl bg-white border ${
          totalBillYetToPay > 0 ? 'border-rose-300' : 'border-emerald-200'
        } shadow-sm space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Bill Yet to Repay</span>
            <div className={`w-8 h-8 rounded-xl ${
              totalBillYetToPay > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            } flex items-center justify-center`}>
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
            totalBillYetToPay > 0 ? 'text-rose-700' : 'text-emerald-700'
          }`}>
            ₹{totalBillYetToPay.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-600 font-medium">
            {totalBillYetToPay > 0 ? (
              <span className="text-rose-700 font-bold">Outstanding statement amount to repay</span>
            ) : (
              <span className="text-emerald-700 font-bold">✓ All bills cleared & settled</span>
            )}
          </p>
        </div>
      </div>

      {/* Add Card Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 border-2 border-emerald-400 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">Add Card to My Wallet</h3>
            <p className="text-xs text-slate-600">
              Select a card from our verified database to start monitoring its changes, balance, and payment schedule.
            </p>

            <select
              value={selectedAddId}
              onChange={e => setSelectedAddId(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-300 text-slate-900 text-xs font-bold focus:outline-none"
            >
              <option value="" disabled>Choose a credit card...</option>
              {cards
                .filter(c => !savedCardIds.includes(c.id))
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.bank})
                  </option>
                ))}
            </select>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl bg-emerald-50 text-slate-700 text-xs font-bold hover:bg-emerald-100 border border-emerald-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedAddId}
                onClick={handleAddCardSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20"
              >
                Save Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Limit & Spent Modal */}
      {editingCardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 border-2 border-emerald-400 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Customize Card Balance & Billing</h3>
              </div>
              <button
                onClick={() => setEditingCardId(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Set your actual credit card limit, current spends, and upcoming bill due date for personalized alerts.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Total Credit Limit (₹)</label>
                <input
                  type="number"
                  value={editLimit}
                  onChange={e => setEditLimit(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Current Used Spends (₹)</label>
                <input
                  type="number"
                  value={editUsed}
                  onChange={e => setEditUsed(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Statement Bill Amount Yet to Pay (₹)</label>
                <input
                  type="number"
                  value={editBill}
                  onChange={e => setEditBill(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Due Date Label</label>
                  <input
                    type="text"
                    value={editDueDate}
                    onChange={e => setEditDueDate(e.target.value)}
                    placeholder="e.g. 17 Nov 2026"
                    className="w-full p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-300 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Days Remaining</label>
                  <input
                    type="number"
                    value={editDaysRemaining}
                    onChange={e => setEditDaysRemaining(Number(e.target.value))}
                    min={0}
                    max={30}
                    className="w-full p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-300 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                type="button"
                onClick={() => setEditingCardId(null)}
                className="px-4 py-2 rounded-xl bg-emerald-50 text-slate-700 text-xs font-bold hover:bg-emerald-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditModal}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Devaluation Alert Feed */}
      {personalAlerts.length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-50/60 border-2 border-amber-300 space-y-4 shadow-md">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 animate-pulse" />
            <h3 className="text-sm font-extrabold uppercase font-mono tracking-wider text-amber-900">
              {personalAlerts.length} Actionable Alert{personalAlerts.length > 1 ? 's' : ''} on Your Cards:
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalAlerts.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white border border-amber-200 space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono uppercase text-emerald-700 font-bold">{item.bank}</span>
                    <h4 className="text-sm font-bold text-slate-900">{item.cardName}</h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                    {item.alert.effectiveDate}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {item.alert.description}
                </p>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectCard(item.cardId);
                    }}
                    className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Read Full Circular & Toll-Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Owned Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            <span>Cards in Your Portfolio ({ownedCards.length})</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Click 'Repay Bill' to clear statement dues and restore available balance.
          </span>
        </div>

        {ownedCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedCards.map(card => {
              const helpline = getBankHelpline(card.bank);
              const b = billingMap[card.id] || getInitialBillingForCard(card.id, card);
              const available = Math.max(0, b.creditLimit - b.usedAmount);
              const utilizationPct = b.creditLimit > 0 ? Math.min(100, Math.round((b.usedAmount / b.creditLimit) * 100)) : 0;
              const isUrgent = !b.isPaid && b.daysRemaining <= 3;
              const isDueTomorrow = !b.isPaid && b.daysRemaining <= 1;

              return (
                <div
                  key={card.id}
                  className={`p-6 rounded-3xl bg-white border-2 ${
                    isDueTomorrow
                      ? 'border-rose-400 shadow-md ring-2 ring-rose-300/40'
                      : isUrgent
                      ? 'border-amber-400 shadow-sm'
                      : 'border-emerald-200 hover:border-emerald-400 shadow-sm'
                  } transition-all flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono uppercase text-emerald-700 font-bold">
                          {card.bank}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(card.id)}
                            className="text-slate-400 hover:text-emerald-700 p-1 transition-colors"
                            title="Edit Limit & Balance"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              sound.playClick();
                              onRemoveFromWallet(card.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            title="Remove from wallet"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4
                        onClick={() => onSelectCard(card.id)}
                        className="text-base font-extrabold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors mt-1"
                      >
                        {card.name}
                      </h4>
                    </div>

                    {/* PAYMENT WARNING / DUE STATUS BADGE */}
                    <div className="pt-1">
                      {!b.isPaid ? (
                        <div className={`p-3 rounded-2xl ${
                          isDueTomorrow
                            ? 'bg-rose-50 border border-rose-300 text-rose-900'
                            : isUrgent
                            ? 'bg-amber-50 border border-amber-300 text-amber-900'
                            : 'bg-emerald-50/60 border border-emerald-200 text-slate-800'
                        } flex items-center justify-between gap-2 shadow-xs`}>
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 shrink-0 ${
                              isDueTomorrow ? 'text-rose-600 animate-pulse' : isUrgent ? 'text-amber-600' : 'text-emerald-700'
                            }`} />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
                                  isDueTomorrow ? 'bg-rose-600 text-white' : isUrgent ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {isDueTomorrow ? '🚨 DUE TOMORROW' : isUrgent ? `⚠️ DUE IN ${b.daysRemaining} DAYS` : `DUE IN ${b.daysRemaining} DAYS`}
                                </span>
                              </div>
                              <span className="text-[11px] font-bold block mt-0.5">
                                Due on {b.dueDate}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            Avoid 42% APR
                          </span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <span className="text-xs font-extrabold text-emerald-950 block">Statement Bill Paid</span>
                              <span className="text-[10px] text-emerald-700 font-medium">
                                {b.lastPaidAt || 'Paid for this billing cycle'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleResetBillStatus(card.id)}
                            className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 underline"
                            title="Reset bill status to test warnings"
                          >
                            Mark Unpaid
                          </button>
                        </div>
                      )}
                    </div>

                    {/* LIVE BALANCE & UTILIZATION GAUGES */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                      <div className="flex justify-between items-baseline text-xs">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Available Balance</span>
                          <span className="text-base font-extrabold font-mono text-emerald-700">
                            ₹{available.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Credit Used</span>
                          <span className="text-sm font-extrabold font-mono text-slate-800">
                            ₹{b.usedAmount.toLocaleString('en-IN')} <span className="text-slate-400 font-normal text-[11px]">/ ₹{b.creditLimit.toLocaleString('en-IN')}</span>
                          </span>
                        </div>
                      </div>

                      {/* Utilization Bar */}
                      <div className="space-y-1">
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              utilizationPct > 50
                                ? 'bg-rose-500'
                                : utilizationPct > 30
                                ? 'bg-amber-500'
                                : 'bg-emerald-600'
                            }`}
                            style={{ width: `${utilizationPct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                          <span>{utilizationPct}% credit limit used</span>
                          <span className={utilizationPct <= 30 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                            {utilizationPct <= 30 ? '✓ Healthy for CIBIL' : '⚠️ Keep below 30%'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BILL AMOUNT YET TO BE PAID & REPAY ACTION */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3">
                      <div className="flex justify-between items-start text-xs">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                            Bill Amount Yet to Pay
                          </span>
                          <span className={`text-lg font-black font-mono ${
                            b.isPaid ? 'text-emerald-700' : 'text-rose-700'
                          }`}>
                            {b.isPaid ? '₹0' : `₹${b.billAmount.toLocaleString('en-IN')}`}
                          </span>
                          {!b.isPaid && (
                            <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                              Min Due: ₹{b.minimumDue.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Payment Due</span>
                          <span className="text-xs font-bold text-slate-900 font-mono block">
                            {b.dueDate}
                          </span>
                          <span className={`text-[10px] font-extrabold ${b.isPaid ? 'text-emerald-700' : isDueTomorrow ? 'text-rose-700' : 'text-amber-700'}`}>
                            {b.isPaid ? '✓ Settled' : `${b.daysRemaining} days left`}
                          </span>
                        </div>
                      </div>

                      {/* Repay Action Button */}
                      {!b.isPaid ? (
                        <button
                          onClick={() => handleRepaySingleBill(card.id)}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Repay Bill (₹{b.billAmount.toLocaleString('en-IN')})</span>
                        </button>
                      ) : (
                        <div className="w-full py-2 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Bill Repaid & Clear</span>
                        </div>
                      )}
                    </div>

                    {/* Direct Bank Toll-Free Phone on Card */}
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-emerald-800 font-bold uppercase block">Toll-Free Helpline:</span>
                        <a href={`tel:${helpline.conciergeNumber.replace(/\D/g, '')}`} className="font-mono font-bold text-slate-900 text-sm hover:text-emerald-700 hover:underline">
                          {helpline.conciergeNumber}
                        </a>
                      </div>
                      <a
                        href={`tel:${helpline.conciergeNumber.replace(/\D/g, '')}`}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors"
                      >
                        Call
                      </a>
                    </div>

                    {/* Lounge spend radar box */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 font-medium">Quarterly Lounge Quota:</span>
                        <span className="font-mono text-emerald-800 font-extrabold">{card.domesticLoungesPerQuarter} visits</span>
                      </div>

                      {/* Spend progress simulation */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-800 font-mono font-semibold">
                          <span>Spent Q4: ₹62,000</span>
                          <span>Target: ₹1,00,000</span>
                        </div>
                        <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="w-[62%] h-full bg-emerald-600 rounded-full" />
                        </div>
                        <span className="text-[11px] text-slate-600 block font-medium">
                          ₹38,000 more needed before Dec 31 to unlock Q1 2025 lounges
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-emerald-100 flex items-center justify-between">
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Protected</span>
                    </span>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onSelectCard(card.id);
                      }}
                      className="text-xs text-slate-800 hover:text-emerald-700 font-bold flex items-center gap-1"
                    >
                      <span>View Terms & Helpline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 rounded-3xl bg-white border border-emerald-200 text-center space-y-3 shadow-sm">
            <Wallet className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-slate-900">You haven't added any cards to your portfolio yet.</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Add your current credit cards to track balance, used limits, payment due warnings, and surprise lounge spend rules.
            </p>
            <button
              onClick={() => {
                sound.playClick();
                setIsAdding(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20"
            >
              Add My First Card
            </button>
          </div>
        )}
      </div>

      {/* Notification Preferences Centre */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-emerald-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Notification & Devaluation Alert Centre</h3>
            <p className="text-xs text-slate-500">Customize how and when CARDWATCH alerts you before payment dues and circulars take effect.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              key: 'devaluations' as const,
              label: 'Benefit Cuts & Devaluation Radar',
              desc: 'Instant alerts when bank circulars cut reward ratios or merchant cashback.',
            },
            {
              key: 'loungeThresholds' as const,
              label: 'Lounge Spend Milestone Warnings',
              desc: 'Reminders 15 days before quarter ends if your spend is below the lounge threshold.',
            },
            {
              key: 'feeRevisions' as const,
              label: 'Annual Fee & Surcharge Revisions',
              desc: 'Notifications if the bank introduces fees on education, rent, or fuel.',
            },
            {
              key: 'expiringOffers' as const,
              label: 'Temporary Offers & Points Expiry',
              desc: 'Alerts when reward points or partner vouchers are 30 days away from lapsing.',
            },
          ].map(pref => {
            const isEnabled = userProfile?.notificationPreferences[pref.key] ?? true;
            return (
              <div
                key={pref.key}
                onClick={() => handleTogglePref(pref.key)}
                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 hover:border-emerald-400 cursor-pointer flex items-center justify-between gap-4 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{pref.label}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">{pref.desc}</p>
                </div>

                <div
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center shrink-0 ${
                    isEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-200 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
