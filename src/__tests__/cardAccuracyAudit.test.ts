import { describe, it, expect } from 'vitest';
import { CREDIT_CARDS_DATA } from '../data/cards';
import { validateCard, validateAllCards } from '../utils/cardValidator';

describe('CARDWATCH — Permanent Credit Card Data Accuracy Audit', () => {
  it('should validate all cards with a 100% accuracy score and zero critical errors', () => {
    const report = validateAllCards(CREDIT_CARDS_DATA);
    expect(report.totalCardsAudited).toBe(CREDIT_CARDS_DATA.length);
    expect(report.validCardsCount).toBe(CREDIT_CARDS_DATA.length);
    expect(report.hasErrors).toBe(false);
    expect(report.accuracyScore).toBe(100);
  });

  it('should verify exact audited facts for HDFC Millennia', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'hdfc-millennia');
    expect(card).toBeDefined();
    expect(card?.annualFee).toBe(1000);
    expect(card?.domesticLoungesPerQuarter).toBe(1);
    expect(card?.loungeSpendCondition).toContain('₹1,00,000');
    expect(card?.cashbackRate).toContain('5%');
    expect(card?.rewardPointValue).toContain('1 CashPoint = ₹1.00');
  });

  it('should verify exact audited facts for SimplyCLICK SBI Card', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'sbi-simplyclick');
    expect(card).toBeDefined();
    expect(card?.annualFee).toBe(499);
    expect(card?.domesticLoungesPerQuarter).toBe(0);
    expect(card?.welcomeBenefit).toContain('Amazon');
    expect(card?.cashbackRate).toContain('10 Reward Points');
  });

  it('should verify exact audited facts for BPCL SBI Card OCTANE', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'sbi-bpcl-octane');
    expect(card).toBeDefined();
    expect(card?.annualFee).toBe(1499);
    expect(card?.headlineBenefit).toContain('7.25%');
    expect(card?.domesticLoungesPerQuarter).toBe(1);
    expect(card?.rewardPointValue).toContain('BPCL petrol pumps');
  });

  it('should verify exact audited facts for SBI Card PRIME', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'sbi-prime');
    expect(card).toBeDefined();
    expect(card?.annualFee).toBe(2999);
    expect(card?.domesticLoungesPerQuarter).toBe(2);
    expect(card?.internationalLoungesPerYear).toBe(4);
    expect(card?.welcomeBenefit).toContain('₹3,000');
  });

  it('should ensure all Lifetime Free (LTF) cards have strictly ₹0 joining and annual fees', () => {
    const ltfCards = CREDIT_CARDS_DATA.filter(c => c.isLifetimeFree);
    expect(ltfCards.length).toBeGreaterThan(0);

    for (const card of ltfCards) {
      expect(card.joiningFee).toBe(0);
      expect(card.annualFee).toBe(0);
      expect(card.gstApplicability).toBeDefined();
    }
  });

  it('should verify exact audited facts for HDFC Infinia Metal Edition', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'hdfc-infinia-metal');
    expect(card).toBeDefined();
    expect(card?.annualFee).toBe(12500);
    expect(card?.domesticLoungesPerQuarter).toBe('Unlimited');
    expect(card?.forexMarkup).toBe(2.0);
    expect(card?.rewardPointValue).toContain('1 RP = ₹1.00');
    expect(card?.officialCircularUrl).toBe('https://www.hdfc.bank.in/credit-cards/infinia-credit-card');
  });

  it('should verify exact audited facts for HDFC Regalia Gold', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'hdfc-regalia-gold');
    expect(card).toBeDefined();
    expect(card?.annualFee).toBe(2500);
    expect(card?.domesticLoungesPerQuarter).toBe(3);
    expect(card?.loungeSpendCondition).toContain('₹60,000');
    expect(card?.rewardPointValue).toContain('1 RP = ₹0.50');
  });

  it('should verify exact audited facts for Scapia Federal Credit Card', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'scapia-federal');
    expect(card).toBeDefined();
    expect(card?.isLifetimeFree).toBe(true);
    expect(card?.annualFee).toBe(0);
    expect(card?.forexMarkup).toBe(0.0);
    expect(card?.loungeSpendCondition).toContain('₹20,000');
    expect(card?.rewardPointValue).toContain('5 Scapia Coins = ₹1');
  });

  it('should verify exact audited facts for Cashback SBI Card', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'sbi-cashback');
    expect(card).toBeDefined();
    expect(card?.annualFee).toBe(999);
    expect(card?.domesticLoungesPerQuarter).toBe(0);
    expect(card?.internationalLoungesPerYear).toBe(0);
    expect(card?.cappingDetails).toContain('₹2,000');
  });

  it('should verify exact audited facts for Axis Bank Magnus', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'axis-magnus');
    expect(card).toBeDefined();
    expect(card?.annualFee).toBe(12500);
    expect(card?.rewardPointValue).toContain('5 EDGE Reward points = 2 partner air miles');
    expect(card?.loungeSpendCondition).toContain('₹50,000');
  });

  it('should verify exact audited facts for American Express cards', () => {
    const platTravel = CREDIT_CARDS_DATA.find(c => c.id === 'amex-plat-travel');
    expect(platTravel).toBeDefined();
    expect(platTravel?.joiningFee).toBe(3500);
    expect(platTravel?.annualFee).toBe(5000);
    expect(platTravel?.domesticLoungesPerQuarter).toBe(2);

    const platCharge = CREDIT_CARDS_DATA.find(c => c.id === 'amex-platinum');
    expect(platCharge).toBeDefined();
    expect(platCharge?.joiningFee).toBe(66000);
    expect(platCharge?.annualFee).toBe(66000);
    expect(platCharge?.domesticLoungesPerQuarter).toBe('Unlimited');
  });

  it('should verify exact audited facts for IDFC FIRST Millennia', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'idfc-first-millennia');
    expect(card).toBeDefined();
    expect(card?.isLifetimeFree).toBe(true);
    expect(card?.domesticLoungesPerQuarter).toBe(4);
    expect(card?.loungeNetwork).toBe('IRCTC Railway Lounge');
    expect(card?.loungeSpendCondition).toContain('railway lounge');
  });

  it('should verify exact audited facts for Flipkart Axis Bank', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'flipkart-axis');
    expect(card).toBeDefined();
    expect(card?.annualFee).toBe(500);
    expect(card?.domesticLoungesPerQuarter).toBe(0);
    expect(card?.internationalLoungesPerYear).toBe(0);
  });
});
