import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { CREDIT_CARDS_DATA } from '../data/cards';
import { processCardwatchAIQuery } from '../utils/cardwatchAI';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import {
  Bot,
  Send,
  Sparkles,
  Network
} from 'lucide-react';

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

export const AIAdvisorScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello! I am your AI Credit Card Advisor. I continuously track r/CreditCardsIndia, Technofino forums, and official bank regulatory circulars to give you unbiased advice and structured mind maps.",
      mindMapNodes: {
        title: "Current Indian Credit Card Landscape (Q4 2024 / 2025)",
        items: [
          { label: "Airport Lounge Wave", detail: "HDFC, ICICI, SBI have moved to ₹50k-₹100k quarterly spend thresholds.", tag: "Devaluation" },
          { label: "Zero Forex King", detail: "Scapia Federal offers 0% markup + unlimited lounge if spending targets met.", tag: "Forex" },
          { label: "Cashback Champions", detail: "SBI Cashback (5% online up to ₹2k/cycle) & ICICI Amazon Pay (5% uncapped for Prime).", tag: "Cashback" },
          { label: "UPI on RuPay", detail: "Tata Neu Infinity gives 1.5% NeuCoins on scan-and-pay UPI transactions.", tag: "UPI" },
        ],
      },
      sources: ["r/CreditCardsIndia Wiki", "Technofino Community Insights", "RBI Devaluation Guidelines 2024"],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const predefinedPrompts = [
    "I want to go to Dubai, which card is best for 0% forex?",
    "Which card gives lounge access without quarterly spend limits?",
    "Best lifetime free credit card for beginner with ₹50k salary?",
    "Why was HDFC Regalia Gold lounge access reduced from 3 to 2?",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    sound.playClick();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const aiResponse = await processCardwatchAIQuery(query, CREDIT_CARDS_DATA);
      sound.playSuccess();
      setIsTyping(false);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse.text,
        mindMapNodes: aiResponse.mindMapNodes,
        sources: aiResponse.sources,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      sound.playSuccess();
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 text-slate-900">

      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Bot className="w-4 h-4 text-emerald-600" />
          <span>AI Intelligence Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Credit Card Advisor & Mind Map
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl font-medium">
          Ask questions in plain English. Our AI analyzes official bank circulars, Reddit r/CreditCardsIndia discussions, and Technofino guides to generate structured mind map recommendations.
        </p>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-emerald-800 font-mono font-bold shrink-0">Try asking:</span>
        {predefinedPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-4 py-2 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 text-slate-800 font-semibold shrink-0 transition-colors shadow-sm hover:bg-emerald-50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-3xl bg-white p-5 sm:p-7 border border-emerald-200 shadow-sm space-y-6 min-h-[460px] flex flex-col justify-between">

        <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0 mt-1 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div className={`max-w-2xl space-y-3.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed font-medium ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white font-bold rounded-tr-none shadow-sm'
                      : 'bg-emerald-50/70 text-slate-900 border border-emerald-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  <MarkdownRenderer content={msg.text} isUser={msg.sender === 'user'} />
                </div>

                {/* Mind Map Diagram Visualization */}
                {msg.mindMapNodes && (
                  <div className="p-5 rounded-2xl bg-white border-2 border-emerald-400 space-y-3.5 shadow-md">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-mono font-extrabold text-slate-900 uppercase tracking-wider">
                          {msg.mindMapNodes.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-white font-mono bg-emerald-600 px-2.5 py-0.5 rounded font-extrabold shadow-sm">
                        Interactive Mind Map
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.mindMapNodes.items.map((node, nIdx) => (
                        <div
                          key={nIdx}
                          className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1 hover:border-emerald-400 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{node.label}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                              {node.tag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-tight font-medium">
                            {node.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.sources && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                    <span className="font-mono font-bold text-emerald-800">Sources verified:</span>
                    {msg.sources.map((src, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-slate-800 border border-emerald-200 font-mono text-[10px] font-bold"
                      >
                        ✓ {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-emerald-700 text-xs font-mono font-bold">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              </div>
              <span>Synthesizing Reddit, Technofino, and bank circulars...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-emerald-100">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything: e.g. Which card gives 5% on Flipkart? Or how to avoid lounge charges?"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-slate-900 font-semibold text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-2 transition-colors shrink-0 shadow-md shadow-emerald-600/20"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
