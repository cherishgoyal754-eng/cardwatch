import React, { useState } from 'react';
import { BankHelpline, ScreenType } from '../types';
import { BANK_HELPLINES_DATA } from '../data/cards';
import { sound } from '../utils/audio';
import {
  PhoneCall,
  Phone,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Headphones,
  Zap,
  Info,
  Clock
} from 'lucide-react';

interface AdvisorsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const AdvisorsScreen: React.FC<AdvisorsScreenProps> = ({ onNavigate }) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [searchBank, setSearchBank] = useState<string>('');

  const copyToClipboard = (number: string) => {
    sound.playClick();
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredBanks = BANK_HELPLINES_DATA.filter(b =>
    b.bank.toLowerCase().includes(searchBank.toLowerCase()) ||
    b.shortName.toLowerCase().includes(searchBank.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">

      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
          <Headphones className="w-4 h-4" />
          <span>Direct Bank Concierge Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Personal Advisor & Bank Helpline Desk
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Skip 15-minute generic IVR wait times. Direct contact numbers for premium bank concierges, elite escalation desks, and WhatsApp channels for all major card issuers.
        </p>
      </div>

      {/* IVR Skip Hack Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-blue-950/40 border border-blue-500/30 flex items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              CARDWATCH IVR Bypass Tip:
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Press <strong>9</strong> immediately after the welcome greeting, or enter your registered mobile number followed by <strong>#</strong> to route directly to a human credit card specialist.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onNavigate('ai-advisor');
          }}
          className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
        >
          Ask AI Advisor Instead
        </button>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBanks.map((item, index) => (
          <div
            key={index}
            className="rounded-3xl glass-panel p-6 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-5 shadow-xl"
          >
            <div className="space-y-4">
              {/* Bank Title */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold font-mono text-xs"
                    style={{ backgroundColor: item.logoColor }}
                  >
                    {item.shortName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{item.bank}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">Verified Contact Desk</span>
                  </div>
                </div>

                <a
                  href={item.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                  title="Official Card Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Number Rows */}
              <div className="space-y-2.5 text-xs">
                {/* Concierge / Elite Desk */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold block">
                      Dedicated Concierge / Elite Desk:
                    </span>
                    <a
                      href={`tel:${item.conciergeNumber.replace(/\D/g, '')}`}
                      className="font-mono text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                    >
                      {item.conciergeNumber}
                    </a>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.conciergeNumber)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy number"
                  >
                    {copiedNumber === item.conciergeNumber ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* General Support */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">
                      24x7 General Support:
                    </span>
                    <a
                      href={`tel:${item.generalSupport.replace(/\D/g, '')}`}
                      className="font-mono text-xs text-slate-200 hover:text-blue-400"
                    >
                      {item.generalSupport}
                    </a>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.generalSupport)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    {copiedNumber === item.generalSupport ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* WhatsApp Support if available */}
                {item.whatsappSupport && (
                  <div className="flex items-center justify-between px-2 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                      <span>WhatsApp Bot:</span>
                    </span>
                    <span className="font-mono text-slate-300">{item.whatsappSupport}</span>
                  </div>
                )}
              </div>

              {/* Bank specific advice note */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
                <Info className="w-3 h-3 text-blue-400 inline mr-1" />
                <span>{item.notes}</span>
              </div>
            </div>

            {/* Tap to Call */}
            <div className="pt-2">
              <a
                href={`tel:${item.conciergeNumber.replace(/\D/g, '')}`}
                className="w-full py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>One-Tap Call Concierge</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
