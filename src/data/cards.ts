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
    headlineBenefit: '3 Domestic Lounges/Quarter (on ₹60k spend) • 6 Intl Lounges • 5X Rewards on Partners • 2% Forex',
    cashbackRate: '4 RP per ₹150 spent (Base) • 5X RP on Partner Lifestyle Brands (Myntra, Nykaa, Reliance Digital, M&S)',
    rewardPointValue: '1 RP = Up to ₹0.65 when redeemed against flights, hotels & exclusive Gold Catalogue',
    forexMarkup: 2.0,
    fuelSurchargeWaiver: '1% waiver on fuel transactions between ₹400 and ₹5,000 (capped at ₹500/month)',
    domesticLoungesPerQuarter: 3,
    internationalLoungesPerYear: 6,
    loungeSpendCondition: '3 complimentary domestic lounge visits per calendar quarter (on spends of ₹60,000 or more in preceding calendar quarter) + 6 international visits per calendar year via Priority Pass',
    loungeNetwork: 'Priority Pass',
    merchantExclusions: [
      'Rental payments (1% fee + no reward points)',
      'Government transactions & property tax (No points)',
      'Wallet loading (Paytm, Mobikwik) excluded',
      'Education fees paid via third-party apps incur 1% fee'
    ],
    cappingDetails: 'Reward points capped at 2,000 points per day for grocery purchases; 5X accelerated rewards on partner brands (Myntra, Nykaa, Reliance Digital, Marks & Spencer).',
    officialCircularUrl: 'https://www.hdfc.bank.in/credit-cards/regalia-gold-credit-card',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.6,
    popularityIndex: 94,
    recentChangeAlert: {
      badge: 'Lounge Spend Criteria: ₹60,000/Quarter',
      effectiveDate: '2024',
      isDevaluation: false,
      description: '3 complimentary domestic lounge visits per calendar quarter unlock on spending ₹60,000 or more in the preceding calendar quarter.'
    },
    changeHistory: [
      {
        date: 'Oct 01, 2024',
        type: 'policy_update',
        title: 'Domestic Lounge Access Requirement: ₹60,000 Spend',
        summary: 'Cardholders receive 3 complimentary domestic lounge visits per quarter upon spending ₹60,000 in preceding calendar quarter, plus 6 Priority Pass international visits per year.',
        oldValue: 'Spend ₹1,00,000 in previous calendar quarter for 2 visits',
        newValue: '3 complimentary visits per quarter on spends of ₹60,000+ in preceding calendar quarter',
        officialRef: 'HDFC Regalia Gold Benefit Guide 2024',
        severity: 'medium'
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
    suitableFor: [
      'Base earn rate of 4 Reward Points per ₹150 spent',
      '5X Reward Points on select partner lifestyle brands (Myntra, Nykaa, Reliance Digital, Marks & Spencer)',
      '1 RP valued up to ₹0.65 when redeemed against flights, hotels, or Gold Catalogue',
      '3 complimentary domestic lounge visits per quarter on ₹60,000 preceding quarter spend',
      '6 complimentary international lounge visits per year via Priority Pass',
      'Complimentary Swiggy One & MMT Black/Gold memberships upon hitting spending thresholds (₹1 Lakh in 90 days)',
      'Milestone vouchers worth ₹1,500 every quarter on ₹1.5 Lakh spend + ₹5,000 flight vouchers on ₹5L & ₹7.5L spend',
      '2% discounted foreign currency markup on all overseas transactions',
      'Comprehensive insurance: ₹1 Cr air death, ₹15 Lakh overseas hospitalization, ₹10 Lakh credit liability'
    ]
  },
  {
    id: 'hdfc-infinia-metal',
    name: 'HDFC Bank Infinia Credit Card Metal Edition',
    bank: 'HDFC Bank',
    bankLogoText: 'HDFC BANK',
    tier: 'Super Premium',
    network: 'Visa',
    cardStyle: 'infinia',
    cardNumberPreview: '•••• 8890',
    joiningFee: 12500,
    annualFee: 12500,
    annualFeeWaiverCondition: 'Waived on spending ₹10,00,000 or more in an anniversary year',
    isLifetimeFree: false,
    minSalaryMonthly: 500000,
    minCibilScore: 780,
    status: 'active',
    headlineBenefit: 'Invite-Only • Up to 33.3% Reward Rate via SmartBuy • Unlimited Global Lounges • 2% Forex',
    cashbackRate: '5 RP per ₹150 spent (~3.33% Base) • Up to 10X RP (33.3%) on SmartBuy Flights & Hotels',
    rewardPointValue: '1 RP = ₹1.00 on Flights, Hotels, Apple, Tanishq, or 1:1 Air Mile Transfer',
    forexMarkup: 2.0,
    fuelSurchargeWaiver: '1% waiver across all fuel stations in India',
    domesticLoungesPerQuarter: 'Unlimited',
    internationalLoungesPerYear: 'Unlimited (Primary + Add-on via Priority Pass)',
    loungeSpendCondition: 'Unlimited complimentary domestic and international airport lounge access for primary and add-on cardholders via Priority Pass (Strictly 0 spend threshold)',
    loungeNetwork: 'Priority Pass',
    merchantExclusions: [
      'Wallet reloads & gift cards',
      'Govt transactions excluded from reward points',
      'Rental payment 1% convenience charge'
    ],
    cappingDetails: 'SmartBuy bonus rewards capped at 10,000 points per calendar month; 15,000 points per month overall across accelerated partners.',
    officialCircularUrl: 'https://www.hdfc.bank.in/credit-cards/infinia-credit-card',
    lastVerifiedDate: 'Nov 14, 2026',
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
    suitableFor: [
      'Invite-only super-premium status (High net-worth relationship, ₹5L+ net monthly salary, or existing card upgrade with ₹8L+ limit)',
      '12,500 Reward Points upon fee realization and card activation + complimentary Club Marriott membership',
      'Base reward rate of 5 Reward Points per ₹150 spent (~3.33% return on eligible spends)',
      'Up to 10X Reward Points via HDFC SmartBuy for flights and hotels (returns up to 33.3%)',
      '1 Reward Point = ₹1 when redeemed for flights, hotels, Apple/Tanishq, or 1:1 air mile transfer',
      'Unlimited complimentary domestic and international airport lounge access for primary and add-on cardholders via Priority Pass',
      'Low 2% foreign currency markup fee',
      'Unlimited complimentary golf games worldwide, Swiggy Dineout discounts, and ITC Hotels 1+1 buffet/stay benefits',
      'Comprehensive insurance: ₹3 Cr air accident cover, ₹50 Lakh overseas hospitalization, ₹9 Lakh lost card liability'
    ]
  },
  {
    id: 'sbi-cashback',
    name: 'Cashback SBI Card',
    bank: 'SBI Card',
    bankLogoText: 'SBI CARD',
    tier: 'Entry Level',
    network: 'Visa',
    cardStyle: 'sbi',
    cardNumberPreview: '•••• 1042',
    joiningFee: 999,
    annualFee: 999,
    annualFeeWaiverCondition: 'Waived on annual spend of ₹2,00,000 or more in an anniversary year',
    isLifetimeFree: false,
    minSalaryMonthly: 30000,
    minCibilScore: 720,
    status: 'active',
    headlineBenefit: '5% Online Cashback (Capped at ₹2,000/cycle) • 1% Offline Cashback • Auto-Credit in 2 Days',
    cashbackRate: '5% on online purchases without merchant restrictions • 1% on offline spends',
    rewardPointValue: 'Direct statement credit auto-credited within 2 working days of next statement generation',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% waiver on fuel transactions between ₹500 and ₹3,000 (up to ₹100 per statement cycle)',
    domesticLoungesPerQuarter: 0,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'No complimentary lounge access. Entire card proposition is optimized for pure direct cash cashback.',
    loungeNetwork: 'None',
    merchantExclusions: [
      'Fuel transactions (beyond surcharge waiver)',
      'Wallet load (Amazon Pay, Paytm, Mobikwik)',
      'Rent payments & property management',
      'Insurance premium payments',
      'Utility bill payments & government services',
      'Jewelry purchases & precious metals',
      'School & education fees / college payments'
    ],
    cappingDetails: '5% online cashback capped at ₹2,000 per statement cycle; 1% offline cashback capped at ₹2,000 per statement cycle; 1% fuel surcharge waiver capped at ₹100 per cycle.',
    officialCircularUrl: 'https://www.sbicard.com/en/personal/credit-cards/cashback-sbi-card.html',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.7,
    popularityIndex: 96,
    recentChangeAlert: {
      badge: 'Online Cashback Capped at ₹2,000/Cycle',
      effectiveDate: 'Apr 01, 2026',
      isDevaluation: true,
      description: 'Monthly online cashback revised to a cap of ₹2,000 per statement cycle (on ₹40,000 spend), and offline cashback capped at ₹2,000 per cycle.'
    },
    changeHistory: [
      {
        date: 'Apr 01, 2026',
        type: 'devaluation',
        title: 'Cashback Monthly Cap Revised to ₹2,000',
        summary: 'SBI Card revised maximum online cashback to ₹2,000 per statement cycle, with offline cashback also capped at ₹2,000 per cycle.',
        oldValue: 'Maximum ₹5,000 cashback per billing cycle',
        newValue: 'Maximum ₹2,000 online cashback + ₹2,000 offline cashback per cycle',
        officialRef: 'SBI Card Cashback Policy Revision 2026',
        severity: 'high'
      },
      {
        date: 'Sep 15, 2024',
        type: 'restriction',
        title: 'Education, Utilities & Insurance Excluded',
        summary: 'Cashback removed on educational fees, utilities, insurance, rent, wallet loads, and jewelry.',
        oldValue: 'Cashback applied across broader merchant categories',
        newValue: 'Strict exclusions on fuel, wallets, rent, insurance, utilities, jewelry, and school fees',
        officialRef: 'SBI Card Notification Circular SBIC/REV/2024',
        severity: 'high'
      }
    ],
    tags: ['cashback', 'shopping', 'grocery', 'dining'],
    suitableFor: [
      '5% cashback on online purchases without merchant restrictions (capped at ₹2,000/statement cycle)',
      '1% cashback on offline spends (capped at ₹2,000/statement cycle)',
      'Auto-credited directly to SBI Card account within 2 working days of next statement generation',
      '1% fuel surcharge waiver on transactions between ₹500 and ₹3,000 (up to ₹100/cycle)',
      'Nil add-on card fee',
      'Annual fee of ₹999 waived on spending ₹2,00,000 or more in an anniversary year',
      'Foreign currency markup: 3.5% + GST'
    ]
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
    annualFeeWaiverCondition: 'Waived on spending ₹25 Lakhs or more in preceding year',
    isLifetimeFree: false,
    minSalaryMonthly: 200000,
    minCibilScore: 760,
    status: 'active',
    headlineBenefit: 'Unlimited International Lounges (Priority Pass + 4 Guests) • 35 EDGE Pts > ₹1.5L/mo • 2% Forex',
    cashbackRate: '12 EDGE pts / ₹200 base • 35 pts / ₹200 on monthly spend > ₹1.5L • 5X (up to 60 pts / ₹200) on Travel EDGE',
    rewardPointValue: '5 EDGE Reward points = 2 partner air miles (capped at 500,000 pts/yr)',
    forexMarkup: 2.0,
    fuelSurchargeWaiver: '1% waiver on transactions between ₹400 and ₹4,000',
    domesticLoungesPerQuarter: 'Unlimited',
    internationalLoungesPerYear: 'Unlimited Priority Pass + 4 Guest Visits / Year',
    loungeSpendCondition: 'Unlimited complimentary international visits via Priority Pass (+ 4 guest visits/yr); Unlimited domestic lounge access subject to min spend of ₹50,000 in previous 3 calendar months',
    loungeNetwork: 'Priority Pass',
    merchantExclusions: [
      'Utilities & electricity payments',
      'Fuel transactions',
      'Insurance premium payments',
      'Gold & jewellery purchases',
      'Rent payments & property management',
      'Wallet reload & cash advances'
    ],
    cappingDetails: '5:2 partner airline & hotel point transfers capped at 500,000 points per year; excluded categories (utilities, fuel, insurance, gold, rent, wallet) do not earn reward points or count toward milestone spends.',
    officialCircularUrl: 'https://www.axis.bank.in/cards/credit-card/axis-bank-magnus-credit-card',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.4,
    popularityIndex: 90,
    recentChangeAlert: {
      badge: 'Domestic Lounge Spend: ₹50,000 in 3 Months',
      effectiveDate: '2024',
      isDevaluation: true,
      description: 'Unlimited domestic lounge access requires a minimum spend of ₹50,000 in the previous 3 calendar months.'
    },
    changeHistory: [
      {
        date: 'Sep 01, 2024',
        type: 'policy_update',
        title: 'Accelerated 35 Points Rate & Domestic Lounge Threshold',
        summary: 'Earn 35 EDGE points per ₹200 on monthly spends > ₹1.5 Lakhs; domestic lounge access requires ₹50,000 spend in preceding 3 months.',
        oldValue: '25,000 milestone bonus points on ₹1L monthly spend',
        newValue: '35 EDGE points per ₹200 on spend above ₹1.5L/mo + 5X on Travel EDGE',
        officialRef: 'Axis Bank Magnus Terms Revision',
        severity: 'medium'
      },
      {
        date: 'Sep 01, 2024',
        type: 'devaluation',
        title: 'Airline Partner Transfer Ratio Revised to 5:2',
        summary: 'Standard airline mile conversion updated to 5 EDGE Reward points = 2 Partner Air Miles, capped at 500,000 points per year.',
        oldValue: '5 EDGE Reward points = 4 Airline Miles',
        newValue: '5 EDGE Reward points = 2 Airline Miles (500k points/yr cap)',
        officialRef: 'Axis Bank Notice Ref AX/CC/MAGNUS',
        severity: 'critical'
      }
    ],
    tags: ['lounge', 'travel', 'premium', 'dining', 'golf'],
    suitableFor: [
      'Minimum net salary or annual ITR of ₹24 Lakhs per annum',
      'Welcome benefit: ₹12,500 luxury brand voucher (Luxe, Postcard Hotels, or Yatra)',
      '12 EDGE REWARD Points per ₹200 spent on regular categories',
      '35 EDGE REWARD Points per ₹200 spent on incremental monthly spends above ₹1.5 Lakhs',
      '5X or up to 60 points per ₹200 via Travel EDGE portal',
      '5 EDGE points = 2 partner air miles (capped at 500,000 points per year)',
      'Unlimited international lounges with Priority Pass + 4 guest visits per calendar year',
      'Unlimited domestic lounge access on minimum spend of ₹50,000 in previous 3 calendar months',
      'Low 2% foreign currency markup fee (3% monthly extended credit interest rate)',
      'Joining & Annual fee of ₹12,500 waived on spending ₹25 Lakhs in preceding year'
    ]
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
    annualFeeWaiverCondition: 'Nil Joining Fee & Nil Annual Fee (Unconditionally Lifetime Free)',
    isLifetimeFree: true,
    minSalaryMonthly: 30000,
    minCibilScore: 700,
    status: 'active',
    headlineBenefit: 'Lifetime Free (₹0) • 5% Unlimited Amazon & Travel Cashback • 1.99% Low Forex Markup',
    cashbackRate: '5% on Amazon (Prime) / 3% (Non-Prime) • 2% on Amazon Pay & 100+ Partners • 1% Other Spends',
    rewardPointValue: '1 Reward Point = ₹1.00 directly auto-credited monthly into Amazon Pay Balance',
    forexMarkup: 1.99,
    fuelSurchargeWaiver: '1% fuel surcharge waiver across all petrol pumps in India',
    domesticLoungesPerQuarter: 0,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'No airport lounge access included. Card is 100% optimized for zero fees and direct Amazon Pay cashback.',
    loungeNetwork: 'None',
    merchantExclusions: ['Gold purchases', 'Wallet top-up (Amazon Pay load)', 'EMI processing fee', 'Cash advances'],
    cappingDetails: 'NO CAPPING on cashback! 5% on Amazon (Prime) and 1% on all other spends is truly unlimited.',
    officialCircularUrl: 'https://www.icici.bank.in/personal-banking/cards/credit-card/amazon-pay-credit-card',
    lastVerifiedDate: 'Nov 14, 2026',
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
    tags: ['lifetime-free', 'cashback', 'shopping', 'grocery', 'travel'],
    suitableFor: [
      'Zero Fees: Nil joining fee and nil annual fee (Unconditionally Lifetime Free)',
      '5% unlimited cashback for Amazon Prime members on Amazon shopping & travel bookings (flights/hotels)',
      '3% cashback for non-Prime members on Amazon shopping & flight/hotel bookings',
      '2% cashback on digital categories, utility bills, gift cards, and 100+ partner merchants',
      '1% cashback on all other eligible spends wherever Visa is accepted',
      'Low 1.99% foreign currency markup fee on international transactions',
      'Automatic monthly conversion of rewards directly into your Amazon Pay Balance (no redemption fees)',
      '1% fuel surcharge waiver across petrol pumps in India',
      'Eligibility: Indian citizen, minimum age 21, minimum monthly income ~₹30,000'
    ]
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
    annualFeeWaiverCondition: 'Waived if you spend ₹3 Lakh or more in a membership year',
    isLifetimeFree: false,
    minSalaryMonthly: 100000,
    minCibilScore: 740,
    status: 'active',
    headlineBenefit: '5% NeuCoins on Tata Neu (+5% NeuPass) • 1.5% UPI & Non-Tata Spends • 8 Domestic & 4 Intl Lounges',
    cashbackRate: '5% (+5% via NeuPass) on Tata Brands • 1.5% on Non-Tata & Tata Neu UPI • 0.5% other UPI',
    rewardPointValue: '1 NeuCoin = ₹1.00 (Claim manually via NeuCard section in Tata Neu App)',
    forexMarkup: 2.0,
    fuelSurchargeWaiver: '1% fuel surcharge waiver across petrol pumps in India',
    domesticLoungesPerQuarter: 2,
    internationalLoungesPerYear: 4,
    loungeSpendCondition: '8 complimentary domestic lounge visits/year (2/quarter) via Visa or RuPay + 4 international visits/year (1/quarter) via Priority Pass.',
    loungeNetwork: 'RuPay / Visa / Priority Pass',
    merchantExclusions: ['Fuel transactions', 'Wallet reloads', 'Rental payments', 'Govt transactions'],
    cappingDetails: 'NeuCoins must be claimed manually via the NeuCard section in Tata Neu App. UPI rewards subject to combined monthly caps.',
    officialCircularUrl: 'https://www.hdfc.bank.in/credit-cards/tata-neu-infinity-hdfc-bank-credit-card',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.7,
    popularityIndex: 94,
    recentChangeAlert: {
      badge: 'NeuCard Claim Reminder',
      effectiveDate: 'Active',
      isDevaluation: false,
      description: 'NeuCoins must be manually claimed via the NeuCard section in the Tata Neu App.'
    },
    changeHistory: [
      {
        date: 'Nov 14, 2026',
        type: 'feature_update',
        title: 'Verified Card Features & Eligibility',
        summary: '8 domestic lounges/yr (2/qtr) via Visa or RuPay, 4 intl via Priority Pass, 5% on Tata brands (+5% NeuPass), 1.5% on UPI & non-Tata spends, 2% forex, ₹1L monthly salary / ₹12L ITR eligibility.',
        oldValue: 'Older benefit definitions',
        newValue: '8 domestic (2/qtr) + 4 Priority Pass intl (1/qtr), 2% forex, 1.5% UPI',
        officialRef: 'HDFC Bank Tata Neu Infinity Official Portal',
        severity: 'low'
      }
    ],
    tags: ['upi', 'lounge', 'shopping', 'grocery', 'travel', 'dining'],
    suitableFor: [
      'Annual Fee: ₹1,499 + GST (waived on spending ₹3 Lakh or more in a membership year)',
      '1 NeuCoin = ₹1 (must be claimed manually through the NeuCard section in the Tata Neu App)',
      '5% back as NeuCoins on non-EMI spends on Tata Neu & partner Tata brands (plus an additional 5% via NeuPass on selected categories)',
      '1.5% back as NeuCoins on non-Tata brand spends and merchant EMI spends',
      'RuPay Variant UPI Benefit: 1.5% on Tata Neu UPI, 0.5% on other UPI apps (combined monthly cap applies)',
      'Domestic Lounge Access: 8 complimentary domestic visits per calendar year (2 per quarter) via Visa or RuPay',
      'International Lounge Access: Up to 4 complimentary international visits per calendar year (1 per quarter) via Priority Pass (issued on request for Visa)',
      'Foreign Currency Markup: Low 2% foreign currency markup on international transactions',
      '1% fuel surcharge waiver across petrol pumps in India',
      'Comprehensive Insurance: Complimentary accidental air death cover, emergency overseas hospitalization, and credit liability cover',
      'Eligibility: Age 21–65 years | Salaried: Minimum monthly income ₹1 Lakh | Self-Employed: Annual ITR > ₹12 Lakh'
    ]
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
    annualFeeWaiverCondition: 'Waived if you spend ₹6 Lakh or more in an anniversary year',
    isLifetimeFree: false,
    minSalaryMonthly: 75000,
    minCibilScore: 740,
    status: 'active',
    headlineBenefit: 'Dual-Network Card (Amex + Mastercard) • BOGO BookMyShow (2x/mo up to ₹500) • ₹13k Welcome Vouchers',
    cashbackRate: '4 RP / ₹100 Intl • 2 RP / ₹100 Domestic • 1 RP / ₹100 Utilities & Insurance (1 RP = ₹0.25)',
    rewardPointValue: '1 Reward Point = ₹0.25 (Dual-network card sharing a single credit limit)',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% fuel surcharge waiver across petrol pumps in India',
    domesticLoungesPerQuarter: 4,
    internationalLoungesPerYear: 2,
    loungeSpendCondition: 'Complimentary domestic airport lounge access (quarterly) and international lounge access (yearly) via DreamFolks.',
    loungeNetwork: 'DreamFolks / DragonPass',
    merchantExclusions: ['Cash advances', 'Wallet load', 'Rental payments', 'Late payment fees'],
    cappingDetails: 'BookMyShow BOGO capped at ₹500 off on second ticket twice every calendar month (up to ₹1,000/mo savings).',
    officialCircularUrl: 'https://www.icici.bank.in/personal-banking/cards/credit-card/sapphiro-card',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.5,
    popularityIndex: 89,
    recentChangeAlert: {
      badge: 'Dual-Card Architecture Verified',
      effectiveDate: 'Active',
      isDevaluation: false,
      description: 'Dual Amex + Mastercard/Visa setup with ₹13,000+ welcome vouchers and BMS BOGO.'
    },
    changeHistory: [
      {
        date: 'Nov 14, 2026',
        type: 'feature_update',
        title: 'Verified Official Features & Dual-Card Architecture',
        summary: 'Dual network (Amex + Mastercard/Visa), ₹13,000+ welcome vouchers, ₹3,500 annual fee (waived on ₹6L spend), 4 RP intl / 2 RP domestic / 1 RP utility, ₹75k/mo salary / ₹9L ITR eligibility.',
        oldValue: 'Older salary and earn rate figures',
        newValue: '₹75k monthly salary, ₹9L ITR, 4/2/1 RP structure, ₹13k welcome vouchers',
        officialRef: 'ICICI Bank Sapphiro Official Portal',
        severity: 'low'
      }
    ],
    tags: ['movies', 'lounge', 'dining', 'golf', 'premium'],
    suitableFor: [
      'Joining Fee: ₹6,500 + GST (includes welcome vouchers worth over ₹13,000)',
      'Annual Fee: ₹3,500 + GST (waived if you spend ₹6 Lakh or more in an anniversary year)',
      'Dual Card Structure: Issued as dual-network (Amex for weekend offers + Visa/Mastercard for universal acceptance)',
      'Reward Points: 4 RP per ₹100 international, 2 RP per ₹100 domestic, 1 RP per ₹100 utility & insurance (1 RP = ₹0.25)',
      'Movies & Entertainment: Buy 1 Get 1 Free on BookMyShow tickets (up to ₹500 off twice a month)',
      'Lounge Access: Complimentary domestic airport lounge access (quarterly) and international lounge access (yearly)',
      'Golf Privileges: Complimentary monthly golf rounds based on eligible spend milestones',
      'Insurance Cover: ₹3 Crore complimentary accidental air death insurance cover',
      '1% fuel surcharge waiver & 3.5% foreign currency markup fee',
      'Eligibility: Age 21+ | Salaried: Minimum monthly income ₹75,000 | Self-Employed: Annual ITR > ₹9 Lakh'
    ]
  },
  {
    id: 'amex-plat-travel',
    name: 'American Express Platinum Travel Credit Card',
    bank: 'American Express',
    bankLogoText: 'AMEX PLATINUM',
    tier: 'Premium',
    network: 'Amex',
    cardStyle: 'amex',
    cardNumberPreview: '•••• 1009',
    joiningFee: 5000,
    annualFee: 5000,
    annualFeeWaiverCondition: '₹5,000 + GST renewal fee (Offset via milestone bonus MR points & Taj vouchers)',
    isLifetimeFree: false,
    minSalaryMonthly: 50000,
    minCibilScore: 740,
    status: 'active',
    headlineBenefit: '10,000 Welcome MR Points • ₹10,000 Taj Voucher + 40k Bonus MR Points on ₹4L/₹7L Milestones',
    cashbackRate: '1 MR per ₹50 spent (excl. fuel, utilities, insurance) • Milestone bonus at ₹1.9L, ₹4L & ₹7L',
    rewardPointValue: '1 MR Point = up to ₹0.50 (Taj vouchers, Marriott Bonvoy & Air Mile transfers)',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '0% convenience fee at select HPCL / BPCL pumps in India',
    domesticLoungesPerQuarter: 2,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: '8 complimentary domestic airport lounge visits per year (2 per quarter) subject to Amex network criteria.',
    loungeNetwork: 'Amex Network Lounges',
    merchantExclusions: ['Fuel', 'Utilities', 'Insurance', 'Cash transactions', 'EMI at POS'],
    cappingDetails: 'Base points excluded on fuel, insurance & utilities; milestones unlock at ₹1.9L, ₹4L, and ₹7L annual spends.',
    officialCircularUrl: 'https://www.americanexpress.com/in/credit-cards/platinum-travel-credit-card/',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.7,
    popularityIndex: 93,
    recentChangeAlert: {
      badge: 'Milestone Tier Update',
      effectiveDate: 'Active',
      isDevaluation: false,
      description: 'Revised fee structure (₹5,000/yr) with higher-value milestone rewards shifting toward ₹7 Lakhs.'
    },
    changeHistory: [
      {
        date: 'Nov 14, 2026',
        type: 'feature_update',
        title: 'Verified Official Fee & Income Thresholds',
        summary: '₹5,000 annual fee, ₹6 Lakhs annual income eligibility (₹50k/mo), 10k welcome MR points on ₹15k spend in 90 days, 1 MR/₹50 earn rate.',
        oldValue: 'Older salary & fee structures',
        newValue: '₹5k annual fee, ₹6L annual income, 1 MR / ₹50, 10k welcome bonus',
        officialRef: 'American Express India Official Portal',
        severity: 'low'
      }
    ],
    tags: ['travel', 'lounge', 'dining', 'premium'],
    suitableFor: [
      'Annual Fee: ₹5,000 + applicable taxes (same for first year and renewal)',
      'Eligibility: Age 18+, Indian resident, minimum annual income of ₹6 Lakhs (~₹50,000/month)',
      'Welcome Benefit: 10,000 Membership Rewards points on spending ₹15,000 within first 90 days of card issuance',
      'Earn Rate: 1 Membership Rewards Point per ₹50 spent (excludes fuel, insurance, utilities, cash & POS EMI)',
      'Milestone Rewards: Unlocks 15,000 bonus MR points at ₹1.9 Lakh spend, 25,000 bonus points + ₹10,000 Taj voucher at ₹4 Lakh spend (higher-value tiers shift toward ₹7 Lakhs)',
      'Domestic Lounge Access: 8 complimentary domestic airport lounge visits per year (2 per quarter)',
      'Priority Pass: Complimentary Priority Pass membership (standard usage fees apply per visit)',
      '24/7 Platinum Assist concierge and cardmember support',
      'Comprehensive zero lost card liability and online fraud protection'
    ]
  },
  {
    id: 'amex-platinum',
    name: 'American Express Platinum Charge Card',
    bank: 'American Express',
    bankLogoText: 'AMERICAN EXPRESS',
    tier: 'Super Premium',
    network: 'Amex',
    cardStyle: 'amex-platinum',
    cardNumberPreview: '•••• 7997',
    joiningFee: 66000,
    annualFee: 66000,
    annualFeeWaiverCondition: '₹66,000 + GST (Strictly non-waivable metal charge card; ₹35,000 renewal vouchers on ₹20L annual spend)',
    isLifetimeFree: false,
    minSalaryMonthly: 208333,
    minCibilScore: 780,
    status: 'active',
    headlineBenefit: 'Metal Charge Card • Up to ₹60k Welcome Gift • 1,550+ Global Lounges • 5-Star Hotel Gold Tiers & FHR',
    cashbackRate: '1 MR per ₹40; 3X on overseas spends; up to 20X via Rewards Multiplier partners',
    rewardPointValue: '1 MR = up to ₹0.50 (Taj vouchers, Marriott Bonvoy, air miles & statement credit)',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '0% convenience fee at select HPCL & BPCL fuel stations',
    domesticLoungesPerQuarter: 'Unlimited',
    internationalLoungesPerYear: 'Unlimited',
    loungeSpendCondition: 'Unlimited complimentary access to 1,550+ airport lounges worldwide (Centurion, Priority Pass, Delta Sky Clubs, Escape) across 140+ countries.',
    loungeNetwork: 'Centurion & Priority Pass (1,550+ Lounges)',
    merchantExclusions: ['Fuel', 'Cash advances', 'Utilities excluded from base points'],
    cappingDetails: 'Charge card with no pre-set spending limit. Welcome gift vouchers up to ₹60,000 via Taj, Luxe, or Postcard.',
    officialCircularUrl: 'https://www.americanexpress.com/in/charge-cards/platinum-card/',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.9,
    popularityIndex: 98,
    recentChangeAlert: {
      badge: 'Official Fee & Perks Verified',
      effectiveDate: 'Active',
      isDevaluation: false,
      description: '₹66,000 annual fee with up to ₹60,000 welcome gift vouchers and 1,550+ global lounges.'
    },
    changeHistory: [
      {
        date: 'Nov 14, 2026',
        type: 'feature_update',
        title: 'Verified Official Fee, Eligibility & Luxury Benefits',
        summary: '₹66,000 annual fee, ₹25L salaried / ₹15L self-employed eligibility, up to ₹60k welcome gift, 1,550+ global lounges, 5 hotel elite statuses, FHR benefits, 1 MR/₹40, 3X intl, up to 20X multiplier.',
        oldValue: 'Older ₹60,000 fee figures',
        newValue: '₹66k + GST fee, ₹25L/₹15L income, ₹60k welcome vouchers, 1,550+ lounges',
        officialRef: 'American Express India Official Portal',
        severity: 'low'
      }
    ],
    tags: ['premium', 'lounge', 'travel', 'dining', 'golf'],
    suitableFor: [
      'Annual Fee: ₹66,000 plus applicable taxes (all-metal charge card with no pre-set credit limit)',
      'Eligibility: Minimum annual income of ₹25 Lakhs for salaried or ₹15 Lakhs for self-employed individuals',
      'Welcome Gift: Vouchers worth up to ₹60,000 via Taj, Luxe, or Postcard Hotels upon fee realization',
      'Renewal Benefit: Vouchers & benefits worth up to ₹35,000 upon spending ₹20 Lakhs in a year',
      'Global Lounges: Complimentary access to 1,550+ airport lounges globally across 140+ countries (Centurion, Priority Pass, Delta, Escape)',
      'Fine Hotels & Resorts: Curated stay benefits valued around ₹44,300 (room upgrades, early check-in, 4pm checkout, $100 property credit)',
      'Complimentary Hotel Status Tiers: Marriott Bonvoy Gold Elite, Hilton Honors Gold Elite, Radisson Rewards, Taj Epicure, ALL Accor+ Explorer',
      'Rewards Program: 1 Membership Rewards point per ₹40 spent, 3X points on international spends, up to 20X via Rewards Multiplier partners',
      'Dining & Concierge: EazyDiner Prime membership (up to 50% off at 1,800+ restaurants) and 24/7 dedicated Centurion concierge desk',
      'Insurance Coverage: Complimentary air accident insurance up to ₹5 Crore and overseas medical insurance up to USD 50,000'
    ]
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
    annualFeeWaiverCondition: 'Waived if you spend ₹8 Lakh or more in an anniversary year',
    isLifetimeFree: false,
    minSalaryMonthly: 250000,
    minCibilScore: 780,
    status: 'active',
    headlineBenefit: 'Unlimited Global Lounges (Primary + Add-on) • 10k Bonus Points/Quarter (on ₹4L spend) • 2X Weekend Dining',
    cashbackRate: '5 RP / ₹150 (3.33%) • 2X Weekend Dining (6.66%) • Up to 10X SmartBuy Hotels (33.3%) & 5X Flights',
    rewardPointValue: '1 Reward Point = up to ₹1.00 (SmartBuy flights & hotels or 1:1 air miles conversion)',
    forexMarkup: 2.0,
    fuelSurchargeWaiver: '1% fuel surcharge waiver up to ₹1,000 per statement cycle',
    domesticLoungesPerQuarter: 'Unlimited',
    internationalLoungesPerYear: 'Unlimited',
    loungeSpendCondition: 'Unlimited complimentary airport lounge access worldwide for primary and add-on cardholders.',
    loungeNetwork: 'Diners Club Global Lounge Network',
    merchantExclusions: ['Rental payments (1% fee + zero reward points)', 'Government transactions & property tax', 'Wallet load'],
    cappingDetails: '10,000 bonus RP every quarter on ₹4 Lakh spend; SmartBuy daily/monthly caps apply; 1 RP = up to ₹1.',
    officialCircularUrl: 'https://www.hdfc.bank.in/credit-cards/diners-club-black-metal-edition-credit-card',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.9,
    popularityIndex: 97,
    recentChangeAlert: {
      badge: 'Metal Edition Features Verified',
      effectiveDate: 'Active',
      isDevaluation: false,
      description: '10,000 bonus RP every quarter on ₹4 Lakh spend + 2X weekend dining + 2% forex.'
    },
    changeHistory: [
      {
        date: 'Nov 14, 2026',
        type: 'feature_update',
        title: 'Verified Official Features & Eligibility',
        summary: '₹10,000 annual fee (waived on ₹8L spend), 2% forex, 10,000 bonus RP/quarter on ₹4L spend, 2X weekend dining, unlimited global lounges for primary + add-on, 6 golf games/qtr, salaried > ₹2.5L/mo, self-employed ITR > ₹30L/yr.',
        oldValue: 'Older salary and benefit structures',
        newValue: '₹2.5L/mo salary, ₹30L ITR, 10k points/qtr milestone, 2X weekend dining',
        officialRef: 'HDFC Bank Diners Club Black Official Portal',
        severity: 'low'
      }
    ],
    tags: ['premium', 'lounge', 'travel', 'dining', 'golf'],
    suitableFor: [
      'Joining & Renewal Fee: ₹10,000 + GST (waived on spending ₹8 Lakh or more in an anniversary year)',
      'Foreign Currency Markup: Low 2% foreign currency markup on international transactions',
      'Base Rewards: 5 Reward Points for every ₹150 spent (effective 3.33% return)',
      'Weekend Dining: 2X reward points on weekend dining (up to 10 points per ₹150, approx 6.66% return)',
      'SmartBuy Accelerated: Up to 10X on hotel bookings (up to 33.3% value-back), up to 5X on flight bookings, and 3X points on partner vouchers (Amazon, Flipkart, Myntra)',
      'Quarterly Milestone Benefit: 10,000 bonus reward points every calendar quarter upon spending ₹4 Lakh or more in that quarter (up to 40,000 bonus RP/year)',
      'Redemption: 1 Reward Point = up to ₹1 on SmartBuy (flights/hotels) or air miles conversion (1:1 and 2:1 ratios with partner airlines/hotels)',
      'Airport Lounge Access: Unlimited complimentary airport lounge access worldwide for primary and add-on cardholders',
      'Golf Program: 6 complimentary golf games per quarter (24 games annually) booked via golf concierge',
      'Memberships & Perks: Complimentary memberships including Club Marriott; ₹2 Crore air accident cover + ₹50 Lakh overseas emergency hospitalization',
      'Eligibility: Salaried: Age 21–60, net monthly income > ₹2.5 Lakh | Self-Employed: Age 21–65, annual ITR > ₹30 Lakh'
    ]
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
    annualFeeWaiverCondition: 'Nil Joining Fee & Nil Annual Fee (Unconditionally Lifetime Free)',
    isLifetimeFree: true,
    minSalaryMonthly: 300000,
    minCibilScore: 750,
    status: 'active',
    headlineBenefit: 'Lifetime Free (₹0) • 10X Rewards Above ₹20k • 1.5% Forex • BOGO Movies & Golf',
    cashbackRate: '10X RP on incremental spends above ₹20k/mo & birthdays • 3X on spends up to ₹20k',
    rewardPointValue: '1 Reward Point = ₹0.25 (Points never expire; no redemption fee)',
    forexMarkup: 1.5,
    fuelSurchargeWaiver: '1% fuel surcharge waiver up to ₹300 per month',
    domesticLoungesPerQuarter: 4,
    internationalLoungesPerYear: 4,
    loungeSpendCondition: 'Complimentary domestic & international airport lounge/spa access (subject to ₹20,000 spend in preceding month).',
    loungeNetwork: 'DreamFolks / Priority Pass',
    merchantExclusions: ['Fuel, Cash advances; 3X points on education, wallet load & govt services'],
    cappingDetails: '10X points activate on monthly spends above ₹20,000; points never expire; ATM cash withdrawals are interest-free until due date.',
    officialCircularUrl: 'https://www.idfcfirst.bank.in/credit-card/wealth',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.7,
    popularityIndex: 92,
    recentChangeAlert: {
      badge: 'Lifetime Free Verified',
      effectiveDate: 'Active',
      isDevaluation: false,
      description: 'Unconditional ₹0 fee forever, 10X points above ₹20,000 spend, and 1.5% forex markup.'
    },
    changeHistory: [
      {
        date: 'Nov 14, 2026',
        type: 'feature_update',
        title: 'Verified Official Features & Income Criteria',
        summary: 'Lifetime Free (₹0), ₹36L annual income eligibility (~₹3L/mo), 10X points above ₹20k spend, 3X up to ₹20k, 1.5% forex markup, BOGO movies up to ₹250 (2x/mo), 2 golf rounds/mo, interest-free ATM withdrawals.',
        oldValue: 'Older ₹30k threshold and salary figures',
        newValue: '10X on spends above ₹20k, ₹36L income eligibility, Lifetime Free',
        officialRef: 'IDFC FIRST Bank Official Wealth Product Guide',
        severity: 'low'
      }
    ],
    tags: ['lifetime-free', 'lounge', 'forex', 'travel', 'dining', 'movies'],
    suitableFor: [
      'Joining & Annual Fee: ₹0 (Unconditionally Lifetime Free card with no renewal conditions)',
      'Income Eligibility: Generally targets individuals with an annual income of ₹36 Lakhs or more (~₹3,00,000/month)',
      'Rewards Program: 10X Reward Points on incremental spends above ₹20,000 per statement cycle and on birthday spends',
      'Base Rewards: 3X Reward Points on online and offline spends up to ₹20,000 (plus education, wallet load & government services)',
      'Never-Expiring Points: 1 Reward Point = ₹0.25 (no redemption charges, points never expire)',
      'Foreign Currency Markup: Low 1.5% (+ GST) foreign currency markup fee on international transactions',
      'Airport Lounge & Spa: Complimentary domestic and international airport lounge/spa visits (subject to ₹20k monthly spend)',
      'Movies & Entertainment: Buy-One-Get-One (BOGO) ticket offers up to ₹250 off twice a month',
      'Golf Privileges: 2 complimentary golf rounds and 2 golf lessons per month (up to 24 annually)',
      'Interest-Free ATM Cash: Interest-free cash withdrawals from ATMs until due date (advance fee ₹199 + GST)',
      'Insurance & Protection: Complimentary ₹1 Crore air accident cover, personal accident, lost card liability, and trip cancellation cover (CFAR)'
    ]
  },
  {
    id: 'kiwi-axis-rupay',
    name: 'Axis Bank Kwik Credit Card',
    bank: 'Axis Bank / Kiwi',
    bankLogoText: 'AXIS KWIK RUPAY',
    tier: 'Entry Level',
    network: 'RuPay',
    cardStyle: 'aurum',
    cardNumberPreview: '•••• 1983',
    joiningFee: 0,
    annualFee: 0,
    annualFeeWaiverCondition: 'Nil Joining Fee & Nil Annual Fee (Unconditionally Lifetime Free)',
    isLifetimeFree: true,
    minSalaryMonthly: 25000,
    minCibilScore: 710,
    status: 'active',
    headlineBenefit: 'Lifetime Free Virtual RuPay • Credit on UPI • 2 EDGE Points per ₹200 • Instant Issuance',
    cashbackRate: '2 EDGE Points per ₹200 spent (UPI/Online/Offline) • Accelerated rewards with Kiwi Neon',
    rewardPointValue: '1 EDGE Reward Point = ₹0.20 to ₹0.40 (or direct cashback in Kiwi app)',
    forexMarkup: 3.5,
    fuelSurchargeWaiver: '1% fuel surcharge waiver on transactions between ₹400 and ₹4,000 (capped at ₹150/cycle)',
    domesticLoungesPerQuarter: 0,
    internationalLoungesPerYear: 0,
    loungeSpendCondition: 'No airport lounge access included. Card is 100% focused on zero fees and UPI scan & pay transactions.',
    loungeNetwork: 'None',
    merchantExclusions: ['Fuel', 'Wallet loads', 'Rental transactions (1% fee, max ₹1,500)', 'Cash withdrawals', 'Insurance', 'Government services', 'UPI under ₹2,000'],
    cappingDetails: 'Standard UPI credit limit up to ₹1,000/day (utilities up to ₹2,000, card limit up to ₹1 Lakh/day). Redemption fee: Nil (<300 pts), ₹49 (300-10k pts), ₹99 (>10k pts).',
    officialCircularUrl: 'https://www.axis.bank.in/cards/credit-card/axis-bank-kwik-credit-card',
    lastVerifiedDate: 'Nov 14, 2026',
    isVerified: true,
    rating: 4.5,
    popularityIndex: 91,
    recentChangeAlert: {
      badge: 'Lifetime Free Verified',
      effectiveDate: 'Active',
      isDevaluation: false,
      description: 'Zero joining & annual fee with instant virtual RuPay UPI issuance via Kiwi app.'
    },
    changeHistory: [
      {
        date: 'Nov 14, 2026',
        type: 'feature_update',
        title: 'Verified Official Fees, Fuel Waiver & Rewards',
        summary: 'Lifetime Free (₹0), 2 EDGE Points per ₹200, 1% fuel waiver (₹400–₹4,000 capped at ₹150/mo), 1% rental fee (max ₹1,500), 3.6% monthly APR, instant Video KYC issuance.',
        oldValue: 'Older benefit definitions',
        newValue: '2 EDGE points per ₹200, 1% fuel waiver, 3.5% forex, Lifetime Free',
        officialRef: 'Axis Bank & Kiwi User Guide',
        severity: 'low'
      }
    ],
    tags: ['lifetime-free', 'upi', 'cashback', 'shopping'],
    suitableFor: [
      'Joining & Annual Fee: ₹0 (Nil joining & nil annual fee, 100% Lifetime Free)',
      'Credit on UPI: Virtual RuPay credit card issued instantly in the Kiwi app for merchant (P2M) QR code scan & pay',
      'Rewards Program: Earns 2 EDGE Reward Points per ₹200 spent (excludes fuel, wallet, rent, cash, insurance, govt & UPI under ₹2,000)',
      'Accelerated Returns: Standard cashback or upgrade options via Kiwi Neon membership for accelerated UPI rewards',
      '1% Fuel Surcharge Waiver on transactions between ₹400 and ₹4,000 (capped at ₹150 per statement cycle)',
      'UPI Limits: Standard UPI limit up to ₹1,000/day, utilities/insurance up to ₹2,000, and general card limit up to ₹1,00,000/day',
      'Charges: 3.6% monthly finance charges (52.86% p.a.), 1% rent transaction fee (max ₹1,500), 3.5% foreign currency markup',
      'Instant Issuance: 100% digital onboarding via Kiwi app with PAN and Video KYC',
      'Eligibility: Age 21+, Indian resident, minimum monthly income of ₹25,000'
    ]
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
      headline: 'Buy 1 Get 1 Free on Movie Tickets (Up to ₹250 Off, 2x / Month)',
      subline: 'Enjoy Buy-One-Get-One movie ticket offers up to ₹250 off twice a month (save up to ₹500/month) on Paytm or BookMyShow.',
      hasBogo: true,
      score: 8,
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
      headline: '₹1,500 Quarterly Milestone Vouchers (BookMyShow / Partner Brands)',
      subline: 'Earn ₹1,500 vouchers every quarter upon spending ₹1.5 Lakh (redeemable for BookMyShow, Myntra, Nykaa, etc.) + ₹5,000 flight vouchers on ₹5L & ₹7.5L spend.',
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

  if (id === 'amex-plat-travel') {
    return {
      headline: '10k Welcome Points + ₹10k Taj Voucher & 40k MR Milestones + 8 Domestic Lounges',
      subline: '₹5,000 annual fee, 10,000 welcome MR points on ₹15k spend in 90 days, 1 MR per ₹50 spent, milestone bonuses unlocking Taj stay vouchers and bonus points at ₹1.9L, ₹4L, and ₹7L annual spends, 8 domestic airport lounges, and Priority Pass membership.',
      perks: [
        'Welcome Benefit: 10,000 Membership Rewards points on spending ₹15,000 in first 90 days',
        'Milestone Rewards: ₹10,000 Taj Stay/Dining Voucher + 40,000 Bonus MR points on ₹4 Lakh spend',
        'Higher-tier milestone rewards shifting toward ₹7 Lakhs annual spend',
        'Earn Rate: 1 MR point per ₹50 spent (excluding fuel, insurance, and utilities)',
        '8 Complimentary Domestic Airport Lounge visits per year (2 per quarter)',
        'Complimentary Priority Pass Membership (standard usage fees apply)',
        '24/7 Dedicated Platinum Assist & Concierge Support',
        'Online Fraud Protection Guarantee & Zero Lost Card Liability',
        'Eligibility: Age 18+, Indian resident, min annual income of ₹6 Lakhs (~₹50,000/month)'
      ],
      insurance: 'Complimentary Travel & Air Accident Protection Cover',
      score: 9,
    };
  }
  if (id === 'amex-platinum') {
    return {
      headline: '₹60k Welcome Vouchers + 1,550+ Global Lounges + 5 Hotel Status Tiers + FHR (~₹44.3k) + ₹5 Cr Insurance',
      subline: 'Metal charge card with no pre-set limit, ₹66,000 fee, up to ₹60k welcome vouchers (Taj/Luxe/Postcard), 1,550+ global lounges (Centurion, Priority Pass, Delta), Marriott & Hilton Gold status, FHR benefits valued ~₹44,300, EazyDiner Prime, and 24/7 dedicated Centurion concierge.',
      perks: [
        'Welcome Gift: Vouchers worth up to ₹60,000 via Taj, Luxe, or Postcard Hotels',
        'Renewal Benefit: Vouchers & benefits worth up to ₹35,000 upon spending ₹20 Lakhs/yr',
        'Global Lounges: Unlimited access to 1,550+ lounges worldwide across 140+ countries with guests',
        'Fine Hotels & Resorts (FHR): Stay privileges valued at ~₹44,300 (room upgrades, $100 credit, 4pm checkout)',
        'Complimentary 5-Star Elite Status: Marriott Bonvoy Gold, Hilton Honors Gold, Radisson Rewards, Taj Epicure, ALL Accor+ Explorer',
        'Rewards: 1 MR per ₹40, 3X International, up to 20X via Rewards Multiplier partners',
        'Dining & Lifestyle: EazyDiner Prime membership (up to 50% off) + 24/7 Dedicated Concierge',
        'Golf Privileges: Unlimited complimentary golf games & coaching across premier global greens',
        'Eligibility: Salaried: ₹25 Lakhs p.a. (~₹2.08L/mo) | Self-Employed: ₹15 Lakhs p.a. (~₹1.25L/mo)'
      ],
      insurance: '₹5 Crore Accidental Air Death Cover + USD 50,000 Overseas Medical Insurance',
      score: 10,
    };
  }
  if (id === 'hdfc-infinia-metal') {
    return {
      headline: 'Club Marriott + 12.5k Points + ITC 1+1 + Unlimited Golf & Lounges + ₹3 Cr Cover',
      subline: '12,500 Reward Points upon fee realization & renewal, complimentary Club Marriott membership, unlimited domestic & international lounges for primary & add-on via Priority Pass, unlimited golf games, ITC Hotels 1+1 buffet/stay benefits, Swiggy Dineout discounts, 1:1 air miles, 2% forex markup, and ₹3 Crore air accident insurance.',
      perks: [
        'Welcome / Renewal: 12,500 Reward Points + Club Marriott Membership',
        'Unlimited Complimentary Global Lounges (Primary & Add-on via Priority Pass)',
        'Base ~3.33% Return (5 RP / ₹150) & Up to 10X (33.3%) on SmartBuy Flights & Hotels',
        '1 RP = ₹1 on Flights, Hotels, Apple, Tanishq or 1:1 Air Mile Transfer',
        'Unlimited Complimentary Golf Games in India & Worldwide',
        'ITC Hotels 1+1 Buffet / Stay Privileges & Swiggy Dineout Discounts',
        'Low 2% Foreign Currency Markup Fee',
        'Annual Fee Waived on ₹10 Lakh Spend in Anniversary Year'
      ],
      insurance: '₹3 Crore Air Accident Cover + ₹50 Lakh Overseas Hospitalization + ₹9 Lakh Lost Card Liability',
      score: 10,
    };
  }
  if (id === 'hdfc-diners-black') {
    return {
      headline: 'Unlimited Lounges (Primary & Add-on) + 10k Bonus RP/Qtr + 2X Weekend Dining + 6 Golf/Qtr',
      subline: '₹10,000 fee (waived on ₹8L spend), 2% forex, 10,000 bonus RP every calendar quarter on ₹4L spend, 2X weekend dining (6.66%), up to 10X SmartBuy hotels & 5X flights, unlimited global lounges for primary & add-on, 6 golf games/quarter, Club Marriott, and ₹2 Cr air accident cover.',
      perks: [
        'Annual Fee: ₹10,000 + GST (Waived on spending ₹8 Lakh or more in an anniversary year)',
        'Quarterly Milestone: 10,000 Bonus Reward Points every quarter on ₹4 Lakh spend (up to 40k RP/yr)',
        'Unlimited Global Airport Lounges worldwide for primary and add-on cardholders',
        'Base Reward Rate: 5 RP per ₹150 spent (3.33% return) & 1 RP = up to ₹1 on SmartBuy/air miles',
        'Weekend Dining: 2X Reward Points (up to 10 RP per ₹150, approx 6.66% return)',
        'SmartBuy Accelerated: Up to 10X on Hotels (33.3%), 5X Flights, 3X on Partner Vouchers (~9.9%)',
        'Golf Program: 6 complimentary golf games per quarter (24 games annually)',
        'Low 2% Foreign Currency Markup Fee + taxes',
        'Eligibility: Salaried: Age 21–60, income > ₹2.5L/mo | Self-Employed: Age 21–65, ITR > ₹30L/yr'
      ],
      insurance: '₹2 Crore Air Accident Cover + ₹50 Lakh Overseas Emergency Hospitalization',
      score: 10,
    };
  }
  if (id === 'hdfc-regalia-gold') {
    return {
      headline: 'Swiggy One & MMT Black + ₹1.5k Quarterly Vouchers + ₹1 Cr Insurance + 2% Forex',
      subline: 'Complimentary Swiggy One & MMT Black/Gold memberships (on ₹1L in 90 days), ₹1,500 quarterly milestone vouchers on ₹1.5L spend, ₹5,000 flight vouchers at ₹5L/₹7.5L milestones, 2% foreign currency markup, and comprehensive travel insurance.',
      perks: [
        'Swiggy One & MMT Black/Gold Memberships (₹1L spend in 90 days)',
        '₹1,500 Milestone Vouchers every quarter on ₹1.5 Lakh spend',
        '₹5,000 Flight/Reward Vouchers on ₹5 Lakh and ₹7.5 Lakh annual spends',
        '3 Domestic Lounges/qtr (on ₹60k spend) + 6 International Lounges (Priority Pass)',
        '5X Reward Points on Partner Brands (Myntra, Nykaa, Reliance Digital, M&S)',
        '1 RP valued up to ₹0.65 on flights, hotels & exclusive Gold Catalogue',
        '2% Foreign Currency Markup on all international transactions',
        'Annual fee waived on ₹4 Lakh spend in an anniversary year'
      ],
      insurance: '₹1 Crore Air Death + ₹15 Lakh Overseas Hospitalization + ₹10 Lakh Credit Liability',
      score: 9,
    };
  }
  if (id === 'axis-magnus') {
    return {
      headline: '₹12.5k Luxury Voucher + Priority Pass + 4 Free Guests + 35 pts > ₹1.5L + 2% Forex',
      subline: '₹12,500 luxury brand voucher (Luxe/Postcard/Yatra) on qualifying spend, unlimited Priority Pass international lounges + 4 guest visits/year, unlimited domestic lounges (on ₹50k spend in previous 3 calendar months), 35 EDGE points / ₹200 on spends > ₹1.5L/mo, 5X on Travel EDGE, 5:2 air miles conversion, and 2% forex markup.',
      perks: [
        'Welcome: ₹12,500 Luxury Brand Voucher (Luxe, Postcard Hotels, or Yatra)',
        'Unlimited International Lounges (Priority Pass) + 4 Guest Visits / Year',
        'Unlimited Domestic Lounges (on ₹50,000 spend in previous 3 calendar months)',
        '12 EDGE Points / ₹200 Base & 35 Points / ₹200 on Incremental Spends > ₹1.5L/mo',
        '5X EDGE Points (up to 60 pts / ₹200) via Travel EDGE Portal',
        '5:2 Standard Airline & Hotel Transfer Ratio (Capped at 500,000 pts/yr)',
        'Low 2% Foreign Currency Markup Fee (3% Monthly Extended Interest Rate)',
        'Annual Fee Waived on spending ₹25 Lakhs in preceding year'
      ],
      insurance: '₹4.5 Crore Air Accident Cover + Overseas Medical Insurance',
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
      headline: 'Dual-Network Amex + Mastercard + ₹13k Vouchers + BOGO BMS (2x/mo) + Golf & Lounges',
      subline: '₹6,500 joining fee (with ₹13k+ welcome vouchers), ₹3,500 annual fee (waived on ₹6L spend), dual-network Amex + Mastercard/Visa, BOGO on BookMyShow up to ₹500 twice a month, complimentary domestic & international lounge access, monthly golf rounds, and ₹3 Crore air accident cover.',
      perks: [
        'Welcome Benefit: Vouchers worth over ₹13,000 upon joining fee realization',
        'Dual-Card Structure: Amex variant for weekend offers + Mastercard/Visa variant for universal acceptance',
        'Annual Fee Waived on spending ₹6,00,000 or more in an anniversary year',
        'Rewards: 4 RP / ₹100 International, 2 RP / ₹100 Domestic, 1 RP / ₹100 Utilities & Insurance',
        'Movies: Buy 1 Get 1 Free on BookMyShow (up to ₹500 off on second ticket, twice a month)',
        'Lounge Access: Complimentary domestic airport lounge (quarterly) & international lounge visits (yearly)',
        'Golf Access: Complimentary monthly golf rounds based on eligible spend milestones',
        '1% Fuel Surcharge Waiver & 3.5% Forex Markup Fee',
        'Eligibility: Age 21+; Salaried: Min ₹75,000/month; Self-Employed: Annual ITR > ₹9 Lakh'
      ],
      insurance: '₹3 Crore Accidental Air Death Cover + Standard Fraud Protection',
      score: 8,
    };
  }
  if (id === 'idfc-first-wealth') {
    return {
      headline: 'Lifetime Free + 10X Points Above ₹20k + 1.5% Forex + BOGO Movies & Golf + ₹1 Cr Insurance',
      subline: 'Unconditional ₹0 joining & annual fee forever, 10X points on spends above ₹20,000, low 1.5% forex markup, BOGO movie tickets up to ₹250 twice a month, 2 golf rounds/mo, interest-free ATM cash, free roadside assistance, and ₹1 Crore air accident insurance.',
      perks: [
        'Unconditional Lifetime Free (₹0 Joining Fee & ₹0 Annual Fee Forever)',
        'Income Eligibility: Annual income of ₹36 Lakhs or more (~₹3,00,000/month)',
        '10X Reward Points on incremental spends above ₹20,000 per cycle & on birthdays',
        '3X Reward Points on spends up to ₹20,000 & never-expiring points (1 RP = ₹0.25)',
        'Discounted 1.5% Foreign Currency Markup Fee (+ GST)',
        'Complimentary Domestic & International Airport Lounge & Spa Access',
        'Buy-One-Get-One Free Movie Tickets up to ₹250 off twice a month',
        '2 Complimentary Golf Rounds + 2 Lessons per month (up to 24 per year)',
        'Interest-Free ATM Cash Withdrawals until due date (nominal ₹199 + GST fee)',
        'Free 24x7 Roadside Assistance (RSA) worth ₹1,399 across India'
      ],
      insurance: '₹1 Crore Accidental Air Death Cover + Trip Cancellation Cover (CFAR)',
      score: 9,
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
      headline: '5% NeuCoins on Tata Brands (+5% NeuPass) + 1.5% UPI + 8 Domestic & 4 Intl Lounges + 2% Forex',
      subline: '₹1,499 annual fee (waived on ₹3L spend), 5% back as NeuCoins on Tata Neu & partner brands (+5% NeuPass), 1.5% on non-Tata & Tata Neu UPI (0.5% other UPI), 8 domestic + 4 Priority Pass lounges, 2% forex markup, and ₹1 Cr air accident insurance.',
      perks: [
        'Annual Fee: ₹1,499 + GST (Waived on ₹3 Lakh spend in a membership year)',
        '1 NeuCoin = ₹1 (Claim manually via NeuCard section in Tata Neu App)',
        '5% NeuCoins on Tata Neu & Partner Tata Brands (+5% additional via NeuPass)',
        '1.5% NeuCoins on Non-Tata Spends & Merchant EMI Spends',
        'RuPay UPI Benefits: 1.5% on Tata Neu UPI & 0.5% on other UPI apps (monthly cap)',
        '8 Domestic Lounges/yr (2/qtr) via Visa/RuPay + 4 Intl/yr (1/qtr) via Priority Pass',
        'Low 2% Foreign Currency Markup Fee',
        '1% Fuel Surcharge Waiver across all petrol pumps in India',
        'Eligibility: Age 21–65; Salaried: ₹1 Lakh/month; Self-Employed: ITR > ₹12 Lakh'
      ],
      insurance: '₹1 Crore Accidental Air Death Cover + Credit Liability Cover',
      score: 9,
    };
  }
  if (id === 'icici-amazon-pay') {
    return {
      headline: 'Lifetime Free (₹0) + 5% Amazon & Travel Cashback + 1.99% Forex + Auto-Credit',
      subline: 'Unconditional ₹0 joining & annual fee forever, 5% unlimited cashback for Prime (3% non-Prime) on Amazon shopping, flights & hotel bookings, 2% on bills & 100+ partner merchants, 1% elsewhere, 1.99% discounted forex markup, 1% fuel surcharge waiver, and automatic monthly conversion into Amazon Pay balance.',
      perks: [
        'Unconditional Lifetime Free (₹0 Joining Fee & ₹0 Annual Fee)',
        '5% Unlimited Cashback on Amazon Shopping & Flight/Hotel Bookings (Prime Members)',
        '3% Cashback on Amazon Shopping & Travel Bookings (Non-Prime Members)',
        '2% Cashback on Digital Categories, Utility Bills, Gift Cards & 100+ Partner Merchants',
        '1% Cashback on All Other Spends Wherever Visa is Accepted',
        'Discounted 1.99% Foreign Currency Markup Fee',
        'Automatic Monthly Credit Directly into Amazon Pay Balance (Zero Redemption Fees)',
        '1% Fuel Surcharge Waiver across all petrol pumps in India'
      ],
      insurance: 'Standard Chip & PIN Fraud Protection + Zero Lost Card Liability',
      score: 8,
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
      headline: '5% Online & 1% Offline Cashback + Auto-Credit in 2 Days + ₹2k Cap',
      subline: '5% cashback on online purchases without merchant restrictions (capped at ₹2,000/cycle), 1% offline cashback (capped at ₹2,000/cycle), automatically credited within 2 working days of next statement generation, 1% fuel surcharge waiver, annual fee waived on ₹2 Lakh spend.',
      perks: [
        '5% Cashback on All Online Spends (No Merchant Restrictions, Capped at ₹2,000/cycle)',
        '1% Cashback on Offline Spends (Capped at ₹2,000/cycle)',
        'Auto-Credit to SBI Card Account within 2 Working Days of Next Statement',
        '1% Fuel Surcharge Waiver on ₹500–₹3,000 transactions (up to ₹100/cycle)',
        'Nil Add-on Card Fee',
        'Annual Fee Waived on spending ₹2,00,000 or more in an anniversary year'
      ],
      insurance: 'Lost Card Liability Protection Cover',
      score: 8,
    };
  }
  if (id === 'kiwi-axis-rupay') {
    return {
      headline: 'Lifetime Free (₹0) + Credit on UPI + 2 EDGE Points/₹200 + Kiwi Neon Boost',
      subline: '100% virtual RuPay credit card, unconditional ₹0 joining & annual fee, 2 EDGE points per ₹200 on UPI/offline/online, 1% fuel surcharge waiver, Kiwi Neon cashback multipliers, and instant digital Video KYC issuance.',
      perks: [
        'Unconditional Lifetime Free (₹0 Joining Fee & ₹0 Annual Fee)',
        'Virtual RuPay Credit Card issued instantly inside the Kiwi App',
        'Scan & Pay at all merchant (P2M) UPI QR codes via Kiwi, Google Pay, PhonePe, Paytm',
        '2 EDGE Reward Points per ₹200 spent (excl. fuel, wallet, rent & UPI under ₹2,000)',
        'Kiwi Neon Membership upgrade for accelerated flat cashback on UPI spends',
        '1% Fuel Surcharge Waiver on transactions between ₹400 and ₹4,000 (up to ₹150/cycle)',
        'Standard UPI daily limits up to ₹1,000/day, utilities up to ₹2,000, card limit up to ₹1 Lakh/day',
        'Instant digital approval with Video KYC in minutes'
      ],
      insurance: 'Standard RuPay Digital Fraud & Zero Lost Card Liability Protection',
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

