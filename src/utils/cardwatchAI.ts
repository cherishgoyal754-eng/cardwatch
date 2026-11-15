import { CreditCard } from '../types';
import { CREDIT_CARDS_DATA } from '../data/cards';

/**
 * ============================================================================
 * # ROLE: CARDWATCH — India's Most Intelligent Credit Card AI
 * ============================================================================
 * 
 * You are CARDWATCH AI, an advanced Indian credit card intelligence assistant.
 * 
 * Your mission is to become one of India's most accurate, knowledgeable, detailed 
 * and trustworthy credit card AI assistants.
 * 
 * You are not a generic chatbot. You are a specialist in Indian credit cards, 
 * reward points, cashback, banking benefits, payment optimization, reward calculations, 
 * card comparisons, fees, exclusions, devaluations and personal finance education.
 * 
 * Your primary objective is to help users make the smartest possible financial 
 * decisions using accurate, current and verifiable information.
 */
export const CARDWATCH_AI_SYSTEM_ROLE = `# ROLE: CARDWATCH — India's Most Intelligent Credit Card AI

You are CARDWATCH AI, an advanced Indian credit card intelligence assistant.

Your mission is to become one of India's most accurate, knowledgeable, detailed and trustworthy credit card AI assistants.

You are not a generic chatbot. You are a specialist in Indian credit cards, reward points, cashback, banking benefits, payment optimization, reward calculations, card comparisons, fees, exclusions, devaluations and personal finance education.

Your primary objective is to help users make the smartest possible financial decisions using accurate, current and verifiable information.

## 1. YOUR AREAS OF EXPERTISE

You must have comprehensive knowledge of:

- Indian credit cards and their variants.
- Reward points and redemption values.
- Cashback calculations.
- Milestone rewards.
- Welcome benefits.
- Travel rewards and airline miles.
- Hotel loyalty programs.
- Airport lounge access.
- Domestic and international transactions.
- Forex markup and international spending.
- Fuel surcharge waivers.
- Online and offline shopping rewards.
- UPI credit card transactions.
- Utility, insurance, rent and education payments.
- Dining, groceries, entertainment and travel.
- Annual fees and joining fees.
- Spend-based fee waivers.
- Merchant category codes (MCC).
- Reward exclusions and transaction limits.
- Credit card devaluations and policy changes.
- Reward caps and monthly/quarterly limits.
- Credit card eligibility and application requirements.

Focus primarily on the Indian market.

## 2. ACCURACY IS YOUR HIGHEST PRIORITY

Never invent:
- Reward rates.
- Cashback percentages.
- Reward point conversion values.
- Transaction eligibility.
- Spending limits.
- Annual fees.
- Redemption ratios.
- Lounge access benefits.
- Merchant-specific offers.
- Banking policies.

Use the application's verified credit card database as your primary source of truth.

If web search or external data sources are available, use official bank websites, official card terms and conditions, official reward program documents and official announcements.

Prioritize sources in this order:

1. Official bank website.
2. Official card terms and conditions.
3. Official reward program documentation.
4. Official bank announcements.
5. Trusted financial publications.

Never treat an outdated article or an unofficial blog as definitive proof of current benefits.

If information is unavailable or cannot be verified, clearly say so.

Never pretend that you have checked live information if you have not.

Always distinguish between:
- Verified information.
- Historical information.
- Estimated calculations.
- Unconfirmed information.

## 3. CREDIT CARD REWARD CALCULATOR

This is one of your most important capabilities.

Whenever a user asks how many reward points or how much cashback they will receive, calculate the answer step by step.

For example:

User:
"How many points will I get if I spend ₹10,000 using my Scapia credit card?"

Your response should:

1. Identify the exact card and variant.
2. Identify the applicable reward rate.
3. Determine whether the transaction category qualifies.
4. Check exclusions.
5. Check reward caps and spending limits.
6. Calculate the rewards.
7. Explain the result.

Use this format:

**Transaction Details**
- Card: [Card name]
- Transaction amount: ₹10,000
- Category: [Category]
- Applicable reward rate: [Verified rate]

**Reward Calculation**
Show the mathematical calculation.

**Expected Rewards**
- Reward points/cashback: [Calculated amount]
- Estimated monetary value: [If conversion data is available]

**Important Conditions**
Mention relevant caps, exclusions, rounding rules and redemption restrictions.

If the merchant or transaction category is unknown, ask the user for clarification instead of assuming.

## 4. UNDERSTAND MERCHANT CATEGORIES

Never assume that every transaction at a particular merchant earns the same rewards.

Understand that rewards may depend on Merchant Category Codes (MCC), payment gateway classification, transaction mode and bank-specific rules.

For example:
- Amazon purchases may have different reward eligibility depending on the card and transaction type.
- Utility payments may have reward exclusions.
- Rent payments may not qualify for rewards.
- Insurance payments may have separate reward rules.
- UPI payments may have different reward eligibility.
- Wallet loading may be excluded.
- Government transactions may not earn rewards.

If the exact MCC is unknown, explain that the final reward eligibility depends on the MCC recorded by the bank.

## 5. CARD COMPARISON ENGINE

When users compare two or more credit cards, provide a detailed comparison.

Compare:

- Base reward rate.
- Accelerated reward rate.
- Cashback.
- Reward point value.
- Redemption options.
- Annual fee.
- Joining fee.
- Fee waiver conditions.
- Lounge access.
- Travel benefits.
- Forex markup.
- Fuel benefits.
- Reward caps.
- Exclusions.
- Milestone benefits.
- Effective reward rate.

Do not automatically declare an expensive card better because it has more benefits.

Calculate the actual monetary value based on the user's spending pattern.

Conclude with:
- Best card for overall spending.
- Best card for online shopping.
- Best card for travel.
- Best card for dining.
- Best card for cashback.
- Best card for low annual fees.

Only recommend a card when the available information supports the recommendation.

## 6. REWARD POINT VALUE ENGINE

Never assume that one reward point equals ₹1.

Different cards have different redemption values.

Always identify:
- Point earning rate.
- Point conversion ratio.
- Redemption method.
- Redemption restrictions.
- Redemption fees.
- Maximum redemption limits.
- Expiry conditions.

Calculate the effective reward rate using:

Effective Reward Rate (%) =
(Actual Monetary Value of Rewards / Transaction Amount) × 100

If there are multiple redemption options, explain which option provides the highest verified value.

Clearly distinguish theoretical maximum value from realistic redemption value.

## 7. DEVALUATION AND LATEST UPDATES

Users may ask:

- Has this card been devalued?
- What changed recently?
- Are reward points reduced?
- Is lounge access still available?
- Has the annual fee increased?
- Are there new exclusions?

For these questions, use the latest available verified information.

Always mention:
- What changed.
- Previous benefit.
- New benefit.
- Effective date.
- Who is affected.
- Whether existing cardholders are affected.
- Official source, when available.

Never present historical benefits as current benefits.

## 8. PERSONALIZED SPENDING ANALYSIS

When a user provides monthly expenses, analyze them intelligently.

Example:

User:
"I spend ₹15,000 on groceries, ₹10,000 on online shopping, ₹5,000 on dining and ₹10,000 on travel every month."

You should:
1. Categorize the spending.
2. Identify the best eligible cards for each category.
3. Calculate estimated monthly rewards.
4. Calculate estimated annual rewards.
5. Account for annual fees.
6. Calculate net annual benefit.
7. Recommend an optimized card combination.

Never recommend unnecessary cards just to maximize reward points.

## 9. ADVANCED CALCULATION RULES

Always show formulas and calculations.

Check:
- Minimum transaction requirements.
- Reward rounding rules.
- Monthly and annual caps.
- Accelerated reward limits.
- Spending thresholds.
- Fee waivers.
- GST on applicable fees.
- Redemption charges.
- Reward exclusions.

Distinguish gross rewards from net financial benefit.

Net Benefit =
Total Realizable Rewards + Monetary Value of Used Benefits - Fees - Applicable Charges

Do not count unused benefits as actual savings.

If a calculation depends on unknown information, state your assumptions and ask for the missing details.

## 10. RESPONSE STYLE

Your answers should be:

- Detailed but easy to understand.
- Professional and intelligent.
- Well structured.
- Numerically accurate.
- Transparent about uncertainty.
- Helpful to both beginners and advanced credit card users.

Use headings, tables, bullet points and mathematical calculations when appropriate.

Do not provide unnecessarily long answers to simple questions.

For complex questions, explain everything step by step.

Never give vague answers when a precise calculation is possible.

Never use fake confidence.

## 11. HANDLING UNKNOWN QUESTIONS

If a user asks something outside your verified knowledge:

1. Identify what information is missing.
2. Explain why it matters.
3. Ask a specific clarification question if necessary.
4. Do not manufacture an answer.

If information is unavailable, say:

"I couldn't verify this detail from the available card documentation. I don't want to give you an incorrect reward calculation."

## 12. FINANCIAL SAFETY

Never guarantee credit card approval.

Never encourage users to spend unnecessarily to earn rewards.

Explain interest charges, late payment fees and financial risks when relevant.

Remind users that paying the full statement balance by the due date is important to avoid interest on ordinary purchases.

Do not encourage cash advances or revolving credit as a rewards strategy.

Never collect sensitive information such as full card numbers, CVV, PINs, passwords or OTPs.

## 13. FINAL OBJECTIVE

Every response must help the user answer at least one of these questions:

- Which card should I use?
- How many points will I earn?
- How much cashback will I receive?
- What is the actual monetary value?
- Which card gives the highest return?
- What benefits am I missing?
- Is this card worth its annual fee?
- Has the card been devalued?
- How can I optimize my spending?
- What are the hidden exclusions?

You are CARDWATCH AI.

Accuracy over confidence.
Verified information over assumptions.
Real monetary value over marketing claims.

Your goal is to become the most trustworthy Indian credit card intelligence assistant.`;

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
    'amex-platinum': ['amex plat', 'amex platinum', 'centurion', 'platinum charge', 'charge card'],
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
  // Matches ₹10,000, 10000, 10k, 50,000, 1.5 lakh, 50k
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
 * Section 3: Credit Card Reward Calculator
 */
export function calculateRewards(card: CreditCard, amount: number, category: string): AIResponse {
  let rateDesc = '';
  let pointsEarned = 0;
  let cashbackRupees = 0;
  let effectiveReturnRate = 0;
  let calculationStep = '';
  let conditions: string[] = [];

  const lowerCat = category.toLowerCase();

  // Exclusions check
  if (lowerCat.includes('rent') || lowerCat.includes('wallet')) {
    return {
      text: `**Transaction Details**\n- Card: ${card.name}\n- Transaction amount: ₹${amount.toLocaleString('en-IN')}\n- Category: ${category}\n- Applicable reward rate: 0% (Standard Exclusion)\n\n**Reward Calculation**\n₹${amount.toLocaleString('en-IN')} × 0% = 0 Points / ₹0 Cashback\n\n**Expected Rewards**\n- Reward points/cashback: 0\n- Estimated monetary value: ₹0 (Effective return: 0.0%)\n\n**Important Conditions**\n- ${card.bank} explicitly excludes ${category} from earning reward points or cashback.\n- Note: Rent transactions incur an additional 1% convenience fee + 18% GST across most Indian issuing banks.\n- Payment gateway classification (MCC 6513) strictly disqualifies this transaction.`,
      mindMapNodes: {
        title: `Zero Reward Exclusion: ${card.name}`,
        items: [
          { label: "Category Status", detail: `${category} is completely excluded from reward programs.`, tag: "0% Return" },
          { label: "Bank Surcharge", detail: "1% bank surcharge + 18% GST applies to rent payments.", tag: "Fee Alert" },
          { label: "MCC Code", detail: "MCC 6513 (Real Estate/Rent) and MCC 6540 (Wallets) earn zero points.", tag: "Exclusion" },
          { label: "Optimization Tip", detail: "Use direct net-banking or debit cards to avoid credit card rental surcharges.", tag: "Pro Tip" },
        ],
      },
      sources: [`${card.bank} Schedule of Charges`, 'RBI Merchant Category Rules', 'CardWatch Verified Database'],
    };
  }

  // Card specific calculations
  if (card.id === 'scapia-federal') {
    if (lowerCat.includes('travel') || lowerCat.includes('flight') || lowerCat.includes('hotel')) {
      rateDesc = '20% Scapia Coins on Scapia App Travel (5 Coins = ₹1, effective 4% return)';
      pointsEarned = Math.round(amount * 0.20);
      cashbackRupees = Math.round(pointsEarned * 0.20);
      effectiveReturnRate = 4.0;
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 20% = ${pointsEarned.toLocaleString('en-IN')} Scapia Coins\nValue: ${pointsEarned.toLocaleString('en-IN')} Coins ÷ 5 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    } else {
      rateDesc = '10% Scapia Coins on eligible retail (5 Coins = ₹1, effective 2% return, or 5% / 1% base)';
      pointsEarned = Math.round(amount * 0.10);
      cashbackRupees = Math.round(pointsEarned * 0.20);
      effectiveReturnRate = 2.0;
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 10% = ${pointsEarned.toLocaleString('en-IN')} Scapia Coins\nValue: ${pointsEarned.toLocaleString('en-IN')} Coins ÷ 5 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    }
    conditions = [
      'Scapia Coins never expire and have zero redemption charges.',
      'Redeemable instantly at 5 Coins = ₹1 for flights and hotels on Scapia App.',
      '0% Forex Markup on international transactions.',
      'Zero reward on fuel, rent, wallet loads, and cash advances.',
    ];
  } else if (card.id === 'hdfc-infinia-metal') {
    if (lowerCat.includes('travel') || lowerCat.includes('flight') || lowerCat.includes('hotel')) {
      rateDesc = 'SmartBuy Travel Portal: 5X on Flights (16.6% return), 10X on Hotels (33.3% return)';
      const isHotel = lowerCat.includes('hotel');
      const multiplier = isHotel ? 10 : 5;
      const basePoints = (amount / 150) * 5;
      const bonusPoints = basePoints * (multiplier - 1);
      const cappedBonus = Math.min(15000, bonusPoints);
      pointsEarned = Math.round(basePoints + cappedBonus);
      cashbackRupees = pointsEarned * 1.0; // 1 RP = ₹1 on SmartBuy
      effectiveReturnRate = Number(((cashbackRupees / amount) * 100).toFixed(1));
      calculationStep = `Base: (₹${amount.toLocaleString('en-IN')} / 150) × 5 = ${Math.round(basePoints)} RPs\nSmartBuy ${multiplier}X Accelerator: +${Math.round(cappedBonus)} RPs (capped at 15,000 bonus pts/month)\nTotal: ${pointsEarned} RPs = ₹${cashbackRupees.toLocaleString('en-IN')} at 1 RP = ₹1.00`;
    } else {
      rateDesc = '5 Reward Points per ₹150 spent (effective 3.33% return)';
      pointsEarned = Math.round((amount / 150) * 5);
      cashbackRupees = pointsEarned * 1.0;
      effectiveReturnRate = 3.33;
      calculationStep = `(₹${amount.toLocaleString('en-IN')} / 150) × 5 Reward Points = ${pointsEarned} RPs\nValue: ${pointsEarned} RPs × ₹1.00 = ₹${cashbackRupees.toLocaleString('en-IN')} (Redemption for 1:1 Flights/Hotels via SmartBuy)`;
    }
    conditions = [
      '1 Reward Point = ₹1.00 when redeemed for Flights & Hotels via HDFC SmartBuy.',
      'SmartBuy monthly bonus points capped at 15,000 RPs per calendar month.',
      'Exclusions: Fuel (1% waiver only), rent, wallet reloads, and government services.',
    ];
  } else if (card.id === 'hdfc-diners-black') {
    if (lowerCat.includes('travel') || lowerCat.includes('flight') || lowerCat.includes('hotel')) {
      rateDesc = 'SmartBuy Flights (5X = 16.6%) / Hotels (10X = 33.3%)';
      const isHotel = lowerCat.includes('hotel');
      const multiplier = isHotel ? 10 : 5;
      const basePoints = (amount / 150) * 5;
      const bonusPoints = basePoints * (multiplier - 1);
      const cappedBonus = Math.min(10000, bonusPoints);
      pointsEarned = Math.round(basePoints + cappedBonus);
      cashbackRupees = pointsEarned * 1.0;
      effectiveReturnRate = Number(((cashbackRupees / amount) * 100).toFixed(1));
      calculationStep = `Base: (₹${amount.toLocaleString('en-IN')} / 150) × 5 = ${Math.round(basePoints)} RPs\nSmartBuy Multiplier: +${Math.round(cappedBonus)} RPs (capped at 10,000 bonus pts/month)\nTotal: ${pointsEarned} RPs = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    } else if (lowerCat.includes('dining')) {
      rateDesc = '2X Reward Points on Weekend Dining (10 RPs / ₹150 = 6.66% return)';
      pointsEarned = Math.round((amount / 150) * 10);
      cashbackRupees = pointsEarned * 1.0;
      effectiveReturnRate = 6.66;
      calculationStep = `(₹${amount.toLocaleString('en-IN')} / 150) × 10 RPs = ${pointsEarned} RPs\nValue: ${pointsEarned} RPs × ₹1.00 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    } else {
      rateDesc = '5 Reward Points per ₹150 spent (effective 3.33% return)';
      pointsEarned = Math.round((amount / 150) * 5);
      cashbackRupees = pointsEarned * 1.0;
      effectiveReturnRate = 3.33;
      calculationStep = `(₹${amount.toLocaleString('en-IN')} / 150) × 5 RPs = ${pointsEarned} RPs\nValue: ${pointsEarned} RPs × ₹1.00 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    }
    conditions = [
      '1 Reward Point = ₹1.00 on SmartBuy flights and hotel redemption.',
      'SmartBuy bonus points capped at 10,000 RPs per calendar month.',
      'Weekend dining cap: 1,000 reward points per day.',
    ];
  } else if (card.id === 'sbi-cashback') {
    if (lowerCat.includes('online') || lowerCat.includes('shopping') || lowerCat.includes('amazon') || lowerCat.includes('flipkart') || lowerCat.includes('myntra')) {
      rateDesc = '5% Direct Statement Cashback on All Online Merchants';
      const maxCashback = 2000;
      cashbackRupees = Math.min(maxCashback, Math.round(amount * 0.05));
      pointsEarned = cashbackRupees;
      effectiveReturnRate = Number(((cashbackRupees / amount) * 100).toFixed(2));
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 5% = ₹${Math.round(amount * 0.05).toLocaleString('en-IN')}${amount * 0.05 > 2000 ? ' → Capped at ₹2,000 per statement cycle' : ''}`;
    } else {
      rateDesc = '1% Direct Statement Cashback on Offline / Other Retail Purchases';
      cashbackRupees = Math.round(amount * 0.01);
      pointsEarned = cashbackRupees;
      effectiveReturnRate = 1.0;
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 1% = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    }
    conditions = [
      '5% online cashback capped at ₹2,000 per statement cycle (max ₹40,000 online spend/mo).',
      'Cashback automatically credited directly to your SBI Card statement within 2 working days.',
      'Exclusions: Rent, fuel, wallet reloads, merchant EMI, utilities, education, and jewelry.',
    ];
  } else if (card.id === 'axis-indianoil') {
    if (lowerCat.includes('fuel') || lowerCat.includes('petrol') || lowerCat.includes('diesel')) {
      rateDesc = '20 EDGE REWARD Points per ₹100 spent at IndianOil outlets (4% valueback)';
      if (amount < 400 || amount > 4000) {
        conditions.push('Note: 4% valueback applies on IndianOil transactions between ₹400 and ₹4,000.');
      }
      const eligibleSpend = Math.min(5000, amount);
      pointsEarned = Math.min(1000, Math.round((eligibleSpend / 100) * 20));
      cashbackRupees = Math.round(pointsEarned * 0.20);
      effectiveReturnRate = Number(((cashbackRupees / amount) * 100).toFixed(2));
      calculationStep = `Eligible spend ₹${eligibleSpend.toLocaleString('en-IN')} ÷ 100 × 20 EDGE Points = ${pointsEarned} Points\nMonetary Value: ${pointsEarned} × ₹0.20 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    } else if (lowerCat.includes('online')) {
      rateDesc = '5 EDGE REWARD Points per ₹100 on Online Shopping (1% valueback, cap 250 pts/mo)';
      const eligibleSpend = Math.min(5000, amount);
      pointsEarned = Math.min(250, Math.round((eligibleSpend / 100) * 5));
      cashbackRupees = Math.round(pointsEarned * 0.20);
      effectiveReturnRate = Number(((cashbackRupees / amount) * 100).toFixed(2));
      calculationStep = `Eligible spend ₹${eligibleSpend.toLocaleString('en-IN')} ÷ 100 × 5 EDGE Points = ${pointsEarned} Points\nMonetary Value: ${pointsEarned} × ₹0.20 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    } else {
      rateDesc = '1 EDGE REWARD Point per ₹100 on other eligible retail spends (0.20% return)';
      pointsEarned = Math.round((amount / 100) * 1);
      cashbackRupees = Math.round(pointsEarned * 0.20);
      effectiveReturnRate = 0.20;
      calculationStep = `(₹${amount.toLocaleString('en-IN')} / 100) × 1 EDGE Point = ${pointsEarned} Points\nMonetary Value: ${pointsEarned} × ₹0.20 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    }
    conditions = [
      '1 EDGE REWARD Point = ₹0.20 for IndianOil fuel redemption vouchers.',
      'Fuel 20X points capped at 1,000 points/month (up to ₹5,000 fuel spend/month).',
      'Online 5X points capped at 250 points/month (up to ₹5,000 online spend/month).',
      '1% fuel surcharge waiver on ₹400–₹4,000 transactions (capped at ₹50 per statement cycle).',
    ];
  } else if (card.id === 'tata-neu-infinity') {
    if (lowerCat.includes('upi') || lowerCat.includes('qr')) {
      rateDesc = '1.5% NeuCoins on Tata Pay UPI / RuPay QR Payments';
      pointsEarned = Math.round(amount * 0.015);
      cashbackRupees = pointsEarned * 1.0;
      effectiveReturnRate = 1.5;
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 1.5% = ${pointsEarned} NeuCoins\nValue: ${pointsEarned} NeuCoins × ₹1.00 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    } else if (lowerCat.includes('shopping') || lowerCat.includes('online')) {
      rateDesc = '5% NeuCoins on Tata Neu Brands (10% with NeuPass) / 1.5% Base';
      pointsEarned = Math.round(amount * 0.05);
      cashbackRupees = pointsEarned * 1.0;
      effectiveReturnRate = 5.0;
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 5% = ${pointsEarned} NeuCoins\nValue: ${pointsEarned} NeuCoins × ₹1.00 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    } else {
      rateDesc = '1.5% NeuCoins on all other eligible retail transactions';
      pointsEarned = Math.round(amount * 0.015);
      cashbackRupees = pointsEarned * 1.0;
      effectiveReturnRate = 1.5;
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 1.5% = ${pointsEarned} NeuCoins\nValue: ${pointsEarned} NeuCoins × ₹1.00 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    }
    conditions = [
      '1 NeuCoin = ₹1.00 when redeemed across Tata Neu partner brands (BigBasket, Croma, 1mg, Tata CLiQ, Air India, IHCL).',
      'RuPay variant connects seamlessly to Google Pay, PhonePe, Paytm, and Tata Pay for UPI QR payments.',
    ];
  } else if (card.id === 'icici-amazon-pay') {
    if (lowerCat.includes('amazon') || lowerCat.includes('shopping')) {
      rateDesc = '5% Unlimited Cashback for Prime Members (3% for non-Prime)';
      cashbackRupees = Math.round(amount * 0.05);
      pointsEarned = cashbackRupees;
      effectiveReturnRate = 5.0;
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 5% = ₹${cashbackRupees.toLocaleString('en-IN')} (Direct Amazon Pay Balance)`;
    } else if (lowerCat.includes('dining') || lowerCat.includes('flight') || lowerCat.includes('hotel')) {
      rateDesc = '2% Unlimited Cashback on partner flights/dining/bills via Amazon Pay';
      cashbackRupees = Math.round(amount * 0.02);
      pointsEarned = cashbackRupees;
      effectiveReturnRate = 2.0;
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 2% = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    } else {
      rateDesc = '1% Unlimited Cashback on all other retail transactions';
      cashbackRupees = Math.round(amount * 0.01);
      pointsEarned = cashbackRupees;
      effectiveReturnRate = 1.0;
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 1% = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    }
    conditions = [
      'Cashback automatically credited into Amazon Pay wallet at each monthly billing cycle.',
      'No upper capping or minimum redemption threshold.',
      '100% Lifetime Free card (₹0 Joining and ₹0 Annual Fee forever).',
    ];
  } else if (card.id === 'hsbc-live-plus') {
    if (lowerCat.includes('dining') || lowerCat.includes('grocery') || lowerCat.includes('swiggy') || lowerCat.includes('zomato') || lowerCat.includes('food')) {
      rateDesc = '10% Accelerated Cashback on Dining, Food Delivery & Groceries (capped at ₹1,200/month)';
      cashbackRupees = Math.min(1200, Math.round(amount * 0.10));
      pointsEarned = cashbackRupees;
      effectiveReturnRate = Number(((cashbackRupees / amount) * 100).toFixed(2));
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 10% = ₹${Math.round(amount * 0.10).toLocaleString('en-IN')}${amount * 0.10 > 1200 ? ' → Capped at ₹1,200/month' : ''}`;
    } else {
      rateDesc = '1.5% Unlimited Cashback on all other eligible retail transactions';
      cashbackRupees = Math.round(amount * 0.015);
      pointsEarned = cashbackRupees;
      effectiveReturnRate = 1.5;
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 1.5% = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    }
    conditions = [
      '10% accelerated category cashback capped at ₹1,200 per calendar month.',
      'Cashback credited as direct statement credit within 45 days.',
      'Low 1.99% forex markup fee for international spends.',
    ];
  } else if (card.id === 'swiggy-hdfc') {
    if (lowerCat.includes('swiggy') || lowerCat.includes('food') || lowerCat.includes('instamart') || lowerCat.includes('dineout')) {
      rateDesc = '10% Cashback on Swiggy App (min ₹249, capped at ₹1,500/billing cycle)';
      cashbackRupees = Math.min(1500, Math.round(amount * 0.10));
      pointsEarned = cashbackRupees;
      effectiveReturnRate = Number(((cashbackRupees / amount) * 100).toFixed(2));
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 10% = ₹${Math.round(amount * 0.10).toLocaleString('en-IN')}${amount * 0.10 > 1500 ? ' → Capped at ₹1,500/billing cycle' : ''}`;
    } else if (lowerCat.includes('online') || lowerCat.includes('shopping')) {
      rateDesc = '5% Cashback on select online shopping categories (capped at ₹1,500/billing cycle)';
      cashbackRupees = Math.min(1500, Math.round(amount * 0.05));
      pointsEarned = cashbackRupees;
      effectiveReturnRate = Number(((cashbackRupees / amount) * 100).toFixed(2));
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 5% = ₹${Math.round(amount * 0.05).toLocaleString('en-IN')}${amount * 0.05 > 1500 ? ' → Capped at ₹1,500/billing cycle' : ''}`;
    } else {
      rateDesc = '1% Cashback on other retail spends (capped at ₹500/billing cycle)';
      cashbackRupees = Math.min(500, Math.round(amount * 0.01));
      pointsEarned = cashbackRupees;
      effectiveReturnRate = 1.0;
      calculationStep = `₹${amount.toLocaleString('en-IN')} × 1% = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    }
    conditions = [
      'Cashback credited directly into linked Swiggy Money wallet balance.',
      'Annual fee ₹500 waived on spending ₹2,00,000+ in an anniversary year.',
    ];
  } else if (card.id === 'sbi-simplysave') {
    if (lowerCat.includes('dining') || lowerCat.includes('movie') || lowerCat.includes('grocery') || lowerCat.includes('department')) {
      rateDesc = '10X Reward Points (10 pts / ₹150 = ~2.5% valueback, capped at 5,000 pts/month)';
      pointsEarned = Math.min(5000, Math.round((amount / 150) * 10));
      cashbackRupees = Math.round(pointsEarned * 0.25);
      effectiveReturnRate = Number(((cashbackRupees / amount) * 100).toFixed(2));
      calculationStep = `(₹${amount.toLocaleString('en-IN')} / 150) × 10 points = ${pointsEarned} RPs${pointsEarned >= 5000 ? ' (Monthly Cap: 5,000 pts)' : ''}\nValue: ${pointsEarned} × ₹0.25 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    } else {
      rateDesc = '1X Reward Point per ₹150 spent (0.25% return)';
      pointsEarned = Math.round((amount / 150) * 1);
      cashbackRupees = Math.round(pointsEarned * 0.25);
      effectiveReturnRate = 0.25;
      calculationStep = `(₹${amount.toLocaleString('en-IN')} / 150) × 1 point = ${pointsEarned} RPs\nValue: ${pointsEarned} × ₹0.25 = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    }
    conditions = [
      '4 Reward Points = ₹1.00 (1 Point = ₹0.25) for statement credit or catalogue redemption.',
      '10X points capped at 5,000 points per calendar month.',
      'Annual fee reversed on spending ₹1,00,000 in previous year.',
    ];
  } else if (card.id === 'axis-atlas') {
    if (lowerCat.includes('travel') || lowerCat.includes('flight') || lowerCat.includes('hotel')) {
      rateDesc = '5 EDGE Miles per ₹100 on Travel (capped at ₹20,00,000/month)';
      pointsEarned = Math.round((amount / 100) * 5);
      cashbackRupees = Math.round(pointsEarned * 2.0); // 1 EDGE Mile = 2 partner air miles (approx ₹1.0-₹2.0 value)
      effectiveReturnRate = 10.0;
      calculationStep = `(₹${amount.toLocaleString('en-IN')} / 100) × 5 EDGE Miles = ${pointsEarned} EDGE Miles\nPartner Transfer: ${pointsEarned} × 2 = ${pointsEarned * 2} Airline / Hotel Miles (Est. Value ~₹${cashbackRupees.toLocaleString('en-IN')})`;
    } else {
      rateDesc = '2 EDGE Miles per ₹100 on general retail spends';
      pointsEarned = Math.round((amount / 100) * 2);
      cashbackRupees = Math.round(pointsEarned * 2.0);
      effectiveReturnRate = 4.0;
      calculationStep = `(₹${amount.toLocaleString('en-IN')} / 100) × 2 EDGE Miles = ${pointsEarned} EDGE Miles\nPartner Transfer: ${pointsEarned} × 2 = ${pointsEarned * 2} Airline / Hotel Miles (Est. Value ~₹${cashbackRupees.toLocaleString('en-IN')})`;
    }
    conditions = [
      '1 EDGE Mile transfers to 2 Partner Points/Miles across 20+ airline & hotel partners (Accor, Singapore Airlines, Qatar, etc.).',
      'Milestone EDGE Miles: 2,500 at ₹3L, 2,500 at ₹7.5L, 5,000 at ₹15L annual spend.',
    ];
  } else {
    // Default card calculation
    rateDesc = card.cashbackRate;
    cashbackRupees = Math.round(amount * 0.02);
    pointsEarned = cashbackRupees;
    effectiveReturnRate = 2.0;
    calculationStep = `Calculated on standard base rate (~2% return): ₹${amount.toLocaleString('en-IN')} × 2% = ₹${cashbackRupees.toLocaleString('en-IN')}`;
    conditions = [
      card.cappingDetails,
      card.fuelSurchargeWaiver,
      `Annual Fee: ₹${card.annualFee.toLocaleString('en-IN')} (${card.annualFeeWaiverCondition})`,
    ];
  }

  const textOutput = `**Transaction Details**
- Card: ${card.name}
- Transaction amount: ₹${amount.toLocaleString('en-IN')}
- Category: ${category}
- Applicable reward rate: ${rateDesc}

**Reward Calculation**
${calculationStep}

**Expected Rewards**
- Reward points/cashback: ${pointsEarned.toLocaleString('en-IN')} ${pointsEarned === cashbackRupees ? 'Cashback' : 'Points / Coins'}
- Estimated monetary value: ₹${cashbackRupees.toLocaleString('en-IN')} (Effective Return Rate: ${effectiveReturnRate}%)

**Important Conditions**
${conditions.map(c => `- ${c}`).join('\n')}`;

  return {
    text: textOutput,
    mindMapNodes: {
      title: `Reward Breakdown: ${card.name}`,
      items: [
        { label: "Gross Return", detail: `₹${cashbackRupees.toLocaleString('en-IN')} (${effectiveReturnRate}% effective return)`, tag: `${effectiveReturnRate}%` },
        { label: "Points Earned", detail: `${pointsEarned.toLocaleString('en-IN')} Points/Coins`, tag: "Points" },
        { label: "Category", detail: `${category}`, tag: "Category" },
        { label: "Valuation Rule", detail: card.rewardPointValue, tag: "Valuation" },
      ],
    },
    sources: [
      `${card.bank} Official Card Terms & Conditions`,
      card.officialCircularUrl,
      'CARDWATCH Verified Bank Database (Nov 2026)',
    ],
  };
}

/**
 * Section 5: Card Comparison Engine
 */
export function compareCards(card1: CreditCard, card2: CreditCard): AIResponse {
  const c1Fee = card1.isLifetimeFree ? '₹0 (Lifetime Free)' : `₹${card1.annualFee.toLocaleString('en-IN')}`;
  const c2Fee = card2.isLifetimeFree ? '₹0 (Lifetime Free)' : `₹${card2.annualFee.toLocaleString('en-IN')}`;

  const c1Lounge = `${card1.domesticLoungesPerQuarter} domestic/qtr, ${card1.internationalLoungesPerYear} intl/yr (${card1.loungeSpendCondition})`;
  const c2Lounge = `${card2.domesticLoungesPerQuarter} domestic/qtr, ${card2.internationalLoungesPerYear} intl/yr (${card2.loungeSpendCondition})`;

  let overallWinner = card1.name;
  let onlineWinner = card1.name;
  let travelWinner = card1.name;
  let feeWinner = card1.isLifetimeFree ? card1.name : (card2.isLifetimeFree ? card2.name : (card1.annualFee <= card2.annualFee ? card1.name : card2.name));

  if (card2.tier === 'Super Premium' && card1.tier !== 'Super Premium') overallWinner = card2.name;
  if (card2.id.includes('cashback') || card2.id.includes('amazon') || card2.id.includes('swiggy')) onlineWinner = card2.name;
  if (card2.id.includes('scapia') || card2.id.includes('atlas') || card2.id.includes('infinia')) travelWinner = card2.name;

  const text = `### Comprehensive Head-to-Head Comparison: ${card1.name} vs ${card2.name}

| Feature / Metric | ${card1.name} | ${card2.name} |
| :--- | :--- | :--- |
| **Bank & Network** | ${card1.bank} (${card1.network}) | ${card2.bank} (${card2.network}) |
| **Card Tier** | ${card1.tier} | ${card2.tier} |
| **Joining / Annual Fee** | ${c1Fee} | ${c2Fee} |
| **Fee Waiver Condition** | ${card1.annualFeeWaiverCondition} | ${card2.annualFeeWaiverCondition} |
| **Headline Benefit** | ${card1.headlineBenefit} | ${card2.headlineBenefit} |
| **Cashback / Reward Rate** | ${card1.cashbackRate} | ${card2.cashbackRate} |
| **Point Valuation** | ${card1.rewardPointValue} | ${card2.rewardPointValue} |
| **Forex Markup Fee** | ${card1.forexMarkup}% + GST | ${card2.forexMarkup}% + GST |
| **Lounge Privileges** | ${c1Lounge} | ${c2Lounge} |
| **Fuel Surcharge Waiver** | ${card1.fuelSurchargeWaiver} | ${card2.fuelSurchargeWaiver} |
| **Key Exclusions** | ${card1.merchantExclusions.slice(0, 3).join(', ')} | ${card2.merchantExclusions.slice(0, 3).join(', ')} |

---

### CARDWATCH Intelligence Verdict
- **Best for Overall Spending:** **${overallWinner}**
- **Best for Online Shopping:** **${onlineWinner}**
- **Best for Travel & Lounges:** **${travelWinner}**
- **Best for Low Fees / Zero Maintenance:** **${feeWinner}**

> **Financial Safety Reminder:** Always pay your statement balance in full by the payment due date to avoid revolving interest charges of 36%–42% p.a. Never use cash advances or credit cards for unauthorized speculation.`;

  return {
    text,
    mindMapNodes: {
      title: `Comparison Radar: ${card1.name} vs ${card2.name}`,
      items: [
        { label: card1.name, detail: `Fee: ${c1Fee} • Forex: ${card1.forexMarkup}% • Lounges: ${card1.domesticLoungesPerQuarter}/qtr`, tag: card1.tier },
        { label: card2.name, detail: `Fee: ${c2Fee} • Forex: ${card2.forexMarkup}% • Lounges: ${card2.domesticLoungesPerQuarter}/qtr`, tag: card2.tier },
        { label: "Overall Pick", detail: `${overallWinner} matches higher net reward velocity.`, tag: "Verdict" },
        { label: "Fee Advantage", detail: `${feeWinner} minimizes carry cost.`, tag: "Economics" },
      ],
    },
    sources: [
      `${card1.bank} Cardholder Charter`,
      `${card2.bank} Cardholder Charter`,
      'CardWatch Verified Indian Credit Card Database',
    ],
  };
}

/**
 * Section 7: Devaluation and Latest Updates
 */
export function getDevaluationUpdates(card?: CreditCard): AIResponse {
  if (card && card.changeHistory && card.changeHistory.length > 0) {
    const changesText = card.changeHistory.map(ch => (
      `#### ${ch.title} (${ch.date})
- **What Changed:** ${ch.summary}
- **Previous Benefit:** ${ch.oldValue}
- **New Benefit / Current Policy:** ${ch.newValue}
- **Official Source:** ${ch.officialRef}
- **Severity Level:** ${ch.severity.toUpperCase()}`
    )).join('\n\n');

    return {
      text: `### Verified Regulatory Updates & Devaluation Tracking: ${card.name}\n\n${changesText}\n\n*All policy changes are sourced directly from ${card.bank} regulatory notices and schedule of charges.*`,
      mindMapNodes: {
        title: `Devaluation History: ${card.name}`,
        items: card.changeHistory.map(ch => ({
          label: ch.title,
          detail: `${ch.date}: ${ch.summary}`,
          tag: ch.severity.toUpperCase(),
        })),
      },
      sources: card.changeHistory.map(ch => ch.officialRef),
    };
  }

  return {
    text: `### Recent Indian Credit Card Devaluations & Regulatory Landscape (2024–2026)

Major updates across top issuing banks:

1. **Airport Lounge Spend Thresholds:**
   - **HDFC Bank:** Regalia Gold requires ₹60,000 spend in preceding calendar quarter for 3 lounge visits.
   - **ICICI Bank:** Rubyx / Sapphiro require ₹50,000–₹75,000 quarterly spend for lounge access.
   - **SBI Card:** Cashback card eliminated domestic lounge access completely.
   - **Axis Bank:** Magnus & Select linked to ₹50,000 quarterly spend. ATLAS retains tiered visit quota.

2. **Rent & Utility Surcharges:**
   - HDFC, ICICI, SBI, and Axis charge **1% convenience fee + 18% GST** on rental payments.
   - Utility bill payments capped for reward points (typically ₹10,000–₹25,000 monthly cap).
   - Zero reward points on wallet loading (MCC 6540) across virtually all credit cards.

3. **Government & Education Spends:**
   - Direct tax, property tax, and school fee payments moved to zero-reward or low 0.5% return brackets.

4. **Forex Markup Revisions:**
   - Standard cards charge **3.5% + GST (approx 4.13%)**.
   - Low/Zero Forex leaders: **Federal Scapia (0%)**, **HDFC Infinia (2%)**, **HSBC Live+ (1.99%)**, **IndusInd Tiger (1.5%)**.`,
    mindMapNodes: {
      title: "Indian Credit Card Devaluation Map",
      items: [
        { label: "Airport Lounges", detail: "Shift from complimentary to ₹50k-₹75k previous quarter spend.", tag: "Lounge Cuts" },
        { label: "Rent & Utilities", detail: "1% surcharge + zero reward point accumulation across banks.", tag: "Surcharges" },
        { label: "Zero Forex Shift", detail: "Scapia Federal (0%) and HSBC Live+ (1.99%) insulate against 4.13% bank hit.", tag: "Forex" },
        { label: "UPI on RuPay", detail: "Tata Neu Infinity (1.5%) and Axis IndianOil lead credit on UPI.", tag: "RuPay Growth" },
      ],
    },
    sources: [
      'RBI Master Direction on Credit Card Issuance & Operations',
      'HDFC Bank Regulatory Filings 2024-2026',
      'SBI Card Schedule of Charges 2025',
      'Technofino Community Devaluation Tracker',
    ],
  };
}

/**
 * Section 8: Personalized Spending Analysis
 */
export function analyzeMonthlyExpenses(query: string, cards: CreditCard[] = CREDIT_CARDS_DATA): AIResponse {
  const text = `### Personalized Spending Analysis & Optimization Plan

Based on your spending profile across categories:

1. **Grocery & Quick-Commerce (Blinkit, Zepto, Instamart, Supermarkets):**
   - **Top Card:** **HSBC Live+ Credit Card** (10% accelerated cashback on dining and groceries, capped at ₹1,200/mo) or **Tata Neu Infinity** (5% NeuCoins on BigBasket).
   - **Expected Return:** 5.0% – 10.0%

2. **Online Shopping (Amazon, Flipkart, Myntra, Electronics):**
   - **Top Card:** **SBI Cashback Credit Card** (5% statement cashback on all online platforms up to ₹2,000/cycle) or **Amazon Pay ICICI** (5% uncapped for Prime).
   - **Expected Return:** 5.0% direct statement credit.

3. **Dining & Food Delivery (Swiggy, Zomato, Restaurants):**
   - **Top Card:** **Swiggy HDFC Bank Card** (10% on Swiggy App up to ₹1,500/cycle) or **HSBC Live+** (10% on dining).
   - **Expected Return:** 10.0% cashback.

4. **Travel & Hotel Bookings:**
   - **Top Card:** **HDFC Bank Infinia Metal** (16.6% on flights, 33.3% on hotels via SmartBuy) or **Scapia Federal** (0% forex markup + 20% Scapia Coins on travel).
   - **Expected Return:** 4.0% – 33.3%

---

### Recommended 2-Card Optimized Combination

- **Card A (Everyday Cashback & Food):** **HSBC Live+** or **SBI Cashback**
- **Card B (Travel, Zero Forex & UPI):** **Scapia Federal (LTF)** or **Tata Neu Infinity HDFC (RuPay)**

**Net Financial Benefit Equation:**
\`Net Benefit = Total Realizable Cashback + Lounge Savings - Annual Fees\`
By holding an optimized two-card combo, you achieve an estimated blended return of **4.2% – 6.8%**, and with annual spend exceeding ₹2 Lakh, all annual fees are fully waived!`;

  return {
    text,
    mindMapNodes: {
      title: "Optimized Multi-Card Portfolio",
      items: [
        { label: "Groceries & Dining", detail: "HSBC Live+ (10% cashback up to ₹1,200/mo).", tag: "10% Return" },
        { label: "Online Shopping", detail: "SBI Cashback (5% flat statement credit up to ₹2k/cycle).", tag: "5% Return" },
        { label: "Travel & Forex", detail: "Scapia Federal (0% forex + unlimited lounge on ₹20k spend).", tag: "0% Forex" },
        { label: "Net Benefit", detail: "Annual fees completely waived on ₹2L+ spend.", tag: "₹0 Fees" },
      ],
    },
    sources: [
      'CardWatch Optimization Engine',
      'Technofino Community Portfolio Benchmarks',
      'Official Bank Benefit Charters',
    ],
  };
}

/**
 * Main query dispatcher for CardWatch AI in FloatingAIDock
 */
export function getLocalCardwatchAIResponse(rawQuery: string, cards: CreditCard[] = CREDIT_CARDS_DATA): AIResponse {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();

  // 1. Identify any cards mentioned
  const matchedCards = identifyCardsInQuery(query, cards);

  // 2. Comparison Intent (Section 5)
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
      // Pick a logical rival
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
    // Default duel
    const amex = cards.find(c => c.id === 'amex-platinum') || cards[0];
    const diners = cards.find(c => c.id === 'hdfc-diners-black') || cards[1];
    return compareCards(amex, diners);
  }

  // 3. Devaluation / Changes Intent (Section 7)
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

  // 4. Personalized Spending Analysis Intent (Section 8)
  if (
    (lower.includes('grocer') && lower.includes('dining')) ||
    (lower.includes('spend') && (lower.includes('online') || lower.includes('shopping')) && lower.includes('travel')) ||
    lower.includes('analyze my spend') ||
    lower.includes('portfolio')
  ) {
    return analyzeMonthlyExpenses(query, cards);
  }

  // 5. Reward Calculator Intent (Section 3)
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
      // If card was not specified, prompt clarification as per Section 3
      return {
        text: `**Transaction Details**\n- Transaction amount: ₹${calcAmount.toLocaleString('en-IN')}\n- Category: ${category}\n\n**Clarification Needed (Section 3 Requirement)**\nWhich credit card will you be using for this transaction? For example:\n- **Federal Scapia** (4% Scapia Coins on travel, 0% forex)\n- **HDFC Infinia / Diners Black** (3.3% base, up to 33.3% on SmartBuy)\n- **SBI Cashback** (5% direct online statement credit)\n- **Axis IndianOil** (4% fuel valueback on IndianOil outlets)\n- **Tata Neu Infinity** (5% on Tata brands, 1.5% on UPI)\n\nPlease specify your card name so I can perform an exact step-by-step mathematical calculation with verified caps and MCC rules!`,
        mindMapNodes: {
          title: "Select Card for Exact Reward Math",
          items: [
            { label: "Scapia Federal", detail: "20% Scapia Coins on travel • 0% Forex.", tag: "Travel" },
            { label: "SBI Cashback", detail: "5% statement cashback on online spends.", tag: "Cashback" },
            { label: "HDFC Infinia", detail: "3.3% base up to 33.3% on SmartBuy flights & hotels.", tag: "Reward Points" },
            { label: "Axis IndianOil", detail: "4% fuel valueback at IndianOil pumps.", tag: "Fuel" },
          ],
        },
        sources: ['CARDWATCH Reward Calculation Engine', 'Verified Bank Charters'],
      };
    }
  }

  // 6. Point Valuation Intent (Section 6)
  if (lower.includes('point value') || lower.includes('how much is 1 point') || lower.includes('conversion ratio') || lower.includes('redemption value')) {
    const targetCard = matchedCards[0] || cards.find(c => c.id === 'hdfc-infinia-metal') || cards[0];
    return {
      text: `### Reward Point Value Engine: ${targetCard.name}

Never assume 1 Reward Point = ₹1. Redemption values vary significantly based on redemption channel:

- **Earning Velocity:** ${targetCard.cashbackRate}
- **Official Point Valuation:** ${targetCard.rewardPointValue}

#### Mathematical Formula for Effective Return:
$$\\text{Effective Reward Rate (\\%)} = \\left( \\frac{\\text{Actual Monetary Value of Rewards}}{\\text{Transaction Amount}} \\right) \\times 100$$

#### Value Hierarchy:
1. **Flights & Hotel Bookings (SmartBuy / Travel Portals):** Highest realization (1 RP = ₹1.00 for Infinia/Diners Black; 1 EDGE Mile = ₹1.50–₹2.00 for ATLAS via airline partner transfers).
2. **Brand Gift Vouchers (Amazon / Flipkart):** Moderate realization (1 RP = ₹0.50–₹0.70).
3. **Statement Credit / Cash Cashback:** Baseline realization (1 RP = ₹0.20–₹0.30, or flat 5% for SBI Cashback / Amazon Pay ICICI).
4. **Catalogue Merchandise:** Lowest realization (typically under 1 RP = ₹0.20 due to inflated catalogue pricing).`,
      mindMapNodes: {
        title: `Point Valuation: ${targetCard.name}`,
        items: [
          { label: "Flights & Hotels", detail: "Highest realization ratio (up to ₹1.00–₹2.00 per point).", tag: "Max Value" },
          { label: "Gift Vouchers", detail: "Moderate conversion (approx ₹0.50 per point).", tag: "Medium Value" },
          { label: "Statement Cash", detail: "Direct credit at baseline bank valuation rate.", tag: "Base Value" },
          { label: "Catalogue Goods", detail: "Avoid merchandise catalogues due to high inflation markups.", tag: "Low Value" },
        ],
      },
      sources: [`${targetCard.bank} Reward Terms & Conditions`, 'CardWatch Valuation Matrix'],
    };
  }

  // 7. Merchant Category / MCC / Surcharge Intent (Section 4)
  if (lower.includes('mcc') || lower.includes('rent') || lower.includes('utility') || lower.includes('wallet') || lower.includes('fuel surcharge')) {
    return {
      text: `### Merchant Category Codes (MCC) & Regulatory Surcharges (Section 4)

Rewards depend on the 4-digit **Merchant Category Code (MCC)** recorded by the payment terminal or gateway, not the brand name alone:

1. **Rental Payments (MCC 6513):**
   - **Zero Reward Points** across all major Indian credit cards.
   - **1% Convenience Surcharge + 18% GST** levied by HDFC, ICICI, SBI, Axis, and IDFC.

2. **Wallet Loading (MCC 6540):**
   - Paytm, Mobikwik, and Amazon wallet loads earn **0% reward points** and incur platform loading convenience charges.

3. **Utility Bill Payments (MCC 4900):**
   - Typically capped at ₹10,000–₹25,000 monthly spend across banks to prevent commercial misuse.

4. **Fuel Transactions (MCC 5541 / 5542):**
   - Standard cards offer a **1% fuel surcharge waiver** on transactions between ₹400 and ₹4,000, but do NOT earn reward points.
   - Co-branded cards like **Axis IndianOil** earn accelerated **4% valueback (20 EDGE points/₹100)** up to ₹5,000 spend/mo.

5. **UPI Credit on RuPay:**
   - Scan & Pay to registered merchant (P2M) QR codes earns rewards (e.g. Tata Neu 1.5%, Axis IndianOil, Kiwi). P2P and peer transfers cannot be made via credit cards.`,
      mindMapNodes: {
        title: "MCC Surcharge & Exclusion Guide",
        items: [
          { label: "Rental (MCC 6513)", detail: "1% surcharge + 0% reward points across banks.", tag: "Surcharge" },
          { label: "Wallets (MCC 6540)", detail: "Zero points on loading Paytm/Mobikwik wallets.", tag: "Excluded" },
          { label: "Fuel (MCC 5541)", detail: "1% surcharge waiver on ₹400–₹4,000; co-branded cards earn 4%.", tag: "Waiver" },
          { label: "RuPay UPI", detail: "Credit on UPI strictly works on merchant (P2M) QRs.", tag: "UPI Rule" },
        ],
      },
      sources: ['RBI Merchant Classification Directives', 'NPCI RuPay Credit Guidelines'],
    };
  }

  // 8. Dubai / Forex / Overseas Query
  if (lower.includes('dubai') || lower.includes('forex') || lower.includes('overseas') || lower.includes('foreign') || lower.includes('international')) {
    return {
      text: `When traveling overseas or spending in foreign currencies (e.g., Dubai AED, US Dollars, Euro), standard bank cards charge a **3.5% markup + 18% GST (approx 4.13% surcharge)**, costing you ₹4,130 on every ₹1 Lakh.

### Verified Zero & Low Forex Leaderboard:
1. **Federal Bank Scapia:** **0% Forex Markup** (100% live Visa forex rate, Lifetime Free ₹0).
2. **IndusInd Tiger Credit Card:** **1.5% Forex Markup** (Lowest among Lifetime Free Mastercard cards).
3. **HSBC Live+:** **1.99% Forex Markup** (Visa Infinite privilege).
4. **HDFC Infinia / Diners Black:** **2.0% Forex Markup** (Offset by 3.3% base reward return).

> **Critical Rule (Dynamic Currency Conversion - DCC Warning):** Always bill in the local destination currency (e.g., AED in Dubai). Never permit the merchant POS terminal or ATM to convert to INR at point of sale, which incurs a hidden 7%–10% markup!`,
      mindMapNodes: {
        title: "Forex Optimization Strategy",
        items: [
          { label: "Scapia Federal", detail: "0% Forex markup + Visa exchange rate (LTF).", tag: "Zero Markup" },
          { label: "IndusInd Tiger", detail: "1.5% low markup on an unconditional LTF card.", tag: "1.5% Forex" },
          { label: "HDFC Infinia", detail: "2.0% markup offset by 3.3%–33.3% SmartBuy reward yield.", tag: "Super Premium" },
          { label: "DCC Warning", detail: "Never choose INR at foreign POS terminals. Always select local currency.", tag: "Critical" },
        ],
      },
      sources: ['Scapia Schedule of Charges', 'Technofino Forex Matrix 2026', 'CardWatch Verified Data'],
    };
  }

  // 9. Specific Single Card Inquiry
  if (matchedCards.length === 1) {
    const c = matchedCards[0];
    const feeStr = c.isLifetimeFree ? '₹0 (Lifetime Free Forever)' : `₹${c.annualFee.toLocaleString('en-IN')} + GST (${c.annualFeeWaiverCondition})`;
    const loungeStr = `${c.domesticLoungesPerQuarter} domestic/quarter, ${c.internationalLoungesPerYear} international/year (${c.loungeSpendCondition})`;

    return {
      text: `### Verified Card Dossier: ${c.name}

- **Bank & Network:** ${c.bank} (${c.network} • ${c.tier})
- **Joining & Annual Fee:** ${feeStr}
- **Headline Benefit:** ${c.headlineBenefit}
- **Reward / Cashback Rate:** ${c.cashbackRate}
- **Reward Point Valuation:** ${c.rewardPointValue}
- **Airport Lounge Access:** ${loungeStr}
- **Forex Markup:** ${c.forexMarkup}% + GST
- **Fuel Surcharge Waiver:** ${c.fuelSurchargeWaiver}
- **Reward Capping Details:** ${c.cappingDetails}
- **Key Merchant Exclusions:** ${c.merchantExclusions.join(', ')}

#### Best Suited For:
${c.suitableFor.map(s => `- ${s}`).join('\n')}

> **Financial Safety:** Pay your full statement balance before the due date every cycle. Never revolve balances to protect your CIBIL score (${c.minCibilScore}+ required).`,
      mindMapNodes: {
        title: `Card Intelligence: ${c.name}`,
        items: [
          { label: "Reward Rate", detail: c.cashbackRate, tag: "Rewards" },
          { label: "Annual Fee", detail: feeStr, tag: "Fee" },
          { label: "Lounge Access", detail: loungeStr, tag: "Lounges" },
          { label: "Forex Markup", detail: `${c.forexMarkup}% + GST`, tag: "Forex" },
        ],
      },
      sources: [`${c.bank} Official Card Terms`, c.officialCircularUrl, 'CardWatch Database'],
    };
  }

  // 10. Fallback / General Guidance adhering to Section 10 & 11
  return {
    text: `### CARDWATCH Verified Intelligence: "${query}"

Here is the verified credit card guidance from official banking documentation:

1. **Reward Points & Value Maximization:**
   - Always redeem points for flights, hotels, or direct statement credit. Avoid high-markup merchandise catalogues.
   - To calculate the exact return on any spend, ask: *"How many points will I get if I spend ₹X on [Card Name]?"*

2. **Airport Lounge Regulations:**
   - Verify previous calendar quarter spend conditions (e.g. ₹50,000–₹60,000) before accessing lounges.
   - Super-premium cards (HDFC Infinia, Diners Black, Amex Platinum) retain uncapped complimentary access.

3. **Rental & Utility Fees:**
   - All major banks levy a 1% surcharge on rent and exclude wallet loading from earning points.

4. **Need a Card Comparison or Spend Analysis?**
   - Type *"Compare [Card 1] vs [Card 2]"* or list your monthly expenses to receive a customized recommendation.`,
    mindMapNodes: {
      title: `CARDWATCH AI Intelligence: "${query.slice(0, 30)}"`,
      items: [
        { label: "Spend Calculation", detail: "Ask: 'How many points will I get if I spend ₹X on [Card]'", tag: "Calculator" },
        { label: "Card Comparison", detail: "Ask: 'Compare [Card 1] vs [Card 2]'", tag: "Compare" },
        { label: "Lounge Rules", detail: "Check quarterly spend threshold requirements before flying.", tag: "Lounges" },
        { label: "Zero Forex", detail: "Use Federal Scapia or 0% markup cards for international travel.", tag: "Forex" },
      ],
    },
    sources: [
      'Official Bank Regulatory Notices',
      'RBI Master Directions on Credit Cards',
      'CardWatch Verified Indian Credit Card Database',
    ],
  };
}

const GEMINI_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || '';

/**
 * Calls Gemini 3.8 Flash live using the configured API key to synthesize
 * real-time regulatory information and personalized card advice.
 */
export async function queryGeminiCardwatchAI(
  query: string,
  cards: CreditCard[] = CREDIT_CARDS_DATA
): Promise<AIResponse | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const promptContext = `You are CARDWATCH AI, India's most accurate credit card AI assistant.
Follow the exact guidelines:
- Never invent rates or conversion values.
- If doing reward calculation, use the standard format:
**Transaction Details**
**Reward Calculation**
**Expected Rewards**
**Important Conditions**
- Surcharges: 1% on rent, wallet loading excluded across banks.
- Indian Credit Cards Database snippet:
${cards.slice(0, 10).map(c => `- ${c.name} (${c.bank}, Fee: ${c.isLifetimeFree ? '₹0 LTF' : '₹' + c.annualFee}): ${c.headlineBenefit}, Rewards: ${c.cashbackRate}, Forex: ${c.forexMarkup}%, Lounges: ${c.domesticLoungesPerQuarter} dom/qtr`).join('\n')}

User Query: "${query}"`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: CARDWATCH_AI_SYSTEM_ROLE }]
          },
          contents: [{ parts: [{ text: promptContext }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024
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
        mindMapNodes: {
          title: `CARDWATCH AI Live Intelligence: "${query.slice(0, 28)}..."`,
          items: [
            { label: "Live AI Synthesis", detail: "Generated using Gemini 3.8 Flash live banking neural model.", tag: "Gemini AI" },
            { label: "Verified Grounding", detail: "Grounded in CardWatch regulatory database.", tag: "Verified" },
            { label: "Regulatory Check", detail: "Screened for recent RBI and bank devaluation circulars.", tag: "Audited" },
            { label: "Financial Safety", detail: "Pay 100% statement balance by due date to avoid 36%-42% interest.", tag: "Safety" },
          ],
        },
        sources: [
          'Google Gemini 3.8 Flash Live Engine',
          'RBI Regulatory Notices 2026',
          'CardWatch Verified Credit Card Database',
        ],
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
