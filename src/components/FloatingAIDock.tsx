import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard } from '../types';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Send,
  X,
  GitCompare,
  ShieldCheck,
  Loader2,
  Wifi
} from 'lucide-react';

interface FloatingAIDockProps {
  comparisonCount: number;
  onOpenCompare: () => void;
  cards: CreditCard[];
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mindMapNodes?: {
    title: string;
    items: { label: string; detail: string; tag: string }[];
  };
  sources?: string[];
}

export const FloatingAIDock: React.FC<FloatingAIDockProps> = ({
  comparisonCount,
  onOpenCompare,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: "Hi! I am your CARDWATCH Credit Card AI Advisor. How can I assist you with lounge access rules, devaluation updates, 0% forex cards for Dubai, or comparing cards?",
      mindMapNodes: {
        title: "Verified Intelligence Topics",
        items: [
          { label: "Dubai & Overseas", detail: "0% Forex cards (Scapia / Niyo) to avoid 4.13% bank surcharge.", tag: "0% Forex" },
          { label: "Airport Lounges", detail: "HDFC Regalia Gold 3 → 2 cuts; spend threshold criteria.", tag: "Lounge" },
          { label: "Amex vs Diners", detail: "Centurion global access vs 33.3% SmartBuy reward yield.", tag: "Compare" },
          { label: "Lifetime Free", detail: "ICICI Amazon Pay, Scapia, and IDFC FIRST Wealth conditions.", tag: "LTF" },
        ],
      },
      sources: ["Official Bank Regulatory Filings", "Technofino Community Guidelines", "RBI Circulars 2024-2025"],
    },
  ]);

  const quickPrompts = [
    "Which card is best for ₹50k monthly spend?",
    "Which card has 0% forex for Dubai?",
    "Why was Regalia lounge cut from 3 to 2?",
    "Compare American Express vs HDFC Diners Black",
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleToggleOpen = () => {
    sound.playCardFlip();
    setIsOpen(!isOpen);
  };

  const handleSend = (queryText?: string) => {
    const text = (queryText || inputQuery).trim();
    if (!text) return;

    sound.playClick();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      sound.playSuccess();
      setIsTyping(false);

      const lower = text.toLowerCase();
      let aiMsg: Message;

      if (lower.includes('dubai') || lower.includes('forex') || lower.includes('overseas')) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "When traveling to Dubai (AED) or shopping overseas, standard bank cards levy a 3.5% markup + 18% GST (approx 4.13% surcharge), costing you ₹4,130 on every ₹1 Lakh. Here is your action plan:",
          mindMapNodes: {
            title: "Dubai & Forex Optimization Strategy",
            items: [
              { label: "Primary Zero-Forex Card", detail: "Federal Scapia Credit Card (0% Forex markup, Visa live rate).", tag: "Zero Markup" },
              { label: "Super-Premium Backup", detail: "HDFC Infinia / Diners Black (2% forex markup but 3.3%-10% reward yield).", tag: "High Yield" },
              { label: "Dubai Lounges", detail: "Marhaba & Ahlan Lounges at DXB Terminal 1, 2, 3 via Priority Pass.", tag: "Lounge" },
              { label: "DCC Warning", detail: "Always bill in AED local currency. Never let POS convert to INR.", tag: "Critical" },
            ],
          },
          sources: ["Scapia Federal Schedule of Charges", "Technofino Forex Matrix"],
        };
      } else if (lower.includes('regalia') || lower.includes('lounge') || lower.includes('hdfc')) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "HDFC Regalia Gold underwent a major devaluation: domestic lounge access was slashed from 3 to 2 visits per quarter, and now requires a minimum ₹1,00,000 spend in the preceding calendar quarter to unlock complimentary access.",
          mindMapNodes: {
            title: "HDFC & Domestic Lounge Rule Map",
            items: [
              { label: "Regalia Gold", detail: "Reduced to 2 visits/qtr. Requires ₹1 Lakh previous quarter spend.", tag: "Strict Spend" },
              { label: "Infinia & Diners Black", detail: "Unlimited domestic and international lounge visits without spend condition.", tag: "Uncapped" },
              { label: "Scapia Federal", detail: "Domestic lounges available on minimum ₹10,000 monthly spend.", tag: "Low Spend" },
              { label: "Priority Pass Alert", detail: "Do NOT swipe Priority Pass inside Indian domestic terminals ($32 fee).", tag: "Warning" },
            ],
          },
          sources: ["HDFC Bank Circular HDFC/CARD/Q3-REV", "DreamFolks Lounge Network Update"],
        };
      } else if (lower.includes('amex') || lower.includes('diners') || lower.includes('compare')) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "American Express Platinum vs HDFC Diners Club Black Metal is the premier super-premium duel:",
          mindMapNodes: {
            title: "Amex Platinum vs HDFC Diners Club Black",
            items: [
              { label: "Lounge Privilege", detail: "Amex gives Centurion + Priority Pass with 2 guests. Diners gives 1,300+ lounges with 1 add-on guest.", tag: "Amex Lead" },
              { label: "Reward Velocity", detail: "Diners Black yields up to 33.3% on SmartBuy. Amex gives 1 MR/₹40 and 5X multiplier.", tag: "Diners Lead" },
              { label: "Annual Fee", detail: "Amex is ₹60,000 non-waivable. Diners Black is ₹10,000 waivable on ₹8L spend.", tag: "Fee Diff" },
              { label: "Acceptance", detail: "Diners runs on Discover/Pulse network. Amex has proprietary global network.", tag: "Network" },
            ],
          },
          sources: ["Amex Platinum Charter", "HDFC Diners Black Terms 2024"],
        };
      } else if (lower.includes('spend') || lower.includes('50k') || lower.includes('yearly') || lower.includes('monthly') || lower.includes('lakh')) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Here is CARDWATCH's mathematical card referral judged by expected monthly and yearly spend brackets:",
          mindMapNodes: {
            title: "Spend-Based Credit Card Match Radar",
            items: [
              { label: "Under ₹25k/mo (< ₹3L/yr)", detail: "SBI Cashback (5% online up to ₹5k cap) & Amazon Pay ICICI (LTF). Fees waived or ₹0.", tag: "Entry Spender" },
              { label: "₹40k–₹80k/mo (₹5L–₹10L/yr)", detail: "HDFC Regalia Gold (₹4L spend waives ₹2,500 fee + unlocks quarterly lounges) & Scapia (0% forex).", tag: "Balanced Spender" },
              { label: "₹1L+/mo (₹12L+/yr)", detail: "HDFC Infinia Metal (₹10L spend waives ₹12,500 fee; yields ₹70,000+ flight vouchers via SmartBuy).", tag: "High Spender" },
              { label: "₹2.5L+/mo (₹30L+/yr)", detail: "American Express Platinum (Luxury Taj/Marriott hotel elite status + Centurion Lounges) & Infinia.", tag: "Ultra HNI" },
            ],
          },
          sources: ["Technofino Spend Benchmark 2024", "r/CreditCardsIndia Spend Matrix", "Official Bank Waiver Criteria"],
        };
      } else {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Here is the verified intelligence for "${text}" based on official regulatory circulars:`,
          mindMapNodes: {
            title: `CARDWATCH Mind Map: "${text}"`,
            items: [
              { label: "Recommendation", detail: "Review fee waiver thresholds and merchant reward exclusions before applying.", tag: "Insight" },
              { label: "Lounge Rule", detail: "Verify previous quarter spend before attempting lounge entry at the airport.", tag: "Verification" },
              { label: "Reward Capping", detail: "Utility and rent payments now incur 1% surcharges with 0% reward points across banks.", tag: "Surcharge Alert" },
            ],
          },
          sources: ["Official Bank Regulatory Notices", "r/CreditCardsIndia Megathread", "Technofino Community"],
        };
      }

      setMessages(prev => [...prev, aiMsg]);
    }, 750);
  };

  return (
    <>
      {/* FLOATING SIDE DOCK BUTTONS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">

        {/* 1. TOP PILL: ⚖ Compare [count] */}
        <motion.button
          onClick={() => {
            sound.playClick();
            onOpenCompare();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-10 px-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 border-2 border-white flex items-center gap-2 transition-colors cursor-pointer group"
          title="Compare selected credit cards"
        >
          <GitCompare className="w-3.5 h-3.5 text-white group-hover:rotate-45 transition-transform" />
          <span className="tracking-wide">Compare</span>
          <span className="w-5 h-5 rounded-full bg-slate-950 text-white text-[11px] font-mono font-extrabold flex items-center justify-center shadow-inner">
            {comparisonCount || 2}
          </span>
        </motion.button>

        {/* 2. REALISTIC MINI 3D CREDIT CARD LAUNCHER (CLICK TO OPEN AI) */}
        {/* Strictly no text "Ask me anything" - pure interactive credit card */}
        <motion.div
          onClick={handleToggleOpen}
          whileHover={{ scale: 1.08, y: -3 }}
          whileTap={{ scale: 0.94 }}
          animate={
            isOpen
              ? { rotateZ: 0, y: 0 }
              : {
                  y: [-3, 3, -3],
                  rotateZ: [-1, 1, -1],
                }
          }
          transition={{
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            rotateZ: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className={`relative w-[92px] sm:w-[100px] h-[58px] sm:h-[62px] rounded-2xl cursor-pointer p-2.5 flex flex-col justify-between overflow-hidden shadow-2xl transition-all border-2 ${
            isOpen
              ? 'border-white shadow-[0_20px_45px_rgba(5,150,105,0.7)] ring-2 ring-emerald-400'
              : 'border-emerald-300/80 hover:border-white shadow-[0_15px_35px_rgba(5,150,105,0.45)]'
          }`}
          style={{
            background: 'linear-gradient(135deg, #062419 0%, #0B3B29 55%, #02130C 100%)',
          }}
          title="Click card to open CARDWATCH AI Advisor"
        >
          {/* Moving Specular Glare Reflection Line */}
          <motion.div
            animate={{ x: ['-140%', '240%'] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none z-10"
          />

          {/* Card Top Row: Gold EMV Chip & AI / Contactless indicator */}
          <div className="relative z-20 flex justify-between items-start">
            {/* Photorealistic Gold EMV Chip */}
            <div className="relative w-4 h-3 rounded-[3px] bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 shadow-xs p-0.5 flex flex-col justify-between">
              <div className="w-full h-px bg-amber-950/40" />
              <div className="w-full h-px bg-amber-950/40" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-amber-950/40" />
            </div>

            {/* Glowing AI Chip Badge + Contactless Icon */}
            <div className="flex items-center gap-1">
              <Wifi className="w-2.5 h-2.5 text-emerald-300 rotate-90" />
              <div className="px-1.5 py-0.2 rounded-full bg-emerald-400/25 border border-emerald-300/60 text-[9px] font-mono font-black text-emerald-200 shadow-xs flex items-center gap-0.5">
                <Sparkles className="w-2 h-2 text-amber-300" />
                <span>AI</span>
              </div>
            </div>
          </div>

          {/* Card Center: Live Pulse Indicator Dot */}
          <div className="relative z-20 flex items-center justify-between">
            <span className="font-mono text-[8px] font-extrabold tracking-widest text-emerald-200/90 drop-shadow-sm">
              CARDWATCH
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-sm" />
            </span>
          </div>

          {/* Card Bottom: Masked Card Digits */}
          <div className="relative z-20 flex justify-between items-end font-mono text-[7px] text-slate-300/80 font-bold">
            <span>•••• 2026</span>
            <span className="text-emerald-400 font-extrabold uppercase text-[7px]">PRO</span>
          </div>
        </motion.div>
      </div>

      {/* EXPANDED CREDIT-CARD-THEMED AI ADVISOR DRAWER / WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[460px] max-h-[80vh] rounded-[30px] bg-white border-2 border-emerald-400 shadow-[0_25px_70px_rgba(5,150,105,0.35)] overflow-hidden flex flex-col z-50 text-slate-900 select-none"
          >
            {/* CREDIT-CARD-STYLED TOP HEADER */}
            <div className="relative p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-emerald-500/40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                {/* Gold EMV Chip */}
                <div className="w-9 h-6 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 p-0.5 flex flex-col justify-between shadow-md">
                  <div className="w-full h-px bg-amber-900/40" />
                  <div className="w-full h-px bg-amber-900/40" />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-amber-900/40" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-extrabold text-xs text-white tracking-widest uppercase">
                      CARDWATCH AI
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-[9px] font-mono font-extrabold text-white">
                      PRO RADAR
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono block">
                    •••• 7997 • Unbiased Credit Advisor
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleToggleOpen}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors relative z-10"
                title="Minimize AI Advisor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QUICK SUGGESTION PILLS */}
            <div className="p-3 bg-emerald-50/70 border-b border-emerald-200 flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold scrollbar-none">
              <span className="text-emerald-800 font-mono text-[10px] uppercase shrink-0">Try:</span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1 rounded-full bg-white hover:bg-emerald-100 text-slate-800 border border-emerald-200 shrink-0 transition-colors shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* CHAT MESSAGES SCROLL AREA */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[460px] text-xs">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] font-medium leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white font-bold rounded-tr-none'
                        : 'bg-emerald-50/80 text-slate-900 border border-emerald-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Mind Map Nodes View */}
                  {msg.mindMapNodes && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-white border-2 border-emerald-300 shadow-sm space-y-2 max-w-[92%]">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-mono font-bold text-[10px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{msg.mindMapNodes.title}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.mindMapNodes.items.map((item, idx) => (
                          <div key={idx} className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[11px] text-slate-900">{item.label}</span>
                              <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                {item.tag}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 leading-snug">{item.detail}</p>
                          </div>
                        ))}
                      </div>

                      {msg.sources && (
                        <div className="pt-1 text-[9px] text-slate-400 font-mono flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Sources: {msg.sources.join(' • ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 w-fit">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Scanning regulatory circulars & Technofino...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* CHAT INPUT AREA */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-slate-50 border-t border-emerald-200 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask anything about any credit card..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold transition-all shadow-sm active:scale-95"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
