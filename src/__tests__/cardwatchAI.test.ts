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
  it('has official CARDWATCH AI direct & concise system role definition', () => {
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain("# ROLE: CARDWATCH — Direct & Concise Credit Card AI");
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('CORE RULES');
    expect(CARDWATCH_AI_SYSTEM_ROLE).toContain('Answer ONLY the specific question asked');
  });

  it('correctly parses card names and aliases in queries', () => {
    const scapia = identifyCardsInQuery('How many points using Scapia?');
    expect(scapia.length).toBeGreaterThan(0);
    expect(scapia[0].id).toBe('scapia-federal');

    const dcb = identifyCardsInQuery('Compare American Express vs diners black');
    expect(dcb.map(c => c.id)).toContain('amex-platinum');
    expect(dcb.map(c => c.id)).toContain('hdfc-diners-black');

    const indianoil = identifyCardsInQuery('Tell me about axis indianoil rupay');
    expect(indianoil.map(c => c.id)).toContain('axis-indianoil');
  });

  it('calculates rewards directly and concisely for ₹10,000 on Scapia', () => {
    const res = getLocalCardwatchAIResponse('How many points will I get if I spend ₹10,000 using my Scapia credit card?', CREDIT_CARDS_DATA);
    expect(res.text).toContain('Scapia Federal Credit Card');
    expect(res.text).toContain('1,000 Scapia Coins');
    expect(res.text).toContain('₹200');
    // Asserts no unsolicited financial safety lectures or complex tables
    expect(res.text).not.toContain('Financial Safety:');
    expect(res.text).not.toContain('| Feature / Metric |');
  });

  it('handles rent and wallet exclusion with concise warning', () => {
    const res = getLocalCardwatchAIResponse('How many points if I spend 50000 on rent with Infinia?', CREDIT_CARDS_DATA);
    expect(res.text).toContain('MCC 6513');
    expect(res.text).toContain('convenience fee');
  });

  it('executes head-to-head card comparisons concisely', () => {
    const res = getLocalCardwatchAIResponse('Compare American Express vs HDFC Diners Black', CREDIT_CARDS_DATA);
    expect(res.text).toContain('American Express Platinum Charge Card');
    expect(res.text).toContain('HDFC Diners Club Black Metal Edition');
    expect(res.text).toContain('forex markup');
    expect(res.text).toContain('Verdict:');
  });

  it('tracks devaluations and recent policy updates concisely', () => {
    const res = getLocalCardwatchAIResponse('Why was Regalia lounge cut from 3 to 2?', CREDIT_CARDS_DATA);
    expect(res.text).toContain('Regalia Gold');
    expect(res.text).toContain('₹60,000');
  });

  it('analyzes monthly spending with concise direct recommendation', () => {
    const res = getLocalCardwatchAIResponse('I spend ₹15,000 on groceries, ₹10,000 on online shopping, ₹5,000 on dining and ₹10,000 on travel every month.', CREDIT_CARDS_DATA);
    expect(res.text).toContain('SBI Cashback');
    expect(res.text).toContain('HSBC Live+');
    expect(res.text).not.toContain('Net Financial Benefit Equation');
  });

  it('recognizes slice UPI Credit Card aliases and returns accurate cashback & 0% forex details', () => {
    const matched = identifyCardsInQuery('Tell me about super slicer credit card', CREDIT_CARDS_DATA);
    expect(matched.some(c => c.id === 'slice-upi')).toBe(true);

    const upiRes = getLocalCardwatchAIResponse('How much cashback if I spend ₹10,000 on UPI with slice card?', CREDIT_CARDS_DATA);
    expect(upiRes.text).toContain('slice UPI Credit Card');
    expect(upiRes.text).toContain('3%');
    expect(upiRes.text).toContain('slice in 3');
  });
});
