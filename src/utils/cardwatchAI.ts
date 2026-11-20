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
    'hdfc-infinia-metal': ['infinia', 'infinia metal', 'hdfc infinia', 'infinia card'],
    'hdfc-diners-black': ['diners black', 'dcb', 'diners club', 'diners metal', 'hdfc diners', 'diners'],
    'hdfc-regalia-gold': ['regalia', 'regalia gold', 'hdfc regalia', 'regalia card'],
    'amex-platinum': ['american express', 'amex', 'amex plat', 'amex platinum', 'centurion', 'platinum charge', 'charge card', 'amex card'],
    'amex-plat-travel': ['plat travel', 'platinum travel', 'amex travel', 'amex mr'],
    'sbi-cashback': ['sbi cashback', 'cashback sbi', 'sbi cb', 'sbi cash back'],
    'sbi-simplysave': ['simplysave', 'simply save', 'sbi simply'],
    'sbi-aurum': ['aurum', 'sbi aurum'],
    'scapia-federal': ['scapia', 'scapia federal', 'federal scapia', 'federal bank', 'scapia card', 'scapya', 'scapia federal card'],
    'axis-magnus': ['magnus', 'axis magnus'],
    'axis-atlas': ['atlas', 'axis atlas', 'edge miles', 'atlas card'],
    'axis-indianoil': ['indianoil', 'iocl', 'axis indianoil', 'indianoil rupay', 'axis fuel'],
    'flipkart-axis': ['flipkart axis', 'flipkart card', 'axis flipkart'],
    'kiwi-axis-rupay': ['kiwi', 'axis kwik', 'kwik', 'kiwi rupay'],
    'icici-amazon-pay': ['amazon pay', 'amazon icici', 'apay', 'icici amazon', 'amazon card'],
    'icici-sapphiro': ['sapphiro', 'icici sapphiro', 'sapphire'],
    'tata-neu-infinity': ['tata neu', 'neu infinity', 'neucoins', 'neupass', 'tata neu card'],
    'indusind-tiger': ['tiger', 'indusind tiger', 'indusind', 'indusland', 'indusland tiger', 'tiger card', 'indus'],
    'idfc-first-wealth': ['idfc wealth', 'first wealth', 'idfc first wealth'],
    'idfc-first-millennia': ['idfc millennia', 'first millennia'],
    'swiggy-hdfc': ['swiggy hdfc', 'swiggy card', 'hdfc swiggy', 'swiggy credit card'],
    'hsbc-live-plus': ['hsbc live', 'live+', 'live plus', 'hsbc live plus', 'hsbc card', 'hsbc'],
    'hdfc-millennia': ['millennia', 'hdfc millennia', 'millenia'],
    'hdfc-moneyback-plus': ['moneyback', 'moneyback+', 'moneyback plus', 'hdfc moneyback'],
    'hdfc-diners-privilege': ['diners privilege', 'diners club privilege', 'hdfc privilege'],
    'hdfc-freedom': ['freedom', 'hdfc freedom', 'freedom card'],
    'sbi-simplyclick': ['simplyclick', 'simply click', 'sbi click', 'sbi simplyclick'],
    'sbi-prime': ['sbi prime', 'card prime', 'sbi card prime', 'prime card'],
    'sbi-bpcl-octane': ['bpcl octane', 'bpcl sbi', 'sbi octane', 'octane'],
    'sbi-irctc': ['sbi irctc', 'irctc card', 'irctc rupay'],
    'hdfc-marriott-bonvoy': ['marriott bonvoy', 'marriott hdfc', 'bonvoy card'],
    'axis-myzone': ['axis myzone', 'my zone', 'myzone'],
    'icici-coral': ['icici coral', 'coral card'],
    'icici-rubyx': ['icici rubyx', 'rubyx card'],
    'icici-emeralde-private': ['emeralde', 'emeralde private', 'icici emeralde'],
    'icici-makemytrip': ['makemytrip icici', 'mmt icici', 'icici makemytrip'],
    'axis-airtel': ['airtel axis', 'axis airtel'],
    'axis-ace': ['axis ace', 'ace card', 'google pay ace'],
    'axis-neo': ['axis neo', 'neo card', 'axis bank neo'],
    'sbi-air-india': ['air india sbi', 'sbi air india'],
    'icici-hpcl-super-saver': ['icici hpcl', 'hpcl super saver', 'hpcl icici', 'icici fuel card', 'super saver'],
    'kotak-league-platinum': ['kotak league', 'league platinum', 'kotak platinum'],
    'kotak-myntra': ['kotak myntra', 'myntra kotak'],
    'kotak-pvr-inox': ['pvr inox kotak', 'kotak pvr', 'pvr kotak', 'inox kotak'],
    'rbl-world-safari': ['world safari', 'rbl world safari', 'rbl safari'],
    'idfc-first-select': ['idfc select', 'first select', 'idfc first select'],
    'onecard-metal': ['onecard', 'one card', 'bobcard onecard'],
    'au-zenith-plus': ['au zenith', 'zenith+', 'zenith plus', 'au zenith plus'],
    'au-ixigo': ['au ixigo', 'ixigo au', 'ixigo card'],
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
    if (lowerCat.includes('insurance') || lowerCat.includes('utility') || lowerCat.includes('bill') || lowerCat.includes('telecom')) {
      text = `Scapia Federal Credit Card does not earn Scapia Coins on ${category.toLowerCase()} transactions (discontinued effective Feb 27, 2026).`;
    } else if (lowerCat.includes('travel') || lowerCat.includes('flight') || lowerCat.includes('hotel')) {
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
  } else if (card.id === 'hsbc-live-plus') {
    if (lowerCat.includes('international') || lowerCat.includes('forex') || lowerCat.includes('abroad')) {
      const cb = Math.round(amount * 0.015);
      text = `On spending ₹${amount.toLocaleString('en-IN')} internationally with your HSBC Live+ card, you earn ₹${cb.toLocaleString('en-IN')} base cashback (1.5% return) with a 1.99% forex markup. (Note: Reports claiming international exclusion from 1.5% cashback remain unverified by an official HSBC circular).`;
    } else if (lowerCat.includes('dining') || lowerCat.includes('restaurant') || lowerCat.includes('food') || lowerCat.includes('grocer') || lowerCat.includes('blinkit') || lowerCat.includes('swiggy') || lowerCat.includes('zomato')) {
      const cb = Math.min(1200, Math.round(amount * 0.10));
      text = `On spending ₹${amount.toLocaleString('en-IN')} on dining & groceries with your HSBC Live+ card, you will earn ₹${cb.toLocaleString('en-IN')} cashback (10% accelerated cashback, capped at ₹1,200/month).`;
    } else {
      const cb = Math.round(amount * 0.015);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with your HSBC Live+ card, you will earn ₹${cb.toLocaleString('en-IN')} cashback (1.5% return on other domestic retail).`;
    }
  } else if (card.id === 'swiggy-hdfc') {
    if (lowerCat.includes('swiggy') || lowerCat.includes('food') || lowerCat.includes('instamart') || lowerCat.includes('dineout')) {
      const cb = amount >= 249 ? Math.min(1500, Math.round(amount * 0.10)) : Math.round(amount * 0.01);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Swiggy with your Swiggy HDFC card, you will earn ₹${cb.toLocaleString('en-IN')} cashback in Swiggy Money (10% return on orders ₹249+, capped at ₹1,500/cycle). Note: HDFC Bank is phasing out new applications; existing cardholders undergo a phased migration (through March 2027) upon individual notice (not automatic for all cardholders simultaneously).`;
    } else {
      const cb = Math.round(amount * 0.01);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with your Swiggy HDFC card, you will earn ₹${cb.toLocaleString('en-IN')} cashback (1% return).`;
    }
  } else if (card.id === 'flipkart-axis') {
    if (lowerCat.includes('flipkart') || lowerCat.includes('cleartrip')) {
      const cb = Math.min(4000, Math.round(amount * 0.05));
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Flipkart/Cleartrip with Flipkart Axis, you will earn ₹${cb.toLocaleString('en-IN')} statement cashback (5% return, capped at ₹4,000/quarter).`;
    } else if (lowerCat.includes('swiggy') || lowerCat.includes('uber') || lowerCat.includes('pvr')) {
      const cb = Math.round(amount * 0.04);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on preferred partners with Flipkart Axis, you will earn ₹${cb.toLocaleString('en-IN')} unlimited cashback (4% return).`;
    } else {
      const cb = Math.round(amount * 0.01);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with Flipkart Axis, you will earn ₹${cb.toLocaleString('en-IN')} cashback (1% return).`;
    }
  } else if (card.id === 'hdfc-millennia') {
    if (lowerCat.includes('flight') || lowerCat.includes('hotel') || lowerCat.includes('smartbuy') || lowerCat.includes('travel')) {
      const cb = Math.min(1000, Math.round(amount * 0.01));
      const travelVal = Math.round(cb * 0.30);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on travel with HDFC Millennia, you earn ${cb.toLocaleString('en-IN')} CashPoints. Note: When redeemed for flights and hotels on SmartBuy, 1 CashPoint = ₹0.30 (worth ₹${travelVal.toLocaleString('en-IN')}); for direct statement balance credit, 1 CashPoint = ₹1.00 (worth ₹${cb.toLocaleString('en-IN')}, min 500 CP).`;
    } else {
      const isPartner = lowerCat.includes('amazon') || lowerCat.includes('flipkart') || lowerCat.includes('myntra') || lowerCat.includes('swiggy') || lowerCat.includes('zomato') || lowerCat.includes('tata cliq') || lowerCat.includes('uber') || lowerCat.includes('bookmyshow') || lowerCat.includes('cult') || lowerCat.includes('sony');
      if (isPartner) {
        const cb = Math.min(1000, Math.round(amount * 0.05));
        text = `On spending ₹${amount.toLocaleString('en-IN')} on partner apps with HDFC Millennia, you will earn ${cb.toLocaleString('en-IN')} CashPoints (worth ₹${cb.toLocaleString('en-IN')} at 1 CP = ₹1 statement credit, capped at 1,000 CP/month; or ₹${Math.round(cb * 0.30)} at ₹0.30/point for SmartBuy flights/hotels).`;
      } else {
        const cb = Math.min(1000, Math.round(amount * 0.01));
        text = `On spending ₹${amount.toLocaleString('en-IN')} with HDFC Millennia, you will earn ${cb.toLocaleString('en-IN')} CashPoints (worth ₹${cb.toLocaleString('en-IN')} at 1% return for statement credit, capped at 1,000 CP/month; ₹0.30/point for SmartBuy travel).`;
      }
    }
  } else if (card.id === 'idfc-first-wealth' || card.id === 'idfc-first-select' || card.id === 'idfc-first-millennia') {
    if (lowerCat.includes('international') || lowerCat.includes('forex') || lowerCat.includes('abroad')) {
      const points = Math.round((amount / 150) * 3);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} internationally with ${card.name}, you enjoy 0.0% forex markup and earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 1 RP = ₹0.25). IDFC FIRST clarified that international transactions continue to earn reward points.`;
    } else {
      const points = Math.round((amount / 150) * 3);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with ${card.name}, you earn approx ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')}).`;
    }
  } else if (card.id === 'hdfc-moneyback-plus') {
    const is10X = lowerCat.includes('amazon') || lowerCat.includes('bigbasket') || lowerCat.includes('flipkart') || lowerCat.includes('reliance') || lowerCat.includes('swiggy');
    if (is10X) {
      const points = Math.min(2500, Math.round((amount / 200) * 20));
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on 10X partner brands with HDFC MoneyBack+, you will earn ${points.toLocaleString('en-IN')} CashPoints (worth ₹${val.toLocaleString('en-IN')} at 1 CP = ₹0.25, up to 2,500 CP/month).`;
    } else {
      const points = Math.round((amount / 200) * 2);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with HDFC MoneyBack+, you will earn ${points.toLocaleString('en-IN')} CashPoints (worth ₹${val.toLocaleString('en-IN')}).`;
    }
  } else if (card.id === 'hdfc-diners-privilege') {
    if (lowerCat.includes('swiggy') || lowerCat.includes('zomato') || lowerCat.includes('dining')) {
      const points = Math.min(2500, Math.round((amount / 200) * 20));
      const val = Math.round(points * 0.50);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Swiggy/Zomato with HDFC Diners Privilege, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth up to ₹${val.toLocaleString('en-IN')} on SmartBuy travel at 1 RP = ₹0.50).`;
    } else {
      const points = Math.round((amount / 200) * 4);
      const val = Math.round(points * 0.50);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with HDFC Diners Privilege, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth up to ₹${val.toLocaleString('en-IN')} on SmartBuy flights & hotels).`;
    }
  } else if (card.id === 'sbi-simplyclick') {
    const is10X = lowerCat.includes('apollo') || lowerCat.includes('bookmyshow') || lowerCat.includes('cleartrip') || lowerCat.includes('domino') || lowerCat.includes('myntra') || lowerCat.includes('swiggy') || lowerCat.includes('yatra') || lowerCat.includes('tata cliq');
    if (is10X) {
      const points = Math.round((amount / 100) * 10);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on partner brands with SimplyCLICK SBI, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 4 RP = ₹1).`;
    } else if (lowerCat.includes('online') || lowerCat.includes('shopping')) {
      const points = Math.min(10000, Math.round((amount / 100) * 5));
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} online with SimplyCLICK SBI, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 5X rewards, capped at 10,000 pts/month).`;
    } else {
      const points = Math.round((amount / 100) * 1);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} offline with SimplyCLICK SBI, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')}).`;
    }
  } else if (card.id === 'sbi-prime') {
    if (lowerCat.includes('dining') || lowerCat.includes('grocer') || lowerCat.includes('departmental') || lowerCat.includes('movie')) {
      const points = Math.min(7500, Math.round((amount / 100) * 10));
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on dining/groceries/movies with SBI Card PRIME, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 2.5% return, capped at 7,500 pts/month).`;
    } else if (lowerCat.includes('utility') || lowerCat.includes('bill')) {
      const points = Math.min(3000, Math.round((amount / 100) * 20));
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on utilities with SBI Card PRIME, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 5% return, capped at 3,000 pts/month).`;
    } else {
      const points = Math.round((amount / 100) * 2);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with SBI Card PRIME, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')}).`;
    }
  } else if (card.id === 'sbi-bpcl-octane') {
    if (lowerCat.includes('fuel') || lowerCat.includes('petrol') || lowerCat.includes('bpcl') || lowerCat.includes('diesel')) {
      const eligibleSpend = Math.min(10000, amount);
      const points = Math.min(2500, Math.round((eligibleSpend / 100) * 25));
      const val = Math.round(points * 0.25);
      const surchargeSaved = Math.min(100, Math.round(amount * 0.01));
      const totalReturn = val + surchargeSaved;
      text = `On spending ₹${amount.toLocaleString('en-IN')} on BPCL fuel with BPCL SBI OCTANE, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')}) plus ₹${surchargeSaved} surcharge waiver, giving ₹${totalReturn.toLocaleString('en-IN')} total valueback (7.25% return).`;
    } else {
      const points = Math.round((amount / 100) * 1);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with BPCL SBI OCTANE, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')}).`;
    }
  } else if (card.id === 'axis-ace') {
    if (lowerCat.includes('utility') || lowerCat.includes('bill') || lowerCat.includes('recharge') || lowerCat.includes('electricity') || lowerCat.includes('google pay') || lowerCat.includes('gpay')) {
      const cb = Math.min(500, Math.round(amount * 0.05));
      text = `On spending ₹${amount.toLocaleString('en-IN')} on bill payments via Google Pay with Axis ACE, you will earn ₹${cb.toLocaleString('en-IN')} cashback (5% return, capped at ₹500/month).`;
    } else if (lowerCat.includes('swiggy') || lowerCat.includes('zomato') || lowerCat.includes('ola')) {
      const cb = Math.min(500, Math.round(amount * 0.04));
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Swiggy/Zomato/Ola with Axis ACE, you will earn ₹${cb.toLocaleString('en-IN')} cashback (4% return).`;
    } else {
      const cb = Math.round(amount * 0.015);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with Axis ACE, you will earn ₹${cb.toLocaleString('en-IN')} unlimited cashback (1.5% flat return everywhere).`;
    }
  } else if (card.id === 'axis-airtel') {
    if (lowerCat.includes('airtel') || lowerCat.includes('mobile') || lowerCat.includes('dth') || lowerCat.includes('broadband')) {
      const cb = Math.round(amount * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Airtel bills via Airtel Thanks with Airtel Axis Bank, you will earn ₹${cb.toLocaleString('en-IN')} (25% return, subject to dynamic monthly cap of 2x your monthly 1% base cashback).`;
    } else if (lowerCat.includes('zomato') || lowerCat.includes('blinkit') || lowerCat.includes('district')) {
      const cb = amount >= 499 ? Math.min(200, Math.round(amount * 0.10)) : 0;
      text = `On spending ₹${amount.toLocaleString('en-IN')} on ${lowerCat.includes('blinkit') ? 'Blinkit' : lowerCat.includes('district') ? 'District' : 'Zomato'} with Airtel Axis Bank, you will earn ₹${cb.toLocaleString('en-IN')} wallet value-back (10% back on min ₹499 order, capped at ₹200/partner/month). Note: Swiggy and BigBasket 10% cashback have been discontinued.`;
    } else if (lowerCat.includes('utility') || lowerCat.includes('bill') || lowerCat.includes('electricity') || lowerCat.includes('gas')) {
      const cb = Math.round(amount * 0.10);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on utility bills via Airtel Thanks with Airtel Axis Bank, you will earn ₹${cb.toLocaleString('en-IN')} (10% return, subject to dynamic monthly cap of 1x your monthly 1% base cashback).`;
    } else {
      const cb = Math.round(amount * 0.01);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on regular retail with Airtel Axis Bank, you will earn ₹${cb.toLocaleString('en-IN')} base cashback (1% return). This 1% base spend also unlocks up to ₹${(cb * 2).toLocaleString('en-IN')} in Airtel 25% cashback cap and ₹${cb.toLocaleString('en-IN')} in utility 10% cashback cap.`;
    }
  } else if (card.id === 'icici-rubyx') {
    if (lowerCat.includes('international') || lowerCat.includes('forex') || lowerCat.includes('abroad')) {
      const points = Math.round((amount / 100) * 4);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} internationally with ICICI Bank Rubyx, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 1% value back).`;
    } else if (lowerCat.includes('utility') || lowerCat.includes('bill') || lowerCat.includes('insurance')) {
      const points = Math.round((amount / 100) * 1);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on utilities & insurance with ICICI Bank Rubyx, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 0.25% value back).`;
    } else {
      const points = Math.round((amount / 100) * 2);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on domestic retail with ICICI Bank Rubyx, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 0.5% value back).`;
    }
  } else if (card.id === 'icici-emeralde-private') {
    if (lowerCat.includes('hotel') && lowerCat.includes('ishop')) {
      const points = Math.min(18000, Math.round((amount / 200) * 72));
      text = `On spending ₹${amount.toLocaleString('en-IN')} on hotels via iShop with Emeralde Private Metal, you will earn up to ${points.toLocaleString('en-IN')} accelerated Reward Points (12X points, worth up to ₹${points.toLocaleString('en-IN')} on travel, capped at 18k pts/mo).`;
    } else if (lowerCat.includes('flight') && lowerCat.includes('ishop')) {
      const points = Math.min(18000, Math.round((amount / 200) * 36));
      text = `On spending ₹${amount.toLocaleString('en-IN')} on flights via iShop with Emeralde Private Metal, you will earn up to ${points.toLocaleString('en-IN')} accelerated Reward Points (6X points, worth up to ₹${points.toLocaleString('en-IN')} on travel, capped at 18k pts/mo).`;
    } else if (lowerCat.includes('grocery') || lowerCat.includes('utility') || lowerCat.includes('education')) {
      const points = Math.min(1000, Math.round((amount / 200) * 6));
      text = `On spending ₹${amount.toLocaleString('en-IN')} on groceries/utilities/education with Emeralde Private Metal, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth up to ₹${points.toLocaleString('en-IN')}, capped at 1,000 pts/cycle).`;
    } else {
      const points = Math.round((amount / 200) * 6);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with ICICI Bank Emeralde Private Metal, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth up to ₹${points.toLocaleString('en-IN')} at up to 3% return when redeemed for flights, hotels, or luxury vouchers).`;
    }
  } else if (card.id === 'icici-hpcl-super-saver') {
    if (lowerCat.includes('fuel') || lowerCat.includes('petrol') || lowerCat.includes('diesel') || lowerCat.includes('hpcl')) {
      const cb = Math.min(200, Math.round(amount * 0.05));
      text = `On spending ₹${amount.toLocaleString('en-IN')} on fuel at HPCL with ICICI HPCL Super Saver, you will earn ₹${cb.toLocaleString('en-IN')} in savings (4% cashback + 1% surcharge waiver, capped at ₹200/month). Extra 1.5% rewards available via HP Pay.`;
    } else if (lowerCat.includes('utilit') || lowerCat.includes('bill') || lowerCat.includes('grocer') || lowerCat.includes('departmental')) {
      const points = Math.min(400, Math.round((amount / 100) * 20));
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on utilities & departmental stores with ICICI HPCL Super Saver, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 5% value back, capped at 400 pts/month).`;
    } else {
      const points = Math.round((amount / 100) * 2);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with ICICI HPCL Super Saver, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 0.5% return).`;
    }
  } else if (card.id === 'axis-myzone') {
    if (lowerCat.includes('swiggy') || lowerCat.includes('food') || lowerCat.includes('dining')) {
      const discount = amount >= 500 ? 120 : 0;
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Swiggy with Axis Bank MY ZONE, you will save ₹${discount} via the flat ₹120 instant discount (valid on min ₹500 orders, twice a month).`;
    } else if (lowerCat.includes('movie') || lowerCat.includes('district') || lowerCat.includes('cinema') || lowerCat.includes('ticket')) {
      text = `On movie tickets with Axis Bank MY ZONE, you unlock Buy-One-Get-One-Free on District app (100% off second ticket, up to ₹200/month; requires ₹25,000 spend in preceding 3 months).`;
    } else {
      const points = Math.round((amount / 200) * 4);
      const val = Math.round(points * 0.20);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with Axis Bank MY ZONE, you will earn ${points.toLocaleString('en-IN')} EDGE Reward Points (worth ₹${val.toLocaleString('en-IN')} at 0.4% return).`;
    }
  } else if (card.id === 'axis-neo') {
    if (lowerCat.includes('zomato') || lowerCat.includes('food') || lowerCat.includes('dining')) {
      const discount = amount >= 499 ? 120 : 0;
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Zomato with Axis Bank NEO, you will save ₹${discount} via flat ₹120 off (code AXISNEO, orders ₹499+, twice a month, excluding RuPay UPI).`;
    } else if (lowerCat.includes('blinkit') || lowerCat.includes('grocery') || lowerCat.includes('quick')) {
      const discount = amount >= 750 ? Math.min(250, Math.round(amount * 0.10)) : 0;
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Blinkit with Axis Bank NEO, you will save ₹${discount} (10% off up to ₹250 on min ₹750 orders, once a month).`;
    } else if (lowerCat.includes('utility') || lowerCat.includes('bill') || lowerCat.includes('paytm')) {
      const discount = Math.round(amount * 0.05);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Paytm Utilities with Axis Bank NEO, you will save ₹${discount} (5% discount).`;
    } else if (lowerCat.includes('movie') || lowerCat.includes('bookmyshow') || lowerCat.includes('cinema')) {
      const discount = Math.min(100, Math.round(amount * 0.10));
      text = `On movie tickets with Axis Bank NEO, you save ₹${discount} (10% off up to ₹100 on BookMyShow; requires ₹25,000 spend in preceding 3 months from Nov 1, 2026).`;
    } else {
      const points = Math.round((amount / 200) * 1);
      const val = Math.round(points * 0.20);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with Axis Bank NEO, you will earn ${points.toLocaleString('en-IN')} EDGE Reward Points (worth ₹${val.toLocaleString('en-IN')} at 0.1% return).`;
    }
  } else if (card.id === 'rbl-world-safari') {
    if (lowerCat.includes('travel') || lowerCat.includes('flight') || lowerCat.includes('hotel')) {
      const points = Math.round((amount / 100) * 5);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on travel with RBL Bank World Safari, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 1.25% return).`;
    } else if (lowerCat.includes('international') || lowerCat.includes('forex') || lowerCat.includes('abroad')) {
      const savings = Math.round(amount * 0.035);
      text = `On spending ₹${amount.toLocaleString('en-IN')} overseas with RBL Bank World Safari, you save approx ₹${savings.toLocaleString('en-IN')} via 0% foreign currency markup (zero forex fee). Note: International spends do not earn points.`;
    } else {
      const points = Math.round((amount / 100) * 2);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with RBL Bank World Safari, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 0.5% return).`;
    }
  } else if (card.id === 'axis-atlas') {
    if (lowerCat.includes('travel') || lowerCat.includes('airline') || lowerCat.includes('hotel') || lowerCat.includes('flight')) {
      const miles = Math.round((amount / 100) * 5);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on travel bookings with Axis Bank ATLAS, you will earn ${miles.toLocaleString('en-IN')} EDGE Miles (5 EDGE Miles per ₹100, capped at ₹2L/month). Note: Accor ALL ratio was slashed to 2:1 from Sept 2026; public card issuance is paused.`;
    } else {
      const miles = Math.round((amount / 100) * 2);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with Axis Bank ATLAS, you will earn ${miles.toLocaleString('en-IN')} EDGE Miles (2 EDGE Miles per ₹100).`;
    }
  } else if (card.id === 'idfc-first-select') {
    if (lowerCat.includes('international') || lowerCat.includes('forex') || lowerCat.includes('abroad')) {
      const savings = Math.round(amount * 0.035);
      text = `On spending ₹${amount.toLocaleString('en-IN')} overseas with IDFC FIRST Select, you save approx ₹${savings.toLocaleString('en-IN')} via 0% foreign currency markup. Note: International spends earn 0 reward points effective Oct 26, 2026.`;
    } else if (amount > 20000 || lowerCat.includes('birthday')) {
      const points = Math.round((amount / 150) * 10);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with IDFC FIRST Select (above ₹20k tier), you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 1.67%–2.5% return with never-expiring points).`;
    } else {
      const points = Math.round((amount / 150) * 3);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with IDFC FIRST Select, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 0.75% return).`;
    }
  } else if (card.id === 'kotak-pvr-inox') {
    if (lowerCat.includes('movie') || lowerCat.includes('pvr') || lowerCat.includes('inox') || lowerCat.includes('ticket')) {
      const discount = Math.round(amount * 0.05);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on PVR INOX movie tickets, you will save ₹${discount} (5% discount), and earn toward 1 free ticket (worth ₹300) per ₹10,000 monthly spend.`;
    } else if (lowerCat.includes('food') || lowerCat.includes('popcorn') || lowerCat.includes('snack') || lowerCat.includes('beverage')) {
      const discount = Math.round(amount * 0.20);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on food & beverages at PVR INOX, you will save ₹${discount} (20% instant discount).`;
    } else {
      text = `On spending ₹${amount.toLocaleString('en-IN')} with PVR INOX Kotak, every ₹10,000 in monthly spend earns 1 free PVR INOX movie ticket (worth up to ₹300).`;
    }
  } else if (card.id === 'au-zenith-plus') {
    if (lowerCat.includes('dining') || lowerCat.includes('travel') || lowerCat.includes('flight') || lowerCat.includes('hotel')) {
      const points = Math.round((amount / 100) * 2);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on dining/travel with AU Zenith+, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${points.toLocaleString('en-IN')} at 1:1 redemption value = 2% return).`;
    } else {
      const points = Math.round((amount / 100) * 1);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with AU Zenith+, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${points.toLocaleString('en-IN')} at 1:1 redemption value = 1% return).`;
    }
  } else if (card.id === 'au-ixigo') {
    if (lowerCat.includes('train') || lowerCat.includes('railway') || lowerCat.includes('irctc') || lowerCat.includes('confirmtkt')) {
      text = `On train bookings via ixigo Trains / ConfirmTkt with ixigo AU, payment gateway charges (₹0 PG fee) are waived up to twice a month per platform, plus you earn 5 Reward Points per ₹200.`;
    } else if (lowerCat.includes('flight') || lowerCat.includes('hotel') || lowerCat.includes('bus') || lowerCat.includes('ixigo')) {
      const discount = Math.min(3000, Math.round(amount * 0.10));
      text = `On spending ₹${amount.toLocaleString('en-IN')} on flights/hotels via ixigo with ixigo AU, you save ₹${discount.toLocaleString('en-IN')} (10% instant discount up to ₹3,000/month), plus earn 5 Reward Points per ₹200.`;
    } else if (lowerCat.includes('international') || lowerCat.includes('forex') || lowerCat.includes('abroad')) {
      const savings = Math.round(amount * 0.035);
      text = `On spending ₹${amount.toLocaleString('en-IN')} overseas with ixigo AU, you save approx ₹${savings.toLocaleString('en-IN')} via 0% foreign currency markup (zero forex fee). Note: International spends do not earn reward points.`;
    } else {
      const points = Math.round((amount / 200) * 5);
      const val = Math.round(points * 0.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with ixigo AU, you will earn ${points.toLocaleString('en-IN')} Reward Points (worth ₹${val.toLocaleString('en-IN')} at 0.625% return). Note: ₹99 + GST fee per redemption.`;
    }
  } else if (card.id === 'sbi-air-india') {
    if (lowerCat.includes('flight') || lowerCat.includes('air india') || lowerCat.includes('airline') || lowerCat.includes('ticket')) {
      const points = Math.round((amount / 100) * 10);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on Air India tickets with Air India SBI Signature, you will earn ${points.toLocaleString('en-IN')} Maharaja Club Points (10 points per ₹100, effective March 31, 2025). Note: Card issuance was discontinued on Oct 10, 2024; a new co-branded card was announced on Oct 28, 2026.`;
    } else {
      const points = Math.round((amount / 100) * 4);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with Air India SBI Signature, you will earn ${points.toLocaleString('en-IN')} Maharaja Club Points (4 points per ₹100).`;
    }
  } else if (card.id === 'icici-makemytrip') {
    if (lowerCat.includes('hotel') || lowerCat.includes('holiday')) {
      const myCash = Math.round((amount / 200) * 4);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on MakeMyTrip hotel or holiday bookings with MakeMyTrip ICICI Signature, you will earn ${myCash.toLocaleString('en-IN')} myCash (worth ₹${myCash.toLocaleString('en-IN')} at 1 myCash = ₹1.00 on MMT). Note: New card applications are discontinued; existing cards remain active.`;
    } else if (lowerCat.includes('flight') || lowerCat.includes('airline')) {
      const myCash = Math.round((amount / 200) * 2);
      text = `On spending ₹${amount.toLocaleString('en-IN')} on MakeMyTrip flights with MakeMyTrip ICICI Signature, you will earn ${myCash.toLocaleString('en-IN')} myCash (worth ₹${myCash.toLocaleString('en-IN')} at 1 myCash = ₹1.00 on MMT). Note: New card applications are discontinued; existing cards remain active.`;
    } else {
      const myCash = Math.round((amount / 200) * 1.25);
      text = `On spending ₹${amount.toLocaleString('en-IN')} with MakeMyTrip ICICI Signature, you will earn ${myCash.toLocaleString('en-IN')} myCash (worth ₹${myCash.toLocaleString('en-IN')} at 1 myCash = ₹1.00 on MMT).`;
    }
  } else {
    const cb = Math.round(amount * 0.02);
    text = `On spending ₹${amount.toLocaleString('en-IN')} with ${card.name}, you will earn approx ₹${cb.toLocaleString('en-IN')} in rewards based on its ${card.cashbackRate} reward rate.`;
  }

  return { text };
}

/**
 * Compares two cards concisely and helpfully
 */
export function compareCards(card1: CreditCard, card2: CreditCard): AIResponse {
  const c1Fee = card1.isLifetimeFree ? '₹0 (Lifetime Free)' : `₹${card1.annualFee.toLocaleString('en-IN')}/year`;
  const c2Fee = card2.isLifetimeFree ? '₹0 (Lifetime Free)' : `₹${card2.annualFee.toLocaleString('en-IN')}/year`;

  let verdict = '';
  const pair = [card1.id, card2.id].sort().join('__');

  if (pair.includes('indusind-tiger') && pair.includes('scapia-federal')) {
    verdict = `**Recommendation:**\n• **Choose Scapia Federal** if you travel internationally or want zero forex fees (**0% forex markup** + ₹0 lifetime free annual fee).\n• **Choose IndusInd Tiger** if you want everyday domestic rewards, reward points across multiple partner brands, and a standard banking relationship with lower markup (1.5%) than standard cards.`;
  } else if (pair.includes('icici-amazon-pay') && pair.includes('sbi-cashback')) {
    verdict = `**Recommendation:**\n• **SBI Cashback** gives a higher return (**5% direct statement cashback** across Amazon, Flipkart, Myntra up to ₹2,000/mo).\n• **Amazon Pay ICICI** is completely **Lifetime Free (₹0 fee)** and best if you want an easy card dedicated to Amazon Prime orders.`;
  } else if (pair.includes('amex-platinum') && pair.includes('hdfc-infinia-metal')) {
    verdict = `**Recommendation:**\n• **HDFC Infinia Metal** is mathematically superior for rewards (up to **33.3% return** on flights/hotels via SmartBuy).\n• **Amex Platinum** is a luxury charge card built for concierge services, 5-star hotel memberships (Marriott, Hilton, Radisson), and Centurion Lounge access.`;
  } else {
    let winner = card1.name;
    if (card2.tier === 'Super Premium' && card1.tier !== 'Super Premium') winner = card2.name;
    else if ((card2.id.includes('cashback') || card2.id.includes('amazon')) && (card1.tier === 'Entry Level' || card1.tier === 'Mid Tier')) winner = card2.name;
    else if (card1.annualFee > card2.annualFee && card2.isLifetimeFree) winner = card2.name;
    verdict = `**Recommendation:** For overall value and everyday spending returns, **${winner}** is the recommended pick for most users.`;
  }

  return {
    text: `### **${card1.name} vs ${card2.name}**\n\n` +
      `• **${card1.name}:**\n` +
      `  - **Annual Fee:** ${c1Fee}\n` +
      `  - **Forex Markup:** ${card1.forexMarkup}% (forex markup fee)\n` +
      `  - **Key Benefit:** ${card1.headlineBenefit}\n` +
      `  - **Lounge Access:** ${card1.domesticLoungesPerQuarter} domestic/quarter (${card1.loungeSpendCondition || 'Subject to bank criteria'})\n\n` +
      `• **${card2.name}:**\n` +
      `  - **Annual Fee:** ${c2Fee}\n` +
      `  - **Forex Markup:** ${card2.forexMarkup}% (forex markup fee)\n` +
      `  - **Key Benefit:** ${card2.headlineBenefit}\n` +
      `  - **Lounge Access:** ${card2.domesticLoungesPerQuarter} domestic/quarter (${card2.loungeSpendCondition || 'Subject to bank criteria'})\n\n` +
      `**Verdict:** ${verdict}`,
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
    text: `### **Recent Indian Credit Card Devaluations & Rule Changes**\n\n` +
      `1. **Lounge Spend Criteria:** Major banks (HDFC, ICICI, Axis, SBI) now require spending **₹50,000–₹60,000 in the previous calendar quarter** to unlock complimentary airport lounge access.\n` +
      `2. **Rental & Utility Surcharges:** Rent payments (MCC 6513) now carry a 1% convenience fee + GST and earn 0 reward points across almost all issuers.\n` +
      `3. **Education & Wallet Fees:** Third-party app payments (like CRED, Mobikwik, Paytm) for school fees and wallet reloads incur 1% surcharge fees.\n` +
      `4. **Government Tax:** Payments for income tax and municipal charges are largely excluded from reward point calculation.`,
  };
}

/**
 * Spending analysis concisely
 */
export function analyzeMonthlyExpenses(query: string, cards: CreditCard[] = CREDIT_CARDS_DATA): AIResponse {
  return {
    text: `### **Recommended Spending Portfolio:**\n\n` +
      `To maximize cashback and rewards across your expenses:\n` +
      `• **Online Shopping (Amazon, Flipkart, Blinkit):** Use **SBI Cashback** (5% cashback up to ₹2,000/mo) or **Amazon Pay ICICI** (5% unlimited for Prime).\n` +
      `• **Dining, Food Delivery & Groceries:** Use **HSBC Live+** (10% cashback on dining/groceries, up to ₹1,000/mo) or **Swiggy HDFC** (10% cashback on Swiggy).\n` +
      `• **UPI Scan & Pay:** Use **Tata Neu Infinity RuPay** (1.5% NeuCoins on UPI QR transactions).\n` +
      `• **Travel & International Spends:** Use **Federal Bank Scapia** (0% forex markup, ₹0 annual fee).`,
  };
}

/**
 * Deterministic local dispatcher answering ANY question intelligently
 */
export function getLocalCardwatchAIResponse(rawQuery: string, cards: CreditCard[] = CREDIT_CARDS_DATA): AIResponse {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();

  // 0. Front Page Design System Query Handler
  if (
    lower.includes('current design') ||
    lower.includes('which design') ||
    lower.includes('previous design') ||
    lower.includes('revert design') ||
    lower.includes('switch design') ||
    lower.includes('franklin design') ||
    lower.includes('design mode')
  ) {
    return {
      text: `### **CARDWATCH Front Page Design System**\n\n` +
        `• **Current Active Design:** **C. Franklin Noir Edition** — Features the interactive, moveable torn $100 banknote engraving with Benjamin Franklin's eyes, dynamic 3D mouse/touch tilt, currency stamp guilloche borders, and cursive signature.\n` +
        `• **Previous / Alternative Design:** **Classic Emerald Vault Chamber** — The original 3D perspective chamber with the rotating 3D physical credit card deck.\n\n` +
        `**How to Revert or Switch Anytime:**\n` +
        `• Look at the top right of the hero banner on the front page.\n` +
        `• Click the **"Switch to Classic Design"** pill (or **"Switch to C. Franklin Design"**).\n` +
        `• The app instantly toggles between both designs and saves your choice in \`localStorage\` so it persists on every visit.`,
    };
  }

  // Check for queries regarding specific unverified claims
  if (
    lower.includes('dcc') ||
    lower.includes('markup') ||
    lower.includes('accor') ||
    lower.includes('transfer ratio') ||
    lower.includes('paused') ||
    lower.includes('upi limit') ||
    lower.includes('spa') ||
    lower.includes('fee waiver') ||
    lower.includes('exclude') ||
    lower.includes('exclusion') ||
    lower.includes('unverified')
  ) {
    if (lower.includes('infinia') && (lower.includes('dcc') || lower.includes('1.75') || lower.includes('markup'))) {
      return {
        text: `### **HDFC Infinia Metal — DCC Markup Status**\n\n• **Status:** **Unverified**\n• **Official Fact:** Reports claiming a 1.75% Dynamic Currency Conversion (DCC) fee on HDFC Infinia Metal remain unconfirmed by an official HDFC Bank MITC or circular. HDFC Bank charges standard forex markup (2.0%) on foreign currency transactions.`,
      };
    }
    if (lower.includes('magnus') && (lower.includes('dcc') || lower.includes('2%') || lower.includes('2.0%') || lower.includes('markup'))) {
      return {
        text: `### **Axis Magnus — DCC Markup Status**\n\n• **Status:** **Unverified**\n• **Official Fact:** Reports claiming a 2.0% DCC markup on Axis Bank Magnus remain unverified by an official Axis Bank circular or MITC. Standard forex markup is 2.0%.`,
      };
    }
    if (lower.includes('atlas') && (lower.includes('accor') || lower.includes('2:1') || lower.includes('ratio'))) {
      return {
        text: `### **Axis ATLAS — Accor Transfer Ratio Status**\n\n• **Status:** **Unverified**\n• **Official Fact:** The official published transfer ratio between Axis EDGE Miles and Accor ALL remains **1:2** (1 EDGE Mile = 2 Accor points). Claims of a 2:1 devaluation remain unverified by an official Axis Bank circular.`,
      };
    }
    if (lower.includes('atlas') && (lower.includes('pause') || lower.includes('discontinued') || lower.includes('halt'))) {
      return {
        text: `### **Axis ATLAS — Application Status**\n\n• **Status:** **Unverified**\n• **Official Fact:** Claims of a permanent pause on Axis ATLAS applications are unverified by official Axis Bank circulars. The card remains active for cardholders with standard benefits.`,
      };
    }
    if ((lower.includes('kwik') || lower.includes('kiwi')) && (lower.includes('1 lakh') || lower.includes('upi limit') || lower.includes('daily limit'))) {
      return {
        text: `### **Axis Kwik — Daily UPI Limit Status**\n\n• **Status:** **Unverified**\n• **Official Fact:** Daily transaction limits on UPI transactions follow standard NPCI and linked bank account guidelines; reports of a specific ₹1 Lakh daily cap on Axis Kwik are unverified. Note that the Axis-Kiwi co-brand partnership was terminated on Sept 6, 2026.`,
      };
    }
    if (lower.includes('flipkart') && (lower.includes('dcc') || lower.includes('3.5') || lower.includes('markup'))) {
      return {
        text: `### **Flipkart Axis Bank — DCC Markup Status**\n\n• **Status:** **Unverified**\n• **Official Fact:** Claims of a 3.5% DCC markup on Flipkart Axis remain unverified by official Axis Bank terms. Standard forex markup is 3.5%.`,
      };
    }
    if ((lower.includes('live+') || lower.includes('live plus') || lower.includes('hsbc')) && (lower.includes('international') || lower.includes('abroad') || lower.includes('exclude') || lower.includes('exclusion'))) {
      return {
        text: `### **HSBC Live+ — International Cashback Status**\n\n• **Status:** **Unverified**\n• **Official Fact:** Reports claiming complete exclusion of international transactions from the 1.5% base cashback are unverified by an official HSBC circular. Cardholders earn 1.5% base cashback with a 1.99% forex markup.`,
      };
    }
    if (lower.includes('wealth') && (lower.includes('spa') || lower.includes('eliteassist') || lower.includes('dreamfolks'))) {
      return {
        text: `### **IDFC FIRST Wealth — Airport Spa & Lounge Network Status**\n\n• **Status:** **Unverified**\n• **Official Fact:** Claims of complete discontinuation of airport spa access and full migration away from DreamFolks remain unverified by official IDFC FIRST KFS circulars. Domestic and international lounges unlock on ₹20,000 monthly spend.`,
      };
    }
    if (lower.includes('safari') && (lower.includes('3 lakh') || lower.includes('waiver') || lower.includes('fee waiver'))) {
      return {
        text: `### **RBL World Safari — Annual Fee Waiver Status**\n\n• **Status:** **Unverified**\n• **Official Fact:** Claims that the ₹3,000 annual fee is automatically waived on ₹3,00,000 annual spend remain unverified in the official RBL Bank MITC. The card features 0% forex markup and spend-linked domestic lounge visits.`,
      };
    }
  }

  const matchedCards = identifyCardsInQuery(query, cards);

  // 1. Comparison Intent (Triggered if 2+ cards found OR comparison words used)
  const isComparisonQuery =
    matchedCards.length >= 2 ||
    lower.includes('compare') ||
    lower.includes(' vs ') ||
    lower.includes(' vs. ') ||
    lower.includes('versus') ||
    lower.includes('which is better') ||
    lower.includes('which card is better') ||
    lower.includes('which is more useful') ||
    lower.includes('which card is more useful') ||
    lower.includes('which one to choose') ||
    lower.includes('which one should i choose') ||
    lower.includes('which should i pick') ||
    lower.includes('which one is better') ||
    lower.includes('difference between') ||
    (matchedCards.length === 1 && (lower.includes(' or ') || lower.includes('more useful') || lower.includes('better')));

  if (isComparisonQuery) {
    if (matchedCards.length >= 2) {
      return compareCards(matchedCards[0], matchedCards[1]);
    }
    if (matchedCards.length === 1) {
      const c1 = matchedCards[0];
      const rivalId =
        c1.id === 'scapia-federal' ? 'indusind-tiger' :
        c1.id === 'indusind-tiger' ? 'scapia-federal' :
        c1.id === 'hdfc-infinia-metal' ? 'amex-platinum' :
        c1.id === 'amex-platinum' ? 'hdfc-infinia-metal' :
        c1.id === 'sbi-cashback' ? 'icici-amazon-pay' :
        c1.id === 'icici-amazon-pay' ? 'sbi-cashback' :
        c1.id === 'axis-atlas' ? 'hdfc-regalia-gold' :
        c1.id === 'hdfc-regalia-gold' ? 'axis-atlas' :
        'sbi-cashback';
      const c2 = cards.find(c => c.id === rivalId) || cards[1];
      return compareCards(c1, c2);
    }
    const c1 = cards.find(c => c.id === 'sbi-cashback') || cards[0];
    const c2 = cards.find(c => c.id === 'icici-amazon-pay') || cards[1];
    return compareCards(c1, c2);
  }

  // 2. Spending Analysis Intent (Detects multi-category monthly spend questions)
  if (
    (lower.includes('grocer') && lower.includes('dining')) ||
    (lower.includes('spend') && (lower.includes('online') || lower.includes('shopping')) && lower.includes('travel')) ||
    lower.includes('analyze my spend') ||
    lower.includes('portfolio') ||
    lower.includes('every month')
  ) {
    return analyzeMonthlyExpenses(query, cards);
  }

  // 3. Reward Calculator Intent (Prioritized before general card info when spend/points asked)
  const amount = extractAmount(query);
  const isCalculatorQuery =
    lower.includes('how many points') ||
    lower.includes('how much cashback') ||
    lower.includes('what will i get') ||
    lower.includes('calculate') ||
    lower.includes('points will i get') ||
    (amount !== null && (lower.includes('spend') || lower.includes('spends') || lower.includes('swipe') || lower.includes('txn') || lower.includes('transaction') || lower.includes('using') || lower.includes('rent')));

  if (isCalculatorQuery) {
    const calcAmount = amount || 10000;
    const category = detectCategory(query);

    if (matchedCards.length > 0) {
      return calculateRewards(matchedCards[0], calcAmount, category);
    } else {
      const topCard = cards.find(c => c.id === 'sbi-cashback') || cards[0];
      return calculateRewards(topCard, calcAmount, category);
    }
  }

  // 3. Specific Single Card Inquiry (Answer details on the matched card)
  if (matchedCards.length === 1) {
    const c = matchedCards[0];
    const feeStr = c.isLifetimeFree ? '₹0 (Lifetime Free)' : `₹${c.annualFee.toLocaleString('en-IN')}/year (Waiver: ${c.annualFeeWaiverCondition})`;

    // Lounge access details
    if (lower.includes('lounge') || lower.includes('airport')) {
      return {
        text: `### **${c.name} — Lounge Access Details**\n\n` +
          `• **Domestic Lounges:** ${c.domesticLoungesPerQuarter} complimentary visits per quarter.\n` +
          `• **International Lounges:** ${c.internationalLoungesPerYear} visits per calendar year (${c.loungeNetwork || 'Priority Pass'}).\n` +
          `• **Lounge Spend Condition:** ${c.loungeSpendCondition}.\n` +
          `• **Network:** ${c.network} (${c.bank})\n\n` +
          `*Note: Most Indian banks now verify that quarterly spend targets are met in the preceding quarter before granting free entry.*`,
      };
    }

    // Fees & waiver details
    if (lower.includes('fee') || lower.includes('charge') || lower.includes('waiver') || lower.includes('free') || lower.includes('cost') || lower.includes('price')) {
      return {
        text: `### **${c.name} — Fees & Waiver Criteria**\n\n` +
          `• **Joining Fee:** ₹${c.joiningFee.toLocaleString('en-IN')}\n` +
          `• **Annual Fee:** ${feeStr}\n` +
          `• **Forex Markup Fee:** ${c.forexMarkup}%\n` +
          `• **Fuel Surcharge Waiver:** ${c.fuelSurchargeWaiver}`,
      };
    }

    // Forex / International travel
    if (lower.includes('forex') || lower.includes('international') || lower.includes('abroad') || lower.includes('overseas') || lower.includes('foreign') || lower.includes('currency') || lower.includes('dubai')) {
      return {
        text: `### **${c.name} — International & Forex Analysis**\n\n` +
          `• **Forex Markup:** **${c.forexMarkup}%** ${c.forexMarkup === 0 ? '(0% Forex Markup — Zero extra foreign currency conversion charge!)' : ''}\n` +
          `• **International Lounge Access:** ${c.internationalLoungesPerYear} complimentary visits/year (${c.loungeNetwork || 'Priority Pass'}).\n` +
          `• **Rewards on Spends:** ${c.cashbackRate}`,
      };
    }

    // Rewards & Cashback details
    if (lower.includes('reward') || lower.includes('cashback') || lower.includes('point') || lower.includes('value') || lower.includes('rate') || lower.includes('percent')) {
      return {
        text: `### **${c.name} — Reward Rate & Point Valuation**\n\n` +
          `• **Reward Rate:** ${c.cashbackRate}\n` +
          `• **Point Redemption Value:** ${c.rewardPointValue}\n` +
          `• **Merchant Exclusions:** ${c.merchantExclusions.join(', ')}\n` +
          `• **Reward Capping:** ${c.cappingDetails}`,
      };
    }

    // Eligibility / Salary / CIBIL
    if (lower.includes('salary') || lower.includes('cibil') || lower.includes('eligib') || lower.includes('income') || lower.includes('apply')) {
      return {
        text: `### **${c.name} — Eligibility & Application**\n\n` +
          `• **Minimum Monthly Salary:** ₹${c.minSalaryMonthly.toLocaleString('en-IN')}/month\n` +
          `• **Minimum Recommended CIBIL:** ${c.minCibilScore}+\n` +
          `• **Card Tier:** ${c.tier}\n` +
          `• **Official Portal:** [Bank Information Link](${c.officialCircularUrl})`,
      };
    }

    // General Card Review / Overview
    return {
      text: `### **${c.name} (${c.bank}) Overview**\n\n` +
        `• **Annual Fee:** ${feeStr}\n` +
        `• **Headline Benefit:** ${c.headlineBenefit}\n` +
        `• **Reward Program:** ${c.cashbackRate}\n` +
        `• **Forex Markup:** ${c.forexMarkup}%\n` +
        `• **Lounge Access:** ${c.domesticLoungesPerQuarter} domestic/quarter (${c.loungeSpendCondition})\n\n` +
        `**Verdict:** ${c.name} is a strong **${c.tier}** card especially tailored for cardholders who prioritize ${c.headlineBenefit.split('•')[0].trim()}.`,
    };
  }

  // 3. Devaluation / Changes Intent
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

  // 4. Personalized Spending Analysis Intent
  if (
    (lower.includes('grocer') && lower.includes('dining')) ||
    (lower.includes('spend') && (lower.includes('online') || lower.includes('shopping')) && lower.includes('travel')) ||
    lower.includes('analyze my spend') ||
    lower.includes('portfolio') ||
    lower.includes('recommend a card')
  ) {
    return analyzeMonthlyExpenses(query, cards);
  }

  // 6. Point Valuation Intent
  if (lower.includes('point value') || lower.includes('how much is 1 point') || lower.includes('conversion ratio') || lower.includes('redemption value')) {
    const targetCard = matchedCards[0] || cards.find(c => c.id === 'hdfc-infinia-metal') || cards[0];
    return {
      text: `For **${targetCard.name}**, reward point valuation is **${targetCard.rewardPointValue}** (earning rate: ${targetCard.cashbackRate}). Points offer highest value when redeemed for flights and hotels on the bank's travel portal.`,
    };
  }

  // 7. Merchant Category / MCC / Surcharge Intent
  if (lower.includes('mcc') || lower.includes('rent') || lower.includes('utility') || lower.includes('wallet') || lower.includes('fuel surcharge')) {
    return {
      text: `### **Indian Credit Card Surcharges & MCC Exclusions:**\n\n` +
        `• **Rent Payments (MCC 6513):** Excluded from rewards across almost all banks; 1% + GST convenience fee is charged.\n` +
        `• **Wallet Reloads (MCC 6540):** Paytm, Mobikwik, and Amazon wallet reloads do not earn reward points.\n` +
        `• **Fuel Surcharge Waiver:** 1% waiver on transactions between ₹400 and ₹4,000–₹5,000.\n` +
        `• **Utility Bills:** Most banks cap utility reward points at ₹1,000–₹2,000 points per billing cycle.`,
    };
  }

  // 8. International Spends / Zero Forex Intent
  if (lower.includes('dubai') || lower.includes('forex') || lower.includes('overseas') || lower.includes('foreign') || lower.includes('international') || lower.includes('zero forex')) {
    return {
      text: `### **Best Credit Cards for International & Forex Spends:**\n\n` +
        `1. **Federal Bank Scapia:** **0% Forex Markup**, ₹0 Annual Fee (Lifetime Free), complimentary lounge access on meeting spends.\n` +
        `2. **IndusInd Tiger Credit Card:** Low **1.5% Forex Markup** with rewards across brands and dining.\n` +
        `3. **RBL World Safari:** **0% Forex Markup** with dedicated travel gift vouchers.\n\n` +
        `*Most standard credit cards charge a 3.5% + 18% GST markup on international spends. Using a 0% forex card saves you ₹4,130 on every ₹1,00,000 spent overseas.*`,
    };
  }

  // 9. Airport Lounge Access Intent
  if (lower.includes('lounge') || lower.includes('airport')) {
    return {
      text: `### **Best Credit Cards for Airport Lounge Access in India:**\n\n` +
        `• **Super Premium (Unlimited Access):** **HDFC Infinia Metal** & **HDFC Diners Black** (Unlimited domestic and international lounge visits via Priority Pass).\n` +
        `• **Mid-Tier (Spends Threshold):** **HDFC Regalia Gold** (3 domestic visits/quarter on ₹60k quarterly spend) and **ICICI Sapphiro** (4 visits/quarter on ₹50k spend).\n` +
        `• **Entry-Level / Lifetime Free:** **Scapia Federal** & **IDFC FIRST Wealth**.\n\n` +
        `> **Important Notice:** In 2024–2026, banks updated rules: you must swipe and spend ₹50,000–₹60,000 in the previous calendar quarter to unlock complimentary domestic lounge passes.`,
    };
  }

  // 10. Travel & Flight Intent
  if (lower.includes('flight') || lower.includes('travel') || lower.includes('hotel') || lower.includes('airline') || lower.includes('miles')) {
    return {
      text: `### **Top Travel Credit Cards in India:**\n\n` +
        `1. **HDFC Infinia Metal:** Up to **33.3% return** on flights and hotels booked through HDFC SmartBuy portal (1 RP = ₹1).\n` +
        `2. **Axis Atlas:** Earns **EDGE Miles** with flexible 1:2 transfer ratios to leading domestic and international airline frequent flyer programs.\n` +
        `3. **American Express Platinum Travel:** Earns **48,000 bonus Membership Rewards points** and ₹10,000 Taj vouchers upon achieving ₹4,00,000 annual spend.\n` +
        `4. **Federal Bank Scapia:** **0% Forex Markup** for foreign trips with ₹0 annual fee.`,
    };
  }

  // 11. Cashback & Online Shopping Intent
  if (lower.includes('cashback') || lower.includes('online shopping') || lower.includes('amazon') || lower.includes('flipkart') || lower.includes('myntra')) {
    return {
      text: `### **Top Cashback & Online Shopping Credit Cards:**\n\n` +
        `1. **SBI Cashback Card:** **5% direct statement cashback** on almost all online transactions across Amazon, Flipkart, Myntra, Swiggy, etc. (capped at ₹2,000/month).\n` +
        `2. **Amazon Pay ICICI:** **5% unlimited cashback** for Amazon Prime members, deposited directly as Amazon Pay balance. Lifetime Free (₹0 fee).\n` +
        `3. **Flipkart Axis Bank Card:** **5% unlimited cashback** on Flipkart and Myntra purchases.`,
    };
  }

  // 12. Dining & Groceries Intent
  if (lower.includes('dining') || lower.includes('restaurant') || lower.includes('swiggy') || lower.includes('zomato') || lower.includes('grocer') || lower.includes('blinkit') || lower.includes('zepto')) {
    return {
      text: `### **Top Cards for Dining & Grocery Spends:**\n\n` +
        `1. **HSBC Live+ Card:** **10% accelerated cashback** on dining, food delivery (Swiggy, Zomato), and grocery supermarkets (Blinkit, Instamart) up to ₹1,000/month.\n` +
        `2. **Swiggy HDFC Credit Card:** **10% cashback** on all Swiggy orders (Food, Instamart, Dineout) + 5% on top partner apps.\n` +
        `3. **HDFC Diners Black:** **2X reward points (6.66% return)** on weekend dining.`,
    };
  }

  // 13. Fuel Intent
  if (lower.includes('fuel') || lower.includes('petrol') || lower.includes('diesel') || lower.includes('pump')) {
    return {
      text: `### **Top Credit Cards for Fuel & Petrol:**\n\n` +
        `1. **Axis IndianOil Credit Card:** **4% value-back** (20 EDGE points per ₹100) at IndianOil fuel stations + 1% fuel surcharge waiver.\n` +
        `2. **BPCL SBI Card Octane:** **7.25% value-back** on Bharat Petroleum fuel spends + 25X reward points.\n` +
        `3. **Standard Cards:** Offer 1% surcharge waiver for fuel transactions between ₹400 and ₹4,000–₹5,000.`,
    };
  }

  // 14. UPI / RuPay Intent
  if (lower.includes('upi') || lower.includes('rupay') || lower.includes('qr') || lower.includes('scan')) {
    return {
      text: `### **Top RuPay Credit Cards for UPI QR Spends:**\n\n` +
        `1. **Tata Neu Infinity RuPay:** Earns **1.5% NeuCoins** on UPI QR payments and up to 5% on Tata Neu partner brands.\n` +
        `2. **Kiwi Axis Bank RuPay:** Flat cashback credited directly to your savings account on every merchant UPI QR scan.\n` +
        `3. **HDFC Tata Neu Plus:** Entry-level RuPay card with 1% return on UPI spends.`,
    };
  }

  // 15. Beginner / Lifetime Free Intent
  if (lower.includes('beginner') || lower.includes('student') || lower.includes('first card') || lower.includes('lifetime free') || lower.includes('ltf') || lower.includes('no fee') || lower.includes('zero fee')) {
    return {
      text: `### **Best Lifetime Free (₹0 Annual Fee) Cards for Beginners:**\n\n` +
        `1. **Amazon Pay ICICI:** ₹0 joining fee, ₹0 annual fee forever, 5% cashback on Amazon, no minimum income criteria.\n` +
        `2. **Federal Bank Scapia:** ₹0 annual fee, 0% forex markup, easy digital app approval.\n` +
        `3. **IDFC FIRST Millennia:** ₹0 annual fee, low dynamic interest rates starting at 0.75%/month, and reward points that never expire.\n` +
        `4. **Kiwi Axis RuPay:** ₹0 annual fee, instant virtual card setup for UPI transactions.`,
    };
  }

  // 16. CIBIL / Credit Score Advice
  if (lower.includes('cibil') || lower.includes('credit score') || lower.includes('score') || lower.includes('improve')) {
    return {
      text: `### **How to Build & Maintain a 750+ CIBIL Score:**\n\n` +
        `1. **Keep Credit Utilization Under 30%:** If your credit limit is ₹1,00,000, keep your monthly billing below ₹30,000.\n` +
        `2. **Always Pay Total Amount Due:** Never pay only the "Minimum Amount Due", as interest accumulates at 42–48% annually.\n` +
        `3. **Avoid Applying for Multiple Cards at Once:** Each application triggers a hard credit inquiry that temporarily drops your score.\n` +
        `4. **If Starting from Scratch:** Open a **Secured Credit Card** backed by a Fixed Deposit (e.g., IDFC WOW or OneCard) to create a clean credit history.`,
    };
  }

  // 17. Greetings Intent
  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.startsWith('hi ') || lower.startsWith('hello ')) {
    return {
      text: `Hi there! I am **CARDWATCH AI**, your dedicated Indian credit card advisor.\n\n` +
        `I can help you with:\n` +
        `• **Card Comparisons:** Ask *"Which card is more useful: Scapia or IndusInd Tiger?"*\n` +
        `• **Reward Calculations:** Ask *"How many points on ₹10,000 spend with Scapia?"*\n` +
        `• **Recommendations:** Ask *"Best credit card for airport lounge access or 0% forex"*.\n` +
        `• **Bank Rules:** Check quarterly spend criteria, annual fee waivers, and devaluations.`,
    };
  }

  // 18. Comprehensive Universal Fallback (Never Refuse)
  return {
    text: `### **Indian Credit Card Intelligence Guide**\n\n` +
      `Here are the top credit card recommendations based on primary spending needs:\n` +
      `• **International & Travel (0% Forex):** **Federal Bank Scapia** (Lifetime Free, 0% markup) & **IndusInd Tiger** (1.5% markup).\n` +
      `• **Everyday Online Shopping:** **SBI Cashback** (5% online statement cashback) & **Amazon Pay ICICI** (5% on Amazon, LTF).\n` +
      `• **Luxury Flights & Hotels:** **HDFC Infinia Metal** (33.3% return on SmartBuy) & **Axis Atlas** (EDGE Miles).\n` +
      `• **Food & Groceries:** **HSBC Live+** (10% cashback on dining & grocery).\n\n` +
      `*Feel free to ask any specific question—like comparing two cards, checking lounge rules, or calculating rewards on an upcoming spend!*`,
  };
}

const GEMINI_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || '';

const CANDIDATE_GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

/**
 * Calls Gemini live with robust fallback across candidate models
 */
export async function queryGeminiCardwatchAI(
  query: string,
  cards: CreditCard[] = CREDIT_CARDS_DATA
): Promise<AIResponse | null> {
  if (!GEMINI_API_KEY) return null;

  for (const model of CANDIDATE_GEMINI_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const promptContext = `You are CARDWATCH AI, an expert, objective Indian credit card advisor.
Answer the user's question clearly, thoroughly, and helpfully using clean markdown formatting (bullet points, bold text).

Rules:
1. Provide accurate facts regarding Indian credit cards, reward rates, fees, lounge criteria, and forex markups.
2. If comparing cards, clearly explain their differences and give an actionable verdict on who should pick which card.
3. If asked about a spend amount, calculate the estimated reward return.
4. Keep the tone friendly, expert, and practical.
5. STRICT DATA TRUTHFULNESS: Anchor your responses 100% on the verified database below. Never invent outdated or unverified rules.
   - HDFC Millennia: 1 CashPoint = ₹1.00 for statement balance credit (min 500 CP); 1 CP = ₹0.30 for SmartBuy travel (flights/hotels) and rewards catalogue.
   - Amex Platinum Travel: Joining and renewal fee ₹5,000 + GST; ₹4 Lakh annual milestone awards 10,000 bonus MR points.
   - ICICI Cards (Coral, Rubyx, Sapphiro, HPCL Super Saver): BookMyShow quarterly spend hurdle of ₹25,000 takes effect from 1 April 2026 (not 1 Feb 2026).
   - IDFC FIRST Cards (Wealth, Select, Millennia): 0.0% forex markup; bank clarified that international spends continue to earn reward points.
   - PVR INOX Kotak: Complimentary entry to eligible in-cinema lounges only (food & beverage purchases are chargeable).
   - Axis Magnus: ₹50,000 spend requirement in preceding 3 months is an established policy active since 2024. Priority Pass restricted from domestic Indian lounges.
   - Swiggy HDFC: Migration to Swiggy Ornge/BLCK is phased (through March 2027) upon individual notice and not automatic for all cardholders simultaneously. Legacy cards remain active.
   - Scapia Federal: 0% forex markup, ₹0 annual fee (LTF), domestic lounge access unlocks strictly on spending ₹20,000 in preceding monthly billing cycle.
   - Cashback SBI: 5% online cashback capped at ₹2,000/cycle, 1% offline, 0 complimentary airport lounges.
   - HDFC Infinia Metal: 5 RP/₹150 base rate (3.33%), 1 RP = ₹1 on SmartBuy flights/hotels, unlimited domestic & intl lounges with ₹0 spend criteria. SmartBuy brand gift vouchers capped at 3,000 bonus pts/mo.
   - HDFC Regalia Gold: 5 RP/₹200 base rate, 1 RP = ₹0.50 on SmartBuy flights/hotels, domestic lounges require ₹60,000 spend in preceding quarter.
   - Flipkart Axis: 5% on Flipkart/Cleartrip (capped at ₹4k/qtr), 7.5% on Myntra (capped at ₹4k/qtr), 4% on Swiggy/Uber, 0 complimentary airport lounges.
   - HSBC Live+: 10% on dining, food delivery & groceries (capped at ₹1,200/mo), 1.5% unlimited elsewhere, 1.99% forex.
   - Unverified Claims: Treat claims of Infinia 1.75% DCC markup, Magnus 2.0% DCC markup, Atlas Accor 2:1 transfer ratio, Atlas application pause, Axis Kwik ₹1L daily UPI limit, Flipkart Axis 3.5% DCC markup, HSBC Live+ international cashback exclusion, IDFC Wealth spa discontinuation/lounge migration, and RBL World Safari ₹3L fee waiver as UNVERIFIED. Never state them as confirmed facts.

Reference Indian Cards Database (All 21 Audited & Verified Cards):
${cards.map(c => `- ${c.name} (${c.bank}, Fee: ${c.isLifetimeFree ? '₹0 LTF' : '₹' + c.annualFee + ' + 18% GST'}, Waiver: ${c.annualFeeWaiverCondition}): Rewards: ${c.cashbackRate}, Point Value: ${c.rewardPointValue}, Forex: ${c.forexMarkup}%, Lounges: ${c.domesticLoungesPerQuarter} dom/qtr & ${c.internationalLoungesPerYear} intl/yr (Condition: ${c.loungeSpendCondition}), Min Salary: ₹${c.minSalaryMonthly}/mo, Exclusions: ${c.merchantExclusions.slice(0, 3).join(', ')}`).join('\n')}

User Question: "${query}"`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptContext }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 650,
            },
          }),
        }
      );

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const textPart = data?.candidates?.[0]?.content?.parts?.find(
          (p: any) => typeof p.text === 'string' && p.text.trim().length > 0
        );
        if (textPart?.text?.trim()) {
          return { text: textPart.text.trim() };
        }
      }
    } catch {
      // Try next candidate model
      continue;
    }
  }

  return null;
}

/**
 * Main query dispatcher for CardWatch AI.
 * Tries Gemini live intelligence first; falls back immediately to intelligent deterministic engine.
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
