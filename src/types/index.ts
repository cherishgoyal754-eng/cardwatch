export type ScreenType =
  | 'home'
  | 'explorer'
  | 'changes'
  | 'compare'
  | 'card-details'
  | 'tailor'
  | 'travel-intent'
  | 'calculator'
  | 'advisors'
  | 'ai-advisor'
  | 'wallet';

export type CardCategory =
  | 'all'
  | 'lounge'
  | 'cashback'
  | 'travel'
  | 'dining'
  | 'forex'
  | 'upi'
  | 'fuel'
  | 'lifetime-free'
  | 'premium'
  | 'shopping'
  | 'business'
  | 'movies'
  | 'golf';

export type CardNetwork = 'Visa' | 'Mastercard' | 'RuPay' | 'Amex' | 'Diners Club';

export interface CardChangeHistory {
  date: string; // Effective enforcement date
  announcedDate?: string; // Date when circular or notification was sent to cardholders
  deadline?: string; // Deadline / cut-off date before new rules become mandatory
  type: 'devaluation' | 'enhancement' | 'fee_revision' | 'restriction' | 'policy_update' | 'regulatory_update';
  title: string;
  summary: string;
  oldValue: string;
  newValue: string;
  officialRef: string;
  circularPdfUrl?: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'positive';
  source?: string;
  syncedAt?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  bankLogoText: string;
  tier: 'Super Premium' | 'Premium' | 'Mid-Tier' | 'Entry Level';
  network: CardNetwork;
  cardStyle: 'aurum' | 'kestrel' | 'infinia' | 'scapia' | 'sbi' | 'amex' | 'purple' | 'gold' | 'diners' | 'amex-platinum';
  cardNumberPreview: string;
  joiningFee: number;
  annualFee: number;
  annualFeeWaiverCondition: string;
  isLifetimeFree: boolean;
  minSalaryMonthly: number; // in INR
  minCibilScore: number;
  status: 'active' | 'discontinued';

  // Key Value Propositions
  headlineBenefit: string;
  cashbackRate: string; // e.g. "5% on Top Merchants, 1% Others"
  rewardPointValue: string; // e.g. "1 Point = ₹1.00 on Flights via SmartBuy"
  forexMarkup: number; // e.g. 2.0 or 0.0 for zero forex
  fuelSurchargeWaiver: string;

  // Comprehensive Audited & Verified Attributes (2024-2026 Standards)
  gstApplicability?: string; // Standard 18% GST applies to annual & joining fees
  welcomeBenefit?: string;
  renewalBenefit?: string;
  milestoneBenefits?: string;
  rewardConversionDetails?: string; // e.g. 1:1 or 5:2 airmile transfer details
  movieBenefits?: string;
  diningBenefits?: string;
  golfBenefits?: string;
  insuranceCoverage?: string;
  mitcUrl?: string; // Most Important Terms and Conditions (MITC) official link

  // Lounge details
  domesticLoungesPerQuarter: number | string;
  internationalLoungesPerYear: number | string;
  railwayLoungesPerQuarter?: number | string;
  loungeGuestAccess?: string;
  loungeSpendCondition: string; // e.g., "Requires ₹1 Lakh spend in previous quarter" vs "Complimentary with no minimum spend"
  loungeNetwork: 'DreamFolks' | 'Priority Pass' | 'Visa Lounge' | 'Mastercard Airport Pass' | 'None' | 'IRCTC Railway Lounge' | 'Diners Club' | 'American Express Global Lounge Collection' | 'Centurion Lounge';

  // Exclusions & Restrictions
  merchantExclusions: string[]; // e.g. ["Rent payments", "Govt taxes", "Wallet loads", "Jewellery"]
  cappingDetails: string;

  // Official verification & Permanent Accuracy Audit
  officialCircularUrl: string;
  lastVerifiedDate: string;
  isVerified: boolean;
  auditVerificationStatus?: 'fully_verified' | 'pending_review';
  auditDate?: string;
  rating: number; // 4.8 / 5
  popularityIndex: number;

  // Change Tracker details
  recentChangeAlert?: {
    badge: string;
    effectiveDate: string;
    isDevaluation: boolean;
    description: string;
  };
  changeHistory: CardChangeHistory[];

  tags: CardCategory[];
  suitableFor: string[];
}

export interface BankHelpline {
  bank: string;
  shortName: string;
  logoColor: string;
  conciergeNumber: string;
  generalSupport: string;
  premiumDesk: string;
  email: string;
  whatsappSupport?: string;
  portalUrl: string;
  notes: string;
}

export interface UserWalletItem {
  cardId: string;
  ownedSince: string;
  customNickName?: string;
  creditLimit?: number;
  unlockedLoungeThisQuarter: boolean;
  quarterlySpendRecorded: number;
  notes?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  salaryMonthly: number;
  cibilScore: number;
  employmentType: 'Salaried' | 'Self-Employed' | 'Student' | 'Business Owner';
  city: string;
  isVerified: boolean;
  notificationPreferences: {
    devaluations: boolean;
    loungeThresholds: boolean;
    feeRevisions: boolean;
    expiringOffers: boolean;
  };
}
