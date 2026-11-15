import { describe, it, expect } from 'vitest';
import {
  CARDWATCH_AI_SYSTEM_ROLE,
  getLocalCardwatchAIResponse,
  identifyCardsInQuery,
  extractAmount,
  detectCategory,
} from '../utils/cardwatchAI';
import { CREDIT_CARDS_DATA } from '../data/cards';

describe('CARDWATCH AI Engine', () => {
  it('has official CARDWATCH AI system role definition', () => {
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain("# ROLE: CARDWATCH — India's Most Intelligent Credit Card AI");
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('1. YOUR AREAS OF EXPERTISE');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('2. ACCURACY IS YOUR HIGHEST PRIORITY');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('3. CREDIT CARD REWARD CALCULATOR');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('4. UNDERSTAND MERCHANT CATEGORIES');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('5. CARD COMPARISON ENGINE');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('6. REWARD POINT VALUE ENGINE');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('7. DEVALUATION AND LATEST UPDATES');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('8. PERSONALIZED SPENDING ANALYSIS');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('9. ADVANCED CALCULATION RULES');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('10. RESPONSE STYLE');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('11. HANDLING UNKNOWN QUESTIONS');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('12. FINANCIAL SAFETY');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('13. FINAL OBJECTIVE');
  });

  it('correctly parses card names and aliases in queries', () => {
    const scapia = identifyCardsInQuery('How many points using Scapia?');
    expect(scapia.length).toBeGreaterThan(0);
    expect(scapia[0].id).toBe('scapia-federal');

    const dcb = identifyCardsInQuery('Compare amex platinum vs diners black');
    expect(dcb.map(c => c.id)).toContain('amex-platinum');
    expect(dcb.map(c => c.id)).toContain('hdfc-diners-black');

    const indianoil = identifyCardsInQuery('Tell me about axis indianoil rupay');
    expect(indianoil.map(c => c.id)).toContain('axis-indianoil');
  });

  it('calculates rewards for prompt example: ₹10,000 on Scapia', () => {
    const res = getLocalCardwatchAIResponse('How many points will I get if I spend ₹10,000 using my Scapia credit card?', CREDIT_CARDS_DATA);
    expect(res.text).toContain('**Transaction Details**');
    expect(res.text).toContain('Card: Scapia Federal Credit Card');
    expect(res.text).toContain('Transaction amount: ₹10,000');
    expect(res.text).toContain('**Reward Calculation**');
    expect(res.text).toContain('**Expected Rewards**');
    expect(res.text).toContain('**Important Conditions**');
    expect(res.mindMapNodes?.title).toContain('Scapia Federal');
    expect(res.sources?.length).toBeGreaterThan(0);
  });

  it('handles rent and wallet exclusion with warning', () => {
    const res = getLocalCardwatchAIResponse('How many points if I spend 50000 on rent with Infinia?', CREDIT_CARDS_DATA);
    expect(res.text).toContain('0% (Standard Exclusion)');
    expect(res.text).toContain('MCC 6513');
    expect(res.text).toContain('convenience fee');
  });

  it('executes head-to-head card comparisons', () => {
    const res = getLocalCardwatchAIResponse('Compare American Express vs HDFC Diners Black', CREDIT_CARDS_DATA);
    expect(res.text).toContain('Comprehensive Head-to-Head Comparison');
    expect(res.text).toContain('Forex Markup Fee');
    expect(res.text).toContain('CARDWATCH Intelligence Verdict');
    expect(res.text).toContain('Financial Safety Reminder');
  });

  it('tracks devaluations and recent policy updates', () => {
    const res = getLocalCardwatchAIResponse('Why was Regalia lounge cut from 3 to 2?', CREDIT_CARDS_DATA);
    expect(res.text).toContain('Regalia Gold');
    expect(res.text).toContain('₹60,000');
  });

  it('analyzes multi-category monthly spending breakdown', () => {
    const res = getLocalCardwatchAIResponse('I spend ₹15,000 on groceries, ₹10,000 on online shopping, ₹5,000 on dining and ₹10,000 on travel every month.', CREDIT_CARDS_DATA);
    expect(res.text).toContain('Personalized Spending Analysis & Optimization Plan');
    expect(res.text).toContain('Grocery & Quick-Commerce');
    expect(res.text).toContain('Online Shopping');
    expect(res.text).toContain('Dining & Food Delivery');
    expect(res.text).toContain('Travel & Hotel Bookings');
    expect(res.text).toContain('Net Financial Benefit Equation');
  });
});
