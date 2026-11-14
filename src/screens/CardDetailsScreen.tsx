import React, { useState } from 'react';
import { CreditCard, ScreenType, BankHelpline } from '../types';
import { getBankHelpline } from '../data/cards';
import { sound } from '../utils/audio';
import { Real3DCard } from '../components/Real3DCard';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  GitCompare,
  Wallet,
  Plane,
  Coins,
  ShieldCheck,
  DollarSign,
  PhoneCall,
  Phone,
  Copy,
  Check,
  Zap
} from 'lucide-react';

interface CardDetailsScreenProps {
  card: CreditCard;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onAddToCompare: (cardId: string) => void;
  isCompared: boolean;
  onAddToWallet: (cardId: string) => void;
  isSavedInWallet: boolean;
}

export const CardDetailsScreen: React.FC<CardDetailsScreenProps> = ({
  card,
  onBack,
  onNavigate: _onNavigate,
  onAddToCompare,
  isCompared,
  onAddToWallet,
  isSavedInWallet,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'changes' | 'lounge' | 'exclusions' | 'eligibility'>('overview');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const helpline: BankHelpline = getBankHelpline(card.bank);

  const copyToClipboard = (num: string) => {
    sound.playClick();
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const getCardGradient = (style: string) => {
    switch (style) {
      case 'aurum': return 'card-gradient-aurum';
      case 'kestrel': return 'card-gradient-kestrel';
      case 'white': return 'card-gradient-white';
      default: return 'card-gradient-aurum';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 text-slate-900">

      {/* Top Back & Actions Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-emerald-700 transition-colors bg-white border border-emerald-200 px-4 py-2 rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to All Cards</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onAddToCompare(card.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
              isCompared
                ? 'bg-emerald-100 text-emerald-800 border-emerald-400 font-extrabold'
                : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400'
            }`}
          >
            <GitCompare className="w-4 h-4 text-emerald-600" />
            <span>{isCompared ? 'In Compare List' : '+ Compare Card'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onAddToWallet(card.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
              isSavedInWallet
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600 shadow-sm'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{isSavedInWallet ? '✓ In My Wallet' : 'I Own This Card'}</span>
          </button>
        </div>
      </div>

      {/* DIRECT BANK HELPLINE & TOLL-FREE BOX (Requested by user directly inside card review) */}
      <div className="p-6 rounded-3xl bg-white border-2 border-emerald-400 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {card.bank} Official Customer Helpline & Concierge
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  VERIFIED DIRECT DESK
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Official toll-free customer care & premium concierge for {card.name}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-700 font-mono font-bold">24x7 Available</span>
          </div>
        </div>

        {/* Numbers Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Toll Free Direct */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-800 font-bold uppercase block">
                Official Toll-Free Number:
              </span>
              <a
                href={`tel:${helpline.conciergeNumber.replace(/\D/g, '')}`}
                className="text-lg font-mono font-extrabold text-slate-900 hover:text-emerald-700 transition-colors"
              >
                {helpline.conciergeNumber}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard(helpline.conciergeNumber)}
                className="p-2 rounded-xl bg-white hover:bg-emerald-100 text-slate-700 border border-emerald-200 transition-colors"
                title="Copy Toll-Free Number"
              >
                {copiedNumber === helpline.conciergeNumber ? (
                  <Check className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <a
                href={`tel:${helpline.conciergeNumber.replace(/\D/g, '')}`}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>
          </div>

          {/* General Support */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-800 font-bold uppercase block">
                General Support Helpline:
              </span>
              <a
                href={`tel:${helpline.generalSupport.replace(/\D/g, '')}`}
                className="text-sm font-mono font-bold text-slate-900 hover:text-emerald-700"
              >
                {helpline.generalSupport}
              </a>
            </div>
            <button
              onClick={() => copyToClipboard(helpline.generalSupport)}
              className="p-2 rounded-xl bg-white hover:bg-emerald-100 text-slate-700 border border-emerald-200 transition-colors"
            >
              {copiedNumber === helpline.generalSupport ? (
                <Check className="w-4 h-4 text-emerald-700" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* WhatsApp / Portal */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-800 font-bold uppercase block">
                WhatsApp / Digital Portal:
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">
                {helpline.whatsappSupport || 'Digital Web Care'}
              </span>
            </div>
            <a
              href={helpline.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
            >
              <span>Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* IVR Bypass Note */}
        <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs text-slate-700 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>IVR Bypass Instruction:</strong> To talk to a representative without waiting in menus, dial <span className="font-mono text-slate-900 font-bold">{helpline.conciergeNumber}</span> and press <strong className="text-slate-900">9</strong> immediately after the welcome greeting.
          </span>
        </div>
      </div>

      {/* Main Card Spotlight Banner (Green & White Theme) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-white p-6 sm:p-10 border border-emerald-200 shadow-md relative overflow-hidden">
        {/* Left Column: Real-Life 3D Rotating Credit Card */}
        <div className="lg:col-span-5 flex justify-center py-2">
          <Real3DCard
            card={card}
            isInteractive={true}
            autoRotate={true}
            cardholderName="CHERISH GOYAL"
          />
        </div>

        {/* Right Column: Key Card Intel & Badges */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
              {card.bank}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
              {card.tier} Tier
            </span>
            {card.isLifetimeFree ? (
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-mono text-xs font-extrabold shadow-sm">
                100% LIFETIME FREE
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-slate-800 text-xs font-mono font-bold border border-emerald-200">
                Annual Fee: ₹{card.annualFee.toLocaleString('en-IN')}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified: {card.lastVerifiedDate}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {card.name}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            {card.headlineBenefit}
          </p>

          {/* Quick Metrics Bar (High Contrast White & Green) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-xs text-slate-600 font-semibold">Domestic Lounge</div>
              <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                {card.domesticLoungesPerQuarter} / qtr
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-xs text-slate-600 font-semibold">Forex Markup</div>
              <div className={`text-base font-extrabold font-mono mt-0.5 ${card.forexMarkup === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                {card.forexMarkup === 0 ? '0.0% (Zero Forex)' : `${card.forexMarkup}%`}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-xs text-slate-600 font-semibold">Reward Return</div>
              <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5 truncate">
                {card.rewardPointValue.split(' ')[0]} {card.rewardPointValue.split(' ')[1]}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-xs text-slate-600 font-semibold">Min Salary</div>
              <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                ₹{(card.minSalaryMonthly / 1000).toFixed(0)}k/mo
              </div>
            </div>
          </div>

          {/* Official Bank Circular Link */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified against signed bank circulars</span>
            </span>
            <a
              href={card.officialCircularUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 underline"
            >
              <span>View Official Bank PDF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Crisp White and Green Highlight) */}
      <div className="flex items-center gap-2 border-b border-emerald-200 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Perks & Fees' },
          { id: 'changes', label: `Change History (${card.changeHistory?.length || 0})` },
          { id: 'lounge', label: 'Airport Lounge Rules' },
          { id: 'exclusions', label: 'Merchant Exclusions (0% Points)' },
          { id: 'eligibility', label: 'Eligibility & Salary' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(tab.id as typeof activeTab);
            }}
            className={`px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl transition-all shrink-0 ${
              activeTab === tab.id
                ? 'text-emerald-800 border-b-4 border-emerald-600 bg-emerald-50 font-extrabold'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & FEES */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Fees & Waiver Breakdown */}
          <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Joining & Annual Fee Structure</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-emerald-100">
                <span className="text-slate-600 font-medium">Joining Fee</span>
                <span className="font-mono text-slate-900 font-bold">
                  {card.isLifetimeFree ? '₹0 (Lifetime Free)' : `₹${card.joiningFee.toLocaleString('en-IN')} + 18% GST`}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-emerald-100">
                <span className="text-slate-600 font-medium">Renewal / Annual Fee</span>
                <span className="font-mono text-slate-900 font-bold">
                  {card.isLifetimeFree ? '₹0 (Lifetime Free)' : `₹${card.annualFee.toLocaleString('en-IN')} + 18% GST`}
                </span>
              </div>
              <div className="py-2">
                <span className="text-slate-600 font-medium block mb-1">Annual Fee Waiver Target:</span>
                <span className="text-emerald-800 font-bold">
                  {card.annualFeeWaiverCondition}
                </span>
              </div>
              <div className="py-2 border-t border-emerald-100">
                <span className="text-slate-600 font-medium block mb-1">Fuel Surcharge Waiver:</span>
                <span className="text-slate-900">
                  {card.fuelSurchargeWaiver}
                </span>
              </div>
            </div>
          </div>

          {/* Reward Rate & Redemption Details */}
          <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-600" />
              <span>Reward Points & Cashback Yield</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-600 font-medium block mb-1">Cashback & Accelerated Earn Rate:</span>
                <span className="text-slate-900 font-bold bg-emerald-50/60 p-3 rounded-xl block border border-emerald-200">
                  {card.cashbackRate}
                </span>
              </div>

              <div>
                <span className="text-slate-600 font-medium block mb-1">Reward Point Valuation & Conversion:</span>
                <span className="text-slate-900 font-bold bg-emerald-50/60 p-3 rounded-xl block border border-emerald-200 font-mono">
                  {card.rewardPointValue}
                </span>
              </div>

              <div>
                <span className="text-slate-600 font-medium block mb-1">Capping & Monthly Spend Limits:</span>
                <span className="text-slate-900 leading-relaxed block bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                  {card.cappingDetails}
                </span>
              </div>
            </div>
          </div>

          {/* Suitable For */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
              Who Should Apply For This Card?
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {card.suitableFor.map((persona, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-800 text-xs font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{persona}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: COMPLETE CHANGE HISTORY */}
      {activeTab === 'changes' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs sm:text-sm text-slate-700">
            <span>
              Every modification below has been extracted from signed bank notices and circulars.
            </span>
            <span className="font-mono text-emerald-800 font-bold">
              Verified by CARDWATCH Intel
            </span>
          </div>

          {card.changeHistory && card.changeHistory.length > 0 ? (
            <div className="space-y-4">
              {card.changeHistory.map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                        {item.type.replace('_', ' ')}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                    </div>

                    <div className="text-xs text-slate-600 font-mono">
                      Effective: <span className="text-slate-900 font-bold">{item.date}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {item.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm font-mono items-stretch">
                    <div className="p-4 rounded-2xl bg-rose-50/90 border-2 border-rose-300 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] text-rose-800 uppercase font-bold block">
                          Previous Term (Discontinued):
                        </span>
                        <div className="text-slate-700 line-through decoration-rose-500 mt-1">
                          {item.oldValue}
                        </div>
                      </div>
                      <span className="text-[10px] text-rose-600 font-mono font-bold uppercase">Discontinued</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-400 space-y-1.5 flex flex-col justify-between shadow-sm">
                      <div>
                        <span className="text-[11px] text-emerald-800 uppercase font-bold block">
                          New Enforced Term (Active Now):
                        </span>
                        <div className="text-slate-900 font-bold mt-1">
                          {item.newValue}
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold uppercase">Enforced</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                    <span>Source: {item.officialRef}</span>
                    <span className="font-bold text-emerald-800">Status: Enforced</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-emerald-200 rounded-2xl text-slate-600 text-xs shadow-sm">
              No devaluations recorded for this card in our database yet. Terms are stable.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AIRPORT LOUNGE RULES */}
      {activeTab === 'lounge' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-emerald-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Airport Lounge Access & Spend Thresholds</h3>
              <p className="text-xs text-slate-500">Access rules for domestic terminals and international transit.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="text-xs text-emerald-800 font-bold">Domestic Lounge Visits</span>
              <div className="text-xl font-mono font-extrabold text-slate-900">
                {card.domesticLoungesPerQuarter} / quarter
              </div>
              <span className="text-xs text-slate-600">Partner: {card.loungeNetwork}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="text-xs text-emerald-800 font-bold">International Lounges</span>
              <div className="text-xl font-mono font-extrabold text-slate-900">
                {card.internationalLoungesPerYear} / year
              </div>
              <span className="text-xs text-slate-600">Via Priority Pass / DreamFolks</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="text-xs text-emerald-800 font-bold">Forex Fee at Overseas Lounges</span>
              <div className="text-xl font-mono font-extrabold text-slate-900">
                {card.forexMarkup === 0 ? '0% Markup' : `${card.forexMarkup}%`}
              </div>
              <span className="text-xs text-slate-600">+ 18% standard GST</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase font-mono">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
              <span>Mandatory Spend Condition:</span>
            </div>
            <p className="text-sm text-slate-800 font-medium leading-relaxed font-sans">
              {card.loungeSpendCondition}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: MERCHANT EXCLUSIONS */}
      {activeTab === 'exclusions' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-emerald-100">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-600/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Merchant Exclusions & Zero Reward Categories</h3>
              <p className="text-xs text-slate-500">Spends in these categories earn 0 reward points and may attract convenience surcharges.</p>
            </div>
          </div>

          <div className="space-y-3">
            {card.merchantExclusions.map((exclusion, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs sm:text-sm text-slate-900 flex items-center justify-between font-semibold"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>{exclusion}</span>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold">
                  0% Rewards
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ELIGIBILITY & SALARY */}
      {activeTab === 'eligibility' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-emerald-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Eligibility Requirements & Salary Criteria</h3>
              <p className="text-xs text-slate-500">Minimum requirements for online and branch application approval.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
              <span className="text-emerald-800 font-bold">Minimum Monthly In-Hand Salary:</span>
              <div className="text-2xl font-mono font-extrabold text-slate-900">
                ₹{card.minSalaryMonthly.toLocaleString('en-IN')} / month
              </div>
              <span className="text-xs text-slate-600">For Salaried Professionals (Net credit in bank account)</span>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
              <span className="text-emerald-800 font-bold">Recommended CIBIL Score:</span>
              <div className="text-2xl font-mono font-extrabold text-emerald-700">
                {card.minCibilScore}+
              </div>
              <span className="text-xs text-slate-600">Zero late payments in the last 24 months</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
