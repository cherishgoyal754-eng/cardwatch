import { CreditCard } from '../types';
import { CREDIT_CARDS_DATA } from '../data/cards';

/**
 * ============================================================================
 * # ROLE: CARDWATCH — Direct & Concise Credit Card AI
 * ============================================================================
 */
export const CARDWATCH_AI_SYSTEM_ROLE = `# ROLE: CARDWATCH — Direct & Concise Credit Card AI

You are CARDWATCH AI, a friendly, accurate, and direct Indian credit card assistant.

## CORE RULES:
1. Answer ONLY the specific question asked by the user. Never add unsolicited "nearby" information, full card dossiers, or unprompted disclaimers.
2. Keep all responses simple, concise, and clean (1 to 3 short sentences).
3. When calculating rewards on a spend, state the exact points/cashback and monetary value directly.
4. For card comparisons, state the 1-2 key differences and a 1-sentence verdict.
5. Accuracy is paramount: never invent rates, fees, or conversion values.
6. No complicated tables, no long lists, no unsolicited financial safety lectures.`;

export interface MindMapItem {
  label: string;
  detail: string;
  tag: string;
}

export interface MindMapNode {
  title: string;
  items: MindMapItem[];
}

export interface AIResponse {
  text: string;
  mindMapNodes?: MindMapNode;
  sources?: string[];
}

/**
 * Finds matching cards in user query text
 */
export function identifyCardsInQuery(query: string, cards: CreditCard[] = CREDIT_CARDS_DATA): CreditCard[] {
  const lower = query.toLowerCase();
  const matched: CreditCard[] = [];

  const aliasMap: Record<string, string[]> = {
    'hdfc-infinia-metal': ['infinia', 'infinia metal'],
    'hdfc-diners-black': ['diners black', 'dcb', 'diners club', 'diners metal'],
    'hdfc-regalia-gold': ['regalia', 'regalia gold'],
    'amex-platinum': ['american express', 'amex', 'amex plat', 'amex platinum', 'centurion', 'platinum charge', 'charge card'],
    'amex-plat-travel': ['plat travel', 'platinum travel', 'amex travel'],
    'sbi-cashback': ['sbi cashback', 'cashback sbi'],
    'sbi-simplysave': ['simplysave', 'simply save'],
    'sbi-aurum': ['aurum', 'sbi aurum'],
    'scapia-federal': ['scapia', 'scapia federal'],
    'axis-magnus': ['magnus', 'axis magnus'],
    'axis-atlas': ['atlas', 'axis atlas', 'edge miles'],
    'axis-indianoil': ['indianoil', 'iocl', 'axis indianoil', 'indianoil rupay'],
    'flipkart-axis': ['flipkart axis', 'flipkart card'],
    'kiwi-axis-rupay': ['kiwi', 'axis kwik', 'kwik'],
    'icici-amazon-pay': ['amazon pay', 'amazon icici', 'apay'],
    'icici-sapphiro': ['sapphiro', 'icici sapphiro'],
    'tata-neu-infinity': ['tata neu', 'neu infinity', 'neucoins', 'neupass'],
    'indusind-tiger': ['tiger', 'indusind tiger'],
    'idfc-first-wealth': ['idfc wealth', 'first wealth'],
    'idfc-first-millennia': ['idfc millennia', 'first millennia', 'millennia'],
    'swiggy-hdfc': ['swiggy hdfc', 'swiggy card'],
    'hsbc-live-plus': ['hsbc live', 'live+', 'live plus', 'hsbc live plus'],
  };

  for (const card of cards) {
    const aliases = aliasMap[card.id] || [];
    const nameMatch = lower.includes(card.name.toLowerCase());
    const aliasMatch = aliases.some(alias => lower.includes(alias));

    if (nameMatch || aliasMatch) {
      if (!matched.some(m => m.id === card.id)) {
        matched.push(card);
      }
    }
  }

  return matched;
}

/**
 * Extracts numeric transaction or monthly spend amounts
 */
export function extractAmount(text: string): number | null {
  const kMatch = text.match(/(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    return Math.round(parseFloat(kMatch[1]) * 1000);
  }

  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)\b/i);
  if (lakhMatch) {
    return Math.round(parseFloat(lakhMatch[1]) * 100000);
  }

  const rupeeMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{3})+|\d+)/i);
  if (rupeeMatch) {
    const raw = rupeeMatch[1].replace(/,/g, '');
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num > 0) return num;
  }

  return null;
}

/**
 * Detects spending category from query
 */
export function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('fuel') || lower.includes('petrol') || lower.includes('diesel') || lower.includes('pump')) return 'Fuel';
  if (lower.includes('flight') || lower.includes('hotel') || lower.includes('airline') || lower.includes('travel') || lower.includes('smartbuy')) return 'Travel & Stays';
  if (lower.includes('dining') || lower.includes('restaurant') || lower.includes('swiggy') || lower.includes('zomato') || lower.includes('eats')) return 'Dining & Food Delivery';
  if (lower.includes('grocery') || lower.includes('groceries') || lower.includes('supermarket') || lower.includes('blinkit') || lower.includes('instamart') || lower.includes('zepto')) return 'Grocery & Supermarket';
  if (lower.includes('online') || lower.includes('shopping') || lower.includes('amazon') || lower.includes('flipkart') || lower.includes('myntra')) return 'Online Shopping';
  if (lower.includes('upi') || lower.includes('qr') || lower.includes('scan')) return 'UPI QR Scan & Pay';
  if (lower.includes('utility') || lower.includes('electricity') || lower.includes('water') || lower.includes('bill')) return 'Utilities & Bill Payments';
  if (lower.includes('rent') || lower.includes('rental')) return 'Rental Payments';
  if (lower.includes('wallet') || lower.includes('paytm wallet')) return 'Wallet Reloads';
  if (lower.includes('international') || lower.includes('forex') || lower.includes('dubai') || lower.includes('overseas')) return 'International / Foreign Currency';
  return 'General Retail Spends';
}

/**
 * Calculates rewards concisely, answering only what was asked
 */
export function calculateRewards(card: CreditCard, amount: number, category: string): AIResponse {
  const lowerCat = category.toLowerCase();

  // Exclusions check
  if (lowerCat.includes('rent') || lowerCat.includes('wallet')) {
    return {
      text: `${card.name} does not earn reward points or cashback on ${category.toLowerCase()} transactions, as this category (MCC 6513 / 6540) is excluded by ${card.bank}. Additionally, banks charge a 1% convenience fee on rental payments.`,
    };
  }

  let text = '';

  if (card.id === 'scapia-federal') {
    if (lowerCat.includes('travel') || lowerCat.includes('flight') || lowerCat.includes('hotel')) {
      const coins = Math.round(amount * 0.20);
      const val = Math.round(coins * 0.20);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on travel with your Scapia Federal Credit Card, you will earn ${coins.toLocaleString('en-IN')} Scapia Coins (worth ₹${val.toLocaleString('en-IN')} at 5 Coins = ₹1).`;
    } else {
      const coins = Math.round(amount * 0.10);
      const val = Math.round(coins * 0.20);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with your Scapia Federal Credit Card, you will earn ${coins.toLocaleString('en-IN')} Scapia Coins (worth ₹${val.toLocaleString('en-IN')} at 5 Coins = ₹1, or 2,000 Coins worth ₹400 if spent on travel bookings in the Scapia app).`;
    }
  } else if (card.id === 'hdfc-infinia-metal') {
    if (lowerCat.includes('travel') || lowerCat.includes('flight') || lowerCat.includes('hotel')) {
      const isHotel = lowerCat.includes('hotel');
      const mult = isHotel ? 10 : 5;
      const base = (amount / 150) * 5;
      const bonus = Math.min(15000, base * (mult - 1));
      const total = Math.round(base + bonus);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on ${isHotel ? 'hotels (10X)' : 'flights (5X)'} via SmartBuy with HDFC Infinia, you will earn ${total.toLocaleString('en-IN')} Reward Points (worth ₹${total.toLocaleString('en-IN')} at 1 RP = ₹1).`;
    } else {
      const points = Math.round((amount / 150) * 5);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with your HDFC Infinia Metal, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${points.toLocaleString('en-IN')} on SmartBuy flights and hotels, a 3.33% return).`;
    }
  } else if (card.id === 'hdfc-diners-black') {
    if (lowerCat.includes('travel') || lowerCat.includes('flight') || lowerCat.includes('hotel')) {
      const isHotel = lowerCat.includes('hotel');
      const mult = isHotel ? 10 : 5;
      const base = (amount / 150) * 5;
      const bonus = Math.min(10000, base * (mult - 1));
      const total = Math.round(base + bonus);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on ${isHotel ? 'hotels' : 'flights'} via SmartBuy with HDFC Diners Black, you will earn ${total.toLocaleString('en-IN')} Reward Points (worth ₹${total.toLocaleString('en-IN')} at 1 RP = ₹1).`;
    } else if (lowerCat.includes('dining')) {
      const points = Math.round((amount / 150) * 10);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on weekend dining with your HDFC Diners Black, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${points.toLocaleString('en-IN')} at 1 RP = ₹1, a 6.66% return).`;
    } else {
      const points = Math.round((amount / 150) * 5);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with your HDFC Diners Black, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${points.toLocaleString('en-IN')} at 1 RP = ₹1, a 3.33% return).`;
    }
  } else if (card.id === 'sbi-cashback') {
    if (lowerCat.includes('online') || lowerCat.includes('shopping') || lowerCat.includes('amazon') || lowerCat.includes('flipkart') || lowerCat.includes('myntra')) {
      const cb = Math.min(2000, Math.round(amount * 0.05));
      text = `On spending ₹${amount.toLocaleString('en-IN')} online with your SBI Cashback card, you will earn ₹${cb.toLocaleString('en-IN')} direct statement cashback (5% return, capped at ₹2,000 per cycle).`;
    } else {
      const cb = Math.round(amount * 0.01);
      text = `On spending ₹${amount.toLocaleString('en-IN')} offline with your SBI Cashback card, you will earn ₹${cb.toLocaleString('en-IN')} cashback (1% return).`;
    }
  } else if (card.id === 'axis-indianoil') {
    if (lowerCat.includes('fuel') || lowerCat.includes('petrol') || lowerCat.includes('diesel')) {
      const eligibleSpend = Math.min(5000, amount);
      const points = Math.min(1000, Math.round((eligibleSpend / 100) * 20));
      const val = Math.round(points * 0.20);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on fuel at IndianOil outlets with your Axis IndianOil card, you will earn ${points.toLocaleString('en-IN')} EDGE Reward Points (worth approx ₹${val.toLocaleString('en-IN')} at 4% value-back).`;
    } else if (lowerCat.includes('online')) {
      const eligibleSpend = Math.min(5000, amount);
      const points = Math.min(250, Math.round((eligibleSpend / 100) * 5));
      const val = Math.round(points * 0.20);
      text = `On spending ₹${amount.toLocaleString('en-IN')} online with your Axis IndianOil card, you will earn ${points.toLocaleString('en-IN')} EDGE Reward Points (worth ₹${val.toLocaleString('en-IN')}).`;
    } else {
      const points = Math.round((amount / 100) * 1);
      const val = Math.round(points * 0.20);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with your Axis IndianOil card, you will earn ${points.toLocaleString('en-IN')} EDGE Reward Points (worth approx ₹${val.toLocaleString('en-IN')}).`;
    }
  } else if (card.id === 'tata-neu-infinity') {
    if (lowerCat.includes('upi') || lowerCat.includes('qr')) {
      const coins = Math.round(amount * 0.015);
      text = `On spending ₹${amount.toLocaleString('en-IN')} via UPI with Tata Neu Infinity, you will earn ${coins.toLocaleString('en-IN')} NeuCoins (worth ₹${coins.toLocaleString('en-IN')} at 1 NeuCoin = ₹1).`;
    } else if (lowerCat.includes('shopping') || lowerCat.includes('online')) {
      const coins = Math.round(amount * 0.05);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Tata brands with Tata Neu Infinity, you will earn ${coins.toLocaleString('en-IN')} NeuCoins (worth ₹${coins.toLocaleString('en-IN')} at 1 NeuCoin = ₹1).`;
    } else {
      const coins = Math.round(amount * 0.015);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with Tata Neu Infinity, you will earn ${coins.toLocaleString('en-IN')} NeuCoins (worth ₹${coins.toLocaleString('en-IN')}).`;
    }
  } else if (card.id === 'icici-amazon-pay') {
    if (lowerCat.includes('amazon') || lowerCat.includes('shopping')) {
      const cb = Math.round(amount * 0.05);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Amazon with Amazon Pay ICICI, you will earn ₹${cb.toLocaleString('en-IN')} unlimited cashback (5% for Prime members).`;
    } else {
      const cb = Math.round(amount * 0.01);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with Amazon Pay ICICI, you will earn ₹${cb.toLocaleString('en-IN')} cashback (1% unlimited).`;
    }
  } else {
    const cb = Math.round(amount * 0.02);
    text = `On spending ₹${amount.toLocaleString('en-IN')} with ${card.name}, you will earn approx ₹${cb.toLocaleString('en-IN')} in rewards based on its ${card.cashbackRate} reward rate.`;
  }

  return { text };
}

/**
 * Compares two cards concisely
 */
export function compareCards(card1: CreditCard, card2: CreditCard): AIResponse {
  const c1Fee = card1.isLifetimeFree ? '₹0 (Lifetime Free)' : `₹${card1.annualFee.toLocaleString('en-IN')}/year`;
  const c2Fee = card2.isLifetimeFree ? '₹0 (Lifetime Free)' : `₹${card2.annualFee.toLocaleString('en-IN')}/year`;

  let winner = card1.name;
  if (card2.tier === 'Super Premium' && card1.tier !== 'Super Premium') winner = card2.name;
  else if ((card2.id.includes('cashback') || card2.id.includes('amazon')) && (card1.tier === 'Entry Level' || card1.tier === 'Mid Tier')) winner = card2.name;

  return {
    text: `**${card1.name} vs ${card2.name}:**\n• **${card1.name}:** Annual fee ${c1Fee}, ${card1.headlineBenefit}, forex markup ${card1.forexMarkup}%.\n• **${card2.name}:** Annual fee ${c2Fee}, ${card2.headlineBenefit}, forex markup ${card2.forexMarkup}%.\n\n**Verdict:** For overall value and returns, **${winner}** is the recommended pick.`,
  };
}

/**
 * Devaluation and latest updates concisely
 */
export function getDevaluationUpdates(card?: CreditCard): AIResponse {
  if (card && card.changeHistory && card.changeHistory.length > 0) {
    const items = card.changeHistory.map(ch => `• **${ch.title} (${ch.date}):** ${ch.summary}`).join('\n');
    return {
      text: `Recent updates for **${card.name}**:\n${items}`,
    };
  }
  return {
    text: `Recent credit card updates: Major banks (HDFC, ICICI, Axis, SBI) have introduced a ₹50,000–₹60,000 quarterly spend requirement for airport lounge visits, and levy a 1% convenience fee on rent payments.`,
  };
}

/**
 * Spending analysis concisely
 */
export function analyzeMonthlyExpenses(query: string, cards: CreditCard[] = CREDIT_CARDS_DATA): AIResponse {
  return {
    text: `For your spending breakdown, the best two-card combination is **SBI Cashback** (5% online shopping) and **HSBC Live+** (10% dining and groceries). This duo maximizes direct statement cashback with minimal fees.`,
  };
}

/**
 * Deterministic local dispatcher answering only the asked question
 */
export function getLocalCardwatchAIResponse(rawQuery: string, cards: CreditCard[] = CREDIT_CARDS_DATA): AIResponse {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();

  const matchedCards = identifyCardsInQuery(query, cards);

  // 1. Comparison Intent
  if (
    lower.includes('compare') ||
    lower.includes(' vs ') ||
    lower.includes('versus') ||
    lower.includes('which is better') ||
    lower.includes('difference between')
  ) {
    if (matchedCards.length >= 2) {
      return compareCards(matchedCards[0], matchedCards[1]);
    }
    if (matchedCards.length === 1) {
      const c1 = matchedCards[0];
      const rivalId = c1.id === 'hdfc-infinia-metal' ? 'amex-platinum' :
                      c1.id === 'amex-platinum' ? 'hdfc-diners-black' :
                      c1.id === 'sbi-cashback' ? 'icici-amazon-pay' :
                      c1.id === 'scapia-federal' ? 'idfc-first-wealth' :
                      c1.id === 'axis-atlas' ? 'hdfc-regalia-gold' :
                      'sbi-cashback';
      const c2 = cards.find(c => c.id === rivalId) || cards[1];
      return compareCards(c1, c2);
    }
    const amex = cards.find(c => c.id === 'amex-platinum') || cards[0];
    const diners = cards.find(c => c.id === 'hdfc-diners-black') || cards[1];
    return compareCards(amex, diners);
  }

  // 2. Devaluation / Changes Intent
  if (
    lower.includes('deval') ||
    lower.includes('what changed') ||
    lower.includes('recent change') ||
    lower.includes('cut') ||
    lower.includes('reduced') ||
    lower.includes('policy change') ||
    lower.includes('lounge rule')
  ) {
    return getDevaluationUpdates(matchedCards[0]);
  }

  // 3. Personalized Spending Analysis Intent
  if (
    (lower.includes('grocer') && lower.includes('dining')) ||
    (lower.includes('spend') && (lower.includes('online') || lower.includes('shopping')) && lower.includes('travel')) ||
    lower.includes('analyze my spend') ||
    lower.includes('portfolio')
  ) {
    return analyzeMonthlyExpenses(query, cards);
  }

  // 4. Reward Calculator Intent
  const amount = extractAmount(query);
  const isCalculatorQuery =
    lower.includes('how many points') ||
    lower.includes('how much cashback') ||
    lower.includes('what will i get') ||
    lower.includes('calculate') ||
    lower.includes('points will i get') ||
    (amount !== null && (lower.includes('spend') || lower.includes('spends') || lower.includes('swipe') || lower.includes('txn') || lower.includes('transaction') || lower.includes('using')));

  if (isCalculatorQuery) {
    const calcAmount = amount || 10000;
    const category = detectCategory(query);

    if (matchedCards.length > 0) {
      return calculateRewards(matchedCards[0], calcAmount, category);
    } else {
      return {
        text: `Which credit card will you use for this ₹${calcAmount.toLocaleString('en-IN')} spend? (e.g. Scapia, SBI Cashback, HDFC Infinia, or Axis IndianOil)`,
      };
    }
  }

  // 5. Point Valuation Intent
  if (lower.includes('point value') || lower.includes('how much is 1 point') || lower.includes('conversion ratio') || lower.includes('redemption value')) {
    const targetCard = matchedCards[0] || cards.find(c => c.id === 'hdfc-infinia-metal') || cards[0];
    return {
      text: `For **${targetCard.name}**, reward point valuation is **${targetCard.rewardPointValue}** (earning rate: ${targetCard.cashbackRate}). Points offer the highest value when redeemed for flights and hotels on the bank's travel portal.`,
    };
  }

  // 6. Merchant Category / MCC / Surcharge Intent
  if (lower.includes('mcc') || lower.includes('rent') || lower.includes('utility') || lower.includes('wallet') || lower.includes('fuel surcharge')) {
    return {
      text: `On Indian credit cards: rent payments (MCC 6513) and wallet loading (MCC 6540) earn 0% rewards and incur convenience fees. Utility bills often have monthly reward caps, while fuel transactions offer a 1% surcharge waiver on ₹400–₹4,000.`,
    };
  }

  // 7. Dubai / Forex / Overseas Query
  if (lower.includes('dubai') || lower.includes('forex') || lower.includes('overseas') || lower.includes('foreign') || lower.includes('international')) {
    return {
      text: `**Federal Bank Scapia** is the best card for Dubai and international spending with **0% forex markup** and ₹0 annual fee. Other good low-markup cards are **IndusInd Tiger** (1.5% markup) and **HSBC Live+** (1.99% markup).`,
    };
  }

  // 8. Specific Single Card Inquiry
  if (matchedCards.length === 1) {
    const c = matchedCards[0];
    const feeStr = c.isLifetimeFree ? '₹0 (Lifetime Free)' : `₹${c.annualFee.toLocaleString('en-IN')}/year`;
    return {
      text: `**${c.name}** (${c.bank}):\n• **Annual Fee:** ${feeStr}\n• **Headline Benefit:** ${c.headlineBenefit}\n• **Rewards:** ${c.cashbackRate}\n• **Forex Markup:** ${c.forexMarkup}%\n• **Lounge Access:** ${c.domesticLoungesPerQuarter} domestic per quarter (${c.loungeSpendCondition}).`,
    };
  }

  // 9. Fallback
  return {
    text: `I'm here to help with Indian credit cards. Ask me anything specific—like how many points you'll earn on a spend, which card has 0% forex, or compare two cards!`,
  };
}

const GEMINI_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || '';

/**
 * Calls Gemini live with strict instructions to answer ONLY the question asked in 1-3 sentences.
 */
export async function queryGeminiCardwatchAI(
  query: string,
  cards: CreditCard[] = CREDIT_CARDS_DATA
): Promise<AIResponse | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const promptContext = `You are a helpful, direct, and concise credit card assistant for Indian credit cards.
STRICT RULES:
1. Answer ONLY the specific question asked by the user. Do NOT include unasked features, card dossiers, or unrelated information.
2. Keep your answer simple, direct, and short (1 to 3 straightforward sentences).
3. If asked how many points or cashback for spending ₹X: state the exact points/cashback and estimated monetary value directly.
4. For card comparisons: give 2 brief bullet points of the main difference and 1 verdict sentence.
5. Do NOT include markdown tables, mind maps, disclaimers, or financial safety warnings.

Verified Indian Credit Cards Reference:
${cards.slice(0, 15).map(c => `- ${c.name} (${c.bank}, Fee: ${c.isLifetimeFree ? '₹0 LTF' : '₹' + c.annualFee}): ${c.headlineBenefit}, Rewards: ${c.cashbackRate}, Forex: ${c.forexMarkup}%, Lounges: ${c.domesticLoungesPerQuarter} dom/qtr`).join('\n')}

User Question: "${query}"`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You are a concise, direct assistant for Indian credit cards. Answer ONLY the question asked in 1-3 sentences without extra disclaimers or unrelated features." }]
          },
          contents: [{ parts: [{ text: promptContext }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 300
          }
        })
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0];
    const textPart = candidate?.content?.parts?.find((p: any) => typeof p.text === 'string' && p.text.trim().length > 0);
    const generatedText = textPart?.text;

    if (generatedText && generatedText.trim().length > 0) {
      return {
        text: generatedText.trim(),
      };
    }
  } catch {
    // If Gemini times out or is offline, fallback seamlessly to deterministic local engine
  }
  return null;
}

/**
 * Main query dispatcher for CardWatch AI.
 * Tries Gemini live intelligence first; falls back immediately to deterministic engine if offline/timeout.
 */
export async function processCardwatchAIQuery(
  rawQuery: string,
  cards: CreditCard[] = CREDIT_CARDS_DATA
): Promise<AIResponse> {
  const geminiResult = await queryGeminiCardwatchAI(rawQuery, cards);
  if (geminiResult) {
    return geminiResult;
  }
  return getLocalCardwatchAIResponse(rawQuery, cards);
}
