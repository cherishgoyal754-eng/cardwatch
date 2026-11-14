import { CreditCard, BankHelpline } from '../types';

export const CREDIT_CARDS_DATA: CreditCard[] = [
  {
    id: 'hdfc-regalia-gold',
    name: 'HDFC Regalia Gold Credit Card',
    bank: 'HDFC Bank',
    bankLogoText: 'HDFC BANK',
    tier: 'Premium',
    network: 'Visa',
    cardStyle: 'aurum',
    cardNumberPreview: '•••• 4821',
    joiningFee: 2500,
    annualFee: 2500,
    annualFeeWaiverCondition: 'Waived on ₹4,00,000 annual spend',
    isLifetimeFree: false,
    minSalaryMonthly: 150000,
    minCibilScore: 750,
    status: 'active',
    headlineBenefit: '12 Domestic Lounges/Year + 4 Reward Points per ₹150',
    cashbackRate: 'Up to 6.6% on Marks & Spencer, Myntra, Nykaa via SmartBuy',
    rewardPointValue: '1 RP = ₹0.50 on SmartBuy Flight bookings & Gold vouchers',
    forexMarkup: 2.0,
    fuelSurchargeWaiver: '1% waiver on fuel transactions between ₹400 and ₹5,000 (capped at ₹500/month)',
    domesticLoungesPerQuarter: 2,
    internationalLoungesPerYear: 6,
    loungeSpendCondition: 'DEVALUATION: Requires min ₹1,00,000 spend in previous calendar quarter to unlock complimentary domestic lounge visits for the subsequent quarter.',
    loungeNetwork: 'Priority Pass',
    merchantExclusions: [
      'Rental payments (1% fee + no reward points)',
      'Government transactions & property tax (No points)',
      'Wallet loading (Paytm, Mobikwik) excluded',
      'Education fees paid via third-party apps incur 1% fee'
    ],
    cappingDetails: 'Reward points capped at 2,000 points per day for grocery purchases; SmartBuy daily cap of 5,000 points.',
    officialCircularUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card',
    lastVerifiedDate: 'Nov 02, 2024',
    isVerified: true,
    rating: 4.5,
    popularityIndex: 94,
    recentChangeAlert: {
      badge: 'Lounge Spend Criteria Added',
      effectiveDate: 'Dec 01, 2024',
      isDevaluation: true,
      description: 'Lounge access is no longer unconditional. Cardholders must spend ₹1 Lakh in the previous calendar quarter to unlock 2 lounge visits.'
    },
    changeHistory: [
      {
        date: 'Dec 01, 2024',
        type: 'devaluation',
        title: 'Lounge Spend Threshold Introduced',
        summary: 'Cardholders must now spend ₹1 Lakh in previous calendar quarter to unlock complimentary lounge access for next quarter.',
        oldValue: '12 Complimentary Domestic Lounge visits per year (Unconditional)',
        newValue: '2 Domestic Lounge visits per quarter ONLY after ₹1,00,000 quarter spend',
        officialRef: 'HDFC Circular: HDFC/CC/2024/REV-L09',
        severity: 'critical'
      },
      {
        date: 'Aug 01, 2024',
        type: 'restriction',
        title: 'Utility & Fuel Reward Capping',
        summary: 'Utility reward points capped at 2,000 points per month; 1% charge on third-party educational payments.',
        oldValue: 'Unlimited utility reward points at 4 RP per ₹150',
        newValue: 'Capped at 2,000 reward points per calendar month',
        officialRef: 'HDFC Customer Notice Ref 8941',
        severity: 'high'
      }
    ],
    tags: ['lounge', 'dining', 'travel', 'shopping', 'premium'],
    suitableFor: ['Frequent domestic travelers', 'People spending ₹1L+ per quarter', 'SmartBuy flight bookers']
  },
  {
    id: 'hdfc-infinia-metal',
    name: 'HDFC Infinia Metal Edition',
    bank: 'HDFC Bank',
    bankLogoText: 'HDFC BANK',
    tier: 'Super Premium',
    network: 'Visa',
    cardStyle: 'infinia',
    cardNumberPreview: '•••• 8890',
    joiningFee: 12500,
    annualFee: 12500,
    annualFeeWaiverCondition: 'Waived on spending ₹10,00,000 in previous year',
    isLifetimeFree: false,
    minSalaryMonthly: 300000,
    minCibilScore: 780,
    status: 'active',
    headlineBenefit: '3.3% to 33.3% Reward Rate via SmartBuy + Unlimited Global Lounges',
    cashbackRate: '33.3% on Hotels, 16.6% on Flights via SmartBuy portal',
    rewardPointValue: '1 RP = ₹1.00 for Apple products, Tanishq & Flight/Hotel bookings',
    forexMarkup: 2.0,
    fuelSurchargeWaiver: '1% waiver across all fuel stations in India',
    domesticLoungesPerQuarter: 'Unlimited',
    internationalLoungesPerYear: 'Unlimited (Primary + Add-on Priority Pass)',
    loungeSpendCondition: '100% Unconditional unlimited lounge access across India & 1,300+ global airports for primary and add-on cardholders.',
    loungeNetwork: 'Priority Pass',
    merchantExclusions: [
      'Wallet reloads & gift cards',
      'Govt transactions excluded from reward points',
      'Rental payment 1% convenience charge'
    ],
    cappingDetails: 'SmartBuy bonus rewards capped at 10,000 points per calendar month; 15,000 points per month overall across accelerated partners.',
    officialCircularUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card',
    lastVerifiedDate: 'Nov 10, 2024',
    isVerified: true,
    rating: 4.9,
    popularityIndex: 99,
    recentChangeAlert: {
      badge: 'SmartBuy Monthly Capping Revised',
      effectiveDate: 'Oct 01, 2024',
      isDevaluation: true,
      description: 'SmartBuy accelerated reward points capped strictly to 10,000 points per calendar month from 15,000 points.'
    },
    changeHistory: [
      {
        date: 'Oct 01, 2024',
        type: 'devaluation',
        title: 'SmartBuy Accelerated Cap Reduction',
        summary: 'Accelerated rewards on flight and hotel bookings through SmartBuy portal capped at 10,000 points per month.',
        oldValue: '15,000 accelerated reward points per calendar month',
        newValue: '10,000 accelerated reward points per calendar month',
        officialRef: 'HDFC Infinia T&C Oct 2024 Gazette',
        severity: 'medium'
      }
    ],
    tags: ['lounge', 'travel', 'dining', 'golf', 'premium', 'forex'],
    suitableFor: ['High Net-worth Individuals', 'Luxury travel & 5-star hotel bookings', 'Golf enthusiasts']
  },
  {
    id: 'sbi-cashback',
    name: 'SBI Cashback Credit Card',
    bank: 'SBI Card',
    bankLogoText: 'SBI CARD',
    tier: 'Entry Level',
    network: 'Visa',
    cardStyle: 'sbi',
    cardNumberPreview: '•••• 1042',
    joiningFee: 999,
    annualFee: 999,
    annualFeeWaiverCondition: 'Waived on annual online spend of ₹2,00,000',
    isLifetimeFree: false,
    minSalaryMonthly: 30000,
    minCibilScore: 720,
    status: 'active',
    headlineBenefit: '5% Flat Unlimited Cashback on All Online Spends (Capped at ₹5,000/mo)',
    cashbackRate: '5% on online e-commerce websites; 1% on offline spends',
    rewardPointValue: 'Direct statement credit (₹1 Cashback = ₹1 Statement Credit)',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% waiver (₹500 to ₹3,000 spend)',
    domesticLoungesPerQuarter: 0,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'No complimentary lounge access. Entire benefit is optimized for pure cash cashback.',
    loungeNetwork: 'None',
    merchantExclusions: [
      'Rent payments & property management',
      'Wallet loading (Amazon Pay, Paytm)',
      'School/college fee payments & utilities',
      'Jewellery purchases & precious metals',
      'Government and tax transactions'
    ],
    cappingDetails: 'Maximum ₹5,000 cashback per billing cycle (on ₹1,00,000 eligible online spend).',
    officialCircularUrl: 'https://www.sbicard.com/en/personal/credit-cards/rewards/cashback-sbi-card.page',
    lastVerifiedDate: 'Nov 08, 2024',
    isVerified: true,
    rating: 4.7,
    popularityIndex: 96,
    recentChangeAlert: {
      badge: 'Merchant Category Exclusions Expanded',
      effectiveDate: 'Sep 15, 2024',
      isDevaluation: true,
      description: 'Cashback removed on educational fees, transit passes and government utility platforms.'
    },
    changeHistory: [
      {
        date: 'Sep 15, 2024',
        type: 'restriction',
        title: 'Education & Utility Excluded from 5% Cashback',
        summary: 'School/tuition fees and railway tickets booked outside standard gateways excluded from cashback category.',
        oldValue: '5% cashback applied across most e-payments',
        newValue: 'Merchant code 8211, 8220 (Schools/Colleges) earn 0% cashback',
        officialRef: 'SBI Card Notification Circular SBIC/REV/2024',
        severity: 'high'
      }
    ],
    tags: ['cashback', 'shopping', 'grocery', 'dining'],
    suitableFor: ['Online shopping on Amazon/Flipkart/Swiggy', 'Zero hassle statement cashback', 'Everyday shoppers']
  },
  {
    id: 'scapia-federal',
    name: 'Scapia Federal Credit Card',
    bank: 'Federal Bank / Scapia',
    bankLogoText: 'SCAPIA FEDERAL',
    tier: 'Mid-Tier',
    network: 'Visa',
    cardStyle: 'scapia',
    cardNumberPreview: '•••• 7721',
    joiningFee: 0,
    annualFee: 0,
    annualFeeWaiverCondition: 'Nil Joining Fee & Nil Annual Fee (Unconditionally Lifetime Free)',
    isLifetimeFree: true,
    minSalaryMonthly: 25000,
    minCibilScore: 710,
    status: 'active',
    headlineBenefit: 'Zero Forex Markup across 180+ Countries • Unlimited Lounges (on ₹20k spend) • Dual Visa & RuPay Cards',
    cashbackRate: '20% on Scapia Travel app, 10% on Visa spends, 5% on RuPay UPI (₹500+)',
    rewardPointValue: '5 Scapia Coins = ₹1 on travel bookings via Scapia app (No Redemption Cap)',
    forexMarkup: 0.0,
    fuelSurchargeWaiver: '1% fuel surcharge waiver on applicable transactions',
    domesticLoungesPerQuarter: 'Unlimited',
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'Unlimited domestic airport lounge access + airport dining/shopping privileges (worth up to ₹1,000) unlock upon spending ₹20,000 in preceding/monthly billing cycle',
    loungeNetwork: 'DreamFolks',
    merchantExclusions: ['Rent payments', 'Wallet load', 'Cash withdrawals'],
    cappingDetails: 'Scapia Coins have a fixed value (5 Coins = ₹1) with no redemption cap on the Scapia app; ₹20,000 monthly cycle spend unlocks unlimited domestic lounge access + up to ₹1,000 airport dining/shopping privileges.',
    officialCircularUrl: 'https://www.scapia.cards/',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.8,
    popularityIndex: 94,
    recentChangeAlert: {
      badge: 'Lounge Qualification Revised to ₹20,000',
      effectiveDate: 'Sep 01, 2024',
      isDevaluation: true,
      description: 'Monthly spend criteria to unlock unlimited domestic lounge access and airport dining/shopping privileges (up to ₹1,000) was updated to ₹20,000 in preceding billing cycle.'
    },
    changeHistory: [
      {
        date: 'Sep 01, 2024',
        type: 'policy_update',
        title: 'Lounge Spend Criteria Updated to ₹20,000 + Dining Privileges',
        summary: 'Monthly spend requirement to unlock unlimited domestic lounge access and up to ₹1,000 airport dining/shopping privileges updated to ₹20,000 in preceding cycle.',
        oldValue: 'Spend ₹10,000 in monthly statement cycle',
        newValue: 'Spend ₹20,000 in preceding/monthly billing cycle (includes airport dining/shopping up to ₹1,000)',
        officialRef: 'Scapia Terms of Service Revision 2024',
        severity: 'medium'
      },
      {
        date: 'Aug 01, 2024',
        type: 'enhancement',
        title: 'Dual Card Issuance (Visa + RuPay UPI)',
        summary: 'One application provides a Visa card for general/international 0% forex spends and a RuPay card for UPI payments.',
        oldValue: 'Single Visa physical card only',
        newValue: 'Dual cards: Visa for international/general + RuPay for UPI (5% rewards on ₹500+)',
        officialRef: 'Scapia Product Blog 2024',
        severity: 'positive'
      }
    ],
    tags: ['forex', 'travel', 'lounge', 'lifetime-free', 'rupay', 'upi', 'rewards'],
    suitableFor: [
      'Zero Fees: Nil joining fee, nil annual fee, and zero forex markup across 180+ countries',
      'Dual Cards: Visa card for international spending & RuPay card for UPI transactions',
      '20% rewards on travel bookings (flights, stays, trains, buses, visas, experiences) on Scapia app',
      '10% rewards on eligible online and offline spends on the Visa card',
      '5% rewards on eligible UPI/online/offline spends of ₹500 or more on RuPay card',
      'Earned Scapia Coins have fixed value (5 Coins = ₹1) with no redemption cap on Scapia app',
      'Unlimited domestic airport lounges + up to ₹1,000 airport dining/shopping on ₹20,000 spend',
      '1% fuel surcharge waiver on applicable transactions'
    ]
  },
  {
    id: 'axis-magnus',
    name: 'Axis Bank Magnus Credit Card',
    bank: 'Axis Bank',
    bankLogoText: 'AXIS BANK',
    tier: 'Super Premium',
    network: 'Mastercard',
    cardStyle: 'kestrel',
    cardNumberPreview: '•••• 9942',
    joiningFee: 12500,
    annualFee: 12500,
    annualFeeWaiverCondition: 'Waived on ₹25,00,000 annual spend',
    isLifetimeFree: false,
    minSalaryMonthly: 250000,
    minCibilScore: 760,
    status: 'active',
    headlineBenefit: 'Unlimited Domestic Lounge Access + 8 Guest Visits with ₹50k Spend',
    cashbackRate: '12 EDGE Reward points per ₹200 spend; 5:2 conversion to airlines',
    rewardPointValue: '5 EDGE Points = 2 AirMiles (Singapore Krisflyer, Qatar Airways, Accor)',
    forexMarkup: 2.0,
    fuelSurchargeWaiver: '1% waiver on transactions between ₹400 and ₹4,000',
    domesticLoungesPerQuarter: 'Unlimited',
    internationalLoungesPerYear: 8,
    loungeSpendCondition: 'Lounge access for primary is unlimited; complimentary 8 guest visits requires spending ₹50,000 in previous 3 months.',
    loungeNetwork: 'Priority Pass',
    merchantExclusions: ['Rent, Govt utilities, Fuel, Insurance capped'],
    cappingDetails: 'EDGE Miles transfer capped at 5,00,000 points per year per cardholder group.',
    officialCircularUrl: 'https://www.axisbank.com/retail/cards/credit-card/magnus-credit-card',
    lastVerifiedDate: 'Oct 28, 2024',
    isVerified: true,
    rating: 4.1,
    popularityIndex: 88,
    recentChangeAlert: {
      badge: 'Historic Devaluation Implemented',
      effectiveDate: 'Sep 01, 2024',
      isDevaluation: true,
      description: 'Monthly 25,000 bonus EDGE points eliminated for non-Burgundy users; mileage ratio reduced from 5:4 to 5:2.'
    },
    changeHistory: [
      {
        date: 'Sep 01, 2024',
        type: 'devaluation',
        title: 'Removal of 25k Monthly Milestone Bonus',
        summary: 'The 25,000 monthly bonus points for spending ₹1 Lakh has been completely removed for regular Magnus holders.',
        oldValue: '25,000 bonus EDGE points every month on ₹1L spend',
        newValue: '0 milestone bonus points (Burgundy exclusive now)',
        officialRef: 'Axis Bank Notice Ref AX/CC/MAGNUS-SEP24',
        severity: 'critical'
      },
      {
        date: 'Sep 01, 2024',
        type: 'devaluation',
        title: 'Airline Partner Transfer Ratio Cut',
        summary: 'Points conversion ratio slashed by 60%.',
        oldValue: '5 EDGE Reward points = 4 Airline Miles / Hotel Points',
        newValue: '5 EDGE Reward points = 2 Airline Miles / Hotel Points',
        officialRef: 'Axis Bank Notice Ref AX/CC/MAGNUS-SEP24',
        severity: 'critical'
      }
    ],
    tags: ['lounge', 'travel', 'premium', 'dining', 'golf'],
    suitableFor: ['Axis Burgundy Priority customers', 'International long-haul flyers', 'Airport guest visits']
  },
  {
    id: 'icici-amazon-pay',
    name: 'Amazon Pay ICICI Bank Credit Card',
    bank: 'ICICI Bank',
    bankLogoText: 'ICICI BANK',
    tier: 'Entry Level',
    network: 'Visa',
    cardStyle: 'aurum',
    cardNumberPreview: '•••• 3319',
    joiningFee: 0,
    annualFee: 0,
    annualFeeWaiverCondition: 'Lifetime Free unconditionally for all applicants',
    isLifetimeFree: true,
    minSalaryMonthly: 20000,
    minCibilScore: 700,
    status: 'active',
    headlineBenefit: '5% Unlimited Cashback for Prime Members + 100% Lifetime Free',
    cashbackRate: '5% Amazon Prime, 3% Non-Prime, 2% Bill Payments, 1% All other spends',
    rewardPointValue: 'Direct 1:1 auto-credited into Amazon Pay balance monthly',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% fuel surcharge waiver at all petrol pumps in India',
    domesticLoungesPerQuarter: 0,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'No airport lounge access included.',
    loungeNetwork: 'None',
    merchantExclusions: ['Gold purchase, wallet top-up, EMI processing fee'],
    cappingDetails: 'NO CAPPING on cashback! 5% is truly unlimited.',
    officialCircularUrl: 'https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-credit-card',
    lastVerifiedDate: 'Nov 11, 2024',
    isVerified: true,
    rating: 4.8,
    popularityIndex: 98,
    changeHistory: [
      {
        date: 'Jun 18, 2024',
        type: 'enhancement',
        title: 'Instant Credit Approval Rollout',
        summary: '100% video KYC digital approval expanded with instant virtual card delivery on Amazon app.',
        oldValue: 'Physical verification for non-ICICI customers',
        newValue: 'Instant 10-minute digital approval via Aadhaar OTP',
        officialRef: 'Amazon Pay ICICI Partnership Statement',
        severity: 'positive'
      }
    ],
    tags: ['lifetime-free', 'cashback', 'shopping', 'grocery'],
    suitableFor: ['First credit card seekers', 'Heavy Amazon shoppers', 'Zero fee seekers']
  },
  {
    id: 'tata-neu-infinity',
    name: 'Tata Neu Infinity HDFC Bank Credit Card',
    bank: 'HDFC Bank',
    bankLogoText: 'TATA NEU HDFC',
    tier: 'Premium',
    network: 'RuPay',
    cardStyle: 'purple',
    cardNumberPreview: '•••• 6632',
    joiningFee: 1499,
    annualFee: 1499,
    annualFeeWaiverCondition: 'Waived on ₹3,00,000 annual spend',
    isLifetimeFree: false,
    minSalaryMonthly: 100000,
    minCibilScore: 740,
    status: 'active',
    headlineBenefit: '1.5% NeuCoins on UPI QR Payments + 5% on Tata Brands',
    cashbackRate: '1.5% on UPI spends; 10% on BigBasket, 1mg, Tata Cliq, Air India, Taj',
    rewardPointValue: '1 NeuCoin = ₹1.00 across all Tata brands & Air India flights',
    forexMarkup: 2.0,
    fuelSurchargeWaiver: '1% waiver (max ₹500/month)',
    domesticLoungesPerQuarter: 2,
    internationalLoungesPerYear: 4,
    loungeSpendCondition: 'DEVALUATION: Requires spending min ₹50,000 in previous calendar quarter to unlock complimentary domestic lounge visits via RuPay network.',
    loungeNetwork: 'Visa Lounge',
    merchantExclusions: ['Rent, Govt utilities, Wallet reloads'],
    cappingDetails: 'UPI merchant spend capped at 500 NeuCoins per calendar month for small merchant QR codes.',
    officialCircularUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/tata-neu-infinity-hdfc-bank-credit-card',
    lastVerifiedDate: 'Nov 09, 2024',
    isVerified: true,
    rating: 4.6,
    popularityIndex: 93,
    recentChangeAlert: {
      badge: 'UPI Lounge Threshold Updated',
      effectiveDate: 'Nov 15, 2024',
      isDevaluation: true,
      description: 'RuPay lounge access now requires ₹50,000 spend in preceding quarter.'
    },
    changeHistory: [
      {
        date: 'Nov 15, 2024',
        type: 'devaluation',
        title: 'RuPay Lounge Spend Requirement',
        summary: 'Complimentary lounge visits now require minimum ₹50,000 spend in previous calendar quarter.',
        oldValue: '2 visits/quarter unconditional with card swipe',
        newValue: '2 visits/quarter after ₹50,000 spend in previous quarter',
        officialRef: 'RuPay Network & HDFC Bulletin 2024',
        severity: 'high'
      }
    ],
    tags: ['upi', 'lounge', 'shopping', 'grocery', 'travel', 'dining'],
    suitableFor: ['UPI QR code spenders', 'BigBasket grocery shoppers', 'Air India & Taj stays']
  },
  {
    id: 'icici-sapphiro',
    name: 'ICICI Bank Sapphiro Credit Card',
    bank: 'ICICI Bank',
    bankLogoText: 'ICICI BANK',
    tier: 'Premium',
    network: 'Mastercard',
    cardStyle: 'gold',
    cardNumberPreview: '•••• 5521',
    joiningFee: 6500,
    annualFee: 3500,
    annualFeeWaiverCondition: 'Waived on ₹6,00,000 annual spend',
    isLifetimeFree: false,
    minSalaryMonthly: 175000,
    minCibilScore: 750,
    status: 'active',
    headlineBenefit: 'Buy 1 Get 1 Free Movie Tickets up to ₹500 on BMS + 4 Lounges/Quarter',
    cashbackRate: '4 Reward points per ₹100 domestic; 8 points per ₹100 international',
    rewardPointValue: '1 RP = ₹0.25 cash credit or vouchers',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% waiver on HPCL petrol pumps',
    domesticLoungesPerQuarter: 4,
    internationalLoungesPerYear: 2,
    loungeSpendCondition: 'DEVALUATION: Spend of ₹50,000 in previous calendar quarter required to activate 4 domestic lounge visits in next quarter.',
    loungeNetwork: 'DreamFolks',
    merchantExclusions: ['Rent, Wallet loading, Property management'],
    cappingDetails: 'BookMyShow BOGO capped at ₹500 off on second ticket twice every calendar month.',
    officialCircularUrl: 'https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card',
    lastVerifiedDate: 'Oct 30, 2024',
    isVerified: true,
    rating: 4.3,
    popularityIndex: 87,
    recentChangeAlert: {
      badge: 'Lounge Spend Criteria Active',
      effectiveDate: 'Oct 01, 2024',
      isDevaluation: true,
      description: 'Spend ₹50,000 in previous calendar quarter to unlock complimentary lounge access.'
    },
    changeHistory: [
      {
        date: 'Oct 01, 2024',
        type: 'devaluation',
        title: '₹50,000 Quarterly Spend Condition for Lounge',
        summary: 'ICICI implemented ₹50k previous quarter spend rule across Gemstone cards.',
        oldValue: '4 Complimentary visits/quarter unconditionally',
        newValue: '4 visits/quarter unlocked only on ₹50,000 quarterly spend',
        officialRef: 'ICICI Bank Gemstone Notice GEMS/2024',
        severity: 'high'
      }
    ],
    tags: ['movies', 'lounge', 'dining', 'golf', 'premium'],
    suitableFor: ['Movie buffs (BOGO BookMyShow up to ₹500)', 'Frequent flyers', 'Golf privileges']
  },
  {
    id: 'amex-plat-travel',
    name: 'American Express Platinum Travel',
    bank: 'American Express',
    bankLogoText: 'AMEX PLATINUM',
    tier: 'Premium',
    network: 'Amex',
    cardStyle: 'amex',
    cardNumberPreview: '•••• 1009',
    joiningFee: 3500,
    annualFee: 5000,
    annualFeeWaiverCondition: 'Retention offer or milestone spend',
    isLifetimeFree: false,
    minSalaryMonthly: 120000,
    minCibilScore: 760,
    status: 'active',
    headlineBenefit: 'Earn ₹48,000+ Value in Taj Vouchers & Travel on ₹4 Lakh Annual Spend',
    cashbackRate: 'Up to 9.5% effective reward rate when achieving ₹4 Lakh annual milestone',
    rewardPointValue: '40,000 MR points + ₹10,000 Taj Hotels voucher on ₹4L spend',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '0% convenience fee at HPCL pumps',
    domesticLoungesPerQuarter: 2,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'Complimentary 8 domestic airport lounges per year (2 per quarter) unconditional.',
    loungeNetwork: 'Visa Lounge',
    merchantExclusions: ['Fuel, Insurance, Utilities excluded from base points but count towards milestones'],
    cappingDetails: 'Milestones activate at ₹1.9 Lakhs and ₹4.0 Lakhs annual calendar spend.',
    officialCircularUrl: 'https://www.americanexpress.com/in/credit-cards/platinum-travel-credit-card/',
    lastVerifiedDate: 'Nov 07, 2024',
    isVerified: true,
    rating: 4.7,
    popularityIndex: 92,
    changeHistory: [
      {
        date: 'May 10, 2024',
        type: 'policy_update',
        title: 'Taj Voucher Digital Instant Issuance',
        summary: 'Taj stay vouchers now credited digitally via email within 48 hours of reaching ₹4 Lakh spend.',
        oldValue: 'Paper vouchers mailed via post (2-3 weeks)',
        newValue: 'Instant digital e-voucher code',
        officialRef: 'Amex India Member Circular',
        severity: 'positive'
      }
    ],
    tags: ['travel', 'lounge', 'dining', 'premium'],
    suitableFor: ['Couples planning luxury Taj holidays', 'Salaried professionals spending ₹30k-₹40k monthly', 'Travel lovers']
  },
  {
    id: 'amex-platinum',
    name: 'American Express Platinum Card',
    bank: 'American Express',
    bankLogoText: 'AMERICAN EXPRESS',
    tier: 'Super Premium',
    network: 'Amex',
    cardStyle: 'amex-platinum',
    cardNumberPreview: '•••• 7997',
    joiningFee: 60000,
    annualFee: 60000,
    annualFeeWaiverCondition: 'Strictly non-waivable super-premium metal charge card',
    isLifetimeFree: false,
    minSalaryMonthly: 300000,
    minCibilScore: 780,
    status: 'active',
    headlineBenefit: 'Centurion & Global Lounge Collection + Fine Hotels & Resorts VIP Upgrades + 24x7 Dedicated Concierge Desk',
    cashbackRate: '1 MR per ₹40; 3X on overseas spends; 5X via Amex Reward Multiplier portal',
    rewardPointValue: '1 MR = ₹0.50 on Taj Vouchers, Marriott Bonvoy & Airline Partners',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '0% convenience fee at all HPCL & BPCL fuel stations',
    domesticLoungesPerQuarter: 'Unlimited',
    internationalLoungesPerYear: 'Unlimited',
    loungeSpendCondition: 'Complimentary unlimited access to American Express Centurion Lounges, Priority Pass, Delta Sky Clubs, and Eurostar lounges worldwide with 2 guests.',
    loungeNetwork: 'Priority Pass',
    merchantExclusions: ['Fuel, Cash advances, and Utilities excluded from base points'],
    cappingDetails: '5X points capped at 25,000 bonus points per month via Reward Multiplier.',
    officialCircularUrl: 'https://www.americanexpress.com/in/charge-cards/platinum-card/',
    lastVerifiedDate: 'Nov 12, 2024',
    isVerified: true,
    rating: 4.9,
    popularityIndex: 98,
    recentChangeAlert: {
      badge: 'ENHANCEMENT: Fine Hotels & Resorts Credit',
      effectiveDate: 'Jan 01, 2025',
      isDevaluation: false,
      description: 'Added ₹30,000 annual Taj Hotel credit and instant Marriott Gold Elite & Hilton Honors Gold VIP statuses.'
    },
    changeHistory: [
      {
        date: 'Oct 01, 2024',
        type: 'enhancement',
        title: 'New Metal Form Factor & Global Lounge Upgrade',
        summary: 'Card engineered with stainless steel core with Centurion engraving and unlimited Priority Pass guest access.',
        oldValue: 'Plastic card with limited lounge guest allowances',
        newValue: 'All-metal precision engraved Centurion charge card',
        officialRef: 'Amex India Platinum Charter 2024',
        severity: 'positive'
      }
    ],
    tags: ['premium', 'lounge', 'travel', 'dining', 'golf'],
    suitableFor: ['HNIs & CXOs seeking global Centurion lounge access', 'International travelers wanting 5-star hotel upgrades', 'Luxury diners wanting dedicated table concierge']
  },
  {
    id: 'hdfc-diners-black',
    name: 'HDFC Diners Club Black Metal Edition',
    bank: 'HDFC Bank',
    bankLogoText: 'HDFC DINERS BLACK',
    tier: 'Super Premium',
    network: 'Diners Club',
    cardStyle: 'diners',
    cardNumberPreview: '•••• 8012',
    joiningFee: 10000,
    annualFee: 10000,
    annualFeeWaiverCondition: 'Waived on spends of ₹8 Lakhs or more in preceding 12 months',
    isLifetimeFree: false,
    minSalaryMonthly: 200000,
    minCibilScore: 780,
    status: 'active',
    headlineBenefit: 'Unlimited Domestic & International Lounges (Primary + Add-on Guest) + 33.3% SmartBuy Flight/Hotel Rewards',
    cashbackRate: '5 Reward Points per ₹150; 10X (33.3%) on SmartBuy Flights, Hotels, and Apple purchases',
    rewardPointValue: '1 Reward Point = ₹1.00 on Flights and Hotels booked via HDFC SmartBuy portal',
    forexMarkup: 2.0,
    fuelSurchargeWaiver: '1% fuel surcharge waiver up to ₹1,000 per statement cycle',
    domesticLoungesPerQuarter: 'Unlimited',
    internationalLoungesPerYear: 'Unlimited',
    loungeSpendCondition: 'Unlimited complimentary domestic and international airport lounge access for primary cardholder PLUS add-on guest across 1,300+ lounges globally.',
    loungeNetwork: 'DreamFolks',
    merchantExclusions: ['Rental payments (1% fee + zero reward points)', 'Government transactions & property tax', 'Wallet loading transactions'],
    cappingDetails: 'Daily 10X SmartBuy points capped at 2,500 RP per day; monthly SmartBuy cap is 7,500 RP.',
    officialCircularUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/diners-club-black',
    lastVerifiedDate: 'Nov 11, 2024',
    isVerified: true,
    rating: 4.9,
    popularityIndex: 97,
    recentChangeAlert: {
      badge: 'SMARTBUY UPDATE: Daily Cap Adjusted',
      effectiveDate: 'Sep 01, 2024',
      isDevaluation: true,
      description: 'Daily SmartBuy 10X bonus points capped at 2,500 points per day to prevent bulk commercial ticketing.'
    },
    changeHistory: [
      {
        date: 'Sep 01, 2024',
        type: 'devaluation',
        title: 'SmartBuy 10X Daily Capping',
        summary: 'Accelerated reward points on flights capped at 2,500 points/day while keeping 33.3% redemption ratio intact.',
        oldValue: 'No daily limit on 10X points (only 7,500 monthly cap)',
        newValue: '2,500 RP daily cap + 7,500 RP monthly cap',
        officialRef: 'HDFC Bank Customer Circular REF:DCB-2024-09',
        severity: 'medium'
      }
    ],
    tags: ['premium', 'lounge', 'travel', 'dining', 'golf'],
    suitableFor: ['High-income earners wanting 33.3% return on flights', 'Couples traveling together needing free guest lounge entry', 'Golf enthusiasts wanting 6 complimentary games/quarter']
  },
  {
    id: 'idfc-first-wealth',
    name: 'IDFC FIRST Wealth Credit Card',
    bank: 'IDFC FIRST Bank',
    bankLogoText: 'IDFC FIRST',
    tier: 'Premium',
    network: 'Visa',
    cardStyle: 'kestrel',
    cardNumberPreview: '•••• 7289',
    joiningFee: 0,
    annualFee: 0,
    annualFeeWaiverCondition: 'Lifetime Free unconditionally',
    isLifetimeFree: true,
    minSalaryMonthly: 200000,
    minCibilScore: 750,
    status: 'active',
    headlineBenefit: 'Lifetime Free + 4 Lounges/Quarter (₹20k spend) + Low 1.5% Forex Markup',
    cashbackRate: '10x reward points on spends above ₹30,000 monthly; 3x on spends below ₹30k',
    rewardPointValue: '1 RP = ₹0.25 (Never expires, can be used for bill settlement)',
    forexMarkup: 1.5,
    fuelSurchargeWaiver: '1% waiver up to ₹300/month',
    domesticLoungesPerQuarter: 4,
    internationalLoungesPerYear: 4,
    loungeSpendCondition: 'DEVALUATION: Requires spending min ₹20,000 in preceding calendar month to unlock lounge access for current month.',
    loungeNetwork: 'DreamFolks',
    merchantExclusions: ['Rent, Govt payments earn 1x reward points only'],
    cappingDetails: 'Points never expire; low interest rate from 9% to 36% APR.',
    officialCircularUrl: 'https://www.idfcfirstbank.com/credit-card/wealth',
    lastVerifiedDate: 'Oct 25, 2024',
    isVerified: true,
    rating: 4.6,
    popularityIndex: 90,
    recentChangeAlert: {
      badge: 'Monthly Spend Lounge Rule',
      effectiveDate: 'May 01, 2024',
      isDevaluation: true,
      description: 'Complimentary lounge access now conditioned on ₹20,000 spend in preceding month.'
    },
    changeHistory: [
      {
        date: 'May 01, 2024',
        type: 'devaluation',
        title: 'Monthly Lounge Qualifying Spend',
        summary: 'Lounge access converted from unconditional to monthly ₹20,000 spend criteria.',
        oldValue: '4 complimentary visits/quarter with no conditions',
        newValue: '4 visits/quarter unlocked on ₹20,000 previous month spend',
        officialRef: 'IDFC FIRST Bank CC Revision 2024',
        severity: 'medium'
      }
    ],
    tags: ['lifetime-free', 'lounge', 'forex', 'travel', 'dining', 'movies'],
    suitableFor: ['Zero fee super-premium seekers', 'Spa and lounge privileges', 'Overseas travel with 1.5% forex']
  },
  {
    id: 'kiwi-axis-rupay',
    name: 'Kiwi Axis Bank Virtual RuPay Credit Card',
    bank: 'Axis Bank / Kiwi',
    bankLogoText: 'KIWI RUPAY',
    tier: 'Entry Level',
    network: 'RuPay',
    cardStyle: 'aurum',
    cardNumberPreview: '•••• 1983',
    joiningFee: 0,
    annualFee: 0,
    annualFeeWaiverCondition: 'Lifetime Free unconditionally',
    isLifetimeFree: true,
    minSalaryMonthly: 25000,
    minCibilScore: 710,
    status: 'active',
    headlineBenefit: 'Flat 2% Cashback on UPI QR Code Payments + Instant Digital Issuance',
    cashbackRate: '2% on Scan & Pay at merchant QR codes; 0.5% on regular online',
    rewardPointValue: 'Direct Kiwi Kiwis (1 Kiwi = ₹0.25 to ₹1.00 via Neon)',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: 'No waiver',
    domesticLoungesPerQuarter: 0,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'No airport lounge access included.',
    loungeNetwork: 'None',
    merchantExclusions: ['Peer-to-peer personal transfers (P2P)', 'Rent payments'],
    cappingDetails: 'Max 1,000 Kiwis per billing cycle on standard tier.',
    officialCircularUrl: 'https://gokiwi.in/',
    lastVerifiedDate: 'Nov 04, 2024',
    isVerified: true,
    rating: 4.4,
    popularityIndex: 89,
    changeHistory: [
      {
        date: 'Jul 15, 2024',
        type: 'policy_update',
        title: 'Neon Subscription Integration',
        summary: 'Kiwi introduced Neon tier giving 2% flat cashback on UPI merchant payments.',
        oldValue: '0.5% base UPI cashback',
        newValue: '2% boosted UPI cashback with Neon streak',
        officialRef: 'Kiwi Terms v2.4',
        severity: 'positive'
      }
    ],
    tags: ['lifetime-free', 'upi', 'cashback', 'shopping'],
    suitableFor: ['Tea stalls, grocery & daily UPI payments', 'Anyone wanting credit on Google Pay/PhonePe/Kiwi', 'Zero fee']
  },
  {
    id: 'flipkart-axis',
    name: 'Flipkart Axis Bank Credit Card',
    bank: 'Axis Bank',
    bankLogoText: 'AXIS BANK',
    tier: 'Entry Level',
    network: 'Visa',
    cardStyle: 'aurum',
    cardNumberPreview: '•••• 4400',
    joiningFee: 500,
    annualFee: 500,
    annualFeeWaiverCondition: 'Waived on ₹3,50,000 annual spend',
    isLifetimeFree: false,
    minSalaryMonthly: 25000,
    minCibilScore: 720,
    status: 'active',
    headlineBenefit: '5% Unlimited Cashback on Flipkart & Myntra + 4% on Preferred Partners',
    cashbackRate: '5% on Flipkart/Myntra, 4% on Swiggy, Uber, PVR, Cult.fit, 1.5% other spends',
    rewardPointValue: 'Direct statement cashback credited every month automatically',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% waiver between ₹400 and ₹4,000',
    domesticLoungesPerQuarter: 0,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'DEVALUATION: Complimentary domestic airport lounge access discontinued.',
    loungeNetwork: 'None',
    merchantExclusions: ['Fuel transactions', 'Wallet loading', 'Rent payments', 'Government services', 'Jewellery purchases'],
    cappingDetails: 'Unlimited cashback on Flipkart & Myntra with no monthly maximum cap.',
    officialCircularUrl: 'https://www.axisbank.com/retail/cards/credit-card/flipkart-axis-bank-credit-card',
    lastVerifiedDate: 'Nov 04, 2024',
    isVerified: true,
    rating: 4.6,
    popularityIndex: 96,
    changeHistory: [
      {
        date: 'Aug 18, 2023',
        type: 'devaluation',
        title: 'Lounge Access & Preferred Partner Devaluation',
        summary: 'Domestic lounge access withdrawn and preferred partner cashback streamlined to 4%.',
        oldValue: '4 Complimentary Domestic Lounge visits/year',
        newValue: 'No complimentary lounge visits',
        officialRef: 'Axis Bank Notice CC/FLIP/2023-08',
        severity: 'high'
      }
    ],
    tags: ['cashback', 'shopping', 'entry-level'],
    suitableFor: ['Frequent Flipkart & Myntra shoppers', 'Swiggy & Uber daily users', 'Zero-fuss direct statement credit']
  },
  {
    id: 'axis-atlas',
    name: 'Axis Bank ATLAS Credit Card',
    bank: 'Axis Bank',
    bankLogoText: 'AXIS BANK',
    tier: 'Premium',
    network: 'Visa',
    cardStyle: 'aurum',
    cardNumberPreview: '•••• 0000',
    joiningFee: 5000,
    annualFee: 5000,
    annualFeeWaiverCondition: 'Tier progression based on milestone spends (Silver, Gold, Platinum)',
    isLifetimeFree: false,
    minSalaryMonthly: 125000,
    minCibilScore: 750,
    status: 'active',
    headlineBenefit: '5 EDGE Miles per ₹100 on Airlines & Hotels (1:2 Miles Transfer Ratio)',
    cashbackRate: 'Up to 10% value back on direct airline and hotel transactions',
    rewardPointValue: '1 EDGE Mile = 2 Airline/Hotel Miles (Singapore Krisflyer, Accor, Qatar, Turkish)',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% waiver between ₹400 and ₹4,000',
    domesticLoungesPerQuarter: 2,
    internationalLoungesPerYear: 4,
    loungeSpendCondition: 'Includes complimentary domestic & international lounge visits per tier status.',
    loungeNetwork: 'DreamFolks',
    merchantExclusions: ['Rent payments', 'Wallet upload', 'Government utilities', 'Gold/Jewellery'],
    cappingDetails: 'Monthly cap on 5x accelerated travel category is 10,000 EDGE Miles per billing cycle.',
    officialCircularUrl: 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card',
    lastVerifiedDate: 'Nov 01, 2024',
    isVerified: true,
    rating: 4.8,
    popularityIndex: 93,
    changeHistory: [
      {
        date: 'Apr 20, 2024',
        type: 'devaluation',
        title: 'Miles Conversion Cap & Exclusions',
        summary: 'Axis Bank capped annual group A and group B partner mile transfers.',
        oldValue: 'Uncapped partner mile transfers',
        newValue: 'Annual capping on group A (30,000 miles) and group B transfers',
        officialRef: 'Axis Circular ATLAS/2024/04',
        severity: 'critical'
      }
    ],
    tags: ['travel', 'super-premium', 'rewards', 'shopping'],
    suitableFor: ['Frequent domestic & international flyers', 'Direct airline & hotel bookings', 'Accor & Singapore KrisFlyer fans']
  },
  {
    id: 'swiggy-hdfc',
    name: 'Swiggy HDFC Bank Credit Card',
    bank: 'HDFC Bank',
    bankLogoText: 'HDFC BANK',
    tier: 'Entry Level',
    network: 'Mastercard',
    cardStyle: 'aurum',
    cardNumberPreview: '•••• 7712',
    joiningFee: 500,
    annualFee: 500,
    annualFeeWaiverCondition: 'Waived on ₹2,00,000 annual spend',
    isLifetimeFree: false,
    minSalaryMonthly: 25000,
    minCibilScore: 720,
    status: 'active',
    headlineBenefit: '10% Cashback on Swiggy (Food, Instamart, Dineout) + 5% Top Online Merchants',
    cashbackRate: '10% on Swiggy app, 5% on Amazon, Flipkart, Myntra, Nykaa, 1% other spends',
    rewardPointValue: 'Direct Swiggy Money cashback automatically credited every cycle',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: 'No waiver',
    domesticLoungesPerQuarter: 0,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'No airport lounge access included.',
    loungeNetwork: 'None',
    merchantExclusions: ['Rent', 'Wallet loads', 'Fuel', 'Government payments'],
    cappingDetails: '10% Swiggy cashback capped at ₹1,500/month; 5% online capped at ₹1,500/month.',
    officialCircularUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/swiggy-hdfc-bank-credit-card',
    lastVerifiedDate: 'Nov 03, 2024',
    isVerified: true,
    rating: 4.7,
    popularityIndex: 95,
    changeHistory: [
      {
        date: 'Jun 20, 2024',
        type: 'enhancement',
        title: 'Direct Swiggy Money Statement Balance Option',
        summary: 'Cashback now flows seamlessly into Swiggy Money wallet for instant order redemption.',
        oldValue: 'Manual voucher claiming',
        newValue: 'Instant automatic Swiggy Money credit',
        officialRef: 'HDFC Swiggy Benefit Bulletin v1.8',
        severity: 'positive'
      }
    ],
    tags: ['cashback', 'dining', 'shopping', 'entry-level'],
    suitableFor: ['Daily Swiggy Food & Instamart ordering', 'Online shopping at Amazon/Myntra/Flipkart', 'High cashback for low annual fee']
  },
  {
    id: 'hsbc-live-plus',
    name: 'HSBC Live+ Credit Card',
    bank: 'HSBC',
    bankLogoText: 'HSBC',
    tier: 'Mid-Tier',
    network: 'Visa',
    cardStyle: 'aurum',
    cardNumberPreview: '•••• 3819',
    joiningFee: 999,
    annualFee: 999,
    annualFeeWaiverCondition: 'Waived on ₹2,00,000 annual spend',
    isLifetimeFree: false,
    minSalaryMonthly: 50000,
    minCibilScore: 730,
    status: 'active',
    headlineBenefit: 'Flat 10% Accelerated Cashback on Dining, Food Delivery & Grocery Spends',
    cashbackRate: '10% on Dining & Food delivery (Swiggy, Zomato) & Groceries (Blinkit, Zepto, Instamart), 1.5% other spends',
    rewardPointValue: 'Direct statement credit cashback (₹1 = ₹1 statement offset)',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: 'No fuel waiver',
    domesticLoungesPerQuarter: 1,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: '1 complimentary domestic airport lounge visit per calendar quarter.',
    loungeNetwork: 'Visa Lounge',
    merchantExclusions: ['Fuel', 'Rent', 'Wallet loads', 'Jewellery', 'Government utilities'],
    cappingDetails: '10% accelerated dining/grocery cashback capped at ₹1,000 per billing month.',
    officialCircularUrl: 'https://www.hsbc.co.in/credit-cards/products/live-plus/',
    lastVerifiedDate: 'Nov 02, 2024',
    isVerified: true,
    rating: 4.8,
    popularityIndex: 94,
    changeHistory: [
      {
        date: 'Jun 24, 2024',
        type: 'enhancement',
        title: 'Rebranded from Cashback Card to Live+',
        summary: 'HSBC revamped the popular Cashback Card into Live+ with enhanced dining and quick-commerce groceries.',
        oldValue: '1.5% flat cashback with 10% dining cap',
        newValue: '10% accelerated cashback on dining and groceries up to ₹1,000/mo',
        officialRef: 'HSBC Retail Banking Circular LIVE+/2024-06',
        severity: 'positive'
      }
    ],
    tags: ['dining', 'cashback', 'shopping'],
    suitableFor: ['Dining enthusiasts and Zomato/Swiggy orders', 'Supermarket & quick-commerce grocery buyers (Blinkit/Zepto)', 'Direct statement balance deduction']
  },
  {
    id: 'sbi-simplysave',
    name: 'SBI Card SimplySAVE Credit Card',
    bank: 'SBI Card',
    bankLogoText: 'SBI CARD',
    tier: 'Entry Level',
    network: 'Visa',
    cardStyle: 'sbi',
    cardNumberPreview: '•••• 2910',
    joiningFee: 499,
    annualFee: 499,
    annualFeeWaiverCondition: 'Waived on ₹1,00,000 annual spend',
    isLifetimeFree: false,
    minSalaryMonthly: 20000,
    minCibilScore: 700,
    status: 'active',
    headlineBenefit: '10X Reward Points on Dining, Movies, Grocery & Departmental Store Spends',
    cashbackRate: '10 Reward Points per ₹150 spent on Dining/Grocery/Movies (equivalent to 2.5% valueback)',
    rewardPointValue: '4 Reward Points = ₹1.00 for statement credit or catalogue redemption',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% waiver across all petrol pumps in India (₹500 to ₹3,000)',
    domesticLoungesPerQuarter: 0,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'No airport lounge access included.',
    loungeNetwork: 'None',
    merchantExclusions: ['Wallet loads', 'Property tax and Govt utilities', 'Education fees via third-party'],
    cappingDetails: '10X reward points capped at 10,000 points per calendar month.',
    officialCircularUrl: 'https://www.sbicard.com/en/personal/credit-cards/shopping/simplysave-sbi-card.page',
    lastVerifiedDate: 'Nov 01, 2024',
    isVerified: true,
    rating: 4.3,
    popularityIndex: 91,
    changeHistory: [
      {
        date: 'Nov 01, 2024',
        type: 'fee_revision',
        title: 'Utility Payment Fee Revisions',
        summary: 'SBI Card levied 1% fee on utility payments exceeding ₹50,000 in a billing cycle.',
        oldValue: 'Zero fee on utility payments',
        newValue: '1% fee on utility transactions over ₹50,000/cycle',
        officialRef: 'SBI Card Utility Circular SBIC/REV/2024-11',
        severity: 'medium'
      }
    ],
    tags: ['dining', 'shopping', 'entry-level', 'rewards'],
    suitableFor: ['Beginner credit card users', 'Supermarket grocery and movie spenders', 'Fuel surcharge waiver across any petrol pump']
  },
  {
    id: 'indusind-tiger',
    name: 'IndusInd Bank Tiger Credit Card',
    bank: 'IndusInd Bank',
    bankLogoText: 'INDUSIND BANK',
    tier: 'Premium',
    network: 'Visa',
    cardStyle: 'aurum',
    cardNumberPreview: '•••• 9010',
    joiningFee: 0,
    annualFee: 0,
    annualFeeWaiverCondition: 'Unconditionally Lifetime Free (₹0 Joining & Annual Fee)',
    isLifetimeFree: true,
    minSalaryMonthly: 60000,
    minCibilScore: 740,
    status: 'active',
    headlineBenefit: 'Lifetime Free (₹0) • Earn up to 6X Accelerated Rewards per ₹100 • 1.50% Discounted Forex Markup',
    cashbackRate: 'Earn up to 6X accelerated reward points per ₹100 spent (capped/scaled based on monthly or annual spend milestones)',
    rewardPointValue: '1 Reward Point = ₹0.40 for cash credit, or redeemable for airmiles (including 1:1 transfer ratio to Air India Maharaja Club)',
    forexMarkup: 1.5,
    fuelSurchargeWaiver: '1% fuel surcharge waiver on transactions between ₹400 and ₹4,000',
    domesticLoungesPerQuarter: 2,
    internationalLoungesPerYear: 2,
    loungeSpendCondition: '8 domestic airport lounge visits per year (2 per quarter) via Credit Card + 2 international airport lounge visits per year via Priority Pass',
    loungeNetwork: 'Domestic Lounge Program + Priority Pass',
    merchantExclusions: ['Rent payments', 'Wallet load', 'Government payments'],
    cappingDetails: 'Accelerated reward points capped at 5,000 points per statement cycle.',
    officialCircularUrl: 'https://www.indusind.bank.in/in/en/personal/cards/credit-card/tiger-credit-card.html',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.8,
    popularityIndex: 94,
    changeHistory: [
      {
        date: 'Sep 01, 2024',
        type: 'enhancement',
        title: 'Reduced Forex Markup to 1.50%',
        summary: 'IndusInd Bank slashed forex markup on Tiger card from 3.5% to 1.50% for international transactions.',
        oldValue: '3.5% standard forex fee',
        newValue: '1.50% discounted forex markup fee',
        officialRef: 'IndusInd Tiger Circular 2024-09',
        severity: 'positive'
      }
    ],
    tags: ['lifetime-free', 'travel', 'rewards', 'shopping', 'lounge'],
    suitableFor: [
      'Lifetime Free (₹0 Joining Fee & ₹0 Annual Fee)',
      'Earn up to 6X accelerated reward points per ₹100 spent (scaled on milestones)',
      '1 Reward Point = ₹0.40 cash credit or 1:1 airmile transfer to Air India Maharaja Club',
      '8 domestic airport lounge visits per year (2 per quarter) + 2 international via Priority Pass',
      'Discounted foreign currency mark-up fee of 1.50%',
      '1 complimentary golf game or lesson per quarter (4 per year) booked via Apexlynx',
      '1 complimentary BookMyShow movie ticket (up to ₹500) every 6 months',
      '1% fuel surcharge waiver on transactions between ₹400 and ₹4,000'
    ]
  },
  {
    id: 'idfc-first-millennia',
    name: 'IDFC FIRST Millennia Credit Card',
    bank: 'IDFC FIRST Bank',
    bankLogoText: 'IDFC FIRST',
    tier: 'Entry Level',
    network: 'Visa',
    cardStyle: 'kestrel',
    cardNumberPreview: '•••• 6321',
    joiningFee: 0,
    annualFee: 0,
    annualFeeWaiverCondition: 'Lifetime Free with no conditions',
    isLifetimeFree: true,
    minSalaryMonthly: 25000,
    minCibilScore: 710,
    status: 'active',
    headlineBenefit: 'Lifetime Free Card + 10X Reward Points on Spends Beyond ₹20,000/mo',
    cashbackRate: '6X on online, 3X on offline, 10X reward points on incremental spends above ₹20,000',
    rewardPointValue: '1 Reward Point = ₹0.25 (Reward points never expire)',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% fuel surcharge waiver up to ₹200/month',
    domesticLoungesPerQuarter: 1,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'DEVALUATION: Requires min ₹20,000 spend in previous calendar month to unlock domestic lounge.',
    loungeNetwork: 'DreamFolks',
    merchantExclusions: ['Rent payments (1% fee)', 'Wallet loads', 'Property tax'],
    cappingDetails: 'Reward points never expire and have no redemption capping.',
    officialCircularUrl: 'https://www.idfcfirstbank.com/credit-card/millennia',
    lastVerifiedDate: 'Nov 02, 2024',
    isVerified: true,
    rating: 4.5,
    popularityIndex: 92,
    changeHistory: [
      {
        date: 'May 01, 2024',
        type: 'devaluation',
        title: 'Lounge Monthly Spend Threshold Added',
        summary: 'Complimentary lounge visit now requires ₹20,000 minimum spend in previous billing cycle.',
        oldValue: 'Unconditional complimentary domestic lounge visit',
        newValue: 'Requires ₹20,000 monthly spend',
        officialRef: 'IDFC First Circular IDFC/CC/2024/05',
        severity: 'high'
      }
    ],
    tags: ['lifetime-free', 'shopping', 'rewards', 'entry-level'],
    suitableFor: ['Anyone wanting a zero-fee lifetime free card', 'Points that never expire', '0% interest on ATM cash withdrawals up to 48 days']
  },
  {
    id: 'axis-indianoil',
    name: 'IndianOil Axis Bank RuPay Credit Card',
    bank: 'Axis Bank',
    bankLogoText: 'AXIS BANK',
    tier: 'Entry Level',
    network: 'RuPay',
    cardStyle: 'aurum',
    cardNumberPreview: '•••• 6529',
    joiningFee: 500,
    annualFee: 500,
    annualFeeWaiverCondition: 'Waived on ₹50,000 annual spend',
    isLifetimeFree: false,
    minSalaryMonthly: 20000,
    minCibilScore: 710,
    status: 'active',
    headlineBenefit: '4% Valueback on Fuel at IndianOil Outlets + UPI QR Code Payment Access',
    cashbackRate: '20 EDGE Points per ₹100 spent at IndianOil outlets (4% valueback) + 1% fuel surcharge waiver',
    rewardPointValue: '1 EDGE Point = ₹0.20 (convertible to IndianOil fuel points or catalogue)',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% waiver on fuel purchases between ₹400 and ₹4,000',
    domesticLoungesPerQuarter: 0,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'No airport lounge access included.',
    loungeNetwork: 'None',
    merchantExclusions: ['Non-IOCL petrol pumps earn regular 1x points', 'Wallet load', 'Rent'],
    cappingDetails: '4% fuel valueback capped at ₹250 per month (spends up to ₹4,000 at IOCL pumps).',
    officialCircularUrl: 'https://www.axisbank.com/retail/cards/credit-card/indianoil-axis-bank-credit-card',
    lastVerifiedDate: 'Nov 03, 2024',
    isVerified: true,
    rating: 4.4,
    popularityIndex: 88,
    changeHistory: [
      {
        date: 'Sep 10, 2024',
        type: 'enhancement',
        title: 'RuPay UPI Integration',
        summary: 'Link seamlessly to Google Pay, PhonePe, and Paytm for merchant UPI QR payments.',
        oldValue: 'Physical card only',
        newValue: 'Instant RuPay UPI on all apps',
        officialRef: 'NPCI / Axis Bank RuPay Notice 2024-09',
        severity: 'positive'
      }
    ],
    tags: ['fuel', 'upi', 'entry-level', 'cashback'],
    suitableFor: ['Daily bike and car commuters using IndianOil pumps', 'UPI QR code Scan & Pay via credit', 'Low annual fee with easy spend waiver']
  }
];

export const BANK_HELPLINES_DATA: BankHelpline[] = [
  {
    bank: 'HSBC',
    shortName: 'HSBC',
    logoColor: '#dc2626',
    conciergeNumber: '1800-266-3456',
    generalSupport: '1800-120-4722',
    premiumDesk: '022-67015555',
    email: 'info@hsbc.co.in',
    whatsappSupport: '+91 800 266 3456',
    portalUrl: 'https://www.hsbc.co.in',
    notes: 'Live+ cardholders receive dedicated dining dispute resolution and worldwide emergency card replacement.'
  },
  {
    bank: 'IndusInd Bank',
    shortName: 'IndusInd',
    logoColor: '#991b1b',
    conciergeNumber: '1860-267-7777',
    generalSupport: '1800-267-7777',
    premiumDesk: '022-68577777',
    email: 'reachus@indusind.com',
    whatsappSupport: '+91 22 4406 6666',
    portalUrl: 'https://www.indusind.com',
    notes: 'Tiger Card desk offers 24x7 global customer assistance and zero lost-card liability.'
  },
  {
    bank: 'HDFC Bank',
    shortName: 'HDFC',
    logoColor: '#1d4ed8',
    conciergeNumber: '1800-266-4332',
    generalSupport: '1800-202-6161',
    premiumDesk: '022-68461208',
    email: 'customerservices.cards@hdfcbank.com',
    whatsappSupport: '+91 70700 22222',
    portalUrl: 'https://mycards.hdfcbank.com',
    notes: 'Infinia & Diners Black cardholders get 24x7 dedicated Concierge for hotel/flight and dining table bookings.'
  },
  {
    bank: 'ICICI Bank',
    shortName: 'ICICI',
    logoColor: '#ea580c',
    conciergeNumber: '1800-1080',
    generalSupport: '1800-103-8181',
    premiumDesk: '1800-200-3344',
    email: 'customer.care@icicibank.com',
    whatsappSupport: '+91 86400 86400',
    portalUrl: 'https://www.icicibank.com',
    notes: 'Sapphiro & Emeralde desk handles priority dispute resolution within 4 hours.'
  },
  {
    bank: 'Axis Bank',
    shortName: 'Axis',
    logoColor: '#9f1239',
    conciergeNumber: '1800-419-5959',
    generalSupport: '1860-419-5555',
    premiumDesk: '1800-103-5577',
    email: 'creditcards@axisbank.com',
    whatsappSupport: '+91 70360 00456',
    portalUrl: 'https://cards.axisbank.co.in',
    notes: 'Magnus Burgundy desk connects directly to Relationship Manager without IVR hold time.'
  },
  {
    bank: 'SBI Card',
    shortName: 'SBI',
    logoColor: '#0284c7',
    conciergeNumber: '1800-180-1290',
    generalSupport: '1860-180-1290',
    premiumDesk: '0124-39020202',
    email: 'customercare@sbicard.com',
    whatsappSupport: '+91 90044 19888',
    portalUrl: 'https://www.sbicard.com',
    notes: 'SMS "HELP" to 5676791 for instant card block or limit enhancement verification.'
  },
  {
    bank: 'American Express',
    shortName: 'Amex',
    logoColor: '#2563eb',
    conciergeNumber: '1800-419-1030',
    generalSupport: '1800-419-3646',
    premiumDesk: '1800-419-1030',
    email: 'executivecare@aexp.com',
    whatsappSupport: '+91 1800 419 2122',
    portalUrl: 'https://www.americanexpress.com/in',
    notes: 'Zero hold time benchmark with world-renowned Amex customer service & fraud liability protection.'
  },
  {
    bank: 'Federal Bank / Scapia',
    shortName: 'Federal / Scapia',
    logoColor: '#0f766e',
    conciergeNumber: '1800-420-1199',
    generalSupport: '1800-425-1199',
    premiumDesk: '0484-2630994',
    email: 'help@scapia.cards',
    whatsappSupport: '+91 80471 88000',
    portalUrl: 'https://www.scapia.cards',
    notes: 'Scapia in-app chat provides 24x7 instant overseas support for forex and transaction unblocking.'
  },
  {
    bank: 'IDFC FIRST Bank',
    shortName: 'IDFC FIRST',
    logoColor: '#831843',
    conciergeNumber: '1800-10-888',
    generalSupport: '1860-500-1111',
    premiumDesk: '1800-10-888',
    email: 'banker@idfcfirstbank.com',
    whatsappSupport: '+91 95555 55555',
    portalUrl: 'https://www.idfcfirstbank.com',
    notes: 'Wealth cardholders get direct access to personal Wealth Banker.'
  }
];

export const TRAVEL_DESTINATION_RULES = [
  {
    destination: 'Dubai & UAE (Shopping Festival, Luxury Dining & Gold)',
    currency: 'AED',
    recommendedCards: ['scapia-federal', 'hdfc-infinia-metal', 'idfc-first-wealth'],
    keyTips: [
      'Card 1 (Everyday spend): Scapia Federal for 0% Forex Markup. Standard bank cards charge 3.5% + 18% GST (effectively ~4.13% fee), costing ₹4,130 extra per ₹1 Lakh spent.',
      'Card 2 (Airport Lounges): Dubai Terminal 1, 2 & 3 Marhaba & Ahlan Lounges accept Priority Pass from HDFC Infinia or IDFC FIRST Wealth.',
      'Card 3 (Dining & Hotels): Infinia earns 33.3% value back on Dubai hotel bookings via SmartBuy portal.'
    ]
  },
  {
    destination: 'Singapore & Southeast Asia (Universal Studios, Food & Flights)',
    currency: 'SGD',
    recommendedCards: ['scapia-federal', 'axis-magnus', 'hdfc-regalia-gold'],
    keyTips: [
      'Zero forex markup card saves significant cash on Singapore MRT tap-and-pay and Sentosa entry.',
      'Axis Magnus & Atlas convert EDGE miles directly to Singapore Airlines KrisFlyer miles for economy or business class redemptions.'
    ]
  },
  {
    destination: 'Europe & UK (London, Paris, Schengen Zone)',
    currency: 'EUR / GBP',
    recommendedCards: ['scapia-federal', 'idfc-first-wealth', 'hdfc-infinia-metal'],
    keyTips: [
      'High transaction volume across cafes and transit makes 0% or 1.5% forex markup mandatory.',
      'Ensure card has Contactless NFC enabled up to ₹5,000 for seamless Tube / Metro tap-in.'
    ]
  },
  {
    destination: 'USA & Americas (Shopping, Outlet Malls, Rental Cars)',
    currency: 'USD',
    recommendedCards: ['hdfc-infinia-metal', 'amex-plat-travel', 'scapia-federal'],
    keyTips: [
      'Amex has high acceptance across US retail outlets.',
      'Car rental insurance waivers are supported on Visa Infinite / Mastercard World tiers.'
    ]
  }
];

export function getBankHelpline(bankName: string): BankHelpline {
  const normalized = bankName.toLowerCase();
  const found = BANK_HELPLINES_DATA.find(h =>
    normalized.includes(h.shortName.toLowerCase()) ||
    normalized.includes(h.bank.toLowerCase()) ||
    h.bank.toLowerCase().includes(normalized)
  );
  if (found) return found;
  return BANK_HELPLINES_DATA[0];
}

export interface MovieBenefit {
  headline: string;
  subline: string;
  hasBogo: boolean;
  score: number;
}

export interface GolfBenefit {
  headline: string;
  subline: string;
  roundsPerQuarter: number | string;
  score: number;
}

export interface ExtrasBenefit {
  headline: string;
  subline: string;
  perks: string[];
  insurance: string;
  score: number;
}

export function getCardMovieBenefit(card: { id: string; name?: string; bank?: string }): MovieBenefit {
  const id = card.id.toLowerCase();

  if (id === 'axis-magnus') {
    return {
      headline: 'Buy 1 Get 1 Free on BookMyShow (Up to ₹500, 5x / Month)',
      subline: 'Save up to ₹2,500 every month on cinema tickets! Maximum 5 complimentary BOGO tickets per calendar month on BookMyShow.',
      hasBogo: true,
      score: 10,
    };
  }
  if (id === 'icici-sapphiro') {
    return {
      headline: 'Buy 1 Get 1 Free on BookMyShow (Up to ₹500, 2x / Month)',
      subline: 'Buy one ticket and get up to ₹500 off on the second ticket twice a month on BookMyShow (Save up to ₹1,000/month).',
      hasBogo: true,
      score: 9,
    };
  }
  if (id === 'hdfc-infinia-metal') {
    return {
      headline: 'Buy 1 Get 1 Free on BookMyShow (Up to ₹500 Off)',
      subline: 'Complimentary BOGO ticket access on BookMyShow plus 5X reward points on SmartBuy entertainment vouchers.',
      hasBogo: true,
      score: 9,
    };
  }
  if (id === 'idfc-first-wealth') {
    return {
      headline: 'Buy 1 Get 1 Free on Paytm / BookMyShow (Up to ₹500, 2x / Month)',
      subline: 'Enjoy 2 complimentary movie tickets per calendar month up to ₹500 per ticket across leading cinema chains in India.',
      hasBogo: true,
      score: 9,
    };
  }
  if (id === 'hdfc-diners-black') {
    return {
      headline: 'Buy 1 Get 1 Free on BookMyShow (Up to ₹250, 2x / Month)',
      subline: 'Complimentary weekend BOGO tickets twice per calendar month on BookMyShow plus 2X dining rewards on weekends.',
      hasBogo: true,
      score: 8,
    };
  }
  if (id === 'indusind-tiger') {
    return {
      headline: '1 Complimentary Ticket up to ₹500 on BookMyShow (Every 6 Months)',
      subline: '1 complimentary BookMyShow movie ticket (up to ₹500) every 6 months in a financial year (2 tickets per year).',
      hasBogo: false,
      score: 8,
    };
  }
  if (id === 'hdfc-regalia-gold') {
    return {
      headline: '₹1,500 Quarterly Milestone Vouchers (PVR / BookMyShow)',
      subline: 'Earn ₹1,500 gift vouchers every quarter upon spending ₹1.5 Lakh, redeemable directly on PVR or BookMyShow.',
      hasBogo: false,
      score: 7,
    };
  }
  if (id === 'sbi-cashback') {
    return {
      headline: 'Flat 5% Direct Cashback on All Cinema Bookings',
      subline: 'Automatic 5% statement cashback on BookMyShow, PVR, INOX, and Cinepolis with no minimum ticket requirement.',
      hasBogo: false,
      score: 7,
    };
  }
  if (id === 'sbi-simplysave') {
    return {
      headline: '10X Reward Points on Cinema & Movies',
      subline: 'Earn 10 reward points per ₹150 spent on all movie ticket counters and online cinema portals (~2.5% valueback).',
      hasBogo: false,
      score: 6,
    };
  }
  if (id === 'idfc-first-millennia') {
    return {
      headline: 'Buy 1 Get 1 Free on Paytm (Up to ₹250, 1x / Month)',
      subline: 'Get 25% discount or Buy 1 Get 1 up to ₹250 on movie tickets once a month via Paytm Movies.',
      hasBogo: true,
      score: 6,
    };
  }
  if (id === 'tata-neu-infinity') {
    return {
      headline: '5% NeuCoins on Entertainment via Tata Neu',
      subline: 'Earn 5% back as NeuCoins on cinema and entertainment bookings made via the Tata Neu ecosystem.',
      hasBogo: false,
      score: 6,
    };
  }
  if (id === 'amex-platinum') {
    return {
      headline: 'VIP Amex Invites & Private Film Screenings',
      subline: 'Centurion 24x7 Platinum Concierge priority reservations for high-demand theatrical shows and film festivals.',
      hasBogo: false,
      score: 7,
    };
  }
  if (id === 'flipkart-axis') {
    return {
      headline: '4% Cashback on Preferred Entertainment Partners',
      subline: '4% flat cashback on partner dining and entertainment platforms; 1.5% unlimited cashback elsewhere.',
      hasBogo: false,
      score: 5,
    };
  }
  if (id === 'icici-amazon-pay') {
    return {
      headline: '2% Unlimited Cashback on Movie Tickets via Amazon Pay',
      subline: 'Flat 2% cashback credited directly into Amazon Pay balance for movie bookings made through Amazon.',
      hasBogo: false,
      score: 5,
    };
  }
  if (id === 'scapia-federal') {
    return {
      headline: '20% Scapia Coins on Travel Experiences, Events & Bookings',
      subline: 'Earn 20% rewards on flights, stays, trains, buses, visas, and experiences booked via Scapia app (5 Coins = ₹1 with zero redemption caps).',
      hasBogo: false,
      score: 6,
    };
  }
  return {
    headline: 'Standard Category Rewards on Entertainment',
    subline: 'Earn standard reward points or flat cashback on all entertainment and cinema ticketing merchants.',
    hasBogo: false,
    score: 4,
  };
}

export function getCardGolfBenefit(card: { id: string; name?: string; bank?: string }): GolfBenefit {
  const id = card.id.toLowerCase();

  if (id === 'amex-platinum') {
    return {
      headline: 'Unlimited Complimentary Golf Across 80+ Global Courses',
      subline: 'Unlimited complimentary green fee access across 30+ leading Indian golf clubs and 50+ international courses, plus golf coaching sessions.',
      roundsPerQuarter: 'Unlimited',
      score: 10,
    };
  }
  if (id === 'hdfc-infinia-metal') {
    return {
      headline: 'Unlimited Complimentary Golf Games (India & Worldwide)',
      subline: 'Unlimited complimentary green fee access at premier domestic & international golf clubs + 4 golf lessons per year.',
      roundsPerQuarter: 'Unlimited',
      score: 10,
    };
  }
  if (id === 'hdfc-diners-black') {
    return {
      headline: '6 Complimentary Golf Rounds / Quarter (Worldwide)',
      subline: '6 complimentary golf games per quarter across leading greens in India and abroad, with guest booking privileges.',
      roundsPerQuarter: 6,
      score: 9,
    };
  }
  if (id === 'idfc-first-wealth') {
    return {
      headline: '2 Golf Rounds + 2 Golf Lessons / Month (24 / Year)',
      subline: 'Enjoy up to 24 complimentary golf rounds & lessons per calendar year upon spending ₹20,000 in previous statement cycle.',
      roundsPerQuarter: 6,
      score: 8,
    };
  }
  if (id === 'icici-sapphiro') {
    return {
      headline: '4 Complimentary Golf Rounds / Quarter',
      subline: '1 complimentary golf game per month for every ₹50,000 spent in the previous calendar month at select Indian courses.',
      roundsPerQuarter: 4,
      score: 7,
    };
  }
  if (id === 'indusind-tiger') {
    return {
      headline: '1 Complimentary Game or Lesson per Quarter (4 / Year)',
      subline: '1 complimentary golf game or lesson per quarter (4 per year) booked via Apexlynx across leading golf clubs in India.',
      roundsPerQuarter: 1,
      score: 7,
    };
  }
  if (id === 'hdfc-regalia-gold') {
    return {
      headline: '4 Complimentary Golf Games / Year',
      subline: '1 complimentary golf round per calendar quarter at select golf destinations across India.',
      roundsPerQuarter: 1,
      score: 5,
    };
  }
  if (id === 'axis-atlas' || id === 'axis-magnus') {
    return {
      headline: 'Tier-Based Milestone Golf Privileges',
      subline: 'Golf privileges unlocked on top-tier annual milestone spends (Platinum Tier) or private wealth desk invitation.',
      roundsPerQuarter: 'Milestone',
      score: 4,
    };
  }
  return {
    headline: 'No Golf Privileges Included',
    subline: 'This credit card focuses on everyday shopping, cashback, and travel perks without golf club memberships.',
    roundsPerQuarter: 0,
    score: 0,
  };
}

export function getCardExtrasBenefit(card: { id: string; name?: string; bank?: string; annualFee?: number }): ExtrasBenefit {
  const id = card.id.toLowerCase();

  if (id === 'amex-platinum') {
    return {
      headline: 'Taj Epicure + Marriott Gold + Fine Hotels & Resorts + ₹5 Cr Cover',
      subline: 'Centurion 24x7 Global Concierge, Taj Epicure, Marriott Bonvoy Gold Elite, Hilton Honors Gold, Radisson Rewards, Fine Hotels & Resorts ($100 property credit, free breakfast for 2, 4pm checkout), ₹5 Crore travel accident insurance.',
      perks: ['Taj Epicure Preferred', 'Marriott Bonvoy Gold Elite', 'Hilton Honors Gold', 'Fine Hotels & Resorts ($100 credit + breakfast)', '₹5 Cr Travel Accident Cover'],
      insurance: '₹5 Crore Air Accident + Overseas Medical Cover',
      score: 10,
    };
  }
  if (id === 'hdfc-infinia-metal') {
    return {
      headline: 'Club Marriott + 1:1 Airline Miles + 24x7 Concierge + ₹3 Cr Cover',
      subline: 'Complimentary Club Marriott membership (up to 20% off stays and dining across APAC), 1:1 reward points transfer to Singapore KrisFlyer / Air France / British Airways / Accor, ₹3 Crore accidental air death cover, ₹50 Lakh emergency medical.',
      perks: ['Club Marriott APAC Membership', '1:1 Airline Mile Transfers', '₹3 Cr Accidental Air Death Cover', '₹50 Lakh Emergency Medical Evacuation', '24x7 Global Concierge'],
      insurance: '₹3 Crore Accidental Death + ₹50 Lakh Medical Cover',
      score: 10,
    };
  }
  if (id === 'hdfc-diners-black') {
    return {
      headline: 'Swiggy One & Prime Subscriptions + ₹2 Cr Air Accident Insurance',
      subline: 'Complimentary annual subscriptions on milestone spend (Club Marriott, Swiggy One, Amazon Prime, Forbes, MMT Black), 2X weekend dining reward points, ₹2 Crore air accident cover.',
      perks: ['Milestone Subscriptions (Prime, Swiggy One)', '2X Weekend Dining Reward Points', '₹2 Cr Air Accident Insurance', 'Diners Global Airport Network'],
      insurance: '₹2 Crore Air Accident Cover',
      score: 9,
    };
  }
  if (id === 'axis-magnus') {
    return {
      headline: '8x VIP Airport Meet & Greet + 8 Free Guest Lounges + ₹4.5 Cr Cover',
      subline: '8 complimentary VIP airport concierge meet & assist services at 29 Indian airports, 8 international guest lounge visits, 24x7 luxury concierge, ₹4.5 Crore air accident cover.',
      perks: ['8 VIP Airport Meet & Assist', '8 International Guest Lounges', '₹4.5 Cr Air Accident Insurance', '24x7 Dedicated Luxury Concierge'],
      insurance: '₹4.5 Crore Air Accident Insurance',
      score: 9,
    };
  }
  if (id === 'axis-atlas') {
    return {
      headline: '1:2 Mile Transfers to 20+ Airlines + Tier Upgrades + ₹2.5 Cr Cover',
      subline: 'Industry-leading 1:2 mile conversion to Singapore KrisFlyer, Qatar Airways, Accor ALL, Marriott Bonvoy, United MileagePlus, up to 10,000 tier bonus miles, ₹2.5 Crore travel insurance.',
      perks: ['1:2 Airline Mile Transfer (20+ Airlines)', 'Accor ALL 1:2 Hotel Transfer', 'Silver / Gold Tier Elite Upgrades', '₹2.5 Cr Air Accident Cover'],
      insurance: '₹2.5 Crore Travel Insurance',
      score: 8,
    };
  }
  if (id === 'icici-sapphiro') {
    return {
      headline: 'DreamFolks DragonPass + ICICI i-Assist Concierge + ₹3 Cr Cover',
      subline: 'Complimentary DreamFolks DragonPass membership, 24x7 ICICI i-Assist luxury concierge, luxury hotel collection privileges, air accident insurance cover of ₹3 Crore.',
      perks: ['DreamFolks DragonPass Membership', 'ICICI i-Assist Concierge', '₹3 Cr Air Accident Cover', 'Luxury Hotel Privileges'],
      insurance: '₹3 Crore Air Accident Cover',
      score: 8,
    };
  }
  if (id === 'idfc-first-wealth') {
    return {
      headline: 'Lifetime Free + 24x7 Roadside Assistance + ₹1 Cr Personal Cover',
      subline: 'Unconditional ₹0 joining & annual fee, complimentary 24x7 Roadside Assistance (RSA) worth ₹1,399, ₹1 Crore personal accident insurance, dynamic low APR from 9% to 36%.',
      perks: ['Unconditional Lifetime Free (₹0)', 'Free 24x7 Roadside Assistance', '₹1 Cr Personal Accident Cover', '9%–36% Dynamic Low APR'],
      insurance: '₹1 Crore Personal Accident Cover',
      score: 8,
    };
  }
  if (id === 'scapia-federal') {
    return {
      headline: 'Zero Fees & 0% Forex + Dual Visa/RuPay + 20% Travel Rewards + Lounge Privileges',
      subline: 'Nil joining and annual fee forever, zero forex markup across 180+ countries, dual cards (Visa for general/international & RuPay for UPI), 20% rewards on Scapia app travel, unlimited domestic lounge access + ₹1,000 airport dining/shopping on ₹20k spend.',
      perks: [
        'Zero Fees: Nil Joining Fee & Nil Annual Fee Forever',
        'Zero Forex Markup across 180+ Countries',
        'Dual Cards: Visa for 0% Forex + RuPay for UPI Transactions',
        '20% Rewards on Scapia App (Flights, Stays, Trains, Buses, Visas, Experiences)',
        '10% Rewards on Visa & 5% on RuPay UPI Spends (₹500+)',
        'Fixed Coin Value: 5 Scapia Coins = ₹1 (No Redemption Cap)',
        'Unlimited Domestic Lounge Access + ₹1,000 Airport Dining/Shopping (on ₹20k spend)',
        '1% Fuel Surcharge Waiver on applicable transactions'
      ],
      insurance: 'Comprehensive In-Flight Travel Cover',
      score: 9,
    };
  }
  if (id === 'tata-neu-infinity') {
    return {
      headline: '5% NeuCoins on UPI QR + Tata Brand Multipliers + Air India Perks',
      subline: '5% NeuCoins on Tata Neu UPI, comprehensive coverage on Tata brand ecosystem (Croma, 1mg, Taj, BigBasket, Air India), 8 domestic + 4 international lounges.',
      perks: ['5% NeuCoins on RuPay UPI QR', 'Taj Hotel & Dining Discounts', '8 Domestic + 4 Intl Lounges', 'Air India Accelerated Points'],
      insurance: '₹1 Crore Air Accident Cover',
      score: 7,
    };
  }
  if (id === 'icici-amazon-pay') {
    return {
      headline: 'Lifetime Free (₹0) + 5% Auto-Cashback on Amazon Prime Spends',
      subline: 'Unconditional ₹0 annual fee forever, 5% unlimited cashback credited directly into Amazon Pay balance without redemption charges, fuel surcharge waiver.',
      perks: ['Unconditional Lifetime Free (₹0)', '5% Unlimited Amazon Cashback', 'Direct Amazon Pay Balance Credit', 'Zero Redemption Fees'],
      insurance: 'Standard Chip & PIN Fraud Protection',
      score: 7,
    };
  }
  if (id === 'indusind-tiger') {
    return {
      headline: 'Lifetime Free + 1.50% Forex + 1:1 Air India Airmiles + Golf & Movies',
      subline: 'Unconditionally Lifetime Free (₹0), 1.50% discounted forex markup, 1:1 airmile transfer to Air India Maharaja Club, 8 domestic + 2 Priority Pass lounges, Apexlynx golf, and BookMyShow movie tickets.',
      perks: [
        'Lifetime Free: ₹0 Joining Fee & ₹0 Annual Fee',
        'Earn up to 6X Accelerated Reward Points per ₹100 spent',
        '1:1 Airmile Transfer to Air India Maharaja Club (or ₹0.40 Cash Credit)',
        '1.50% Discounted Foreign Currency Markup Fee',
        '8 Domestic Lounges/yr (2/qtr) via Card + 2 International via Priority Pass',
        '1 Complimentary Golf Game or Lesson per Quarter (4/yr) via Apexlynx',
        '1 Complimentary BookMyShow Movie Ticket (up to ₹500) every 6 Months',
        '1% Fuel Surcharge Waiver on transactions between ₹400 and ₹4,000'
      ],
      insurance: 'Complimentary Personal Air Accident Insurance Cover',
      score: 9,
    };
  }
  if (id === 'sbi-cashback') {
    return {
      headline: '5% Direct Statement Cashback on All Online Merchants in India',
      subline: 'Direct statement cashback up to ₹5,000/month across virtually all online transactions, fuel surcharge waiver, annual fee waived on ₹2 Lakh spend.',
      perks: ['5% Direct Statement Credit', 'Covers All Online Shopping', 'No Merchant Restrictions', 'Fuel Surcharge Waiver'],
      insurance: 'Lost Card Liability Protection',
      score: 7,
    };
  }
  return {
    headline: 'Dining Delights + Fuel Surcharge Waiver + Concierge',
    subline: 'Complimentary fuel surcharge waiver across India, dining discounts through partner networks, and standard fraud liability cover.',
    perks: ['1% Fuel Surcharge Waiver', 'Dining Partner Discounts', 'Fraud Liability Protection'],
    insurance: 'Standard Fraud & Loss Liability',
    score: 5,
  };
}

export const ALL_CREDIT_CARDS = CREDIT_CARDS_DATA;

