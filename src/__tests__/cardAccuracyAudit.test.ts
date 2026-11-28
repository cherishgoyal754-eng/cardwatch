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

  it('should verify exact audited facts for ICICI Bank Coral Credit Card', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'icici-coral');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(500);
    expect(card?.annualFee).toBe(500);
    expect(card?.minSalaryMonthly).toBe(20000);
    expect(card?.loungeSpendCondition).toContain('₹75,000');
    expect(card?.domesticLoungesPerQuarter).toBe(1);
    expect(card?.railwayLoungesPerQuarter).toBe(1);
    expect(card?.movieBenefits).toContain('25%');
    expect(card?.fuelSurchargeWaiver).toContain('HPCL');
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
    expect(platTravel?.joiningFee).toBe(5000);
    expect(platTravel?.annualFee).toBe(5000);
    expect(platTravel?.domesticLoungesPerQuarter).toBe(2);
    expect(platTravel?.loungeSpendCondition).toContain('70,000');
    expect(platTravel?.milestoneBenefits).toContain('10,000');

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
    expect(card?.domesticLoungesPerQuarter).toBe(0);
    expect(card?.railwayLoungesPerQuarter).toBe(4);
    expect(card?.forexMarkup).toBe(0);
    expect(card?.loungeNetwork).toContain('IRCTC');
    expect(card?.loungeSpendCondition).toContain('railway lounge');
    expect(card?.loungeSpendCondition).toContain('20,000');
  });

  it('should verify exact audited facts for Flipkart Axis Bank', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'flipkart-axis');
    expect(card).toBeDefined();
    expect(card?.annualFee).toBe(500);
    expect(card?.domesticLoungesPerQuarter).toBe(0);
    expect(card?.internationalLoungesPerYear).toBe(0);
  });

  it('should verify exact audited facts for ICICI Bank Rubyx', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'icici-rubyx');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(3000);
    expect(card?.annualFee).toBe(2000);
    expect(card?.minSalaryMonthly).toBe(75000);
    expect(card?.domesticLoungesPerQuarter).toBe(2);
    expect(card?.railwayLoungesPerQuarter).toBe(2);
    expect(card?.loungeSpendCondition).toContain('₹75,000');
    expect(card?.movieBenefits).toContain('25%');
    expect(card?.golfBenefits).toContain('Up to 2 complimentary golf rounds');
    expect(card?.fuelSurchargeWaiver).toContain('₹400 and ₹4,000');
    expect(card?.officialCircularUrl).toBe('https://www.icici.bank.in/personal-banking/cards/credit-card/rubyx-credit-card');
  });

  it('should verify exact audited facts for ICICI Bank Emeralde Private Metal', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'icici-emeralde-private');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(12499);
    expect(card?.annualFee).toBe(12499);
    expect(card?.forexMarkup).toBe(2.0);
    expect(card?.domesticLoungesPerQuarter).toBe('Unlimited');
    expect(card?.internationalLoungesPerYear).toBe('Unlimited');
    expect(card?.loungeSpendCondition).toContain('₹75,000');
    expect(card?.movieBenefits).toContain('₹750');
    expect(card?.golfBenefits).toContain('Unlimited complimentary golf');
    expect(card?.fuelSurchargeWaiver).toContain('₹1,00,000');
    expect(card?.annualFeeWaiverCondition).toContain('10,00,000');
    expect(card?.recentChangeAlert?.isDevaluation).toBe(true);
    expect(card?.recentChangeAlert?.description).toContain('Dec 15, 2026');
  });

  it('should verify exact audited facts for ICICI Bank HPCL Super Saver', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'icici-hpcl-super-saver');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(500);
    expect(card?.annualFee).toBe(500);
    expect(card?.annualFeeWaiverCondition).toContain('1,50,000');
    expect(card?.minSalaryMonthly).toBe(20000);
    expect(card?.domesticLoungesPerQuarter).toBe(1);
    expect(card?.loungeSpendCondition).toContain('₹75,000');
    expect(card?.movieBenefits).toContain('25%');
    expect(card?.fuelSurchargeWaiver).toContain('₹400 and ₹4,000');
    expect(card?.officialCircularUrl).toBe('https://www.icici.bank.in/personal-banking/cards/credit-card/hpcl-super-saver');
  });

  it('should verify exact audited facts and 2026 devaluation for Airtel Axis Bank', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'axis-airtel');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(500);
    expect(card?.annualFee).toBe(500);
    expect(card?.domesticLoungesPerQuarter).toBe(0);
    expect(card?.loungeSpendCondition).toContain('discontinued');
    expect(card?.recentChangeAlert?.isDevaluation).toBe(true);
    expect(card?.cappingDetails).toContain('2x');
    expect(card?.cappingDetails).toContain('1x');
    expect(card?.cappingDetails).toContain('Swiggy');
    expect(card?.welcomeBenefit).toContain('250');
  });

  it('should verify exact audited facts for Axis Bank ACE', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'axis-ace');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(499);
    expect(card?.annualFee).toBe(499);
    expect(card?.domesticLoungesPerQuarter).toBe(1);
    expect(card?.loungeSpendCondition).toContain('50,000');
    expect(card?.cappingDetails).toContain('500');
    expect(card?.officialCircularUrl).toBe('https://www.axis.bank.in/cards/credit-card/axis-bank-ace-credit-card');
  });

  it('should verify exact audited facts and 2026 revisions for Axis Bank MY ZONE', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'axis-myzone');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(500);
    expect(card?.annualFee).toBe(500);
    expect(card?.annualFeeWaiverCondition).toContain('1,50,000');
    expect(card?.domesticLoungesPerQuarter).toBe(1);
    expect(card?.loungeSpendCondition).toContain('50,000');
    expect(card?.cappingDetails).toContain('25,000');
    expect(card?.cappingDetails).toContain('District');
    expect(card?.recentChangeAlert?.isDevaluation).toBe(true);
    expect(card?.recentChangeAlert?.badge).toContain('District BOGO');
    expect(card?.movieBenefits).toContain('District');
    expect(card?.milestoneBenefits).toContain('1,000 EDGE Reward Points');
    expect(card?.officialCircularUrl).toBe('https://www.axis.bank.in/cards/credit-card/axis-bank-my-zone-credit-card');
  });

  it('should verify exact audited facts and 2026 revisions for Axis Bank NEO', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'axis-neo');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(250);
    expect(card?.annualFee).toBe(250);
    expect(card?.annualFeeWaiverCondition).toContain('1,00,000');
    expect(card?.domesticLoungesPerQuarter).toBe(0);
    expect(card?.loungeSpendCondition).toContain('not offered');
    expect(card?.cappingDetails).toContain('Zomato');
    expect(card?.cappingDetails).toContain('Blinkit');
    expect(card?.cappingDetails).toContain('25,000');
    expect(card?.cappingDetails).toContain('BookMyShow');
    expect(card?.recentChangeAlert?.isDevaluation).toBe(true);
    expect(card?.recentChangeAlert?.badge).toContain('BookMyShow Spend Rule');
    expect(card?.movieBenefits).toContain('BookMyShow');
    expect(card?.diningBenefits).toContain('Zomato');
    expect(card?.officialCircularUrl).toBe('https://www.axis.bank.in/cards/credit-card/axis-bank-neo-credit-card');
  });

  it('should verify exact audited facts for Kotak League Platinum', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'kotak-league-platinum');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(499);
    expect(card?.annualFee).toBe(499);
    expect(card?.annualFeeWaiverCondition).toContain('50,000');
    expect(card?.domesticLoungesPerQuarter).toBe(0);
    expect(card?.recentChangeAlert?.isDevaluation).toBe(true);
    expect(card?.cappingDetails).toContain('35,000');
    expect(card?.movieBenefits).toContain('PVR');
  });

  it('should verify exact audited facts for Kotak Myntra discontinuation', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'kotak-myntra');
    expect(card).toBeDefined();
    expect(card?.status).toBe('discontinued');
    expect(card?.recentChangeAlert?.badge).toContain('Discontinued');
    expect(card?.recentChangeAlert?.effectiveDate).toContain('Jul 10, 2025');
  });

  it('should verify exact audited facts for PVR INOX Kotak', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'kotak-pvr-inox');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(0);
    expect(card?.annualFee).toBe(499);
    expect(card?.movieBenefits).toContain('PVR INOX');
    expect(card?.diningBenefits).toContain('20%');
  });

  it('should verify exact audited facts for RBL Bank World Safari with 0% forex', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'rbl-world-safari');
    expect(card).toBeDefined();
    expect(card?.forexMarkup).toBe(0);
    expect(card?.joiningFee).toBe(3000);
    expect(card?.annualFee).toBe(3000);
    expect(card?.domesticLoungesPerQuarter).toBe(2);
    expect(card?.loungeSpendCondition).toContain('35,000');
  });

  it('should verify exact audited facts for IDFC FIRST Select Lifetime Free', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'idfc-first-select');
    expect(card).toBeDefined();
    expect(card?.isLifetimeFree).toBe(true);
    expect(card?.joiningFee).toBe(0);
    expect(card?.annualFee).toBe(0);
    expect(card?.forexMarkup).toBe(0);
    expect(card?.loungeNetwork).toContain('DreamFolks');
    expect(card?.domesticLoungesPerQuarter).toBe(2);
    expect(card?.loungeSpendCondition).toContain('20,000');
  });

  it('should verify exact audited facts for OneCard Metal RBI halt', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'onecard-metal');
    expect(card).toBeDefined();
    expect(card?.isLifetimeFree).toBe(true);
    expect(card?.status).toBe('discontinued');
    expect(card?.recentChangeAlert?.badge).toContain('RBI');
    expect(card?.forexMarkup).toBe(1.0);
  });

  it('should verify exact audited facts for AU Zenith+ Super Premium and Dec 1 2026 revisions', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'au-zenith-plus');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(4999);
    expect(card?.annualFee).toBe(4999);
    expect(card?.annualFeeWaiverCondition).toContain('8,00,000');
    expect(card?.loungeSpendCondition).toContain('EXEMPT');
    expect(card?.recentChangeAlert?.effectiveDate).toContain('Dec 1, 2026');
  });

  it('should verify exact audited facts for ixigo AU Lifetime Free & 0% Forex', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'au-ixigo');
    expect(card).toBeDefined();
    expect(card?.isLifetimeFree).toBe(true);
    expect(card?.forexMarkup).toBe(0);
    expect(card?.domesticLoungesPerQuarter).toBe(2);
    expect(card?.railwayLoungesPerQuarter).toBe(2);
    expect(card?.loungeSpendCondition).toContain('50,000');
    expect(card?.loungeSpendCondition).toContain('add-on');
    expect(card?.rewardConversionDetails).toContain('99');
    expect(card?.recentChangeAlert?.effectiveDate).toContain('Apr 13, 2026');
  });

  it('should verify exact audited facts for Air India SBI Signature discontinuation and revisions', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'sbi-air-india');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(4999);
    expect(card?.annualFee).toBe(4999);
    expect(card?.status).toBe('discontinued');
    expect(card?.cashbackRate).toContain('10');
    expect(card?.recentChangeAlert?.badge).toContain('Discontinued');
    expect(card?.recentChangeAlert?.effectiveDate).toContain('Oct 28, 2026');
    expect(card?.changeHistory.some(ch => ch.date === 'Oct 28, 2026')).toBe(true);
    expect(card?.changeHistory.some(ch => ch.date === 'Mar 31, 2025')).toBe(true);
    expect(card?.changeHistory.some(ch => ch.date === 'Oct 10, 2024')).toBe(true);
    expect(card?.milestoneBenefits).toContain('100,000');
    expect(card?.officialCircularUrl).toBe('https://www.sbicard.com/en/personal/credit-cards/air-india-sbi-signature-card.html');
  });

  it('should verify exact audited facts for MakeMyTrip ICICI Bank Signature Credit Card', () => {
    const card = CREDIT_CARDS_DATA.find(c => c.id === 'icici-makemytrip');
    expect(card).toBeDefined();
    expect(card?.joiningFee).toBe(2500);
    expect(card?.annualFee).toBe(0);
    expect(card?.status).toBe('discontinued');
    expect(card?.domesticLoungesPerQuarter).toBe(1);
    expect(card?.internationalLoungesPerYear).toBe(1);
    expect(card?.railwayLoungesPerQuarter).toBe(1);
    expect(card?.loungeSpendCondition).toContain('75,000');
    expect(card?.recentChangeAlert?.badge).toContain('Applications Closed');
    expect(card?.recentChangeAlert?.effectiveDate).toContain('Jan 15, 2026');
    expect(card?.changeHistory.some(ch => ch.date === 'Jan 15, 2026')).toBe(true);
    expect(card?.changeHistory.some(ch => ch.date === 'Oct 15, 2025')).toBe(true);
    expect(card?.changeHistory.some(ch => ch.date === 'Apr 01, 2024')).toBe(true);
    expect(card?.milestoneBenefits).toContain('1,100');
    expect(card?.milestoneBenefits).toContain('4,000');
    expect(card?.officialCircularUrl).toBe('https://www.icici.bank.in/personal-banking/cards/credit-card/makemytrip/signature-credit-card');
    expect(card?.mitcUrl).toBe('https://www.icici.bank.in/terms-condition/tnc-for-signature-credit-card');
  });

  it('should verify exact audited facts for Swiggy HDFC, Axis Kwik, and Axis Atlas status updates', () => {
    const swiggy = CREDIT_CARDS_DATA.find(c => c.id === 'swiggy-hdfc');
    expect(swiggy?.status).toBe('discontinued');
    expect(swiggy?.headlineBenefit).toContain('PHASED OUT');

    const kwik = CREDIT_CARDS_DATA.find(c => c.id === 'kiwi-axis-rupay');
    expect(kwik?.status).toBe('discontinued');
    expect(kwik?.headlineBenefit).toContain('DISCONTINUED');

    const atlas = CREDIT_CARDS_DATA.find(c => c.id === 'axis-atlas');
    expect(atlas?.status).toBe('active');
    expect(atlas?.rewardPointValue).toContain('1:2');
  });

  it('should verify 0% forex markup across IDFC FIRST portfolio', () => {
    const wealth = CREDIT_CARDS_DATA.find(c => c.id === 'idfc-first-wealth');
    expect(wealth?.forexMarkup).toBe(0);
    expect(wealth?.loungeNetwork).toContain('DreamFolks');

    const select = CREDIT_CARDS_DATA.find(c => c.id === 'idfc-first-select');
    expect(select?.forexMarkup).toBe(0);
    expect(select?.loungeNetwork).toContain('DreamFolks');

    const millennia = CREDIT_CARDS_DATA.find(c => c.id === 'idfc-first-millennia');
    expect(millennia?.forexMarkup).toBe(0);
    expect(millennia?.domesticLoungesPerQuarter).toBe(0);
    expect(millennia?.railwayLoungesPerQuarter).toBe(4);
  });

  it('should verify 2026 devaluations for HDFC Regalia Gold, Infinia, and Scapia', () => {
    const regalia = CREDIT_CARDS_DATA.find(c => c.id === 'hdfc-regalia-gold');
    expect(regalia?.cashbackRate).toContain('5 RP per ₹200');
    expect(regalia?.recentChangeAlert?.badge).toContain('5 RP/₹200');

    const infinia = CREDIT_CARDS_DATA.find(c => c.id === 'hdfc-infinia-metal');
    expect(infinia?.cappingDetails).toContain('3,000');
    expect(infinia?.renewalBenefit).toContain('18 Lakhs');

    const scapia = CREDIT_CARDS_DATA.find(c => c.id === 'scapia-federal');
    expect(scapia?.merchantExclusions.some(e => e.includes('Insurance'))).toBe(true);
    expect(scapia?.merchantExclusions.some(e => e.includes('Utility'))).toBe(true);
  });

  it('should verify all 2026 special corrections required by user', () => {
    // 1. HDFC Millennia: SmartBuy travel redemption is ₹0.30 per point, not ₹1
    const millennia = CREDIT_CARDS_DATA.find(c => c.id === 'hdfc-millennia');
    expect(millennia?.rewardPointValue).toContain('₹0.30');
    expect(millennia?.rewardConversionDetails).toContain('₹0.30');

    // 2. Amex Platinum Travel: ₹4 lakh milestone still awards 10,000 MR points
    const platTravel = CREDIT_CARDS_DATA.find(c => c.id === 'amex-plat-travel');
    expect(platTravel?.milestoneBenefits).toContain('10,000');

    // 3. ICICI BookMyShow eligibility: 1 April 2026, not 1 February 2026
    const coral = CREDIT_CARDS_DATA.find(c => c.id === 'icici-coral');
    const rubyx = CREDIT_CARDS_DATA.find(c => c.id === 'icici-rubyx');
    const sapphiro = CREDIT_CARDS_DATA.find(c => c.id === 'icici-sapphiro');
    const hpcl = CREDIT_CARDS_DATA.find(c => c.id === 'icici-hpcl-super-saver');
    expect(coral?.cappingDetails).toContain('1 April 2026');
    expect(rubyx?.cappingDetails).toContain('1 April 2026');
    expect(sapphiro?.cappingDetails).toContain('1 April 2026');
    expect(hpcl?.cappingDetails).toContain('1 April 2026');

    // 4. IDFC FIRST: Bank clarified international transactions continue to earn reward points
    const wealth = CREDIT_CARDS_DATA.find(c => c.id === 'idfc-first-wealth');
    expect(wealth?.cappingDetails).toContain('clarified international transactions continue to earn reward points');

    // 5. PVR INOX Kotak: Specify complimentary entry to eligible in-cinema lounges, with purchases chargeable
    const pvrInox = CREDIT_CARDS_DATA.find(c => c.id === 'kotak-pvr-inox');
    expect(pvrInox?.loungeSpendCondition).toContain('in-cinema lounges');
    expect(pvrInox?.loungeSpendCondition).toContain('chargeable');

    // 6. Axis Magnus: Existing ₹50,000 spend requirement is an established 2024 policy, not a new Aug 2026 change
    const magnus = CREDIT_CARDS_DATA.find(c => c.id === 'axis-magnus');
    expect(magnus?.loungeSpendCondition).toContain('2024');

    // 7. Swiggy HDFC: Migration is phased and non-automatic for all cardholders simultaneously
    const swiggy = CREDIT_CARDS_DATA.find(c => c.id === 'swiggy-hdfc');
    expect(swiggy?.cappingDetails).toContain('phased individual migration');
  });

  it('should verify exact audited facts for slice UPI Credit Card (Slice Small Finance Bank)', () => {
    const slice = CREDIT_CARDS_DATA.find(c => c.id === 'slice-upi');
    expect(slice).toBeDefined();
    expect(slice?.bank).toBe('Slice Small Finance Bank');
    expect(slice?.isLifetimeFree).toBe(true);
    expect(slice?.joiningFee).toBe(0);
    expect(slice?.annualFee).toBe(0);
    expect(slice?.forexMarkup).toBe(0.0);
    expect(slice?.network).toBe('RuPay');
    expect(slice?.cashbackRate).toContain('3%');
    expect(slice?.cashbackRate).toContain('Monies');
    expect(slice?.cappingDetails).toContain('3.5%/mo');
    expect(slice?.cappingDetails).toContain('2.5%');
    expect(slice?.mitcUrl).toBe('https://slice.bank.in/cc-mitc/');
    expect(slice?.officialCircularUrl).toBe('https://slice.bank.in/credit-card');
    expect(slice?.benefitAudits?.length).toBeGreaterThanOrEqual(3);
  });
});
